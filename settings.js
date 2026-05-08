/**
 * Personal Command Center - Settings Page
 * Handles user preferences and customization
 */

// ===================================
// State
// ===================================

const state = {
    theme: localStorage.getItem('theme') || 'dark',
    accentColor: localStorage.getItem('accentColor') || 'indigo',
    timeFormat: localStorage.getItem('timeFormat') || '24h',
    showSeconds: localStorage.getItem('showSeconds') !== 'false',
    dateFormat: localStorage.getItem('dateFormat') || 'long',
    animationsEnabled: localStorage.getItem('animationsEnabled') !== 'false',
    notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
    focusReminder: localStorage.getItem('focusReminder') === 'true',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    pomodoroDuration: parseInt(localStorage.getItem('pomodoroDuration')) || 25,
    shortBreak: parseInt(localStorage.getItem('shortBreak')) || 5,
    longBreak: parseInt(localStorage.getItem('longBreak')) || 15
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    themeOptions: document.querySelectorAll('.theme-option'),
    colorOptions: document.querySelectorAll('.color-option'),
    animationToggle: document.getElementById('animation-toggle'),
    formatOptions: document.querySelectorAll('.format-option'),
    secondsToggle: document.getElementById('seconds-toggle'),
    dateFormat: document.getElementById('date-format'),
    pomodoroDuration: document.getElementById('pomodoro-duration'),
    shortBreak: document.getElementById('short-break'),
    longBreak: document.getElementById('long-break'),
    soundToggle: document.getElementById('sound-toggle'),
    notificationsToggle: document.getElementById('notifications-toggle'),
    focusReminderToggle: document.getElementById('focus-reminder-toggle'),
    exportAll: document.getElementById('export-all'),
    importFile: document.getElementById('import-file'),
    resetAll: document.getElementById('reset-all'),
    animatedBg: document.querySelector('.animated-bg'),
    notificationContainer: document.getElementById('notification-container'),
    currentYear: document.getElementById('current-year')
};

