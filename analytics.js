/**
 * Personal Command Center - Analytics Page
 * Displays productivity statistics and insights
 */

// ===================================
// State from localStorage
// ===================================

const state = {
    theme: localStorage.getItem('theme') || 'dark',
    accentColor: localStorage.getItem('accentColor') || 'indigo',
    todos: JSON.parse(localStorage.getItem('todos')) || [],
    habits: JSON.parse(localStorage.getItem('habits')) || [],
    habitHistory: JSON.parse(localStorage.getItem('habitHistory')) || {},
    todayStats: JSON.parse(localStorage.getItem('todayStats')) || { completed: 0, date: new Date().toDateString() },
    streak: JSON.parse(localStorage.getItem('streak')) || { count: 0, lastDate: null },
    activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
    weeklyData: JSON.parse(localStorage.getItem('weeklyData')) || {}
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    exportData: document.getElementById('export-data'),
    dateRange: document.getElementById('date-range'),
    
    // Overview stats
    totalTasks: document.getElementById('total-tasks'),
    totalCompleted: document.getElementById('total-completed'),
    currentStreak: document.getElementById('current-streak'),
    focusHours: document.getElementById('focus-hours'),
    
    // Charts
    weeklyChart: document.getElementById('weekly-chart'),
    priorityDonut: document.getElementById('priority-donut'),
    donutTotal: document.getElementById('donut-total'),
    donutHigh: document.getElementById('donut-high'),
    donutMedium: document.getElementById('donut-medium'),
    donutLow: document.getElementById('donut-low'),
    highCount: document.getElementById('high-count'),
    mediumCount: document.getElementById('medium-count'),
    lowCount: document.getElementById('low-count'),
    
    // Habits
    habitsWeekGrid: document.getElementById('habits-week-grid'),
    
    // Activity
    activityList: document.getElementById('activity-list'),
    clearActivity: document.getElementById('clear-activity'),
    
    // Score
    productivityScore: document.getElementById('productivity-score'),
    scoreCircle: document.getElementById('score-circle'),
    taskScoreBar: document.getElementById('task-score-bar'),
    focusScoreBar: document.getElementById('focus-score-bar'),
    habitScoreBar: document.getElementById('habit-score-bar'),
    
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

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===================================
// Theme Functions
// ===================================

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function applyAccentColor(color) {
    document.documentElement.setAttribute('data-accent', color);
}

function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    showNotification(`Switched to ${newTheme} mode`, 'info', 2000);
}

// ===================================
// Overview Stats
// ===================================

function updateOverviewStats() {
    const range = elements.dateRange?.value || 'week';
    let filteredTodos = state.todos;
    
    // Filter by date range
    const now = new Date();
    if (range === 'today') {
        const today = now.toDateString();
        filteredTodos = state.todos.filter(t => new Date(t.createdAt).toDateString() === today);
    } else if (range === 'week') {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        filteredTodos = state.todos.filter(t => new Date(t.createdAt) >= weekAgo);
    } else if (range === 'month') {
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        filteredTodos = state.todos.filter(t => new Date(t.createdAt) >= monthAgo);
    }
    
    const totalTasks = filteredTodos.length;
    const completedTasks = filteredTodos.filter(t => t.completed).length;
    
    if (elements.totalTasks) elements.totalTasks.textContent = totalTasks;
    if (elements.totalCompleted) elements.totalCompleted.textContent = completedTasks;
    if (elements.currentStreak) elements.currentStreak.textContent = state.streak.count;
    
    // Calculate focus hours (from pomodoro sessions if tracked)
    const focusMinutes = parseInt(localStorage.getItem('totalFocusMinutes')) || 0;
    if (elements.focusHours) {
        elements.focusHours.textContent = `${Math.floor(focusMinutes / 60)}h`;
    }
}

// ===================================
// Weekly Chart
// ===================================

function updateWeeklyChart() {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const today = new Date();
    const weekData = [];
    
    // Get data for last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const completedOnDay = state.todos.filter(t => {
            if (!t.completed) return false;
            const todoDate = new Date(t.createdAt).toDateString();
            return todoDate === dateStr;
        }).length;
        
        weekData.push({
            day: days[date.getDay()],
            count: completedOnDay
        });
    }
    
    const maxCount = Math.max(...weekData.map(d => d.count), 1);
    
    const bars = elements.weeklyChart?.querySelectorAll('.bar');
    if (bars) {
        bars.forEach((bar, index) => {
            if (weekData[index]) {
                const height = (weekData[index].count / maxCount) * 100;
                bar.style.setProperty('--height', `${Math.max(height, 5)}%`);
                bar.setAttribute('data-count', weekData[index].count);
            }
        });
    }
}

// ===================================
// Priority Donut Chart
// ===================================

