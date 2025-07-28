// Products page functionality for Patil Kirana

// Global variables for products
let allProducts = [];
let filteredProducts = [];
let currentCategory = '';
let currentSearchTerm = '';

// Load products when page loads
function loadProducts() {
    showLoading('loading-spinner');
    
    // Simulate API call delay
    setTimeout(() => {
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                allProducts = data;
                window.currentProducts = data; // Make available globally for cart
                
                // Check for category filter from URL
                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');
                if (categoryParam) {
                    currentCategory = categoryParam;
                    document.getElementById('category-filter').value = categoryParam;
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
            product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(currentSearchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });
    
    displayProducts();
}

// Display products in grid
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    const noProductsElement = document.getElementById('no-products');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '';
        toggleElement('no-products', true);
        return;
    }
    
    toggleElement('no-products', false);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                    ${product.discount ? `<span class="product-badge">${product.discount}% OFF</span>` : ''}
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price">
                        ₹${product.price}
                        ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                        <small class="text-muted">/${product.unit}</small>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary flex-grow-1" onclick="addToCart('${product.id}')">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-primary" onclick="showProductDetails('${product.id}')" data-bs-toggle="tooltip" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize tooltips for new elements
    initializeTooltips();
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    currentSearchTerm = searchInput.value.trim();
    filterProducts();
}

// Filter by category
function filterByCategory() {
    const categoryFilter = document.getElementById('category-filter');
    currentCategory = categoryFilter.value;
    filterProducts();
}

// Show product details in modal
function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modalTitle = document.getElementById('product-modal-title');
    const modalBody = document.getElementById('product-modal-body');
    
    modalTitle.textContent = product.name;
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4>${product.name}</h4>
                <div class="mb-3">
                    <span class="badge bg-secondary">${getCategoryDisplayName(product.category)}</span>
                </div>
                <div class="h4 text-primary mb-3">
                    ₹${product.price}
                    ${product.originalPrice ? `<small class="text-muted text-decoration-line-through ms-2">₹${product.originalPrice}</small>` : ''}
                    <small class="text-muted">/${product.unit}</small>
                </div>
                <p class="mb-3">${product.description}</p>
                ${product.features ? `
                    <div class="mb-3">
                        <h6>Features:</h6>
                        <ul class="list-unstyled">
                            ${product.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="d-flex gap-2">
                    <button class="btn btn-primary flex-grow-1" onclick="addToCart('${product.id}'); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
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
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
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
        container.querySelector('.d-flex').insertAdjacentHTML('beforeend', sortHTML);
    }
}

// Initialize products page
if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadProducts();
        addSortDropdown();
    });
}