// ===================================
// Utility Functions
// ===================================

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
        info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
        warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
        error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>'
    };

    notification.innerHTML = `
        <span class="notification-icon ${type}">${icons[type]}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;

    elements.notificationContainer.appendChild(notification);
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('exiting');
        setTimeout(() => notification.remove(), 300);
    });

    if (duration > 0) {
        setTimeout(() => {
            notification.classList.add('exiting');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// ===================================
// Theme Functions
// ===================================

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('theme', theme);
    
    elements.themeOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function applyAccentColor(color) {
    document.documentElement.setAttribute('data-accent', color);
    state.accentColor = color;
    localStorage.setItem('accentColor', color);
    
    elements.colorOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showNotification(`Switched to ${newTheme} mode`, 'info', 2000);
}

function toggleAnimations(enabled) {
    state.animationsEnabled = enabled;
    localStorage.setItem('animationsEnabled', enabled);
    
    if (elements.animatedBg) {
        if (enabled) {
            elements.animatedBg.classList.remove('paused');
        } else {
            elements.animatedBg.classList.add('paused');
        }
    }
}

// ===================================
// Time & Date Functions
// ===================================

function setTimeFormat(format) {
    state.timeFormat = format;
    localStorage.setItem('timeFormat', format);
    
    elements.formatOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
    
    showNotification(`Time format set to ${format.toUpperCase()}`, 'success', 2000);
}

function setShowSeconds(show) {
    state.showSeconds = show;
    localStorage.setItem('showSeconds', show);
}

function setDateFormat(format) {
    state.dateFormat = format;
    localStorage.setItem('dateFormat', format);
    showNotification('Date format updated', 'success', 2000);
}

// ===================================
// Pomodoro Settings
// ===================================

function setPomodoroDuration(duration) {
    const value = parseInt(duration);
    if (value >= 1 && value <= 60) {
        state.pomodoroDuration = value;
        localStorage.setItem('pomodoroDuration', value);
    }
}

function setShortBreak(duration) {
    const value = parseInt(duration);
    if (value >= 1 && value <= 30) {
        state.shortBreak = value;
        localStorage.setItem('shortBreak', value);
    }
}

function setLongBreak(duration) {
    const value = parseInt(duration);
    if (value >= 5 && value <= 60) {
        state.longBreak = value;
        localStorage.setItem('longBreak', value);
    }
}

function setSoundEnabled(enabled) {
    state.soundEnabled = enabled;
    localStorage.setItem('soundEnabled', enabled);
}

// ===================================
// Notification Settings
// ===================================

function setNotificationsEnabled(enabled) {
    state.notificationsEnabled = enabled;
    localStorage.setItem('notificationsEnabled', enabled);
}

function setFocusReminder(enabled) {
    state.focusReminder = enabled;
    localStorage.setItem('focusReminder', enabled);
}

// ===================================
// Data Management
// ===================================

function exportAllData() {
    const data = {
        exportDate: new Date().toISOString(),
        version: '2.0.0',
        todos: JSON.parse(localStorage.getItem('todos')) || [],
        notes: localStorage.getItem('notes') || '',
        habits: JSON.parse(localStorage.getItem('habits')) || [],
        habitHistory: JSON.parse(localStorage.getItem('habitHistory')) || {},
        dailyFocus: JSON.parse(localStorage.getItem('dailyFocus')) || {},
        streak: JSON.parse(localStorage.getItem('streak')) || {},
        activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
        todayStats: JSON.parse(localStorage.getItem('todayStats')) || {},
        settings: {
            theme: state.theme,
            accentColor: state.accentColor,
            timeFormat: state.timeFormat,
            showSeconds: state.showSeconds,
            dateFormat: state.dateFormat,
            animationsEnabled: state.animationsEnabled,
            notificationsEnabled: state.notificationsEnabled,
            focusReminder: state.focusReminder,
            soundEnabled: state.soundEnabled,
            pomodoroDuration: state.pomodoroDuration,
            shortBreak: state.shortBreak,
            longBreak: state.longBreak
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

function importData(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.exportDate || !data.settings) {
                throw new Error('Invalid backup file format');
            }
            
            // Import data
            if (data.todos) localStorage.setItem('todos', JSON.stringify(data.todos));
            if (data.notes) localStorage.setItem('notes', data.notes);
            if (data.habits) localStorage.setItem('habits', JSON.stringify(data.habits));
            if (data.habitHistory) localStorage.setItem('habitHistory', JSON.stringify(data.habitHistory));
            if (data.dailyFocus) localStorage.setItem('dailyFocus', JSON.stringify(data.dailyFocus));
            if (data.streak) localStorage.setItem('streak', JSON.stringify(data.streak));
            if (data.activityLog) localStorage.setItem('activityLog', JSON.stringify(data.activityLog));
            if (data.todayStats) localStorage.setItem('todayStats', JSON.stringify(data.todayStats));
            
            // Import settings
            if (data.settings) {
                Object.keys(data.settings).forEach(key => {
                    localStorage.setItem(key, data.settings[key]);
                });
            }
            
            showNotification('Data imported successfully! Refreshing...', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Failed to import data. Invalid file format.', 'error');
        }
    };
    
    reader.readAsText(file);
}

function resetAllData() {
    if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        return;
    }
    
    if (!confirm('This will delete all tasks, notes, habits, and settings. Are you absolutely sure?')) {
        return;
    }
    
    // Clear all localStorage
    const keysToRemove = [
        'todos', 'notes', 'habits', 'habitHistory', 'dailyFocus',
        'streak', 'activityLog', 'todayStats', 'theme', 'accentColor',
        'timeFormat', 'showSeconds', 'dateFormat', 'animationsEnabled',
        'notificationsEnabled', 'focusReminder', 'soundEnabled',
        'pomodoroDuration', 'shortBreak', 'longBreak', 'totalFocusMinutes'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    showNotification('All data has been reset. Refreshing...', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===================================
// Initialize UI State
// ===================================

function initializeUI() {
    // Theme
    elements.themeOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === state.theme);
    });
    
    // Accent color
    elements.colorOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === state.accentColor);
    });
    
    // Animations
    if (elements.animationToggle) {
        elements.animationToggle.checked = state.animationsEnabled;
    }
    
    // Time format
    elements.formatOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === state.timeFormat);
    });
    
    // Show seconds
    if (elements.secondsToggle) {
        elements.secondsToggle.checked = state.showSeconds;
    }
    
    // Date format
    if (elements.dateFormat) {
        elements.dateFormat.value = state.dateFormat;
    }
    
    // Pomodoro settings
    if (elements.pomodoroDuration) {
        elements.pomodoroDuration.value = state.pomodoroDuration;
    }
    if (elements.shortBreak) {
        elements.shortBreak.value = state.shortBreak;
    }
    if (elements.longBreak) {
        elements.longBreak.value = state.longBreak;
    }
    if (elements.soundToggle) {
        elements.soundToggle.checked = state.soundEnabled;
    }
    
    // Notifications
    if (elements.notificationsToggle) {
        elements.notificationsToggle.checked = state.notificationsEnabled;
    }
    if (elements.focusReminderToggle) {
        elements.focusReminderToggle.checked = state.focusReminder;
    }
}

// ===================================
// Event Listeners
// ===================================

function initEventListeners() {
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Theme options
    elements.themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(btn.dataset.theme);
            showNotification(`Theme set to ${btn.dataset.theme}`, 'success', 2000);
        });
    });
    
    // Color options
    elements.colorOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            applyAccentColor(btn.dataset.color);
            showNotification(`Accent color changed`, 'success', 2000);
        });
    });
    
    // Animation toggle
    if (elements.animationToggle) {
        elements.animationToggle.addEventListener('change', (e) => {
            toggleAnimations(e.target.checked);
            showNotification(`Animations ${e.target.checked ? 'enabled' : 'disabled'}`, 'info', 2000);
        });
    }
    
    // Time format options
    elements.formatOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeFormat(btn.dataset.format);
        });
    });
    
    // Show seconds toggle
    if (elements.secondsToggle) {
        elements.secondsToggle.addEventListener('change', (e) => {
            setShowSeconds(e.target.checked);
            showNotification(`Seconds display ${e.target.checked ? 'enabled' : 'disabled'}`, 'info', 2000);
        });
    }
    
    // Date format select
    if (elements.dateFormat) {
        elements.dateFormat.addEventListener('change', (e) => {
            setDateFormat(e.target.value);
        });
    }
    
    // Pomodoro settings
    if (elements.pomodoroDuration) {
        elements.pomodoroDuration.addEventListener('change', (e) => {
            setPomodoroDuration(e.target.value);
            showNotification('Focus duration updated', 'success', 2000);
        });
    }
    
    if (elements.shortBreak) {
        elements.shortBreak.addEventListener('change', (e) => {
            setShortBreak(e.target.value);
            showNotification('Short break duration updated', 'success', 2000);
        });
    }
    
    if (elements.longBreak) {
        elements.longBreak.addEventListener('change', (e) => {
            setLongBreak(e.target.value);
            showNotification('Long break duration updated', 'success', 2000);
        });
    }
    
    if (elements.soundToggle) {
        elements.soundToggle.addEventListener('change', (e) => {
            setSoundEnabled(e.target.checked);
            showNotification(`Sound ${e.target.checked ? 'enabled' : 'disabled'}`, 'info', 2000);
        });
    }
    
    // Notification settings
    if (elements.notificationsToggle) {
        elements.notificationsToggle.addEventListener('change', (e) => {
            setNotificationsEnabled(e.target.checked);
            if (e.target.checked) {
                showNotification('Notifications enabled', 'success', 2000);
            }
        });
    }
    
    if (elements.focusReminderToggle) {
        elements.focusReminderToggle.addEventListener('change', (e) => {
            setFocusReminder(e.target.checked);
            showNotification(`Focus reminder ${e.target.checked ? 'enabled' : 'disabled'}`, 'info', 2000);
        });
    }
    
    // Data management
    if (elements.exportAll) {
        elements.exportAll.addEventListener('click', exportAllData);
    }
    
    if (elements.importFile) {
        elements.importFile.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                importData(e.target.files[0]);
            }
        });
    }
    
    if (elements.resetAll) {
        elements.resetAll.addEventListener('click', resetAllData);
    }
    
    // Current year
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ===================================
// Initialization
// ===================================

function init() {
    // Apply current theme and accent
    applyTheme(state.theme);
    applyAccentColor(state.accentColor);
    toggleAnimations(state.animationsEnabled);
    
    // Initialize UI state
    initializeUI();
    
    // Initialize event listeners
    initEventListeners();
}

document.addEventListener('DOMContentLoaded', init);