/**
 * poxter88 - Products Data
 * Mock product data matching the Label by VP website
 */

const products = {
    shirts: [
        {
            id: 'shirt-1',
            name: 'Blue Label',
            brand: 'LBVP',
            price: 1199,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: true,
            sizes: ['S', 'M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
            description: 'Premium quality blue label shirt with elegant finish.'
        },
        {
            id: 'shirt-2',
            name: 'Red Label',
            brand: 'LBVP',
            price: 1199,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: false,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop',
            description: 'Luxurious red label shirt perfect for any occasion.'
        },
        {
            id: 'shirt-3',
            name: 'Black Label',
            brand: 'LBVP',
            price: 1299,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: false,
            sizes: ['M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&h=800&fit=crop',
            description: 'Classic black label shirt for sophisticated styling.'
        },
        {
            id: 'shirt-4',
            name: 'Camel Label',
            brand: 'LBVP',
            price: 1399,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: true,
            sizes: ['S', 'M', 'L'],
            image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&h=800&fit=crop',
            description: 'Warm camel toned label shirt with premium fabric.'
        },
        {
            id: 'shirt-5',
            name: 'Navy Classic',
            brand: 'LBVP',
            price: 1499,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: false,
            sizes: ['S', 'M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1598961942613-ba897716405b?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&h=800&fit=crop',
            description: 'Timeless navy classic shirt for everyday elegance.'
        },
        {
            id: 'shirt-6',
            name: 'White Premium',
            brand: 'LBVP',
            price: 1199,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: false,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&h=800&fit=crop',
            description: 'Crisp white premium shirt with impeccable finish.'
        },
        {
            id: 'shirt-7',
            name: 'Grey Minimal',
            brand: 'LBVP',
            price: 1299,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: false,
            sizes: ['M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop',
            description: 'Modern grey minimal shirt for contemporary style.'
        },
        {
            id: 'shirt-8',
            name: 'Sage Green',
            brand: 'LBVP',
            price: 1399,
            originalPrice: null,
            category: 'shirts',
            isOnSale: false,
            isNew: true,
            sizes: ['S', 'M', 'L'],
            image: 'https://images.unsplash.com/photo-1565693413579-8a3c1c80a6b6?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&h=800&fit=crop',
            description: 'Trendy sage green shirt with natural tones.'
        }
    ],
    pants: [
        {
            id: 'pants-1',
            name: 'Noir Classic Trouser',
            brand: 'LBVP',
            price: 1499.25,
            originalPrice: 1999,
            category: 'pants',
            isOnSale: true,
            isNew: false,
            sizes: ['28', '30', '32', '34', '36'],
            image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
            description: 'Classic noir trouser with perfect drape and comfort.'
        },
        {
            id: 'pants-2',
            name: 'Espresso Ease Trouser',
            brand: 'LBVP',
            price: 1499.25,
            originalPrice: 1999,
            category: 'pants',
            isOnSale: true,
            isNew: false,
            sizes: ['28', '30', '32', '34'],
            image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop',
            description: 'Rich espresso trouser for effortless sophistication.'
        },
        {
            id: 'pants-3',
            name: 'Forest Green Trouser',
            brand: 'LBVP',
            price: 1799,
            originalPrice: null,
            category: 'pants',
            isOnSale: false,
            isNew: true,
            sizes: ['30', '32', '34', '36'],
            image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
            description: 'Deep forest green trouser with modern fit.'
        },
        {
            id: 'pants-4',
            name: 'Lavender Dream Trouser',
            brand: 'LBVP',
            price: 1899,
            originalPrice: null,
            category: 'pants',
            isOnSale: false,
            isNew: false,
            sizes: ['28', '30', '32', '34'],
            image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
            description: 'Soft lavender trouser for a unique statement.'
        },
        {
            id: 'pants-5',
            name: 'Charcoal Executive',
            brand: 'LBVP',
            price: 1999,
            originalPrice: null,
            category: 'pants',
            isOnSale: false,
            isNew: false,
            sizes: ['30', '32', '34', '36', '38'],
            image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop',
            description: 'Professional charcoal executive trouser.'
        },
        {
            id: 'pants-6',
            name: 'Camel Wide Leg',
            brand: 'LBVP',
            price: 2199,
            originalPrice: null,
            category: 'pants',
            isOnSale: false,
            isNew: true,
            sizes: ['28', '30', '32', '34'],
            image: 'https://images.unsplash.com/photo-1490427712608-588e68359dbd?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
            description: 'Trendy camel wide leg trouser with flowing silhouette.'
        },
        {
            id: 'pants-7',
            name: 'Navy Pleated',
            brand: 'LBVP',
            price: 1899,
            originalPrice: null,
            category: 'pants',
            isOnSale: false,
            isNew: false,
            sizes: ['30', '32', '34', '36'],
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
            description: 'Classic navy pleated trouser for timeless appeal.'
        },
        {
            id: 'pants-8',
            name: 'Stone Relaxed Fit',
            brand: 'LBVP',
            price: 1699,
            originalPrice: null,
            category: 'pants',
            isOnSale: false,
            isNew: false,
            sizes: ['28', '30', '32', '34', '36'],
            image: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1490427712608-588e68359dbd?w=600&h=800&fit=crop',
            description: 'Comfortable stone relaxed fit trouser.'
        }
    ],
    sale: [
        {
            id: 'sale-1',
            name: 'Noir Classic Trouser',
            brand: 'LBVP',
            price: 1499.25,
            originalPrice: 1999,
            category: 'pants',
            isOnSale: true,
            isNew: false,
            sizes: ['28', '30', '32', '34', '36'],
            image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
            description: 'Classic noir trouser with perfect drape and comfort.'
        },
        {
            id: 'sale-2',
            name: 'Espresso Ease Trouser',
            brand: 'LBVP',
            price: 1499.25,
            originalPrice: 1999,
            category: 'pants',
            isOnSale: true,
            isNew: false,
            sizes: ['28', '30', '32', '34'],
            image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop',
            description: 'Rich espresso trouser for effortless sophistication.'
        },
        {
            id: 'sale-3',
            name: 'Summer Linen Shirt',
            brand: 'LBVP',
            price: 899,
            originalPrice: 1299,
            category: 'shirts',
            isOnSale: true,
            isNew: false,
            sizes: ['S', 'M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
            description: 'Light summer linen shirt at discounted price.'
        },
        {
            id: 'sale-4',
            name: 'Vintage Print Shirt',
            brand: 'LBVP',
            price: 799,
            originalPrice: 1199,
            category: 'shirts',
            isOnSale: true,
            isNew: false,
            sizes: ['M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&h=800&fit=crop',
            imageHover: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop',
            description: 'Unique vintage print shirt on special offer.'
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
function renderProducts(gridId, productList, limit = null) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const productsToRender = limit ? productList.slice(0, limit) : productList;
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
    const allProducts = [...products.shirts, ...products.pants, ...products.sale];
    return allProducts.find(p => p.id === productId) || null;
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('shirtsGrid', products.shirts, 4);
    renderProducts('pantsGrid', products.pants, 4);
    renderProducts('saleGrid', products.sale, 4);
});
