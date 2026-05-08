/**
 * Personal Command Center - Main Application
 * A premium productivity dashboard with advanced features
 * Version 2.0.0
 */

// ===================================
// State Management
// ===================================

const state = {
    timeFormat: localStorage.getItem('timeFormat') || '24h',
    showSeconds: localStorage.getItem('showSeconds') !== 'false',
    theme: localStorage.getItem('theme') || 'dark',
    accentColor: localStorage.getItem('accentColor') || 'indigo',
    animationsEnabled: localStorage.getItem('animationsEnabled') !== 'false',
    notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
    todos: JSON.parse(localStorage.getItem('todos')) || [],
    notes: localStorage.getItem('notes') || '',
    dailyFocus: JSON.parse(localStorage.getItem('dailyFocus')) || { text: '', date: null },
    habits: JSON.parse(localStorage.getItem('habits')) || [],
    habitHistory: JSON.parse(localStorage.getItem('habitHistory')) || {},
    todayStats: JSON.parse(localStorage.getItem('todayStats')) || { 
        completed: 0, 
        date: new Date().toDateString() 
    },
    streak: JSON.parse(localStorage.getItem('streak')) || { count: 0, lastDate: null },
    activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
    pomodoro: {
        duration: parseInt(localStorage.getItem('pomodoroDuration')) || 25,
        shortBreak: parseInt(localStorage.getItem('shortBreak')) || 5,
        longBreak: parseInt(localStorage.getItem('longBreak')) || 15,
        isRunning: false,
        isBreak: false,
        timeLeft: null,
        interval: null
    },
    currentFilter: 'all'
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    // Clock & Date
    clockTime: document.getElementById('clock-time'),
    clockSeconds: document.getElementById('clock-seconds'),
    clockPeriod: document.getElementById('clock-period'),
    weekday: document.getElementById('weekday'),
    fullDate: document.getElementById('full-date'),
    greeting: document.getElementById('greeting'),
    timeFormatBtn: document.getElementById('time-format-btn'),
    timeFormatLabel: document.getElementById('time-format-label'),

    // Theme
    themeToggle: document.getElementById('theme-toggle'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),

    // Weather
    weatherContent: document.getElementById('weather-content'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherTemp: document.getElementById('weather-temp'),
    weatherDesc: document.getElementById('weather-desc'),
    weatherLocation: document.getElementById('weather-location'),
    weatherHumidity: document.getElementById('weather-humidity'),
    weatherWind: document.getElementById('weather-wind'),
    refreshWeather: document.getElementById('refresh-weather'),

    // Daily Focus
    focusInput: document.getElementById('focus-input'),
    focusDisplay: document.getElementById('focus-display'),
    focusText: document.getElementById('focus-text'),
    clearFocus: document.getElementById('clear-focus'),
    focusStreak: document.getElementById('focus-streak'),
    streakCount: document.getElementById('streak-count'),

    // Pomodoro
    pomodoroStart: document.getElementById('pomodoro-start'),
    pomodoroDisplay: document.getElementById('pomodoro-display'),

    // Quote
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    quoteCategory: document.getElementById('quote-category'),
    newQuoteBtn: document.getElementById('new-quote'),
    copyQuoteBtn: document.getElementById('copy-quote'),

    // Stats
    tasksCompleted: document.getElementById('tasks-completed'),
    tasksPending: document.getElementById('tasks-pending'),
    completionRate: document.getElementById('completion-rate'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),

    // Todo
    todoForm: document.getElementById('todo-form'),
    todoInput: document.getElementById('todo-input'),
    todoPriority: document.getElementById('todo-priority'),
    todoList: document.getElementById('todo-list'),
    todoEmpty: document.getElementById('todo-empty'),
    taskCount: document.getElementById('task-count'),
    todoFooter: document.getElementById('todo-footer'),
    clearCompleted: document.getElementById('clear-completed'),
    filterBtns: document.querySelectorAll('.filter-btn'),

    // Notes
    notesArea: document.getElementById('notes-area'),
    autosaveIndicator: document.getElementById('autosave-indicator'),
    charCount: document.getElementById('char-count'),
    clearNotes: document.getElementById('clear-notes'),
    downloadNotes: document.getElementById('download-notes'),

    // Habits
    habitsList: document.getElementById('habits-list'),
    habitsEmpty: document.getElementById('habits-empty'),
    addHabitBtn: document.getElementById('add-habit'),
    habitModal: document.getElementById('habit-modal'),
    closeHabitModal: document.getElementById('close-habit-modal'),
    habitForm: document.getElementById('habit-form'),
    habitInput: document.getElementById('habit-input'),
    habitIconBtns: document.querySelectorAll('.habit-icon-btn'),

    // Modal
    shortcutsModal: document.getElementById('shortcuts-modal'),
    closeModal: document.getElementById('close-modal'),

    // Notification
    notificationContainer: document.getElementById('notification-container'),

    // Background
    animatedBg: document.querySelector('.animated-bg'),

    // Footer
    currentYear: document.getElementById('current-year')
};

// ===================================
// Motivational Quotes Database
// ===================================

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Confidence" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Persistence" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Potential" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "Action" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Action" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "Authenticity" },
    { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Mindset" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "Purpose" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Beginning" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Work" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "Excellence" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "Work" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
    { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs", category: "Patience" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Beginning" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Present" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Risk" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra", category: "Success" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", category: "Perseverance" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "Inner Strength" }
];

