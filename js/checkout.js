/**
 * poxter88 - Checkout & Validation Module
 * Handles pre-purchase validation and checkout form
 */

// User state (simulated)
let userState = {
    isLoggedIn: false,
    user: null
};

// Load user state from localStorage
function loadUserState() {
    const saved = localStorage.getItem('lbvp_user');
    if (saved) {
        try {
            userState = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading user state:', e);
        }
    }
}

// Save user state
function saveUserState() {
    localStorage.setItem('lbvp_user', JSON.stringify(userState));
}

/**
 * Validate cart before checkout
 * @returns {Object} Validation result with status and errors
 */
function validateCart() {
    const errors = [];
    const warnings = [];

    // Get current cart
    const cartItems = JSON.parse(localStorage.getItem('lbvp_cart') || '[]');

    // Check if cart is empty
    if (cartItems.length === 0) {
        errors.push({
            type: 'empty_cart',
            message: 'Your cart is empty. Add items before checkout.'
        });
        return { valid: false, errors, warnings };
    }

    // Validate each item
    cartItems.forEach(item => {
        // Check quantity
        if (item.quantity <= 0) {
            errors.push({
                type: 'invalid_quantity',
                message: `Invalid quantity for ${item.name}`
            });
        }

        if (item.quantity > 10) {
            warnings.push({
                type: 'high_quantity',
                message: `High quantity (${item.quantity}) for ${item.name}. Please confirm.`
            });
        }

        // Check price validity
        if (!item.price || item.price <= 0) {
            errors.push({
                type: 'invalid_price',
                message: `Invalid price for ${item.name}`
            });
        }

        // Check availability (simulated - all items available)
        const product = getProductById(item.id);
        if (!product) {
            errors.push({
                type: 'unavailable',
                message: `${item.name} is no longer available`
            });
        } else if (!product.sizes.includes(item.size)) {
            errors.push({
                type: 'size_unavailable',
                message: `Size ${item.size} is not available for ${item.name}`
            });
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        cartItems,
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
}

/**
 * Show validation modal
 */
function showValidationModal(validation) {
    const modal = document.getElementById('validationModal');
    const content = document.getElementById('validationContent');

    if (!modal || !content) return;

    let html = '';

    if (validation.errors.length > 0) {
        html += `
            <div class="validation-section validation-errors">
                <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg> Issues Found</h4>
                <ul>
                    ${validation.errors.map(e => `<li>${e.message}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (validation.warnings.length > 0) {
        html += `
            <div class="validation-section validation-warnings">
                <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg> Warnings</h4>
                <ul>
                    ${validation.warnings.map(w => `<li>${w.message}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (validation.valid) {
        html += `
            <div class="validation-section validation-success">
                <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg> Cart Validated</h4>
                <p>Your cart is ready for checkout!</p>
            </div>
            <div class="validation-summary">
                <div class="summary-row"><span>Items:</span><span>${validation.cartItems.length}</span></div>
                <div class="summary-row total"><span>Subtotal:</span><span>${formatPrice(validation.subtotal)}</span></div>
            </div>
        `;
    }

    content.innerHTML = html;

    // Update button states
    const proceedBtn = document.getElementById('proceedToCheckout');
    if (proceedBtn) {
        proceedBtn.disabled = !validation.valid;
        proceedBtn.textContent = validation.valid ? 'Proceed to Checkout' : 'Fix Issues to Continue';
    }

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

/**
 * Close validation modal
 */
function closeValidationModal() {
    const modal = document.getElementById('validationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

/**
 * Show checkout form
 */
function showCheckoutForm() {
    closeValidationModal();

    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    // Pre-fill if user is logged in
    if (userState.isLoggedIn && userState.user) {
        const fields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && userState.user[field]) {
                input.value = userState.user[field];
            }
        });
    }

    // Update order summary
    updateOrderSummary();

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

/**
 * Update order summary in checkout form
 */
function updateOrderSummary() {
    const summaryEl = document.getElementById('orderSummary');
    if (!summaryEl) return;

    const cartItems = JSON.parse(localStorage.getItem('lbvp_cart') || '[]');
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    summaryEl.innerHTML = `
        <div class="order-items">
            ${cartItems.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-info">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-details">Size: ${item.size} × ${item.quantity}</span>
                    </div>
                    <span class="order-item-price">${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-totals">
            <div class="order-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
            <div class="order-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div class="order-row order-total"><span>Total</span><span>${formatPrice(total)}</span></div>
        </div>
    `;
}

/**
 * Validate checkout form
 */
function validateCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return { valid: false, errors: ['Form not found'] };

    const errors = [];
    const formData = new FormData(form);

    // Validate full name
    const fullName = formData.get('fullName')?.trim();
    if (!fullName || fullName.length < 2) {
        errors.push('Please enter your full name');
    }

    // Validate email
    const email = formData.get('email')?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }

    // Validate phone
    const phone = formData.get('phone')?.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.push('Please enter a valid 10-digit phone number');
    }

    // Validate address
    const address = formData.get('address')?.trim();
    if (!address || address.length < 10) {
        errors.push('Please enter your complete address');
    }

    // Validate city
    const city = formData.get('city')?.trim();
    if (!city || city.length < 2) {
        errors.push('Please enter your city');
    }

    // Validate pincode
    const pincode = formData.get('pincode')?.trim();
    const pincodeRegex = /^\d{6}$/;
    if (!pincode || !pincodeRegex.test(pincode)) {
        errors.push('Please enter a valid 6-digit pincode');
    }

    // Validate payment method
    const paymentMethod = formData.get('paymentMethod');
    if (!paymentMethod) {
        errors.push('Please select a payment method');
    }

    return {
        valid: errors.length === 0,
        errors,
        data: {
            fullName, email, phone, address, city, pincode, paymentMethod
        }
    };
}

/**
 * Submit order
 */
function submitOrder() {
    const validation = validateCheckoutForm();

    if (!validation.valid) {
        showFormErrors(validation.errors);
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.checkout-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    }

    // Simulate order processing
    setTimeout(() => {
        // Generate order ID
        const orderId = 'LBVP' + Date.now().toString(36).toUpperCase();

        // Save order to localStorage
        const order = {
            id: orderId,
            items: JSON.parse(localStorage.getItem('lbvp_cart') || '[]'),
            customer: validation.data,
            status: 'confirmed',
            date: new Date().toISOString()
        };

        const orders = JSON.parse(localStorage.getItem('lbvp_orders') || '[]');
        orders.push(order);
        localStorage.setItem('lbvp_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.setItem('lbvp_cart', '[]');
        if (window.lbvpCart) {
            window.lbvpCart.clearCart();
        }

        // Show success
        showOrderSuccess(orderId, validation.data.email);
    }, 2000);
}

/**
 * Show form validation errors
 */
function showFormErrors(errors) {
    const errorContainer = document.getElementById('formErrors');
    if (!errorContainer) return;

    errorContainer.innerHTML = `
        <div class="form-error-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
            <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
        </div>
    `;
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Show order success
 */
function showOrderSuccess(orderId, email) {
    const modal = document.getElementById('checkoutModal');
    const content = modal?.querySelector('.checkout-content');

    if (content) {
        content.innerHTML = `
            <div class="order-success">
                <div class="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                </div>
                <h2>Order Confirmed!</h2>
                <p class="order-id">Order ID: <strong>${orderId}</strong></p>
                <p class="order-email">Confirmation sent to <strong>${email}</strong></p>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="closeCheckoutModal(); location.reload();">Continue Shopping</button>
                </div>
            </div>
        `;
    }
}

/**
 * Initialize checkout on button click
 */
function initCheckoutProcess() {
    const validation = validateCart();
    showValidationModal(validation);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadUserState();

    // Checkout button in cart
    document.querySelector('.btn-checkout')?.addEventListener('click', (e) => {
        e.preventDefault();
        initCheckoutProcess();
    });
});

// Export
window.lbvpCheckout = {
    initCheckoutProcess,
    showCheckoutForm,
    closeCheckoutModal,
    closeValidationModal,
    submitOrder
};
