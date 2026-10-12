// Shop items. Each one shows a placeholder icon in its color.
// Set `soldOut: true` on an item to mark it sold out.
const PRODUCTS = [
    { name: 'Élite Silk Evening Dress', price: '$899', icon: 'star', color: '#d8b4fe',
      description: 'Luxurious silk evening dress with hand-embroidered details and premium Italian craftsmanship' },
    { name: 'Élite Cashmere Blazer', price: '$1,299', icon: 'check', color: '#93c5fd',
      description: 'Handwoven cashmere blazer with bespoke tailoring and gold-plated buttons' },
    { name: 'Élite Diamond Cufflinks', price: '$2,499', icon: 'star', color: '#facc15',
      description: 'Platinum cufflinks with genuine diamonds, handcrafted by master jewelers' },
    { name: 'Élite Leather Handbag', price: '$1,899', icon: 'bag', color: '#fda4af',
      description: 'Handcrafted Italian leather handbag with 24k gold hardware and silk lining' },
    { name: 'Élite Wool Overcoat', price: '$1,599', icon: 'check', color: '#9ca3af',
      description: 'Premium merino wool overcoat with cashmere lining and horn buttons' },
    { name: 'Élite Silk Scarf', price: '$399', icon: 'star', color: '#6ee7b7',
      description: 'Hand-painted silk scarf with exclusive artistic design and rolled edges' }
];

const ICONS = {
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    check: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
    bag: '<path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>'
};

function productArt(product) {
    return '<svg viewBox="0 0 24 24" fill="' + product.color + '" aria-hidden="true">' + ICONS[product.icon] + '</svg>';
}

function renderShop() {
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = '';
    PRODUCTS.forEach((product, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'shop-item';
        item.innerHTML =
            '<div class="shop-art">' + productArt(product) + '</div>' +
            '<span class="shop-name"></span>' +
            '<span class="shop-price"></span>';
        item.querySelector('.shop-name').textContent = product.name;
        const price = item.querySelector('.shop-price');
        price.textContent = product.soldOut ? 'Sold out' : product.price;
        if (product.soldOut) price.classList.add('shop-sold');
        item.addEventListener('click', () => openProductModal(index));
        grid.appendChild(item);
    });
    document.getElementById('shopCount').textContent = PRODUCTS.length + ' items';
}

renderShop();

window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 1500);
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('bg-white/95', 'shadow-lg');
        navbar.classList.remove('bg-white/95');
    } else {
        navbar.classList.remove('shadow-lg');
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Smooth scrolling
function scrollToCollections() {
    document.getElementById('collections').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Product modal functions
function openProductModal(index) {
    const product = PRODUCTS[index];
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.price;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalImage').innerHTML = productArt(product);
    document.getElementById('productModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function addToCart() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-right';
    notification.innerHTML = '✓ Added to cart successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    closeProductModal();
}

function addToWishlist() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-right';
    notification.innerHTML = '♥ Added to wishlist!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    closeProductModal();
}

function handleContactForm(event) {
    event.preventDefault();
    
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-right';
    notification.innerHTML = '✨ Consultation request sent! We\'ll contact you within 24 hours.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
    
    event.target.reset();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close mobile menu when clicking on links
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Close modal when clicking outside
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProductModal();
    }
});

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !document.getElementById('productModal').classList.contains('hidden')) {
        closeProductModal();
    }
});

// Add some interactive elements
document.querySelectorAll('.luxury-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97d4a10231583bbc',t:'MTc1NzU2NzExNS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
