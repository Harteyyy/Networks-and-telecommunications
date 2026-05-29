// ===========================================
// ГЛОБАЛЬНАЯ ЛОГИКА АВТОРИЗАЦИИ
// ===========================================

// Ключ для хранения состояния авторизации
const AUTH_STORAGE_KEY = 'userAuth';

// Состояние авторизации
let isAuthenticated = false;
let currentUser = null;

// Инициализация при загрузке
function initAuth() {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            isAuthenticated = true;
            currentUser = parsed.user;
            console.log('Пользователь загружен из localStorage:', currentUser);
        } catch (e) {
            console.error('Ошибка парсинга данных авторизации');
        }
    }
    updateAuthUI();
}

// Вход/регистрация пользователя
function login(userData) {
    isAuthenticated = true;
    currentUser = userData;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: userData,
        timestamp: new Date().toISOString()
    }));
    console.log('Пользователь сохранен в localStorage:', userData);
    updateAuthUI();
}

// Выход пользователя
function logout() {
    isAuthenticated = false;
    currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('Пользователь вышел из аккаунта');
    updateAuthUI();
}

// Проверка авторизации
function checkAuth() {
    return isAuthenticated;
}

// Получение текущего пользователя
function getCurrentUser() {
    return currentUser;
}

// Обновление UI в зависимости от состояния авторизации
function updateAuthUI() {
    const cabinetLinks = document.querySelectorAll('.cabinet');
    
    cabinetLinks.forEach(link => {
        if (isAuthenticated) {
            link.setAttribute('href', 'profile.html');
        } else {
            link.setAttribute('href', 'register.html');
        }
    });
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});