// Copyright (c) 2025 Eria Software solutions and services private limited.
// See LICENSE.md for license details.

// Checkout functionality for Patil Kirana

// Initialize checkout page
function initializeCheckout() {
    loadOrderSummary();
    setupFormValidation();
    
    // Redirect if cart is empty
    if (cart.getItemCount() === 0) {
        showErrorMessage('Your cart is empty. Please add some products first.');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
        return;
    }
}

// Load order summary
function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryAmountElement = document.getElementById('delivery-amount');
    const deliveryChargesElement = document.getElementById('delivery-charges');
    const totalAmountElement = document.getElementById('total-amount');
    
    if (!orderItemsContainer) return;
    
    const cartItems = cart.getCartItems();
    const subtotal = cart.getTotal();
    const deliveryCharges = cart.getDeliveryCharges();
    const total = cart.getFinalTotal();
    
    // Display order items
    orderItemsContainer.innerHTML = cartItems.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                <div>
                    <div class="fw-medium">${item.name}</div>
                    <small class="text-muted">${item.unit} × ${item.quantity}</small>
                </div>
            </div>
            <div class="text-end">
                <div class="fw-bold">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    // Update totals
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
    if (deliveryAmountElement) deliveryAmountElement.textContent = deliveryCharges.toFixed(2);
    if (totalAmountElement) totalAmountElement.textContent = total.toFixed(2);
    
    // Update delivery charges display
    if (deliveryChargesElement) {
        if (deliveryCharges === 0) {
            deliveryChargesElement.innerHTML = '<span class="text-success">FREE</span>';
        } else {
            deliveryChargesElement.innerHTML = `₹${deliveryCharges.toFixed(2)}`;
        }
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCheckoutForm()) {
            placeOrder();
        }
    });
}

// Validate checkout form
function validateCheckoutForm() {
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone',
        'address', 'area', 'pincode', 'deliveryDate', 'deliveryTime'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    // Validate email
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Validate phone
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneField.value)) {
            phoneField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Validate pincode
    const pincodeField = document.getElementById('pincode');
    if (pincodeField && pincodeField.value) {
        const pincodeRegex = /^41\d{4}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showErrorMessage('Please fill in all required fields correctly.');
    }
    
    return isValid;
}

// Place order
function placeOrder() {
    // Show loading state
    const placeOrderBtn = document.querySelector('button[onclick="placeOrder()"]');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Placing Order...';
    }
    
    // Collect form data
    const orderData = {
        orderId: generateOrderId(),
        orderDate: new Date().toISOString(),
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        },
        delivery: {
            address: document.getElementById('address').value,
            area: document.getElementById('area').value,
            pincode: document.getElementById('pincode').value,
            landmark: document.getElementById('landmark').value,
            date: document.getElementById('deliveryDate').value,
            time: document.getElementById('deliveryTime').value,
            notes: document.getElementById('notes').value
        },
        payment: {
            method: document.querySelector('input[name="paymentMethod"]:checked').value
        },
        items: cart.getCartItems(),
        totals: {
            subtotal: cart.getTotal(),
            deliveryCharges: cart.getDeliveryCharges(),
            total: cart.getFinalTotal()
        }
    };
    
    // Save order to localStorage
    storage.set('currentOrder', orderData);
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        cart.clearCart();
        
        // Redirect to confirmation page
        window.location.href = 'order-confirmation.html';
    }, 2000);
}
