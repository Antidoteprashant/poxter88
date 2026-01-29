/**
 * poxter88 Admin Dashboard
 * Handles authentication, product management, orders, and analytics
 */

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// State
let isAuthenticated = false;
let adminProducts = [];
let adminOrders = [];
let pendingImageFile = null;

// DOM Elements
let loginForm, loginScreen, dashboard, pageTitle, pageSubtitle;

/**
 * Initialize Admin Dashboard
 */
function initAdmin() {
    loginForm = document.getElementById('loginForm');
    loginScreen = document.getElementById('loginScreen');
    dashboard = document.getElementById('dashboard');
    pageTitle = document.getElementById('pageTitle');
    pageSubtitle = document.getElementById('pageSubtitle');

    const session = sessionStorage.getItem('poxter_admin_session');
    if (session) {
        isAuthenticated = true;
        showDashboard();
    }

    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const imageFileInput = document.getElementById('productImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                pendingImageFile = file;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const previewImg = document.getElementById('previewImg');
                    const imagePreview = document.getElementById('imagePreview');
                    previewImg.src = ev.target.result;
                    imagePreview.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const removeImageBtn = document.getElementById('removeImage');
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', clearImagePreview);
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

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
        sessionStorage.setItem('poxter_admin_session', 'true');
        showDashboard();
    } else {
        showNotification('Invalid credentials.', 'error');
    }
}

/**
 * Logout
 */
function logout() {
    isAuthenticated = false;
    sessionStorage.removeItem('poxter_admin_session');
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
}

/**
 * Show Dashboard
 */
async function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';

    if (!window.supabaseClient) {
        const check = setInterval(() => {
            if (window.supabaseClient) {
                clearInterval(check);
                loadAllData();
            }
        }, 100);
    } else {
        loadAllData();
    }
}

async function loadAllData() {
    await loadProducts();
    await loadOrders();
    updateStats();
    generateCharts();
}

/**
 * Navigation - Show Section
 */
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const section = document.getElementById(`${sectionId}Section`);
    const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);

    if (section) section.style.display = 'block';
    if (navItem) navItem.classList.add('active');

    // Update Titles
    const titles = {
        overview: { title: 'Dashboard Overview', subtitle: 'Welcome back, Admin' },
        products: { title: 'Product Management', subtitle: 'Manage your poster catalog' },
        orders: { title: 'Order Management', subtitle: 'Track and manage customer orders' },
        analytics: { title: 'Analytics', subtitle: 'Business insights and metrics' }
    };

    if (titles[sectionId]) {
        pageTitle.textContent = titles[sectionId].title;
        pageSubtitle.textContent = titles[sectionId].subtitle;
    }

    if (sectionId === 'overview') {
        renderRecentOrders();
        updateStats();
    } else if (sectionId === 'analytics') {
        generateCharts();
    }

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('active');
}

/**
 * Load Products
 */
async function loadProducts() {
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        adminProducts = data || [];
    } catch (err) {
        console.error('Error loading products:', err.message);
        showNotification('Error loading products', 'error');
    }
    renderProductsTable();
    updateStats();
    generateCharts();
}

