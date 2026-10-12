// Shop items. To use a real product photo, set `image` to its path
// (for example 'images/silk-evening-dress.png'); a cut-out on a white
// or transparent background matches the grid best. Items without an
// image show a drawn silhouette. Set `soldOut: true` to mark one sold out.
const PRODUCTS = [
    { name: 'Élite Silk Evening Dress', price: '$899', shape: 'dress', image: '',
      description: 'Luxurious silk evening dress with hand-embroidered details and premium Italian craftsmanship' },
    { name: 'Élite Cashmere Blazer', price: '$1,299', shape: 'blazer', image: '',
      description: 'Handwoven cashmere blazer with bespoke tailoring and gold-plated buttons' },
    { name: 'Élite Diamond Cufflinks', price: '$2,499', shape: 'cufflinks', image: '',
      description: 'Platinum cufflinks with genuine diamonds, handcrafted by master jewelers' },
    { name: 'Élite Leather Handbag', price: '$1,899', shape: 'handbag', image: '',
      description: 'Handcrafted Italian leather handbag with 24k gold hardware and silk lining' },
    { name: 'Élite Wool Overcoat', price: '$1,599', shape: 'overcoat', image: '',
      description: 'Premium merino wool overcoat with cashmere lining and horn buttons' },
    { name: 'Élite Silk Scarf', price: '$399', shape: 'scarf', image: '',
      description: 'Hand-painted silk scarf with exclusive artistic design and rolled edges' }
];

const SILHOUETTES = {
    dress: '<path d="M80 18h40l-4 34 30 18-20 40 34 72H40l34-72-20-40 30-18z" fill="#111"/><path d="M84 18c4 14 28 14 32 0M70 110h60" stroke="#3a3a3a" stroke-width="2" fill="none"/>',
    blazer: '<path d="M74 22 46 34 26 150l22 4 12-70v100h80V88l12 66 22-4L154 34 126 22l-26 44z" fill="#111"/><path d="M100 66v108M74 22l14 54-14 10M126 22l-14 54 14 10" stroke="#3a3a3a" stroke-width="2" fill="none"/><circle cx="100" cy="120" r="3" fill="#8a7a4a"/><circle cx="100" cy="140" r="3" fill="#8a7a4a"/>',
    cufflinks: '<rect x="40" y="70" width="46" height="46" rx="6" fill="#111"/><rect x="114" y="84" width="46" height="46" rx="6" fill="#111"/><path d="M63 80l10 13-10 13-10-13zM137 94l10 13-10 13-10-13z" fill="#d9d9d9"/><path d="M63 116v28M137 130v28" stroke="#111" stroke-width="6"/><ellipse cx="63" cy="148" rx="14" ry="5" fill="#111"/><ellipse cx="137" cy="162" rx="14" ry="5" fill="#111"/>',
    handbag: '<path d="M70 70c0-40 60-40 60 0" stroke="#111" stroke-width="8" fill="none"/><path d="M40 70h120l12 100H28z" fill="#111"/><path d="M40 92h120" stroke="#3a3a3a" stroke-width="2"/><rect x="92" y="86" width="16" height="12" rx="2" fill="#8a7a4a"/>',
    overcoat: '<path d="M76 16 48 28 30 120l20 4 10-50v122h80V74l10 50 20-4-18-92-28-12-24 50z" fill="#111"/><path d="M100 66v130M76 16l12 50-12 12M124 16l-12 50 12 12M66 140h22M112 140h22" stroke="#3a3a3a" stroke-width="2" fill="none"/>',
    scarf: '<path d="M60 30h80v60c0 20-20 26-20 50v40h-24v-44c0-24-36-30-36-56z" fill="#111"/><path d="M96 180v8M104 180v8M112 180v8M120 180v8" stroke="#111" stroke-width="2"/><path d="M64 50h72M64 64h72" stroke="#3a3a3a" stroke-width="2"/>'
};

function productArt(product) {
    if (product.image) {
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.loading = 'lazy';
        return img.outerHTML;
    }
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + product.name + '">' + SILHOUETTES[product.shape] + '</svg>';
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
