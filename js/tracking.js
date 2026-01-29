
/**
 * POXTER88 Order Tracking System
 * Real-time order tracking functionality from Supabase
 */

// DOM Elements
const trackingForm = document.getElementById('trackingForm');
const trackingInput = document.getElementById('trackingInput');
const trackingResults = document.getElementById('trackingResults');
const trackingError = document.getElementById('trackingError');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const supportModal = document.getElementById('supportModal');
const closeSupportModal = document.getElementById('closeSupportModal');
const contactSupportBtn = document.getElementById('contactSupportBtn');
const reportIssueBtn = document.getElementById('reportIssueBtn');
const supportForm = document.getElementById('supportForm');
const saveNotificationsBtn = document.getElementById('saveNotifications');
const refreshUpdatesBtn = document.getElementById('refreshUpdates');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

// State
let currentOrder = null;
let countdownInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkUrlParams();
    animateHeroElements();
});

// Initialize Event Listeners
function initializeEventListeners() {
    trackingForm.addEventListener('submit', handleTrackingSubmit);
    tryAgainBtn.addEventListener('click', handleTryAgain);
    contactSupportBtn?.addEventListener('click', () => openSupportModal('contact'));
    reportIssueBtn?.addEventListener('click', () => openSupportModal('issue'));
    closeSupportModal?.addEventListener('click', closeSupportModalHandler);
    supportModal?.addEventListener('click', (e) => { if (e.target === supportModal) closeSupportModalHandler(); });
    supportForm?.addEventListener('submit', handleSupportSubmit);
    saveNotificationsBtn?.addEventListener('click', handleSaveNotifications);
    refreshUpdatesBtn?.addEventListener('click', handleRefreshUpdates);
    menuToggle?.addEventListener('click', toggleMobileMenu);

    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            navMobile?.classList.remove('active');
            menuToggle?.classList.remove('active');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSupportModalHandler();
    });
}

// Check URL parameters for order ID
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order') || urlParams.get('id') || urlParams.get('tracking');
    if (orderId) {
        trackingInput.value = orderId;
        handleTrackingSubmit(new Event('submit'));
    }
}

// Handle tracking form submission
async function handleTrackingSubmit(e) {
    if (e) e.preventDefault();

    const trackingNumber = trackingInput.value.trim().toUpperCase();
    if (!trackingNumber) {
        showToast('Please enter an Order ID or Tracking Number', 'error');
        return;
    }

    showLoadingState();

    try {
        const order = await findOrder(trackingNumber);
        if (order) {
            currentOrder = order;
            displayOrderDetails(order);
            trackingResults.classList.add('active');
            trackingError.classList.remove('active');
            startCountdownTimer(order.estimatedDelivery);
            trackingResults.scrollIntoView({ behavior: 'smooth' });
            updateUrl(trackingNumber);
        } else {
            trackingResults.classList.remove('active');
            trackingError.classList.add('active');
            trackingError.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        console.error('Tracking error:', err);
        showToast('Error fetching order details', 'error');
    } finally {
        hideLoadingState();
    }
}

// Find order by ID or tracking number from Supabase
async function findOrder(query) {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return null;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('orders')
            .select('*')
            .eq('id', query);

        if (error) throw error;

        if (data && data.length > 0) {
            const order = data[0];

            // Fetch product details if product_id exists
            let productDetails = {
                name: 'Poster Order',
                image: '',
                price: '₹' + (order.total_price || 0).toLocaleString('en-IN')
            };

            if (order.product_id) {
                const { data: pData } = await window.supabaseClient
                    .from('products')
                    .select('name, image, price')
                    .eq('id', order.product_id)
                    .single();

                if (pData) {
                    productDetails = {
                        name: pData.name,
                        image: pData.image,
                        price: '₹' + (order.total_price || 0).toLocaleString('en-IN')
                    };
                }
            }

            // Map data to UI expectations
            return {
                orderId: order.id,
                status: order.status || 'confirmed',
                statusText: (order.status || 'confirmed').charAt(0).toUpperCase() + (order.status || 'confirmed').slice(1),
                progress: getProgressFromStatus(order.status || 'confirmed'),
                estimatedDelivery: order.estimated_delivery ? new Date(order.estimated_delivery) : new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000),
                customer: {
                    name: order.customer_name,
                    phone: order.customer_phone,
                    address: `${order.customer_address}<br>${order.customer_city} - ${order.customer_pincode}`
                },
                product: {
                    name: productDetails.name,
                    image: productDetails.image,
                    quantity: order.quantity || 1,
                    price: productDetails.price
                },
                courier: {
                    name: order.courier_name || 'Awaiting Shipment',
                    awb: order.awb || '-',
                    trackingUrl: order.tracking_url || '#'
                },
                currentLocation: order.current_location || 'Processing',
                destination: order.customer_city || '-',
                timeline: order.timeline || [
                    {
                        status: 'Order Placed',
                        description: 'Your order has been successfully placed',
                        time: new Date(order.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        completed: true
                    }
                ],
                updates: order.updates || []
            };
        }
    } catch (err) {
        console.error('Supabase findOrder error:', err);
    }
    return null;
}


