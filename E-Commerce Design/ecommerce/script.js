// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the saved theme
if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.querySelector('.fa-moon').style.display = 'none';
    themeToggle.querySelector('.fa-sun').style.display = 'inline-block';
} else {
    body.removeAttribute('data-theme');
    themeToggle.querySelector('.fa-moon').style.display = 'inline-block';
    themeToggle.querySelector('.fa-sun').style.display = 'none';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    if (body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.querySelector('.fa-moon').style.display = 'inline-block';
        themeToggle.querySelector('.fa-sun').style.display = 'none';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.querySelector('.fa-moon').style.display = 'none';
        themeToggle.querySelector('.fa-sun').style.display = 'inline-block';
    }
});

// Product data
const products = [
    {
        id: 1,
        title: "Urban Jacket",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        rating: 4,
        badge: "New"
    },
    {
        id: 2,
        title: "Classic White Tee",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        rating: 5,
        badge: "Bestseller"
    },
    {
        id: 3,
        title: "Slim Fit Jeans",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        rating: 4,
        badge: "Sale"
    },
    {
        id: 4,
        title: "Leather Backpack",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        rating: 5,
        badge: "Limited"
    },
    {
        id: 5,
        title: "Casual Sneakers",
        price: 65.99,
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400",
        rating: 4,
        badge: null
    },
    {
        id: 6,
        title: "Wool Beanie",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1578875288046-eaedc406165c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rating: 3,
        badge: null
    }
];

// Cart functionality
let cart = [];
const cartModal = document.querySelector('.cart-modal');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmount = document.querySelector('.total-amount');
const productGrid = document.querySelector('.product-grid');

// Render products
function renderProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let ratingStars = '';
        for (let i = 0; i < 5; i++) {
            if (i < product.rating) {
                ratingStars += '<i class="fas fa-star"></i>';
            } else {
                ratingStars += '<i class="far fa-star"></i>';
            }
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-rating">${ratingStars}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Add animation to button
    e.target.textContent = 'Added!';
    e.target.style.backgroundColor = '#00b894';
    setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.style.backgroundColor = '';
    }, 1000);
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
    
    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Remove from cart function
function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Toggle cart modal
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartModal.classList.add('active');
});

document.querySelector('.close-cart').addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    
    // In a real app, you would send this to your backend
    console.log('Subscribed with email:', email);
    
    // Show success message
    const submitButton = this.querySelector('button');
    submitButton.textContent = 'Subscribed!';
    submitButton.disabled = true;
    
    // Reset form after 2 seconds
    setTimeout(() => {
        this.reset();
        submitButton.textContent = 'Subscribe';
        submitButton.disabled = false;
    }, 2000);
});

// Initialize the page
renderProducts();
updateCart();

// Category card hover effect
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const category = card.getAttribute('data-category');
        card.style.boxShadow = `0 0 30px ${getCategoryColor(category)}`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

function getCategoryColor(category) {
    switch(category) {
        case 'men':
            return 'rgba(74, 144, 226, 0.3)';
        case 'women':
            return 'rgba(232, 67, 147, 0.3)';
        case 'accessories':
            return 'rgba(253, 203, 110, 0.3)';
        default:
            return 'rgba(108, 92, 231, 0.3)';
    }
}

// Search functionality
document.querySelector('.fa-search').addEventListener('click', () => {
    const searchTerm = prompt('Enter search term:');
    if (searchTerm) {
        // In a real app, you would filter products based on search term
        alert(`Searching for: ${searchTerm}`);
    }
});
// Updated JavaScript for Smoother Transitions
document.addEventListener('DOMContentLoaded', function() {
    const slides = Array.from(document.querySelectorAll('.card-slide'));
    let activeIndex = 0;
    let isAnimating = false;

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('previous', 'active', 'next', 'leaving', 'entering');
            
            const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
            const nextIndex = (activeIndex + 1) % slides.length;

            if (index === activeIndex) {
                slide.classList.add('active');
            } else if (index === prevIndex) {
                slide.classList.add('previous');
            } else if (index === nextIndex) {
                slide.classList.add('next');
            }
        });
    }

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentActive = slides[activeIndex];
        const nextActive = slides[(activeIndex + 1) % slides.length];
        
        currentActive.classList.add('leaving');
        nextActive.classList.add('entering');
        
        setTimeout(() => {
            currentActive.classList.remove('leaving', 'active');
            nextActive.classList.remove('entering');
            activeIndex = (activeIndex + 1) % slides.length;
            updateSlides();
            isAnimating = false;
        }, 1200);
    }

    // Smoother auto-advance with requestAnimationFrame
    let lastTime = 0;
    function autoAdvance(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const progress = timestamp - lastTime;
        
        if (progress > 4000) { // 4 seconds
            nextSlide();
            lastTime = timestamp;
        }
        requestAnimationFrame(autoAdvance);
    }
    requestAnimationFrame(autoAdvance);

    // Add parallax effect on mouse move
    const deck = document.querySelector('.card-deck');
    if (deck) {
        deck.addEventListener('mousemove', (e) => {
            if (isAnimating) return;
            
            const rect = deck.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (e.clientX - rect.left - centerX) / 30;
            const moveY = (e.clientY - rect.top - centerY) / 30;

            deck.style.transform = `
                rotateX(${moveY}deg)
                rotateY(${-moveX}deg)
            `;
        });

        deck.addEventListener('mouseleave', () => {
            deck.style.transform = 'rotateX(0) rotateY(0)';
        });
    }

    // Initialize
    updateSlides();
});