/**
 * poxter88 Admin Dashboard
 * Handles authentication, product management, orders, and analytics
 */

// Admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// State
let isAuthenticated = false;
let adminProducts = [];
let adminOrders = [];

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');

/**
 * Initialize Admin Dashboard
 */
function initAdmin() {
    // Check if already logged in
    const session = sessionStorage.getItem('lbvp_admin_session');
    if (session) {
        isAuthenticated = true;
        showDashboard();
    }

    // Setup event listeners
    setupEventListeners();

    // Update time
    updateTime();
    setInterval(updateTime, 1000);
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

/**
 * Handle Login
 */
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAuthenticated = true;
        sessionStorage.setItem('lbvp_admin_session', 'true');
        showDashboard();
    } else {
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

/**
 * Logout
 */
function logout() {
    isAuthenticated = false;
    sessionStorage.removeItem('lbvp_admin_session');
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
}

/**
 * Show Dashboard
 */
function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';

    // Load data
    loadProducts();
    loadOrders();
    updateStats();
    generateCharts();
}

/**
 * Show Section
 */
function showSection(sectionName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionName);
    });

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Update header
    const titles = {
        overview: { title: 'Dashboard Overview', subtitle: 'Welcome back, Admin' },
        products: { title: 'Poster Management', subtitle: 'Manage your poster catalog' },
        orders: { title: 'Order Management', subtitle: 'Track and manage orders' },
        analytics: { title: 'Analytics', subtitle: 'Business insights and metrics' }
    };

    const titleInfo = titles[sectionName] || titles.overview;
    document.getElementById('pageTitle').textContent = titleInfo.title;
    document.getElementById('pageSubtitle').textContent = titleInfo.subtitle;

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('active');
}

/**
 * Update Time
 */
function updateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentTime').textContent = now.toLocaleDateString('en-IN', options);
}

/**
 * Load Products
 */
function loadProducts() {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('lbvp_admin_products');
    if (saved) {
        adminProducts = JSON.parse(saved);
    } else {
        // Initialize with default poster products
        adminProducts = [
            { id: 'poster-1', name: 'Urban Skyline', category: 'poster', price: 499, stock: 50, image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=800&fit=crop', isOnSale: false, isNew: true, sizes: 'A4', description: 'Stunning urban skyline poster' },
            { id: 'poster-2', name: 'Ocean Waves', category: 'poster', price: 499, stock: 35, image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=800&fit=crop', isOnSale: false, isNew: false, sizes: 'A4', description: 'Calming ocean waves poster' },
            { id: 'poster-3', name: 'Mountain Peak', category: 'poster', price: 599, stock: 45, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop', isOnSale: false, isNew: false, sizes: 'A4', description: 'Majestic mountain peak poster' },
            { id: 'poster-4', name: 'Abstract Art', category: 'poster', price: 549, stock: 28, image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=800&fit=crop', isOnSale: false, isNew: true, sizes: 'A4', description: 'Bold abstract art poster' },
            { id: 'poster-5', name: 'Vintage Cinema', category: 'poster', price: 499, stock: 22, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=800&fit=crop', isOnSale: false, isNew: false, sizes: 'A4', description: 'Classic vintage cinema poster' },
            { id: 'poster-6', name: 'Space Galaxy', category: 'poster', price: 649, stock: 40, image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=800&fit=crop', isOnSale: false, isNew: false, sizes: 'A4', description: 'Mesmerizing space galaxy poster' }
        ];
        saveProducts();
    }

    renderProducts();
}

/**
 * Save Products
 */
function saveProducts() {
    localStorage.setItem('lbvp_admin_products', JSON.stringify(adminProducts));
}

/**
 * Render Products Table
 */
function renderProducts(filteredProducts = null) {
    const products = filteredProducts || adminProducts;
    const tbody = document.getElementById('productsTable');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumb"></td>
            <td>
                <strong>${product.name}</strong>
                ${product.isNew ? '<span class="status status-active" style="margin-left:8px;font-size:0.65rem;">NEW</span>' : ''}
            </td>
            <td>Poster</td>
            <td>₹${product.price.toLocaleString('en-IN')}</td>
            <td>${product.stock}</td>
            <td>
                <span class="status ${product.stock > 0 ? 'status-active' : 'status-outofstock'}">
                    <span class="status-dot"></span>
                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-icon btn-secondary" onclick="editProduct('${product.id}')" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                    </button>
                    <button class="btn btn-icon btn-danger" onclick="deleteProduct('${product.id}')" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Filter Products
 */
function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();

    let filtered = adminProducts;

    if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }

    renderProducts(filtered);
}

/**
 * Open Product Modal
 */
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');

    form.reset();
    document.getElementById('productId').value = '';

    if (productId) {
        const product = adminProducts.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Edit Poster';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productOriginalPrice').value = product.originalPrice || '';
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productOnSale').checked = product.isOnSale;
            document.getElementById('productNew').checked = product.isNew;
        }
    } else {
        title.textContent = 'Add Poster';
    }

    modal.classList.add('active');
}

/**
 * Close Product Modal
 */
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

/**
 * Save Product
 */
function saveProduct(e) {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    const productData = {
        id: productId || 'poster-' + Date.now(),
        name: document.getElementById('productName').value,
        category: 'poster',
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: parseFloat(document.getElementById('productOriginalPrice').value) || null,
        stock: parseInt(document.getElementById('productStock').value),
        sizes: 'A4',
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        isOnSale: document.getElementById('productOnSale').checked,
        isNew: document.getElementById('productNew').checked
    };

    if (productId) {
        // Update existing
        const index = adminProducts.findIndex(p => p.id === productId);
        if (index > -1) {
            adminProducts[index] = productData;
        }
        showNotification('Poster updated successfully!', 'success');
    } else {
        // Add new
        adminProducts.push(productData);
        showNotification('Poster added successfully!', 'success');
    }

    saveProducts();
    renderProducts();
    updateStats();
    closeProductModal();
}

/**
 * Edit Product
 */
function editProduct(productId) {
    openProductModal(productId);
}

/**
 * Delete Product
 */
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this poster?')) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
        updateStats();
        showNotification('Poster deleted successfully!', 'success');
    }
}

