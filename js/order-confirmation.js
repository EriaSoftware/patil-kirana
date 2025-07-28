// Copyright (c) 2025 Eria Software solutions and services private limited.
// See LICENSE.md for license details.

// Order confirmation functionality for Patil Kirana

// Initialize order confirmation page
function initializeOrderConfirmation() {
    const orderData = storage.get('currentOrder');
    
    if (!orderData) {
        showErrorMessage('No order found. Redirecting to home page...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    displayOrderDetails(orderData);
    
    // Clear the order data after displaying (optional)
    // storage.remove('currentOrder');
}

// Display order details
function displayOrderDetails(orderData) {
    // Update order ID and dates
    updateElement('order-id', orderData.orderId);
    updateElement('order-date', formatDate(orderData.orderDate));
    updateElement('delivery-date', formatDate(orderData.delivery.date));
    updateElement('delivery-time', getTimeSlotDisplay(orderData.delivery.time));
    updateElement('order-total', orderData.totals.total.toFixed(2));
    
    // Update payment method
    updateElement('payment-method', getPaymentMethodDisplay(orderData.payment.method));
    
    // Update customer information
    updateElement('customer-name', `${orderData.customer.firstName} ${orderData.customer.lastName}`);
    updateElement('customer-email', orderData.customer.email);
    updateElement('customer-phone', orderData.customer.phone);
    
    // Update delivery address
    const addressElement = document.getElementById('delivery-address');
    if (addressElement) {
        addressElement.innerHTML = `
            ${orderData.delivery.address}<br>
            ${orderData.delivery.area}<br>
            Pune, Maharashtra ${orderData.delivery.pincode}
            ${orderData.delivery.landmark ? `<br>Landmark: ${orderData.delivery.landmark}` : ''}
        `;
    }
    
    // Update order items
    displayOrderItems(orderData.items, orderData.totals);
}

// Display order items
function displayOrderItems(items, totals) {
    const orderItemsList = document.getElementById('order-items-list');
    if (!orderItemsList) return;
    
    orderItemsList.innerHTML = `
        <div class="table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="border-bottom">
                        <th>Product</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-end">Price</th>
                        <th class="text-end">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                                    <div>
                                        <div class="fw-medium">${item.name}</div>
                                        <small class="text-muted">${item.unit}</small>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-end">₹${item.price.toFixed(2)}</td>
                            <td class="text-end fw-bold">₹${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="border-top">
                        <td colspan="3" class="text-end fw-medium">Subtotal:</td>
                        <td class="text-end">₹${totals.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-end fw-medium">Delivery Charges:</td>
                        <td class="text-end">${totals.deliveryCharges === 0 ? '<span class="text-success">FREE</span>' : `₹${totals.deliveryCharges.toFixed(2)}`}</td>
                    </tr>
                    <tr class="border-top">
                        <td colspan="3" class="text-end fw-bold h5">Total:</td>
                        <td class="text-end fw-bold h5 text-primary">₹${totals.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

// Helper function to update element content
function updateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    }
}

// Get time slot display name
function getTimeSlotDisplay(timeSlot) {
    const timeSlots = {
        'morning': 'Morning (8:00 AM - 12:00 PM)',
        'afternoon': 'Afternoon (12:00 PM - 4:00 PM)',
        'evening': 'Evening (4:00 PM - 8:00 PM)'
    };
    return timeSlots[timeSlot] || timeSlot;
}

// Get payment method display name
function getPaymentMethodDisplay(method) {
    const paymentMethods = {
        'cod': 'Cash on Delivery',
        'upi': 'UPI Payment'
    };
    return paymentMethods[method] || method;
}

// Print order details
function printOrder() {
    window.print();
}

// Send order confirmation email (simulation)
function sendConfirmationEmail() {
    showSuccessMessage('Order confirmation email sent successfully!');
}

// Download order receipt (simulation)
function downloadReceipt() {
    const orderData = storage.get('currentOrder');
    if (!orderData) return;
    
    // Create a simple text receipt
    const receiptContent = `
PATIL KIRANA - ORDER RECEIPT
============================

Order ID: ${orderData.orderId}
Order Date: ${formatDate(orderData.orderDate)}
Delivery Date: ${formatDate(orderData.delivery.date)}
Delivery Time: ${getTimeSlotDisplay(orderData.delivery.time)}

CUSTOMER DETAILS:
Name: ${orderData.customer.firstName} ${orderData.customer.lastName}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}

DELIVERY ADDRESS:
${orderData.delivery.address}
${orderData.delivery.area}
Pune, Maharashtra ${orderData.delivery.pincode}
${orderData.delivery.landmark ? `Landmark: ${orderData.delivery.landmark}` : ''}

ORDER ITEMS:
${orderData.items.map(item => 
    `${item.name} (${item.unit}) - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

PAYMENT SUMMARY:
Subtotal: ₹${orderData.totals.subtotal.toFixed(2)}
Delivery Charges: ${orderData.totals.deliveryCharges === 0 ? 'FREE' : `₹${orderData.totals.deliveryCharges.toFixed(2)}`}
Total: ₹${orderData.totals.total.toFixed(2)}

Payment Method: ${getPaymentMethodDisplay(orderData.payment.method)}

Thank you for shopping with Patil Kirana!
Contact: +91 98765 43210
    `;
    
    // Create and download the file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PatilKirana_Order_${orderData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showSuccessMessage('Receipt downloaded successfully!');
}

// Track order (simulation)
function trackOrder() {
    const orderData = storage.get('currentOrder');
    if (!orderData) return;
    
    // Simulate order tracking
    const trackingSteps = [
        { status: 'Order Placed', time: 'Just now', completed: true },
        { status: 'Order Confirmed', time: 'Within 30 minutes', completed: false },
        { status: 'Preparing Order', time: 'Within 2 hours', completed: false },
        { status: 'Out for Delivery', time: 'On delivery date', completed: false },
        { status: 'Delivered', time: 'On delivery date', completed: false }
    ];
    
    // Show tracking modal (you can implement this)
    alert(`Order ${orderData.orderId} is being processed. You will receive a confirmation call within 30 minutes.`);
}

// Initialize page when DOM is ready
if (window.location.pathname.includes('order-confirmation.html')) {
    document.addEventListener('DOMContentLoaded', initializeOrderConfirmation);
}