function renderProductsTable(filteredProducts = null) {
    const products = filteredProducts || adminProducts;
    const tbody = document.getElementById('productsTable');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumb" onerror="this.src='https://via.placeholder.com/50' "></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category || 'Poster'}</td>
            <td>₹${(product.price || 0).toLocaleString('en-IN')}</td>
            <td>${product.stock || 0}</td>
            <td>
                <span class="status ${(product.stock || 0) > 0 ? 'status-active' : 'status-outofstock'}">
                    <span class="status-dot"></span>
                    ${(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-icon btn-secondary" onclick="editProduct('${product.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                    </button>
                    <button class="btn btn-icon btn-danger" onclick="deleteProduct('${product.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    renderProductsTable(adminProducts.filter(p => p.name.toLowerCase().includes(search)));
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');

    form.reset();
    document.getElementById('productId').value = '';
    clearImagePreview();

    if (productId) {
        const product = adminProducts.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Edit Poster';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productOriginalPrice').value = product.original_price || '';
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productOnSale').checked = product.is_on_sale;
            document.getElementById('productNew').checked = product.is_new;

            if (product.image) {
                document.getElementById('previewImg').src = product.image;
                document.getElementById('imagePreview').classList.add('active');
            }
        }
    } else {
        title.textContent = 'Add Poster';
    }
    modal.classList.add('active');
}

async function saveProduct(e) {
    e.preventDefault();
    const productId = document.getElementById('productId').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // UI Loading State
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Saving...';

    let imageUrl = document.getElementById('productImage').value;

    try {
        console.log('Attempting to save product...', { productId, hasImageFile: !!pendingImageFile });

        // 1. Handle image upload if a new file was selected
        if (pendingImageFile) {
            const fileExt = pendingImageFile.name.split('.').pop();
            const fileName = `product-${Date.now()}.${fileExt}`;

            console.log('Uploading image:', fileName);
            const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
                .from('products')
                .upload(fileName, pendingImageFile);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw new Error(`Image Upload Failed: ${uploadError.message}`);
            }

            const { data: publicUrlData } = window.supabaseClient.storage
                .from('products')
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
            console.log('Generated Public URL:', imageUrl);
        }

        if (!imageUrl) throw new Error('Product image is required. Please upload an image.');

        // 2. Prepare Data (Handle potential numeric issues)
        const priceValue = parseFloat(document.getElementById('productPrice').value);
        const originalPriceValue = parseFloat(document.getElementById('productOriginalPrice').value);
        const stockValue = parseInt(document.getElementById('productStock').value);

        if (isNaN(priceValue)) throw new Error('Invalid price value');
        if (isNaN(stockValue)) throw new Error('Invalid stock value');

        const productData = {
            name: document.getElementById('productName').value.trim(),
            price: priceValue,
            original_price: isNaN(originalPriceValue) ? null : originalPriceValue,
            stock: stockValue,
            image: imageUrl,
            description: document.getElementById('productDescription').value.trim(),
            is_on_sale: document.getElementById('productOnSale').checked,
            is_new: document.getElementById('productNew').checked,
            category: 'poster'
        };

        console.log('Sending data to Supabase:', productData);

        // 3. Insert or Update
        let result;
        if (productId) {
            // Update existing
            result = await window.supabaseClient
                .from('products')
                .update(productData)
                .eq('id', productId);
        } else {
            // Insert new (omit ID to use Supabase default)
            result = await window.supabaseClient
                .from('products')
                .insert([productData]);
        }

        const { error } = result;
        if (error) {
            console.error('Supabase Database Error:', error);
            throw new Error(`Database Error: ${error.message}${error.details ? ' - ' + error.details : ''}`);
        }

        showNotification(productId ? 'Poster updated successfully!' : 'New poster added successfully!', 'success');

        // Refresh and Close
        await loadProducts();
        closeProductModal();
    } catch (err) {
        console.error('Final Save Error:', err);
        showNotification(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}


async function deleteProduct(productId) {
    if (!confirm('Delete this poster?')) return;
    try {
        const { error } = await window.supabaseClient.from('products').delete().eq('id', productId);
        if (error) throw error;
        showNotification('Deleted!', 'success');
        await loadProducts();
        updateStats();
    } catch (err) {
        showNotification(err.message, 'error');
    }
}

/**
 * Load Orders
 */
async function loadOrders() {
    try {
        const { data, error } = await window.supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        adminOrders = data || [];
    } catch (err) {
        showNotification('Error loading orders', 'error');
    }
    renderOrdersTable();
    renderRecentOrders();
    updateStats();
    generateCharts();
}

function renderOrdersTable(filteredOrders = null) {
    const orders = filteredOrders || adminOrders;
    const tbody = document.getElementById('ordersTable');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No orders found</td></tr>';
        return;
    }
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer_name}<br><small>${order.customer_email}</small></td>
            <td>${order.quantity} items</td>
            <td>₹${(order.total_price || 0).toLocaleString('en-IN')}</td>
            <td><span class="status status-${order.payment_status === 'paid' ? 'active' : 'pending'}">${order.payment_status}</span></td>
            <td>
                <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                    ${['confirmed', 'processing', 'shipped', 'delivered'].map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                </select>
            </td>
            <td><button class="btn btn-sm btn-secondary" onclick="viewOrder('${order.id}')">View</button></td>
        </tr>
    `).join('');
}

function renderRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    const recent = adminOrders.slice(0, 5);
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No orders yet</td></tr>';
        return;
    }
    tbody.innerHTML = recent.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer_name}</td>
            <td>₹${(order.total_price || 0).toLocaleString('en-IN')}</td>
            <td><span class="status status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const { error } = await window.supabaseClient.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) throw error;
        showNotification('Status updated!', 'success');
        await loadOrders();
    } catch (err) {
        showNotification(err.message, 'error');
    }
}

/**
 * Update Stats
 */
function updateStats() {
    const baseOrders = [...new Map(adminOrders.map(o => [o.id.split('-')[0], o])).values()];
    const totalRev = baseOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);

    document.getElementById('totalSales').textContent = '₹' + totalRev.toLocaleString('en-IN');
    document.getElementById('totalOrders').textContent = baseOrders.length;
    document.getElementById('totalProducts').textContent = adminProducts.length;
    document.getElementById('activeUsers').textContent = new Set(adminOrders.map(o => o.user_id)).size;
}

/**
 * Generate Charts
 */
function generateCharts() {
    // 1. Category Chart - Dynamic
    const categoryChart = document.getElementById('categoryChart');
    const categoryCounts = adminProducts.reduce((acc, p) => {
        const cat = p.category || 'Poster';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    if (adminProducts.length === 0) {
        categoryChart.innerHTML = '<p class="empty-state">No product data</p>';
    } else {
        categoryChart.innerHTML = `<div style="display:flex;gap:20px;justify-content:center;align-items:flex-end;height:120px;padding:10px;">
            ${Object.entries(categoryCounts).map(([cat, count]) => `
                <div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;">
                    <div style="background:var(--admin-primary);width:100%;max-width:40px;height:${(count / adminProducts.length) * 100}px;border-radius:4px 4px 0 0;transition:all 0.3s ease;"></div>
                    <span style="font-size:0.65rem;text-transform:capitalize;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;text-align:center;">${cat} (${count})</span>
                </div>
            `).join('')}
        </div>`;
    }


    // 2. Status Chart
    const statusChart = document.getElementById('statusChart');
    const statuses = { confirmed: 0, processing: 0, shipped: 0, delivered: 0 };
    adminOrders.forEach(o => { if (statuses[o.status] !== undefined) statuses[o.status]++; });

    statusChart.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;padding:10px;">
        ${Object.entries(statuses).map(([s, count]) => `
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:70px;font-size:0.75rem;text-transform:capitalize;">${s}</span>
                <div style="flex:1;height:12px;background:#eee;border-radius:6px;overflow:hidden;">
                    <div style="width:${(count / Math.max(adminOrders.length, 1)) * 100}%;height:100%;background:var(--admin-primary);"></div>
                </div>
                <span style="font-size:0.75rem;">${count}</span>
            </div>
        `).join('')}
    </div>`;

    // 3. Revenue Chart
    const baseOrders = [...new Map(adminOrders.map(o => [o.id.split('-')[0], o])).values()];
    const totalRev = baseOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
    const revenueChart = document.getElementById('revenueChart');
    revenueChart.innerHTML = `<div style="text-align:center;padding:30px;">
        <p style="font-size:2.5rem;font-weight:700;color:var(--admin-primary);">₹${totalRev.toLocaleString('en-IN')}</p>
        <p style="color:#666;">Total Business Revenue</p>
    </div>`;
}

function viewOrder(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    document.getElementById('orderDetails').innerHTML = `
        <div class="order-detail-header"><h3>Order #${order.id}</h3><span class="status status-${order.status}">${order.status}</span></div>
        <div class="order-detail-section"><h4>Customer</h4><p>${order.customer_name}</p><p>${order.customer_email}</p><p>${order.customer_phone}</p><p>${order.customer_address}, ${order.customer_city}</p></div>
        <div class="order-detail-section"><h4>Payment</h4><p>Method: ${order.payment_method}</p><p>Status: ${order.payment_status}</p><p>Total: ₹${(order.total_price || 0).toLocaleString('en-IN')}</p></div>
    `;
    document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() { document.getElementById('orderModal').classList.remove('active'); }
function closeProductModal() { document.getElementById('productModal').classList.remove('active'); }

function clearImagePreview() {
    document.getElementById('imagePreview').classList.remove('active');
    document.getElementById('previewImg').src = '';
    document.getElementById('productImage').value = '';
    const fileInput = document.getElementById('productImageFile');
    if (fileInput) fileInput.value = '';
    pendingImageFile = null;
}

function updateTime() {
    const el = document.getElementById('currentTime');
    if (el) el.textContent = new Date().toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};color:white;padding:12px 20px;border-radius:8px;z-index:2000;box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 3000);
}

// Global scope functions for HTML onclick
window.logout = logout;
window.showSection = showSection;
window.openProductModal = openProductModal;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.editProduct = openProductModal;
window.filterProducts = filterProducts;
window.filterOrders = () => {
    const search = document.getElementById('orderSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    renderOrdersTable(adminOrders.filter(o =>
        (o.id.toLowerCase().includes(search) || o.customer_name.toLowerCase().includes(search)) &&
        (!status || o.status === status)
    ));
};
window.updateOrderStatus = updateOrderStatus;
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;
window.closeProductModal = closeProductModal;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', initAdmin);

