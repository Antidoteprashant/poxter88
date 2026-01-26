/**
 * LBVP - Main JavaScript
 * Handles navigation, modals, animations, and general functionality
 */

// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const quickviewModal = document.getElementById('quickviewModal');
const quickviewClose = document.getElementById('quickviewClose');
const quickviewImage = document.getElementById('quickviewImage');
const quickviewTitle = document.getElementById('quickviewTitle');
const quickviewPrice = document.getElementById('quickviewPrice');
const sizeOptions = document.getElementById('sizeOptions');
const addToCartBtn = document.getElementById('addToCartBtn');
const newsletterForm = document.getElementById('newsletterForm');

// State
let currentProduct = null;
let selectedSize = 'L';
let lastScrollTop = 0;

/**
 * Initialize the application
 */
function init() {
    setupNavigation();
    setupSearch();
    setupQuickView();
    setupIntersectionObserver();
    setupSmoothScroll();
    setupNewsletterForm();
    setupProductCardClicks();
}

/**
 * Setup mobile navigation
 */
function setupNavigation() {
    // Mobile menu toggle
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.classList.toggle('modal-open');
        });

        // Close mobile nav on link click
        navMobile.querySelectorAll('.nav-link-mobile').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        });
    }

    // Header scroll behavior
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add shadow when scrolled
            if (scrollTop > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }
}

/**
 * Setup search modal
 */
function setupSearch() {
    if (searchBtn && searchModal) {
        // Open search
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            document.body.classList.add('modal-open');
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 100);
        });

        // Close search
        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        // Close on background click
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeSearch();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearch();
            }
        });
    }
}

function closeSearch() {
    if (searchModal) {
        searchModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (searchInput) searchInput.value = '';
    }
}

/**
 * Setup Quick View modal
 */
function setupQuickView() {
    // Close quick view
    if (quickviewClose && quickviewModal) {
        quickviewClose.addEventListener('click', closeQuickView);

        quickviewModal.addEventListener('click', (e) => {
            if (e.target === quickviewModal) {
                closeQuickView();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quickviewModal.classList.contains('active')) {
                closeQuickView();
            }
        });
    }

    // Size selection
    if (sizeOptions) {
        sizeOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn')) {
                sizeOptions.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                selectedSize = e.target.dataset.size;
            }
        });
    }

    // Add to cart from quick view
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (currentProduct && window.lbvpCart) {
                window.lbvpCart.addToCart(currentProduct, selectedSize);
                closeQuickView();
            }
        });
    }
}

/**
 * Open quick view modal with product data
 * @param {Object} product - Product object
 */
function openQuickView(product) {
    if (!quickviewModal || !product) return;

    currentProduct = product;
    selectedSize = product.sizes[Math.floor(product.sizes.length / 2)] || 'L';

    // Update modal content
    if (quickviewImage) {
        quickviewImage.src = product.image;
        quickviewImage.alt = product.name;
    }

    if (quickviewTitle) {
        quickviewTitle.textContent = product.name;
    }

    if (quickviewPrice) {
        if (product.originalPrice) {
            quickviewPrice.innerHTML = `
                <span class="price-original">${formatPrice(product.originalPrice)}</span>
                ${formatPrice(product.price)}
            `;
        } else {
            quickviewPrice.textContent = formatPrice(product.price);
        }
    }

    // Update size buttons
    if (sizeOptions) {
        sizeOptions.innerHTML = product.sizes.map(size => `
            <button class="size-btn ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</button>
        `).join('');
    }

    // Show modal
    quickviewModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeQuickView() {
    if (quickviewModal) {
        quickviewModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        currentProduct = null;
    }
}

/**
 * Setup product card click handlers
 */
function setupProductCardClicks() {
    // Use event delegation for dynamically loaded products
    document.addEventListener('click', (e) => {
        // Quick add button click
        const quickAddBtn = e.target.closest('.quick-add-btn');
        if (quickAddBtn) {
            e.preventDefault();
            e.stopPropagation();
            const productId = quickAddBtn.dataset.productId;
            const product = getProductById(productId);
            if (product) {
                openQuickView(product);
            }
            return;
        }

        // Product card click
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.productId;
            const product = getProductById(productId);
            if (product) {
                openQuickView(product);
            }
        }
    });
}

/**
 * Setup Intersection Observer for scroll animations
 */
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Optional: Unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Observe section headers for animation
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Observe products grids
    document.querySelectorAll('.products-grid').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const announcementBar = document.querySelector('.announcement-bar');
                const announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;
                const totalOffset = headerHeight + announcementHeight;

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Setup newsletter form
 */
function setupNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value) {
                // Show success message
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            }
        });
    }
}

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const iconSvg = type === 'success'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;

    notification.innerHTML = `${iconSvg}<span>${message}</span>`;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#121212'};
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

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
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

/**
 * Throttle utility function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Lazy load images with IntersectionObserver
 */
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Preload critical images
 */
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&h=1600&fit=crop'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Handle window resize events
 */
function handleResize() {
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 768) {
        if (menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }
}

// Window resize handler (debounced)
window.addEventListener('resize', debounce(handleResize, 250));

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    preloadImages();
    setupLazyLoading();
});

// Export utilities
window.lbvpApp = {
    openQuickView,
    closeQuickView,
    showNotification,
    debounce,
    throttle
};
