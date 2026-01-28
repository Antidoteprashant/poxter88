/**
 * poxter88 - Products Data
 * Poster products with fixed A4 size
 */

const products = {
    posters: [
        {
            id: 'poster-1',
            name: 'Urban Skyline',
            brand: 'POXTER88',
            price: 499,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: true,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=800&fit=crop',
            description: 'Stunning urban skyline poster perfect for modern spaces.'
        },
        {
            id: 'poster-2',
            name: 'Ocean Waves',
            brand: 'POXTER88',
            price: 499,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: false,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop',
            description: 'Calming ocean waves poster for a serene atmosphere.'
        },
        {
            id: 'poster-3',
            name: 'Mountain Peak',
            brand: 'POXTER88',
            price: 599,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: false,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=800&fit=crop',
            description: 'Majestic mountain peak poster for nature lovers.'
        },
        {
            id: 'poster-4',
            name: 'Abstract Art',
            brand: 'POXTER88',
            price: 549,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: true,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=800&fit=crop',
            description: 'Bold abstract art poster for creative spaces.'
        },
        {
            id: 'poster-5',
            name: 'Vintage Cinema',
            brand: 'POXTER88',
            price: 499,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: false,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=800&fit=crop',
            description: 'Classic vintage cinema poster for movie enthusiasts.'
        },
        {
            id: 'poster-6',
            name: 'Space Galaxy',
            brand: 'POXTER88',
            price: 649,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: false,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=800&fit=crop',
            description: 'Mesmerizing space galaxy poster for cosmic vibes.'
        },
        {
            id: 'poster-7',
            name: 'Botanical Garden',
            brand: 'POXTER88',
            price: 449,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: false,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=800&fit=crop',
            description: 'Beautiful botanical garden poster for plant lovers.'
        },
        {
            id: 'poster-8',
            name: 'Neon Lights',
            brand: 'POXTER88',
            price: 549,
            originalPrice: null,
            category: 'poster',
            isOnSale: false,
            isNew: true,
            sizes: ['A4'],
            image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=800&fit=crop',
            description: 'Vibrant neon lights poster for modern aesthetics.'
        }
    ]
};

/**
 * Format price in Indian Rupees
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return `Rs. ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Create product card HTML
 * @param {Object} product - Product object
 * @returns {string} HTML string for product card
 */
function createProductCard(product) {
    const salePercentage = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="product-image"
                    loading="lazy"
                >
                ${product.imageHover ? `
                    <img 
                        src="${product.imageHover}" 
                        alt="${product.name} - alternate view" 
                        class="product-image-hover"
                        loading="lazy"
                    >
                ` : ''}
                ${product.isOnSale ? `<span class="product-badge badge-sale">Sale</span>` : ''}
                ${product.isNew && !product.isOnSale ? `<span class="product-badge badge-new">New</span>` : ''}
                <button class="quick-add-btn" data-product-id="${product.id}">Quick Add</button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <p class="product-size">Size: A4</p>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
                    <span class="price-current">${formatPrice(product.price)}</span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Render products to a grid
 * @param {string} gridId - ID of the grid element
 * @param {Array} productList - Array of product objects
 * @param {number} limit - Optional limit of products to show
 */
async function renderProducts(gridId, productList, limit = null) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    let itemsToRender = productList;

    try {
        // Try fetching from Supabase
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            itemsToRender = data;
            console.log('Fetched products from Supabase');
        }
    } catch (err) {
        console.warn('Could not fetch products from Supabase, using fallback data:', err.message);
    }

    const productsToRender = limit ? itemsToRender.slice(0, limit) : itemsToRender;
    grid.innerHTML = productsToRender.map(product => createProductCard(product)).join('');

    // Add stagger animation class
    grid.classList.add('stagger-children');
}

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Object|null} Product object or null
 */
function getProductById(productId) {
    return products.posters.find(p => p.id === productId) || null;
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Render posters
    await renderProducts('postersGrid', products.posters, 8);
});
