/**
 * POXTER88 - Authentication Module
 * Handles user login, signup, and session management
 */

// Auth state
const authState = {
    isLoggedIn: false,
    user: null
};

// Load auth state from Supabase
async function loadAuthState() {
    const { data: { session }, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        console.error('Error loading auth state:', error);
        return;
    }

    if (session) {
        authState.isLoggedIn = true;
        authState.user = {
            id: session.user.id,
            fullName: session.user.user_metadata.full_name || 'User',
            email: session.user.email,
            phone: session.user.user_metadata.phone || ''
        };
    } else {
        authState.isLoggedIn = false;
        authState.user = null;
    }
    updateAuthUI();
}

// Check if user is logged in
function isLoggedIn() {
    return authState.isLoggedIn && authState.user !== null;
}

// Get current user
function getCurrentUser() {
    return authState.user;
}

/**
 * Sign up new user
 */
async function signUp(userData) {
    try {
        const { data, error } = await window.supabaseClient.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    full_name: userData.fullName,
                    phone: userData.phone
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            authState.isLoggedIn = true;
            authState.user = {
                id: data.user.id,
                fullName: userData.fullName,
                email: data.user.email,
                phone: userData.phone
            };
            updateAuthUI();
            return { success: true, user: authState.user };
        }
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Login user
 */
async function login(email, password) {
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        if (data.user) {
            authState.isLoggedIn = true;
            authState.user = {
                id: data.user.id,
                fullName: data.user.user_metadata.full_name || 'User',
                email: data.user.email,
                phone: data.user.user_metadata.phone || ''
            };
            updateAuthUI();
            return { success: true, user: authState.user };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Logout user
 */
async function logout() {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
    authState.isLoggedIn = false;
    authState.user = null;
    updateAuthUI();
    showAuthNotification('Logged out successfully', 'success');
}

/**
 * Update UI based on auth state
 */
function updateAuthUI() {
    const accountBtn = document.querySelector('.account-btn');
    const userDropdown = document.getElementById('userDropdown');

    if (accountBtn) {
        if (authState.isLoggedIn && authState.user) {
            // User is logged in - show initials
            const initials = authState.user.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

            accountBtn.innerHTML = `
                <span class="user-avatar">${initials}</span>
            `;
            accountBtn.title = `${authState.user.fullName}`;
            accountBtn.classList.add('logged-in');
        } else {
            // User is not logged in - show icon
            accountBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
            accountBtn.title = 'Login / Sign Up';
            accountBtn.classList.remove('logged-in');
        }
    }
}

/**
 * Show auth modal
 */
function showAuthModal(mode = 'login', redirectAfter = null) {
    const modal = document.getElementById('authModal');
    if (!modal) {
        createAuthModal();
    }

    // Store redirect action
    if (redirectAfter) {
        sessionStorage.setItem('auth_redirect_after', redirectAfter);
    }

    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('active');
        document.body.classList.add('modal-open');

        // Switch to requested mode
        if (mode === 'signup') {
            switchToSignup();
        } else {
            switchToLogin();
        }
    }
}

/**
 * Close auth modal
 */
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

/**
 * Switch to login form
 */
function switchToLogin() {
    const loginForm = document.getElementById('loginFormSection');
    const signupForm = document.getElementById('signupFormSection');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (loginForm) loginForm.classList.add('active');
    if (signupForm) signupForm.classList.remove('active');
    if (loginTab) loginTab.classList.add('active');
    if (signupTab) signupTab.classList.remove('active');
}

/**
 * Switch to signup form
 */
function switchToSignup() {
    const loginForm = document.getElementById('loginFormSection');
    const signupForm = document.getElementById('signupFormSection');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (loginForm) loginForm.classList.remove('active');
    if (signupForm) signupForm.classList.add('active');
    if (loginTab) loginTab.classList.remove('active');
    if (signupTab) signupTab.classList.add('active');
}

/**
 * Create auth modal dynamically
 */
function createAuthModal() {
    const modalHTML = `
        <div class="modal auth-modal" id="authModal">
            <div class="modal-content auth-modal-content">
                <button class="modal-close" id="closeAuthModal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
                
                <div class="auth-header">
                    <div class="auth-logo">
                        <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <text x="0" y="30" font-family="Oswald, sans-serif" font-size="28" font-weight="600"
                                fill="currentColor">poxter88</text>
                        </svg>
                    </div>
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="loginTab" onclick="window.poxter88Auth.switchToLogin()">Login</button>
                        <button class="auth-tab" id="signupTab" onclick="window.poxter88Auth.switchToSignup()">Sign Up</button>
                    </div>
                </div>
                
                <!-- Login Form -->
                <div class="auth-form-section active" id="loginFormSection">
                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email Address</label>
                            <input type="email" id="loginEmail" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <div class="password-input-wrapper">
                                <input type="password" id="loginPassword" placeholder="Enter your password" required>
                                <button type="button" class="toggle-password" onclick="togglePasswordVisibility('loginPassword', this)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="auth-error" id="loginError"></div>
                        <button type="submit" class="btn btn-primary auth-submit">Login</button>
                    </form>
                    <p class="auth-switch-text">
                        Don't have an account? <button type="button" onclick="window.poxter88Auth.switchToSignup()">Sign Up</button>
                    </p>
                </div>
                
                <!-- Signup Form -->
                <div class="auth-form-section" id="signupFormSection">
                    <form class="auth-form" id="signupForm">
                        <div class="form-group">
                            <label for="signupName">Full Name</label>
                            <input type="text" id="signupName" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email Address</label>
                            <input type="email" id="signupEmail" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPhone">Phone Number</label>
                            <input type="tel" id="signupPhone" placeholder="10-digit mobile number" required pattern="[6-9][0-9]{9}">
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <div class="password-input-wrapper">
                                <input type="password" id="signupPassword" placeholder="Create a password" required minlength="6">
                                <button type="button" class="toggle-password" onclick="togglePasswordVisibility('signupPassword', this)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="signupConfirmPassword">Confirm Password</label>
                            <div class="password-input-wrapper">
                                <input type="password" id="signupConfirmPassword" placeholder="Confirm your password" required>
                                <button type="button" class="toggle-password" onclick="togglePasswordVisibility('signupConfirmPassword', this)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="auth-error" id="signupError"></div>
                        <button type="submit" class="btn btn-primary auth-submit">Create Account</button>
                    </form>
                    <p class="auth-switch-text">
                        Already have an account? <button type="button" onclick="window.poxter88Auth.switchToLogin()">Login</button>
                    </p>
                </div>
                
                <div class="auth-footer">
                    <p>By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Attach event listeners
    document.getElementById('closeAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('authModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'authModal') closeAuthModal();
    });
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
            `;
        } else {
            input.type = 'password';
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    // Clear previous errors
    if (errorEl) errorEl.textContent = '';

    // Validate
    if (!email || !password) {
        if (errorEl) errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('.auth-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Logging in...';
    }

    try {
        const result = await login(email, password);

        if (result.success) {
            showAuthNotification(`Welcome back, ${result.user.fullName}!`, 'success');
            closeAuthModal();

            // Check for redirect action
            const redirectAction = sessionStorage.getItem('auth_redirect_after');
            if (redirectAction === 'checkout') {
                sessionStorage.removeItem('auth_redirect_after');
                // Proceed to checkout
                if (window.poxterCheckout) {
                    window.poxterCheckout.initCheckoutProcess();
                }
            }
        } else {
            if (errorEl) errorEl.textContent = result.error;
        }
    } catch (err) {
        console.error('Login error:', err);
        if (errorEl) errorEl.textContent = 'An error occurred during login.';
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    }
}

/**
 * Handle signup form submission
 */
async function handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorEl = document.getElementById('signupError');

    // Clear previous errors
    if (errorEl) errorEl.textContent = '';

    // Validate
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        if (errorEl) errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        if (errorEl) errorEl.textContent = 'Please enter a valid 10-digit phone number.';
        return;
    }

    if (password.length < 6) {
        if (errorEl) errorEl.textContent = 'Password must be at least 6 characters.';
        return;
    }

    if (password !== confirmPassword) {
        if (errorEl) errorEl.textContent = 'Passwords do not match.';
        return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('.auth-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';
    }

    try {
        const result = await signUp({ fullName, email, phone, password });

        if (result.success) {
            showAuthNotification(`Welcome, ${result.user.fullName}! Your account has been created.`, 'success');
            closeAuthModal();

            // Check for redirect action
            const redirectAction = sessionStorage.getItem('auth_redirect_after');
            if (redirectAction === 'checkout') {
                sessionStorage.removeItem('auth_redirect_after');
                // Proceed to checkout
                if (window.poxterCheckout) {
                    window.poxterCheckout.initCheckoutProcess();
                }
            }
        } else {
            if (errorEl) errorEl.textContent = result.error;
        }
    } catch (err) {
        console.error('Signup error:', err);
        if (errorEl) errorEl.textContent = 'An error occurred during signup.';
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    }
}

/**
 * Show auth notification
 */
function showAuthNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success'
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path>'
            : '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>'}
        </svg>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        z-index: 10000;
        transition: transform 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Require login before checkout
 * Returns true if logged in, false if login modal shown
 */
function requireLoginForCheckout() {
    if (isLoggedIn()) {
        return true;
    }

    // Show login modal with checkout redirect
    showAuthModal('login', 'checkout');
    showAuthNotification('Please login to continue with checkout', 'info');
    return false;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadAuthState();
    createAuthModal();

    // Account button click
    const accountBtn = document.querySelector('.account-btn');
    if (accountBtn) {
        accountBtn.addEventListener('click', () => {
            if (isLoggedIn()) {
                // Show user menu or perform logout
                if (confirm('Do you want to logout?')) {
                    logout();
                }
            } else {
                showAuthModal('login');
            }
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAuthModal();
        }
    });
});

// Export for global access
window.poxter88Auth = {
    isLoggedIn,
    getCurrentUser,
    login,
    signUp,
    logout,
    showAuthModal,
    closeAuthModal,
    switchToLogin,
    switchToSignup,
    requireLoginForCheckout,
    updateAuthUI
};

// Also make togglePasswordVisibility available globally
window.togglePasswordVisibility = togglePasswordVisibility;
