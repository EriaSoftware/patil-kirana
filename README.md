# Patil Kirana - E-commerce Website

A modern, responsive e-commerce website for Patil Kirana, a grocery store based in Pune, India. Built with HTML, CSS, JavaScript, and Bootstrap for GitHub Pages deployment.

## 🌟 Features

### Core Functionality
- **Product Catalog**: Browse products by categories (vegetables, fruits, dairy, groceries, spices)
- **Shopping Cart**: Add/remove items with persistent storage using localStorage
- **Order Placement**: Complete checkout process with customer details and delivery preferences
- **Order Confirmation**: Detailed order summary and confirmation page
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Features
- **Static Site**: Compatible with GitHub Pages (HTML, CSS, JavaScript only)
- **Modern UI**: Clean design with Bootstrap 5 and custom CSS
- **Fast Loading**: Optimized images and efficient code structure
- **Local Storage**: Cart persistence across browser sessions
- **Form Validation**: Client-side validation for all forms
- **Search & Filter**: Product search and category filtering
- **Indian Context**: Rupee currency, Pune delivery area, local product selection

## 🚀 Live Demo

Visit the live website: [Patil Kirana](https://yourusername.github.io/patil-kirana)

## 📁 Project Structure

```
patil-kirana/
├── index.html              # Homepage
├── products.html           # Product catalog page
├── checkout.html           # Checkout form
├── order-confirmation.html # Order confirmation page
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── main.js            # Main JavaScript functionality
│   ├── cart.js            # Shopping cart functionality
│   ├── products.js        # Product catalog functionality
│   ├── checkout.js        # Checkout process
│   └── order-confirmation.js # Order confirmation
├── data/
│   └── products.json      # Product data
├── images/                # Image assets (placeholder URLs used)
└── README.md             # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with CSS variables and animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **Bootstrap 5**: Responsive framework
- **Font Awesome**: Icons
- **Google Fonts**: Poppins font family
- **Local Storage**: Cart persistence

## 📦 Installation & Setup

### Option 1: GitHub Pages Deployment

1. **Fork this repository** or create a new repository
2. **Upload all files** to your repository
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
4. **Access your site** at `https://yourusername.github.io/repository-name`

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/patil-kirana.git
   cd patil-kirana
   ```

2. **Open with a local server**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have live-server installed)
   npx live-server
   
   # Or simply open index.html in your browser
   ```

3. **Access locally**: Open `http://localhost:8000` in your browser

## 🎨 Customization

### Colors & Branding
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2E7D32;    /* Main brand color */
    --secondary-color: #FF8F00;   /* Accent color */
    --accent-color: #D32F2F;      /* Alert/sale color */
}
```

### Products
Update product data in `data/products.json`:
```json
{
    "id": "unique-id",
    "name": "Product Name",
    "category": "vegetables|fruits|dairy|groceries|spices",
    "price": 100,
    "unit": "kg|liter|piece",
    "image": "image-url",
    "description": "Product description"
}
```

### Store Information
Update store details in HTML files:
- Contact information in footer sections
- Store address in contact sections
- Delivery areas in checkout validation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Configuration

### Delivery Settings
Edit delivery configuration in `js/cart.js`:
```javascript
// Free delivery threshold
getDeliveryCharges() {
    const total = this.getTotal();
    return total >= 500 ? 0 : 50; // Free delivery for orders above ₹500
}
```

### Pincode Validation
Update delivery areas in `js/main.js`:
```javascript
// Pincode validation for Pune
const pincodeRegex = /^41\d{4}$/; // Pune pincodes start with 41
```

## 🚀 Performance Optimization

- **Images**: Using optimized Unsplash URLs with specific dimensions
- **CSS**: Minified Bootstrap and custom CSS
- **JavaScript**: Modular code structure for better loading
- **Caching**: Leverages browser caching for static assets

## 📋 Features Roadmap

- [ ] Payment gateway integration
- [ ] User authentication
- [ ] Order tracking system
- [ ] Admin panel for product management
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Inventory management
- [ ] Customer reviews and ratings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- **Email**: support@patilkirana.com
- **Phone**: +91 98765 43210
- **Address**: 123 FC Road, Shivajinagar, Pune, Maharashtra 411005

## 🙏 Acknowledgments

- Bootstrap team for the excellent framework
- Font Awesome for the icon library
- Unsplash for placeholder images
- Google Fonts for typography

---

**Made with ❤️ for Patil Kirana, Pune**