// ===================================
// Habit Icons Map
// ===================================

const habitIcons = {
    check: '✓',
    water: '💧',
    exercise: '🏃',
    book: '📚',
    meditation: '🧘',
    sleep: '😴'
};

// ===================================
// Utility Functions
// ===================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        showNotification('Storage error. Some data may not be saved.', 'warning');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ===================================
// Notification System
// ===================================

function showNotification(message, type = 'info', duration = 3000) {
    if (!state.notificationsEnabled) return;
    
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
        <button class="notification-close" aria-label="Close notification">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;

    elements.notificationContainer.appendChild(notification);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });

    if (duration > 0) {
        setTimeout(() => closeNotification(notification), duration);
    }
}

function closeNotification(notification) {
    notification.classList.add('exiting');
    setTimeout(() => notification.remove(), 300);
}

// ===================================
// Activity Log
// ===================================

function logActivity(type, text) {
    const activity = {
        id: generateId(),
        type,
        text,
        timestamp: new Date().toISOString()
    };
    
    state.activityLog.unshift(activity);
    if (state.activityLog.length > 50) {
        state.activityLog = state.activityLog.slice(0, 50);
    }
    saveToStorage('activityLog', state.activityLog);
}

// ===================================
// Clock & Date Functions
// ===================================

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    let period = '';

    if (state.timeFormat === '12h') {
        period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
    }

    elements.clockTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes}`;
    elements.clockSeconds.textContent = `:${seconds}`;
    elements.clockPeriod.textContent = period;
    
    if (!state.showSeconds) {
        elements.clockSeconds.classList.add('hidden');
    } else {
        elements.clockSeconds.classList.remove('hidden');
    }
}

function updateDate() {
    const now = new Date();
    const dateFormat = localStorage.getItem('dateFormat') || 'long';
    
    const weekdayOptions = { weekday: 'long' };
    elements.weekday.textContent = now.toLocaleDateString('en-US', weekdayOptions);
    
    let dateString;
    switch (dateFormat) {
        case 'mdy':
            dateString = now.toLocaleDateString('en-US');
            break;
        case 'dmy':
            dateString = now.toLocaleDateString('en-GB');
            break;
        case 'ymd':
            dateString = now.toISOString().split('T')[0];
            break;
        case 'long':
        default:
            dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    elements.fullDate.textContent = dateString;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting;

    if (hour < 5) {
        greeting = "Working late? Remember to rest!";
    } else if (hour < 12) {
        greeting = "Good morning! Start strong today.";
    } else if (hour < 17) {
        greeting = "Good afternoon! Keep up the momentum.";
    } else if (hour < 21) {
        greeting = "Good evening! Finish strong.";
    } else {
        greeting = "Good night! Great work today.";
    }

    elements.greeting.textContent = greeting;
}

function toggleTimeFormat() {
    state.timeFormat = state.timeFormat === '24h' ? '12h' : '24h';
    elements.timeFormatLabel.textContent = state.timeFormat.toUpperCase();
    saveToStorage('timeFormat', state.timeFormat);
    updateClock();
}

// ===================================
// Theme Functions
// ===================================

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    saveToStorage('theme', theme);
}

function applyAccentColor(color) {
    document.documentElement.setAttribute('data-accent', color);
    state.accentColor = color;
    saveToStorage('accentColor', color);
}

function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showNotification(`Switched to ${newTheme} mode`, 'info', 2000);
}

function toggleAnimations(enabled) {
    state.animationsEnabled = enabled;
    saveToStorage('animationsEnabled', enabled);
    
    if (enabled) {
        elements.animatedBg.classList.remove('paused');
    } else {
        elements.animatedBg.classList.add('paused');
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ===================================
// Weather Functions
// ===================================

function getWeatherIcon(code) {
    const icons = {
        clear: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
        clouds: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>',
        rain: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>',
        snow: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><path d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01"/></svg>',
        thunderstorm: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="M13 11l-4 6h6l-4 6"/></svg>'
    };
    
    if (code <= 3) return { icon: icons.clear, condition: code === 0 ? 'Clear sky' : 'Partly cloudy' };
    if (code <= 48) return { icon: icons.clouds, condition: 'Cloudy' };
    if (code <= 67) return { icon: icons.rain, condition: 'Rainy' };
    if (code <= 77) return { icon: icons.snow, condition: 'Snow' };
    if (code >= 95) return { icon: icons.thunderstorm, condition: 'Thunderstorm' };
    return { icon: icons.clear, condition: 'Clear' };
}

async function fetchWeather() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000
            });
        });

        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );
        
        if (!response.ok) throw new Error('Weather API error');
        
        const data = await response.json();
        const weatherInfo = getWeatherIcon(data.current.weather_code);

        elements.weatherIcon.innerHTML = weatherInfo.icon;
        elements.weatherTemp.textContent = `${Math.round(data.current.temperature_2m)}°C`;
        elements.weatherDesc.textContent = weatherInfo.condition;
        elements.weatherHumidity.textContent = `${data.current.relative_humidity_2m}%`;
        elements.weatherWind.textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
        
        const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const geoData = await geoResponse.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Your Location';
        elements.weatherLocation.textContent = city;
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        elements.weatherLocation.textContent = 'Enable location for weather';
        
        const mockWeather = { temp: 23, desc: 'Clear sky', code: 0 };
        const weatherInfo = getWeatherIcon(mockWeather.code);
        elements.weatherIcon.innerHTML = weatherInfo.icon;
        elements.weatherTemp.textContent = `${mockWeather.temp}°C`;
        elements.weatherDesc.textContent = mockWeather.desc;
        elements.weatherHumidity.textContent = '45%';
        elements.weatherWind.textContent = '12 km/h';
    }
}

// ===================================
// Daily Focus Functions
// ===================================

function checkDailyFocus() {
    const today = new Date().toDateString();
    
    if (state.dailyFocus.date !== today) {
        if (state.dailyFocus.text && state.dailyFocus.date) {
            updateStreak();
        }
        state.dailyFocus = { text: '', date: today };
        saveToStorage('dailyFocus', state.dailyFocus);
    }
    
    if (state.dailyFocus.text) {
        showFocusDisplay(state.dailyFocus.text);
    }
    
    updateStreakDisplay();
}

function updateStreak() {
    const today = new Date();
    const lastDate = state.streak.lastDate ? new Date(state.streak.lastDate) : null;
    
    if (lastDate) {
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            state.streak.count++;
        } else if (diffDays > 1) {
            state.streak.count = 1;
        }
    } else {
        state.streak.count = 1;
    }
    
    state.streak.lastDate = today.toISOString();
    saveToStorage('streak', state.streak);
}

function updateStreakDisplay() {
    if (elements.streakCount) {
        elements.streakCount.textContent = state.streak.count;
    }
}

function showFocusDisplay(text) {
    elements.focusInput.classList.add('hidden');
    elements.focusDisplay.classList.remove('hidden');
    elements.focusText.textContent = text;
}

function hideFocusDisplay() {
    elements.focusDisplay.classList.add('hidden');
    elements.focusInput.classList.remove('hidden');
    elements.focusInput.value = '';
    elements.focusInput.focus();
}

function setDailyFocus(text) {
    if (!text.trim()) return;
    
    state.dailyFocus = {
        text: text.trim(),
        date: new Date().toDateString()
    };
    saveToStorage('dailyFocus', state.dailyFocus);
    showFocusDisplay(state.dailyFocus.text);
    logActivity('focus', `Set daily focus: "${text.trim()}"`);
    showNotification('Daily focus set! Stay focused.', 'success');
}

function clearDailyFocus() {
    state.dailyFocus = { text: '', date: new Date().toDateString() };
    saveToStorage('dailyFocus', state.dailyFocus);
    hideFocusDisplay();
    showNotification('Daily focus cleared', 'info');
}

// ===================================
// Pomodoro Timer
// ===================================

function initPomodoro() {
    state.pomodoro.timeLeft = state.pomodoro.duration * 60;
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    if (elements.pomodoroDisplay) {
        elements.pomodoroDisplay.textContent = formatTime(state.pomodoro.timeLeft);
    }
}

function togglePomodoro() {
    if (state.pomodoro.isRunning) {
        pausePomodoro();
    } else {
        startPomodoro();
    }
}

function startPomodoro() {
    state.pomodoro.isRunning = true;
    elements.pomodoroStart.classList.add('active');
    
    if (state.pomodoro.isBreak) {
        elements.pomodoroStart.classList.add('break');
        elements.pomodoroStart.classList.remove('active');
    }
    
    state.pomodoro.interval = setInterval(() => {
        state.pomodoro.timeLeft--;
        updatePomodoroDisplay();
        
        if (state.pomodoro.timeLeft <= 0) {
            completePomodoro();
        }
    }, 1000);
    
    showNotification(state.pomodoro.isBreak ? 'Break started!' : 'Focus session started!', 'info');
}

function pausePomodoro() {
    state.pomodoro.isRunning = false;
    clearInterval(state.pomodoro.interval);
    elements.pomodoroStart.classList.remove('active', 'break');
}

function completePomodoro() {
    clearInterval(state.pomodoro.interval);
    state.pomodoro.isRunning = false;
    
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    if (soundEnabled) {
        playNotificationSound();
    }
    
    if (state.pomodoro.isBreak) {
        state.pomodoro.isBreak = false;
        state.pomodoro.timeLeft = state.pomodoro.duration * 60;
        showNotification('Break over! Ready for another focus session?', 'success');
        logActivity('focus', 'Completed a break');
    } else {
        state.pomodoro.isBreak = true;
        state.pomodoro.timeLeft = state.pomodoro.shortBreak * 60;
        showNotification('Great work! Time for a break.', 'success');
        logActivity('focus', 'Completed a focus session');
    }
    
    elements.pomodoroStart.classList.remove('active', 'break');
    updatePomodoroDisplay();
}

function playNotificationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ===================================
// Quote Functions
// ===================================

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    elements.quoteText.style.opacity = '0';
    elements.quoteAuthor.style.opacity = '0';
    
    setTimeout(() => {
        elements.quoteText.textContent = `"${quote.text}"`;
        elements.quoteAuthor.textContent = `— ${quote.author}`;
        if (elements.quoteCategory) {
            elements.quoteCategory.textContent = quote.category;
        }
        
        elements.quoteText.style.opacity = '1';
        elements.quoteAuthor.style.opacity = '1';
    }, 200);
}

function copyQuote() {
    const text = elements.quoteText.textContent;
    const author = elements.quoteAuthor.textContent;
    const fullQuote = `${text} ${author}`;
    
    navigator.clipboard.writeText(fullQuote).then(() => {
        showNotification('Quote copied to clipboard!', 'success', 2000);
    }).catch(() => {
        showNotification('Failed to copy quote', 'error');
    });
}

// ===================================
// Statistics Functions
// ===================================

function checkDailyStats() {
    const today = new Date().toDateString();
    
    if (state.todayStats.date !== today) {
        state.todayStats = { completed: 0, date: today };
        saveToStorage('todayStats', state.todayStats);
    }
}

function updateStats() {
    checkDailyStats();
    
    const completedTasks = state.todos.filter(t => t.completed).length;
    const pendingTasks = state.todos.filter(t => !t.completed).length;
    const totalTasks = state.todos.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    elements.tasksCompleted.textContent = state.todayStats.completed;
    elements.tasksPending.textContent = pendingTasks;
    elements.completionRate.textContent = `${completionRate}%`;
    elements.progressBar.style.width = `${completionRate}%`;
    
    if (elements.progressText) {
        if (totalTasks === 0) {
            elements.progressText.textContent = 'No tasks yet';
        } else if (completionRate === 100) {
            elements.progressText.textContent = 'All tasks completed!';
        } else {
            elements.progressText.textContent = `${completedTasks} of ${totalTasks} tasks done`;
        }
    }
}

// ===================================
// Todo Functions
// ===================================

function getFilteredTodos() {
    switch (state.currentFilter) {
        case 'active':
            return state.todos.filter(t => !t.completed);
        case 'completed':
            return state.todos.filter(t => t.completed);
        default:
            return state.todos;
    }
}

function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        elements.todoList.innerHTML = '';
        elements.todoEmpty.classList.remove('hidden');
        
        if (state.currentFilter === 'active' && state.todos.some(t => t.completed)) {
            elements.todoEmpty.querySelector('p').textContent = 'No active tasks!';
        } else if (state.currentFilter === 'completed' && state.todos.some(t => !t.completed)) {
            elements.todoEmpty.querySelector('p').textContent = 'No completed tasks yet!';
        } else {
            elements.todoEmpty.querySelector('p').textContent = 'No tasks yet. Add one above!';
        }
    } else {
        elements.todoEmpty.classList.add('hidden');
        elements.todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    aria-label="Mark task as ${todo.completed ? 'incomplete' : 'complete'}"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" aria-label="Delete task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </li>
        `).join('');
    }

    const totalTasks = state.todos.length;
    const activeTasks = state.todos.filter(t => !t.completed).length;
    elements.taskCount.textContent = `${activeTasks} active / ${totalTasks} total`;
    
    const hasCompleted = state.todos.some(t => t.completed);
    if (elements.clearCompleted) {
        elements.clearCompleted.style.display = hasCompleted ? 'block' : 'none';
    }
    
    updateStats();
}