// Helper to get progress percentage
function getProgressFromStatus(status) {
    const progressMap = {
        'confirmed': 10,
        'processing': 30,
        'printed': 50,
        'shipped': 70,
        'out_for_delivery': 90,
        'delivered': 100
    };
    return progressMap[status] || 0;
}

// Display order details
function displayOrderDetails(order) {
    // Order ID and Status
    document.getElementById('displayOrderId').textContent = order.orderId;

    const statusBadge = document.getElementById('orderStatusBadge');
    statusBadge.querySelector('.status-text').textContent = order.statusText;
    statusBadge.className = 'order-status-badge';
    if (order.status === 'delivered') {
        statusBadge.classList.add('delivered');
    } else if (order.status === 'processing' || order.status === 'printed') {
        statusBadge.classList.add('pending');
    }

    // Progress bar
    document.getElementById('progressFill').style.width = `${order.progress}%`;
    document.getElementById('routeProgress').style.width = `${order.progress}%`;
    document.getElementById('routeTruck').style.left = `${order.progress}%`;

    // Locations
    document.getElementById('currentLocation').textContent = order.currentLocation;
    document.getElementById('destinationCity').textContent = order.destination;

    // Delivery date
    const deliveryDate = order.estimatedDelivery;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    document.querySelector('.date-day').textContent = days[deliveryDate.getDay()];
    document.querySelector('.date-full').textContent = `${deliveryDate.getDate()} ${months[deliveryDate.getMonth()]} ${deliveryDate.getFullYear()}`;

    // Product details
    document.getElementById('productImage').src = order.product.image;
    document.getElementById('productImage').alt = order.product.name;
    document.getElementById('productName').textContent = order.product.name;
    document.getElementById('productQty').textContent = order.product.quantity;
    document.querySelector('.product-price-tag').textContent = order.product.price;

    // Customer details
    document.getElementById('recipientName').textContent = order.customer.name;
    document.getElementById('shippingAddress').innerHTML = order.customer.address;
    document.getElementById('recipientPhone').textContent = order.customer.phone;

    // Courier details
    document.getElementById('courierName').textContent = order.courier.name;
    document.getElementById('courierAwb').textContent = order.courier.awb;
    document.getElementById('courierTrackLink').href = order.courier.trackingUrl;

    // Timeline
    renderTimeline(order.timeline);

    // Updates
    renderUpdates(order.updates);
}

