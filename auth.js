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

// Ключ для хранения купленных курсов
const PURCHASED_COURSES_KEY = 'purchasedCourses';

// Добавление купленного курса
function addPurchasedCourse(course) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userId = user.email || user.phone;
    const purchased = JSON.parse(localStorage.getItem(PURCHASED_COURSES_KEY) || '{}');
    
    if (!purchased[userId]) {
        purchased[userId] = [];
    }
    
    // Проверяем, не куплен ли уже этот курс
    const existing = purchased[userId].find(c => c.id === course.id);
    if (!existing) {
        purchased[userId].push({
            id: course.id,
            name: course.name,
            price: course.price,
            image: course.image,
            purchasedAt: new Date().toISOString(),
            completed: false,
            completedLessons: []
        });
        localStorage.setItem(PURCHASED_COURSES_KEY, JSON.stringify(purchased));
    }
    return true;
}

// Отметить курс как пройденный (вызывается после отзыва)
function completeCourse(courseId, courseName, courseImage) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userId = user.email || user.phone;
    const purchased = JSON.parse(localStorage.getItem(PURCHASED_COURSES_KEY) || '{}');
    
    if (!purchased[userId]) {
        purchased[userId] = [];
    }
    
    const existingCourse = purchased[userId].find(c => c.id === courseId);
    
    if (existingCourse) {
        existingCourse.completed = true;
        existingCourse.completedAt = new Date().toISOString();
    } else {
        purchased[userId].push({
            id: courseId,
            name: courseName,
            image: courseImage,
            purchasedAt: new Date().toISOString(),
            completed: true,
            completedAt: new Date().toISOString(),
            completedLessons: []
        });
    }
    
    localStorage.setItem(PURCHASED_COURSES_KEY, JSON.stringify(purchased));
    return true;
}

// Получить купленные курсы пользователя
function getUserPurchasedCourses() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userId = user.email || user.phone;
    const purchased = JSON.parse(localStorage.getItem(PURCHASED_COURSES_KEY) || '{}');
    return purchased[userId] || [];
}

// В функции login добавим обновление ссылки на админку
function updateAdminLink() {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        const headerActions = document.querySelector('.header-actions');
        if (headerActions && !document.querySelector('.admin-link')) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.className = 'admin-link';
            adminLink.innerHTML = '👑 Админ-панель';
            adminLink.style.marginRight = '20px';
            adminLink.style.color = 'white';
            adminLink.style.textDecoration = 'none';
            headerActions.insertBefore(adminLink, headerActions.firstChild);
        }
    }
}

// Вызвать эту функцию после login