/**
 * Load Orders
 */
function loadOrders() {
    // Load from localStorage
    const saved = localStorage.getItem('lbvp_orders');
    adminOrders = saved ? JSON.parse(saved) : [];

    // Add some demo orders if empty
    if (adminOrders.length === 0) {
        adminOrders = [
            {
                id: 'LBVPDEMO001',
                customer: { fullName: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', address: '123 MG Road', city: 'Mumbai', pincode: '400001' },
                items: [{ id: 'poster-1', name: 'Urban Skyline', size: 'A4', quantity: 2, price: 499, image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=800&fit=crop' }],
                status: 'delivered',
                paymentStatus: 'paid',
                paymentMethod: 'upi',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'LBVPDEMO002',
                customer: { fullName: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', address: '456 Park Street', city: 'Delhi', pincode: '110001' },
                items: [{ id: 'poster-3', name: 'Mountain Peak', size: 'A4', quantity: 1, price: 599, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop' }],
                status: 'shipped',
                paymentStatus: 'paid',
                paymentMethod: 'card',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'LBVPDEMO003',
                customer: { fullName: 'Amit Kumar', email: 'amit@example.com', phone: '9876543212', address: '789 Civil Lines', city: 'Surat', pincode: '395001' },
                items: [
                    { id: 'poster-2', name: 'Ocean Waves', size: 'A4', quantity: 1, price: 499, image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=800&fit=crop' },
                    { id: 'poster-4', name: 'Abstract Art', size: 'A4', quantity: 1, price: 549, image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=800&fit=crop' }
                ],
                status: 'processing',
                paymentStatus: 'pending',
                paymentMethod: 'cod',
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem('lbvp_orders', JSON.stringify(adminOrders));
    }

    renderOrders();
    renderRecentOrders();
}

/**
 * Render Orders Table
 */
function renderOrders(filteredOrders = null) {
    const orders = filteredOrders || adminOrders;
    const tbody = document.getElementById('ordersTable');

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const productNames = order.items.map(i => i.name).join(', ');

        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                    <div>${order.customer.fullName}</div>
                    <small style="color:var(--admin-text-muted)">${order.customer.email}</small>
                </td>
                <td title="${productNames}">${order.items.length} item${order.items.length > 1 ? 's' : ''}</td>
                <td>₹${total.toLocaleString('en-IN')}</td>
                <td>
                    <span class="status status-${order.paymentStatus}">
                        <span class="status-dot"></span>
                        ${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                </td>
                <td>
                    <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewOrder('${order.id}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Render Recent Orders (Dashboard)
 */
function renderRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    const recentOrders = adminOrders.slice(0, 5);

    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = recentOrders.map(order => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const date = new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer.fullName}</td>
                <td>₹${total.toLocaleString('en-IN')}</td>
                <td>
                    <span class="status status-${order.status}">
                        <span class="status-dot"></span>
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>${date}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Filter Orders
 */
function filterOrders() {
    const search = document.getElementById('orderSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;

    let filtered = adminOrders;

    if (search) {
        filtered = filtered.filter(o =>
            o.id.toLowerCase().includes(search) ||
            o.customer.fullName.toLowerCase().includes(search)
        );
    }

    if (status) {
        filtered = filtered.filter(o => o.status === status);
    }

    renderOrders(filtered);
}

/**
 * View Order Details
 */
function viewOrder(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;

    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const date = new Date(order.date).toLocaleString('en-IN');

    document.getElementById('orderDetails').innerHTML = `
        <div class="order-detail-header">
            <div>
                <h3>Order #${order.id}</h3>
                <small>${date}</small>
            </div>
            <span class="status status-${order.status}">
                <span class="status-dot"></span>
                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
        </div>
        
        <div class="order-detail-section">
            <h4>Customer Information</h4>
            <p><strong>${order.customer.fullName}</strong></p>
            <p>${order.customer.email}</p>
            <p>${order.customer.phone}</p>
            <p>${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}</p>
        </div>
        
        <div class="order-detail-section">
            <h4>Order Items</h4>
            <div class="order-items-list">
                ${order.items.map(item => `
                    <div class="order-item-row">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-item-info">
                            <strong>${item.name}</strong>
                            <span>Size: ${item.size} × ${item.quantity}</span>
                        </div>
                        <strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4>Payment</h4>
            <p>Method: ${order.paymentMethod.toUpperCase()}</p>
            <p>Status: <span class="status status-${order.paymentStatus}">${order.paymentStatus}</span></p>
            <p><strong>Total: ₹${total.toLocaleString('en-IN')}</strong></p>
        </div>
    `;

    document.getElementById('orderModal').classList.add('active');
}

/**
 * Close Order Modal
 */
function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

/**
 * Update Order Status
 */
function updateOrderStatus(orderId, newStatus) {
    const order = adminOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        if (newStatus === 'delivered') {
            order.paymentStatus = 'paid';
        }
        localStorage.setItem('lbvp_orders', JSON.stringify(adminOrders));
        renderRecentOrders();
        showNotification('Order status updated!', 'success');
    }
}

/**
 * Update Stats
 */
function updateStats() {
    // Total Sales
    const totalSales = adminOrders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);
    document.getElementById('totalSales').textContent = '₹' + totalSales.toLocaleString('en-IN');

    // Total Orders
    document.getElementById('totalOrders').textContent = adminOrders.length;

    // Active Users (simulated)
    document.getElementById('activeUsers').textContent = Math.floor(Math.random() * 50) + 100;

    // Total Products
    document.getElementById('totalProducts').textContent = adminProducts.length;
}

/**
 * Generate Charts (Simplified visual representation)
 */
function generateCharts() {
    // Category chart - now just shows Posters
    const categoryChart = document.getElementById('categoryChart');
    const postersCount = adminProducts.length;

    categoryChart.innerHTML = `
        <div style="text-align:center;">
            <div style="display:flex;gap:20px;justify-content:center;margin-bottom:16px;">
                <div style="background:var(--admin-primary);width:80px;height:100px;border-radius:4px;"></div>
            </div>
            <div style="display:flex;gap:24px;justify-content:center;font-size:0.875rem;">
                <span>Posters: ${postersCount}</span>
            </div>
        </div>
    `;

    // Status chart
    const statusChart = document.getElementById('statusChart');
    const statuses = { confirmed: 0, processing: 0, shipped: 0, delivered: 0 };
    adminOrders.forEach(o => statuses[o.status]++);

    statusChart.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;">
            ${Object.entries(statuses).map(([status, count]) => `
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="width:80px;font-size:0.75rem;text-transform:capitalize;">${status}</span>
                    <div style="flex:1;height:20px;background:var(--admin-border);border-radius:4px;overflow:hidden;">
                        <div style="width:${count / adminOrders.length * 100 || 0}%;height:100%;background:var(--admin-primary);"></div>
                    </div>
                    <span style="width:20px;font-size:0.75rem;">${count}</span>
                </div>
            `).join('')}
        </div>
    `;

    // Revenue chart
    const revenueChart = document.getElementById('revenueChart');
    revenueChart.innerHTML = `
        <div style="text-align:center;padding:40px;">
            <p style="font-size:2rem;font-weight:700;margin-bottom:8px;">₹${(adminOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0)).toLocaleString('en-IN')}</p>
            <p style="font-size:0.875rem;color:var(--admin-text-secondary);">Total Revenue This Month</p>
        </div>
    `;
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? 'var(--admin-success)' : type === 'error' ? 'var(--admin-danger)' : 'var(--admin-info)'};
        color: white;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', initAdmin);
