// Copyright (c) 2025 Eria Software solutions and services private limited.
// See LICENSE.md for license details.

// Products page functionality for Patil Kirana

// Global variables for products
let allProducts = [];
let filteredProducts = [];
let currentCategory = '';
let currentSearchTerm = '';

// Utility function to show loading spinner
function showLoading(spinnerId) {
    const spinner = document.getElementById(spinnerId);
    if (spinner) {
        spinner.style.display = 'block';
    }
}

// Utility function to hide loading spinner
function hideLoading(spinnerId) {
    const spinner = document.getElementById(spinnerId);
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Utility function to show error message
function showErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    } else {
        console.warn('Error element not found, displaying alert instead');
        alert(message);
    }
}

// Utility function to toggle element visibility
function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

// Utility function to initialize Bootstrap tooltips
function initializeTooltips() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    } else {
        console.warn('Bootstrap is not loaded, tooltips will not be initialized');
    }
}

// Utility function to add product to cart (placeholder implementation)
function addToCart(productId) {
    // Placeholder: In a real application, this would interact with a cart system
    console.log(`Added product ${productId} to cart`);
    // Example: Update cart count in UI
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = parseInt(cartCount.textContent || '0') + 1;
    }
}

// Debounce utility function
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
                window.currentProducts = data; // Maintain for backward compatibility
                
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
                showErrorMessage('Failed to load products. Please try again.');
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
    
    // Sanitize product data to prevent XSS
    productsGrid.innerHTML = filteredProducts.map(product => {
        // Basic sanitization (in a real app, use a library like DOMPurify)
        const sanitize = (str) => str.replace(/[<>]/g, '');
        
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${sanitize(product.image || '')}" alt="${sanitize(product.name || '')}" class="img-fluid">
                        ${product.discount ? `<span class="product-badge">${sanitize(product.discount)}% OFF</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h5 class="product-title">${sanitize(product.name || '')}</h5>
                        <div class="product-price">
                            ₹${sanitize(product.price?.toString() || '0')}
                            ${product.originalPrice ? `<span class="original-price">₹${sanitize(product.originalPrice.toString())}</span>` : ''}
                            <small class="text-muted">/${sanitize(product.unit || '')}</small>
                        </div>
                        <p class="product-description">${sanitize(product.description || '')}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary flex-grow-1" onclick="addToCart('${sanitize(product.id || '')}')">
                                <i class="fas fa-cart-plus me-1"></i>Add to Cart
                            </button>
                            <button class="btn btn-outline-primary" onclick="showProductDetails('${sanitize(product.id || '')}')" data-bs-toggle="tooltip" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Initialize tooltips for new elements
    initializeTooltips();
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
    
    // Sanitize product data
    const sanitize = (str) => str.replace(/[<>]/g, '');
    
    modalTitle.textContent = sanitize(product.name || '');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${sanitize(product.image || '')}" alt="${sanitize(product.name || '')}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4>${sanitize(product.name || '')}</h4>
                <div class="mb-3">
                    <span class="badge bg-secondary">${sanitize(getCategoryDisplayName(product.category))}</span>
                </div>
                <div class="h4 text-primary mb-3">
                    ₹${sanitize(product.price?.toString() || '0')}
                    ${product.originalPrice ? `<small class="text-muted text-decoration-line-through ms-2">₹${sanitize(product.originalPrice.toString())}</small>` : ''}
                    <small class="text-muted">/${sanitize(product.unit || '')}</small>
                </div>
                <p class="mb-3">${sanitize(product.description || '')}</p>
                ${product.features ? `
                    <div class="mb-3">
                        <h6>Features:</h6>
                        <ul class="list-unstyled">
                            ${product.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${sanitize(feature)}</li>`).join('')}
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

// Add debounced search
const debouncedSearch = debounce(searchProducts, 300);

// Initialize search input event listener
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
        
        // Handle Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });
    }
});

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

// Add sort functionality
function addSortDropdown() {
    const container = document.querySelector('.container .row .col-md-6:last-child');
    if (container && !document.getElementById('sort-select')) {
        const sortHTML = `
            <select class="form-select ms-2" id="sort-select" onchange="sortProducts(this.value)" style="width: auto;">
                <option value="">Sort by</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
            </select>
        `;
        const flexContainer = container.querySelector('.d-flex');
        if (flexContainer) {
            flexContainer.insertAdjacentHTML('beforeend', sortHTML);
        } else {
            console.warn('Flex container not found for sort dropdown');
        }
    }
}

// Initialize products page
if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadProducts();
        addSortDropdown();
    });
}