// Render timeline
function renderTimeline(timeline) {
    const timelineContainer = document.getElementById('statusTimeline');
    timelineContainer.innerHTML = '';

    timeline.forEach((item, index) => {
        const itemClass = item.completed ? 'completed' : (item.active ? 'active' : 'pending');

        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${itemClass}`;
        timelineItem.style.animationDelay = `${index * 0.1}s`;

        let markerContent = '';
        if (item.completed) {
            markerContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
        } else if (item.active) {
            markerContent = '<span class="marker-pulse"></span>';
        }

        timelineItem.innerHTML = `
            <div class="timeline-marker">${markerContent}</div>
            <div class="timeline-content">
                <h4>${item.status}</h4>
                <p>${item.description}</p>
                <span class="timeline-time">${item.time}</span>
            </div>
        `;

        timelineContainer.appendChild(timelineItem);
    });
}

// Render updates list
function renderUpdates(updates) {
    const updatesList = document.getElementById('updatesList');
    updatesList.innerHTML = '';

    updates.forEach((update, index) => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        updateItem.style.animationDelay = `${index * 0.1}s`;

        updateItem.innerHTML = `
            <div class="update-time">
                <span class="update-date">${update.date}</span>
                <span class="update-hour">${update.time}</span>
            </div>
            <div class="update-content">
                <p>${update.message}</p>
                <span class="update-location">${update.location}</span>
            </div>
        `;

        updatesList.appendChild(updateItem);
    });
}

// Start countdown timer
function startCountdownTimer(deliveryDate) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const updateTimer = () => {
        const now = new Date();
        const diff = deliveryDate - now;

        if (diff <= 0) {
            document.getElementById('timerDays').textContent = '00';
            document.getElementById('timerHours').textContent = '00';
            document.getElementById('timerMins').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('timerDays').textContent = String(days).padStart(2, '0');
        document.getElementById('timerHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('timerMins').textContent = String(mins).padStart(2, '0');
    };

    updateTimer();
    countdownInterval = setInterval(updateTimer, 60000); // Update every minute
}

// Handle try again button
function handleTryAgain() {
    trackingError.classList.remove('active');
    trackingInput.value = '';
    trackingInput.focus();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open support modal
function openSupportModal(type) {
    const title = document.getElementById('supportModalTitle');
    const desc = document.getElementById('supportModalDesc');
    const issueSelect = document.getElementById('supportIssue');

    if (type === 'issue') {
        title.textContent = 'Report an Issue';
        desc.textContent = 'Tell us what went wrong and we\'ll help fix it';
        if (issueSelect) issueSelect.value = '';
    } else {
        title.textContent = 'Contact Support';
        desc.textContent = 'Fill in the details below and we\'ll get back to you shortly';
    }

    // Pre-fill order ID if available
    if (currentOrder) {
        const orderIdInput = document.getElementById('supportOrderId');
        if (orderIdInput) {
            orderIdInput.value = currentOrder.orderId;
        }
    }

    supportModal.classList.add('active');
    document.body.classList.add('modal-open');
}

// Close support modal
function closeSupportModalHandler() {
    supportModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Handle support form submission
function handleSupportSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('supportName').value,
        email: document.getElementById('supportEmail').value,
        orderId: document.getElementById('supportOrderId').value,
        issue: document.getElementById('supportIssue').value,
        message: document.getElementById('supportMessage').value
    };

    // Simulate API call
    showToast('Submitting your request...', 'info');

    setTimeout(() => {
        console.log('Support request:', formData);
        showToast('Your request has been submitted. We\'ll get back to you soon!', 'success');
        closeSupportModalHandler();
        supportForm.reset();
    }, 1500);
}

// Handle save notifications
function handleSaveNotifications() {
    const preferences = {
        email: document.getElementById('notifyEmail').checked,
        sms: document.getElementById('notifySms').checked,
        whatsapp: document.getElementById('notifyWhatsapp').checked
    };

    console.log('Notification preferences:', preferences);
    showToast('Preferences saved successfully!', 'success');
}

// Handle refresh updates
function handleRefreshUpdates() {
    const btn = refreshUpdatesBtn;
    btn.disabled = true;
    btn.querySelector('svg').style.animation = 'spin 0.8s linear infinite';

    setTimeout(() => {
        btn.disabled = false;
        btn.querySelector('svg').style.animation = '';
        showToast('Updates refreshed!', 'success');
    }, 1000);
}

// Show loading state
function showLoadingState() {
    const submitBtn = trackingForm.querySelector('.tracking-submit-btn');
    submitBtn.innerHTML = `
        <span>Tracking...</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
            <circle cx="12" cy="12" r="10" stroke-dasharray="50" stroke-dashoffset="20"></circle>
        </svg>
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
}

// Hide loading state
function hideLoadingState() {
    const submitBtn = trackingForm.querySelector('.tracking-submit-btn');
    submitBtn.innerHTML = `
        <span>Track</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
        </svg>
    `;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');

    if (type === 'error') {
        toastIcon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" x2="9" y1="9" y2="15"></line>
            <line x1="9" x2="15" y1="9" y2="15"></line>
        `;
        toastIcon.style.color = '#f44336';
    } else if (type === 'info') {
        toastIcon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="16" y2="12"></line>
            <line x1="12" x2="12.01" y1="8" y2="8"></line>
        `;
        toastIcon.style.color = '#2196f3';
    } else {
        toastIcon.innerHTML = `
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        `;
        toastIcon.style.color = '#4caf50';
    }

    toastMessage.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Update URL with tracking number
function updateUrl(trackingNumber) {
    const url = new URL(window.location);
    url.searchParams.set('order', trackingNumber);
    window.history.pushState({}, '', url);
}

// Toggle mobile menu
function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
}

// Animate hero elements
function animateHeroElements() {
    const heroContent = document.querySelector('.tracking-hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 0.6s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Add keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === trackingInput) {
        handleTrackingSubmit(new Event('submit'));
    }
});

// Service Worker registration for offline support (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Could register a service worker here for offline support
    });
}

// Performance optimization - lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    observer.unobserve(image);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findOrder };
}