function addTodo(text, priority = 'medium') {
    if (!text.trim()) return;

    const todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString()
    };

    state.todos.unshift(todo);
    saveToStorage('todos', state.todos);
    renderTodos();
    logActivity('task', `Added task: "${text.trim()}"`);
    showNotification('Task added!', 'success', 2000);
}

function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        
        if (todo.completed) {
            state.todayStats.completed++;
            saveToStorage('todayStats', state.todayStats);
            logActivity('task', `Completed task: "${todo.text}"`);
            showNotification('Task completed! Great job!', 'success', 2000);
        }
        
        saveToStorage('todos', state.todos);
        renderTodos();
    }
}

function deleteTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    state.todos = state.todos.filter(t => t.id !== id);
    saveToStorage('todos', state.todos);
    renderTodos();
    if (todo) {
        logActivity('task', `Deleted task: "${todo.text}"`);
    }
    showNotification('Task deleted', 'info', 2000);
}

function clearCompletedTodos() {
    const completedCount = state.todos.filter(t => t.completed).length;
    state.todos = state.todos.filter(t => !t.completed);
    saveToStorage('todos', state.todos);
    renderTodos();
    logActivity('task', `Cleared ${completedCount} completed tasks`);
    showNotification(`Cleared ${completedCount} completed tasks`, 'info');
}

