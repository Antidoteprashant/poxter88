/**
 * poxter88 - Shopping Cart Functionality
 * Handles cart operations, storage, and UI updates
 */

// Cart state
let cart = [];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartClose = document.getElementById('cartClose');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBody = document.getElementById('cartBody');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');

/**
 * Initialize cart from localStorage
 */
function initCart() {
    const savedCart = localStorage.getItem('poxter_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('poxter_cart', JSON.stringify(cart));
}

/**
 * Add item to cart
 * @param {Object} product - Product object
 * @param {string} size - Selected size
 * @param {number} quantity - Quantity to add
 */
function addToCart(product, size = 'L', quantity = 1) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
        item => item.id === product.id && item.size === size
    );

    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            size: size,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    showCartNotification(product.name);

    // Open cart sidebar briefly
    openCart();
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID
 * @param {string} size - Size variant
 */
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartUI();
}

/**
 * Update item quantity
 * @param {string} productId - Product ID
 * @param {string} size - Size variant
 * @param {number} newQuantity - New quantity
 */
function updateQuantity(productId, size, newQuantity) {
    const itemIndex = cart.findIndex(
        item => item.id === productId && item.size === size
    );

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size);
        } else {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            updateCartUI();
        }
    }
}

/**
 * Calculate cart subtotal
 * @returns {number} Cart subtotal
 */
function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get total items count
 * @returns {number} Total items in cart
 */
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Update cart UI
 */
function updateCartUI() {
    const itemCount = getCartItemCount();
    const subtotal = getCartSubtotal();

    // Update cart count badge
    if (cartCount) {
        cartCount.textContent = itemCount;
        if (itemCount > 0) {
            cartCount.classList.add('visible');
        } else {
            cartCount.classList.remove('visible');
        }
    }

    // Update subtotal
    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }

    // Render cart items
    renderCartItems();
}

/**
 * Render cart items in sidebar
 */
function renderCartItems() {
    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-variant">Size: ${item.size} | Qty: ${item.quantity}</p>
                <p class="cart-item-price">${formatPrice(item.price * item.quantity)}</p>
                <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
            </div>
        </div>
    `).join('');

    // Add remove event listeners
    cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const size = e.target.dataset.size;
            removeFromCart(id, size);
        });
    });
}

/**
 * Open cart sidebar
 */
function openCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

/**
 * Close cart sidebar
 */
function closeCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

/**
 * Toggle cart sidebar
 */
function toggleCart() {
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        closeCart();
    } else {
        openCart();
    }
}

/**
 * Show add to cart notification
 * @param {string} productName - Name of added product
 */
function showCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <path d="m9 11 3 3L22 4"></path>
        </svg>
        <span>${productName} added to cart</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #121212;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        z-index: 1000;
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

/**
 * Clear entire cart
 */
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initCart();

    // Cart button click
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }

    // Cart close button
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    // Cart overlay click
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Close cart on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('active')) {
            closeCart();
        }
    });
});

// Export functions for use in other scripts
window.poxterCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart,
    clearCart,
    getCartItemCount,
    getCartSubtotal
};