function updatePriorityChart() {
    const high = state.todos.filter(t => t.priority === 'high').length;
    const medium = state.todos.filter(t => t.priority === 'medium').length;
    const low = state.todos.filter(t => t.priority === 'low').length;
    const total = high + medium + low;
    
    if (elements.donutTotal) elements.donutTotal.textContent = total;
    if (elements.highCount) elements.highCount.textContent = high;
    if (elements.mediumCount) elements.mediumCount.textContent = medium;
    if (elements.lowCount) elements.lowCount.textContent = low;
    
    if (total === 0) return;
    
    const circumference = 2 * Math.PI * 40;
    
    // Calculate segments
    const highPercent = (high / total) * 100;
    const mediumPercent = (medium / total) * 100;
    const lowPercent = (low / total) * 100;
    
    const highDash = (highPercent / 100) * circumference;
    const mediumDash = (mediumPercent / 100) * circumference;
    const lowDash = (lowPercent / 100) * circumference;
    
    if (elements.donutHigh) {
        elements.donutHigh.style.strokeDasharray = `${highDash} ${circumference}`;
        elements.donutHigh.style.strokeDashoffset = '0';
    }
    
    if (elements.donutMedium) {
        elements.donutMedium.style.strokeDasharray = `${mediumDash} ${circumference}`;
        elements.donutMedium.style.strokeDashoffset = `-${highDash}`;
    }
    
    if (elements.donutLow) {
        elements.donutLow.style.strokeDasharray = `${lowDash} ${circumference}`;
        elements.donutLow.style.strokeDashoffset = `-${highDash + mediumDash}`;
    }
}

// ===================================
// Habits Week Grid
// ===================================

function updateHabitsWeekGrid() {
    if (!elements.habitsWeekGrid) return;
    
    if (state.habits.length === 0) {
        elements.habitsWeekGrid.innerHTML = '<div class="habits-loading">No habits tracked yet. Add habits from the dashboard!</div>';
        return;
    }
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    let html = '';
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const completedHabits = state.habitHistory[dateStr] || [];
        const totalHabits = state.habits.length;
        const completionPercent = totalHabits > 0 ? (completedHabits.length / totalHabits) * 100 : 0;
        
        let cellClass = '';
        if (completionPercent === 100) cellClass = 'completed';
        else if (completionPercent > 0) cellClass = 'partial';
        
        html += `
            <div class="habit-day">
                <span class="habit-day-label">${days[date.getDay()]}</span>
                <div class="habit-day-cell ${cellClass}">${completedHabits.length}/${totalHabits}</div>
            </div>
        `;
    }
    
    elements.habitsWeekGrid.innerHTML = html;
}

// ===================================
// Activity Log
// ===================================

function updateActivityLog() {
    if (!elements.activityList) return;
    
    if (state.activityLog.length === 0) {
        elements.activityList.innerHTML = '<div class="activity-empty">No recent activity</div>';
        return;
    }
    
    const recentActivity = state.activityLog.slice(0, 10);
    
    const iconMap = {
        task: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
        habit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
        focus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
    };
    
    elements.activityList.innerHTML = recentActivity.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                ${iconMap[activity.type] || iconMap.task}
            </div>
            <div class="activity-info">
                <span class="activity-text">${activity.text}</span>
                <span class="activity-time">${formatDate(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function clearActivityLog() {
    if (confirm('Clear all activity history?')) {
        state.activityLog = [];
        localStorage.setItem('activityLog', JSON.stringify([]));
        updateActivityLog();
        showNotification('Activity log cleared', 'info');
    }
}

// ===================================
// Productivity Score
// ===================================

function updateProductivityScore() {
    // Calculate score based on multiple factors
    const taskCompletion = state.todos.length > 0 
        ? (state.todos.filter(t => t.completed).length / state.todos.length) * 100 
        : 0;
    
    const focusScore = Math.min((parseInt(localStorage.getItem('totalFocusMinutes')) || 0) / 60, 100);
    
    const today = new Date().toDateString();
    const todayHabits = state.habitHistory[today] || [];
    const habitScore = state.habits.length > 0 
        ? (todayHabits.length / state.habits.length) * 100 
        : 0;
    
    const streakBonus = Math.min(state.streak.count * 5, 20);
    
    const overallScore = Math.round(
        (taskCompletion * 0.4) + 
        (focusScore * 0.3) + 
        (habitScore * 0.2) + 
        streakBonus
    );
    
    if (elements.productivityScore) {
        elements.productivityScore.textContent = Math.min(overallScore, 100);
    }
    
    // Update circular progress
    if (elements.scoreCircle) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (Math.min(overallScore, 100) / 100) * circumference;
        elements.scoreCircle.style.strokeDashoffset = offset;
    }
    
    // Update detail bars
    if (elements.taskScoreBar) elements.taskScoreBar.style.width = `${taskCompletion}%`;
    if (elements.focusScoreBar) elements.focusScoreBar.style.width = `${focusScore}%`;
    if (elements.habitScoreBar) elements.habitScoreBar.style.width = `${habitScore}%`;
}

// ===================================
// Export Data
// ===================================

function exportAllData() {
    const data = {
        exportDate: new Date().toISOString(),
        todos: state.todos,
        habits: state.habits,
        habitHistory: state.habitHistory,
        activityLog: state.activityLog,
        streak: state.streak,
        settings: {
            theme: state.theme,
            accentColor: state.accentColor
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `command-center-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// ===================================
// Event Listeners
// ===================================

function initEventListeners() {
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (elements.exportData) {
        elements.exportData.addEventListener('click', exportAllData);
    }
    
    if (elements.dateRange) {
        elements.dateRange.addEventListener('change', () => {
            updateOverviewStats();
            updateWeeklyChart();
        });
    }
    
    if (elements.clearActivity) {
        elements.clearActivity.addEventListener('click', clearActivityLog);
    }
    
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ===================================
// Initialization
// ===================================

function init() {
    applyTheme(state.theme);
    applyAccentColor(state.accentColor);
    
    updateOverviewStats();
    updateWeeklyChart();
    updatePriorityChart();
    updateHabitsWeekGrid();
    updateActivityLog();
    updateProductivityScore();
    
    initEventListeners();
}

document.addEventListener('DOMContentLoaded', init);