// ===========================================
// ГЛОБАЛЬНАЯ ЛОГИКА РАБОТЫ С КОРЗИНОЙ
// ===========================================

// Ключ для хранения корзины в localStorage
const CART_STORAGE_KEY = 'courseCart';

// Получение корзины из localStorage
function getCart() {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateAllCartCounters(); // Обновляем счетчики на всех страницах
}

// Обновление всех счетчиков корзины на странице
function updateAllCartCounters() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Обновляем счетчик в хедере на ВСЕХ страницах
    document.querySelectorAll('#header-cart-counter').forEach(counter => {
        counter.textContent = totalItems;
        
        // Показываем/скрываем счетчик в зависимости от количества
        if (totalItems > 0) {
            counter.style.display = 'flex';
            counter.style.opacity = '1';
        } else {
            counter.style.display = 'none';
        }
    });
    
    // Обновляем счетчик на странице корзины, если он есть
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

// Добавление товара в корзину
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity || 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity || 1
        });
    }
    
    saveCart(cart);
    return cart;
}

// Удаление товара из корзины
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

// Обновление количества товара
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            return removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart(cart);
        }
    }
    
    return cart;
}

// Очистка корзины
function clearCart() {
    saveCart([]);
}