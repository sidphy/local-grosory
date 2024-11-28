// DOM Elements
const featuredProducts = document.getElementById('featured-products');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Load featured products
async function loadFeaturedProducts() {
    try {
        const response = await fetch('api/featured-products.php');
        const products = await response.json();
        
        featuredProducts.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="stock">${product.stock} ${product.unit} available</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart">
                    Add to Cart
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        featuredProducts.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Add to cart functionality
async function addToCart(productId) {
    try {
        const response = await fetch('api/get-product.php?id=' + productId);
        const product = await response.json();
        
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showNotification('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding product to cart', 'error');
    }
}

// Search functionality
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const response = await fetch(`api/search-products.php?q=${encodeURIComponent(query)}`);
        const products = await response.json();
        
        displaySearchResults(products);
    } catch (error) {
        console.error('Error searching products:', error);
        showNotification('Error searching products', 'error');
    }
}

function displaySearchResults(products) {
    featuredProducts.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock">${product.stock} ${product.unit} available</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);