function setFilter(filter) {
    state.currentFilter = filter;
    elements.filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTodos();
}

// ===================================
// Notes Functions
// ===================================

const saveNotes = debounce((text) => {
    state.notes = text;
    saveToStorage('notes', text);
    
    elements.autosaveIndicator.classList.add('visible');
    setTimeout(() => {
        elements.autosaveIndicator.classList.remove('visible');
    }, 2000);
}, 500);

function loadNotes() {
    elements.notesArea.value = state.notes;
    updateCharCount();
}

function updateCharCount() {
    const count = elements.notesArea.value.length;
    const max = elements.notesArea.maxLength || 5000;
    elements.charCount.textContent = `${count} / ${max}`;
}

function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        elements.notesArea.value = '';
        state.notes = '';
        saveToStorage('notes', '');
        updateCharCount();
        showNotification('Notes cleared', 'info');
    }
}

function downloadNotes() {
    const content = elements.notesArea.value;
    if (!content.trim()) {
        showNotification('No notes to download', 'warning');
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Notes downloaded!', 'success');
}

// ===================================
// Habits Functions
// ===================================

function renderHabits() {
    const today = new Date().toDateString();
    
    if (state.habits.length === 0) {
        elements.habitsList.innerHTML = '';
        elements.habitsEmpty.classList.remove('hidden');
    } else {
        elements.habitsEmpty.classList.add('hidden');
        elements.habitsList.innerHTML = state.habits.map(habit => {
            const isCompleted = state.habitHistory[today]?.includes(habit.id);
            return `
                <div class="habit-item ${isCompleted ? 'completed' : ''}" data-id="${habit.id}">
                    <span class="habit-icon">${habitIcons[habit.icon] || '✓'}</span>
                    <span class="habit-name">${escapeHtml(habit.name)}</span>
                    <button class="habit-check" aria-label="Toggle habit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    </button>
                    <button class="habit-delete" aria-label="Delete habit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }
}

function addHabit(name, icon = 'check') {
    if (!name.trim()) return;
    
    const habit = {
        id: generateId(),
        name: name.trim(),
        icon: icon,
        createdAt: new Date().toISOString()
    };
    
    state.habits.push(habit);
    saveToStorage('habits', state.habits);
    renderHabits();
    logActivity('habit', `Added habit: "${name.trim()}"`);
    showNotification('Habit added!', 'success');
}

function toggleHabit(id) {
    const today = new Date().toDateString();
    
    if (!state.habitHistory[today]) {
        state.habitHistory[today] = [];
    }
    
    const index = state.habitHistory[today].indexOf(id);
    const habit = state.habits.find(h => h.id === id);
    
    if (index === -1) {
        state.habitHistory[today].push(id);
        if (habit) {
            logActivity('habit', `Completed habit: "${habit.name}"`);
        }
        showNotification('Habit completed!', 'success', 2000);
    } else {
        state.habitHistory[today].splice(index, 1);
    }
    
    saveToStorage('habitHistory', state.habitHistory);
    renderHabits();
}

function deleteHabit(id) {
    const habit = state.habits.find(h => h.id === id);
    state.habits = state.habits.filter(h => h.id !== id);
    saveToStorage('habits', state.habits);
    renderHabits();
    if (habit) {
        logActivity('habit', `Deleted habit: "${habit.name}"`);
    }
    showNotification('Habit deleted', 'info');
}

function openHabitModal() {
    elements.habitModal.classList.remove('hidden');
    elements.habitInput.focus();
}

function closeHabitModal() {
    elements.habitModal.classList.add('hidden');
    elements.habitInput.value = '';
    elements.habitIconBtns.forEach(btn => btn.classList.remove('selected'));
    elements.habitIconBtns[0].classList.add('selected');
}

// ===================================
// Keyboard Shortcuts
// ===================================

function handleKeyboardShortcuts(e) {
    const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    
    if (e.key === 'Escape') {
        if (!elements.shortcutsModal.classList.contains('hidden')) {
            elements.shortcutsModal.classList.add('hidden');
        } else if (!elements.habitModal.classList.contains('hidden')) {
            closeHabitModal();
        } else if (isTyping) {
            document.activeElement.blur();
        }
        return;
    }

    if (isTyping) return;

    switch (e.key.toLowerCase()) {
        case 'n':
            e.preventDefault();
            elements.notesArea.focus();
            break;
        case 't':
            e.preventDefault();
            toggleTheme();
            break;
        case 'q':
            e.preventDefault();
            displayRandomQuote();
            break;
        case 'f':
            e.preventDefault();
            if (!state.dailyFocus.text) {
                elements.focusInput.focus();
            }
            break;
        case 'c':
            e.preventDefault();
            copyQuote();
            break;
        case 'p':
            e.preventDefault();
            togglePomodoro();
            break;
        case '?':
            e.preventDefault();
            elements.shortcutsModal.classList.toggle('hidden');
            break;
    }
}

// ===================================
// Event Listeners
// ===================================

function initEventListeners() {
    // Time format toggle
    if (elements.timeFormatBtn) {
        elements.timeFormatBtn.addEventListener('click', toggleTimeFormat);
    }

    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Fullscreen
    if (elements.fullscreenBtn) {
        elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Weather refresh
    if (elements.refreshWeather) {
        elements.refreshWeather.addEventListener('click', () => {
            showNotification('Refreshing weather...', 'info', 2000);
            fetchWeather();
        });
    }

    // Daily focus
    if (elements.focusInput) {
        elements.focusInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                setDailyFocus(e.target.value);
            }
        });
    }

    if (elements.clearFocus) {
        elements.clearFocus.addEventListener('click', clearDailyFocus);
    }

    // Pomodoro
    if (elements.pomodoroStart) {
        elements.pomodoroStart.addEventListener('click', togglePomodoro);
    }

    // Quote
    if (elements.newQuoteBtn) {
        elements.newQuoteBtn.addEventListener('click', displayRandomQuote);
    }

    if (elements.copyQuoteBtn) {
        elements.copyQuoteBtn.addEventListener('click', copyQuote);
    }

    // Todo form
    if (elements.todoForm) {
        elements.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addTodo(elements.todoInput.value, elements.todoPriority.value);
            elements.todoInput.value = '';
            elements.todoPriority.value = 'medium';
        });
    }

    // Todo list interactions
    if (elements.todoList) {
        elements.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const id = todoItem.dataset.id;

            if (e.target.classList.contains('todo-checkbox')) {
                toggleTodo(id);
            } else if (e.target.closest('.delete-btn')) {
                deleteTodo(id);
            }
        });
    }

    // Todo filters
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Clear completed
    if (elements.clearCompleted) {
        elements.clearCompleted.addEventListener('click', clearCompletedTodos);
    }

    // Notes
    if (elements.notesArea) {
        elements.notesArea.addEventListener('input', (e) => {
            saveNotes(e.target.value);
            updateCharCount();
        });
    }

    if (elements.clearNotes) {
        elements.clearNotes.addEventListener('click', clearNotes);
    }

    if (elements.downloadNotes) {
        elements.downloadNotes.addEventListener('click', downloadNotes);
    }

    // Habits
    if (elements.addHabitBtn) {
        elements.addHabitBtn.addEventListener('click', openHabitModal);
    }

    if (elements.closeHabitModal) {
        elements.closeHabitModal.addEventListener('click', closeHabitModal);
    }

    if (elements.habitForm) {
        elements.habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedIcon = document.querySelector('.habit-icon-btn.selected');
            addHabit(elements.habitInput.value, selectedIcon?.dataset.icon || 'check');
            closeHabitModal();
        });
    }

    elements.habitIconBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.habitIconBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    if (elements.habitsList) {
        elements.habitsList.addEventListener('click', (e) => {
            const habitItem = e.target.closest('.habit-item');
            if (!habitItem) return;

            const id = habitItem.dataset.id;

            if (e.target.closest('.habit-check')) {
                toggleHabit(id);
            } else if (e.target.closest('.habit-delete')) {
                deleteHabit(id);
            }
        });
    }

    // Modal controls
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', () => {
            elements.shortcutsModal.classList.add('hidden');
        });
    }

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            elements.shortcutsModal.classList.add('hidden');
            if (elements.habitModal) {
                closeHabitModal();
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Set current year
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ===================================
// Initialization
// ===================================

function init() {
    // Apply saved settings
    applyTheme(state.theme);
    applyAccentColor(state.accentColor);
    toggleAnimations(state.animationsEnabled);

    // Initialize time format label
    if (elements.timeFormatLabel) {
        elements.timeFormatLabel.textContent = state.timeFormat.toUpperCase();
    }

    // Start clock
    updateClock();
    updateDate();
    updateGreeting();

    // Update clock every second
    setInterval(updateClock, 1000);
    setInterval(updateGreeting, 60000);
    setInterval(updateDate, 60000);

    // Fetch weather
    fetchWeather();

    // Initialize features
    checkDailyFocus();
    displayRandomQuote();
    renderTodos();
    loadNotes();
    renderHabits();
    initPomodoro();

    // Initialize event listeners
    initEventListeners();

    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to your Command Center! Press ? for shortcuts.', 'info', 4000);
    }, 1000);
}

// Start the application
document.addEventListener('DOMContentLoaded', init);