/**
 * poxter88 - Products Data
 * Poster products with fixed A4 size
 */


// Current products list in memory for quick access
let loadedProductsList = [];

/**
 * Format price in Indian Rupees
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    if (price === undefined || price === null) return 'N/A';
    return `Rs. ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Create product card HTML
 * @param {Object} product - Product object
 * @returns {string} HTML string for product card
 */
function createProductCard(product) {
    const salePercentage = product.original_price
        ? Math.round((1 - product.price / product.original_price) * 100)
        : 0;

    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="product-image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/600x800?text=No+Image'"
                >
                ${product.image_hover ? `
                    <img 
                        src="${product.image_hover}" 
                        alt="${product.name} - alternate view" 
                        class="product-image-hover"
                        loading="lazy"
                    >
                ` : ''}
                ${product.is_on_sale ? `<span class="product-badge badge-sale">Sale</span>` : ''}
                ${product.is_new && !product.is_on_sale ? `<span class="product-badge badge-new">New</span>` : ''}
                <button class="quick-add-btn" data-product-id="${product.id}">Quick Add</button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-brand">${product.brand || 'POXTER88'}</p>
                <p class="product-size">Size: ${product.sizes ? product.sizes[0] : 'A4'}</p>
                <div class="product-price">
                    ${product.original_price ? `<span class="price-original">${formatPrice(product.original_price)}</span>` : ''}
                    <span class="price-current">${formatPrice(product.price)}</span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Render products to a grid
 * @param {string} gridId - ID of the grid element
 * @param {Array} productList - Array of product objects (not used anymore as we fetch)
 * @param {number} limit - Optional limit of products to show
 */
async function renderProducts(gridId, productList = [], limit = null) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    // Show loading state
    grid.innerHTML = '<div class="loading-state"><p>Loading posters...</p></div>';

    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        // Fetch from Supabase
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            // Update global state
            loadedProductsList = data;
            const productsToRender = limit ? data.slice(0, limit) : data;

            grid.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
            grid.classList.add('stagger-children');
            console.log(`Loaded ${data.length} products from Supabase`);
        } else {
            grid.innerHTML = '<div class="empty-state"><p>No posters available yet.</p></div>';
            loadedProductsList = [];
        }
    } catch (err) {
        console.error('Error fetching products from Supabase:', err.message);
        grid.innerHTML = `
            <div class="error-state">
                <p>Failed to load products. Please refresh the page.</p>
                <small>${err.message}</small>
            </div>
        `;
    }
}

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Object|null} Product object or null
 */
function getProductById(productId) {
    return loadedProductsList.find(p => p.id === productId) || null;
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for Supabase to init if needed
    const checkInit = setInterval(async () => {
        if (window.supabaseClient) {
            clearInterval(checkInit);
            await renderProducts('postersGrid');
        }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => clearInterval(checkInit), 5000);
});

