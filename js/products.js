// Copyright (c) 2025 Eria Software solutions and services private limited.
// Copyright (c) 2024 Eria Software solutions and services private limited.

// Products page functionality for Patil Kirana

// Global variables for products
let allProducts = [];
let filteredProducts = [];
let currentCategory = '';
let currentSearchTerm = '';

/**
 * Sanitizes a string to prevent XSS by escaping HTML characters.
 * In a production app, consider using a robust library like DOMPurify.
 * @param {string | number | null | undefined} str The string to sanitize.
 * @returns {string} The sanitized string.
 */
const sanitizeHTML = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
};

// Load products when page loads
function loadProducts() {
    showLoading('loading-spinner');
    
    // Simulate API call delay
    setTimeout(() => {
        fetch('data/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format: Expected an array of products');
                }
                allProducts = data;
                window.currentProducts = data; // Make products available to cart.js
                
                // Check for category filter from URL
                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');
                if (categoryParam) {
                    currentCategory = categoryParam;
                    const categoryFilter = document.getElementById('category-filter');
                    if (categoryFilter) {
                        categoryFilter.value = categoryParam;
                    }
                }
                
                filterProducts();
                hideLoading('loading-spinner');
            })
            .catch(error => {
                console.error('Error loading products:', error);
                hideLoading('loading-spinner');
                showErrorMessage('Failed to load products. Please try again later.');
            });
    }, 500);
}

// Filter products based on category and search
function filterProducts() {
    filteredProducts = allProducts.filter(product => {
        const matchesCategory = !currentCategory || product.category === currentCategory;
        const matchesSearch = !currentSearchTerm || 
            (product.name && product.name.toLowerCase().includes(currentSearchTerm.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(currentSearchTerm.toLowerCase()));
        
        return matchesCategory && matchesSearch;
    });
    
    displayProducts();
}

// Display products in grid
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    const noProductsElement = document.getElementById('no-products');
    
    if (!productsGrid || !noProductsElement) {
        console.error('Required elements (products-grid or no-products) not found');
        return;
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '';
        toggleElement('no-products', true);
        return;
    }
    
    toggleElement('no-products', false);
    
    productsGrid.innerHTML = filteredProducts.map(product => {
        const name = sanitizeHTML(product.name);
        const image = sanitizeHTML(product.image);
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${image || 'img/placeholder.png'}" alt="${name}" class="img-fluid">
                        ${product.discount ? `<span class="product-badge">${sanitizeHTML(product.discount)}% OFF</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h5 class="product-title">${name}</h5>
                        <div class="product-price">
                            ₹${sanitizeHTML(product.price)}
                            ${product.originalPrice ? `<span class="original-price">₹${sanitizeHTML(product.originalPrice)}</span>` : ''}
                            <small class="text-muted">/${sanitizeHTML(product.unit)}</small>
                        </div>
                        <p class="product-description">${sanitizeHTML(product.description)}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary flex-grow-1 btn-add-to-cart" data-product-id="${sanitizeHTML(product.id)}">
                                <i class="fas fa-cart-plus me-1"></i>Add to Cart
                            </button>
                            <button class="btn btn-outline-primary btn-quick-view" data-product-id="${sanitizeHTML(product.id)}" data-bs-toggle="tooltip" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Initialize tooltips for new elements
    initializeTooltips(); // This function is in main.js
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        currentSearchTerm = searchInput.value.trim();
        filterProducts();
    }
}

// Filter by category
function filterByCategory() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        currentCategory = categoryFilter.value;
        filterProducts();
    }
}

// Show product details in modal
function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found`);
        return;
    }
    
    const modalTitle = document.getElementById('product-modal-title');
    const modalBody = document.getElementById('product-modal-body');
    
    if (!modalTitle || !modalBody) {
        console.error('Modal elements not found');
        return;
    }
    
    modalTitle.textContent = sanitizeHTML(product.name);
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${sanitizeHTML(product.image)}" alt="${sanitizeHTML(product.name)}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4>${sanitizeHTML(product.name)}</h4>
                <div class="mb-3">
                    <span class="badge bg-secondary">${sanitizeHTML(getCategoryDisplayName(product.category))}</span>
                </div>
                <div class="h4 text-primary mb-3">
                    ₹${sanitizeHTML(product.price)}
                    ${product.originalPrice ? `<small class="text-muted text-decoration-line-through ms-2">₹${sanitizeHTML(product.originalPrice)}</small>` : ''}
                    <small class="text-muted">/${sanitizeHTML(product.unit)}</small>
                </div>
                <p class="mb-3">${sanitizeHTML(product.description)}</p>
                ${product.features ? `
                    <div class="mb-3">
                        <h6>Features:</h6>
                        <ul class="list-unstyled">
                            ${product.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${sanitizeHTML(feature)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="d-flex gap-2">
                    <button class="btn btn-primary flex-grow-1" onclick="addToCart('${sanitize(product.id || '')}'); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();
    } else {
        console.error('Bootstrap Modal is not available');
        showErrorMessage('Unable to display product details. Please try again.');
    }
}

// Get category display name
function getCategoryDisplayName(category) {
    const categoryNames = {
        'vegetables': 'Vegetables',
        'fruits': 'Fruits',
        'dairy': 'Dairy Products',
        'groceries': 'Groceries',
        'spices': 'Spices & Condiments'
    };
    return categoryNames[category] || category;
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'name-asc':
            filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
        default:
            // Default order
            break;
    }
    displayProducts();
}

// Initialize products page
function initProductsPage() {
    // Add debounced search
    const debouncedSearch = debounce(searchProducts, 300); // debounce is in main.js

    // --- Event Listeners ---
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') e.preventDefault(); // Prevent form submission
        });
    }

    document.getElementById('search-button')?.addEventListener('click', searchProducts);
    document.getElementById('category-filter')?.addEventListener('change', filterByCategory);
    document.getElementById('sort-filter')?.addEventListener('change', (e) => sortProducts(e.target.value));

    // Event delegation for dynamically created product buttons
    const productsGrid = document.getElementById('products-grid');
    productsGrid?.addEventListener('click', (e) => {
        const target = e.target;
        const addToCartBtn = target.closest('.btn-add-to-cart');
        const quickViewBtn = target.closest('.btn-quick-view');

        if (addToCartBtn) {
            const productId = addToCartBtn.dataset.productId;
            addToCart(productId); // This is the global function from cart.js
            return;
        }

        if (quickViewBtn) {
            const productId = quickViewBtn.dataset.productId;
            showProductDetails(productId);
            return;
        }
    });

    // --- Initial Load ---
    loadProducts();
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', initProductsPage);
