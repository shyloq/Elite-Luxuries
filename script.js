// Shop items (VULT LABEL Drop 03). Set `soldOut: true` to mark one sold out.
const PRODUCTS = [
    { name: 'Vault Hoodie', price: '$128', shape: 'hoodie', color: '#2b2f35',
      description: '450 GSM brushed fleece, boxy fit. Numbered run of 120.' },
    { name: 'Lot Tee', price: '$54', shape: 'tee', color: '#e9e4d8',
      description: '280 GSM jersey, dropped shoulder. Numbered run of 150.' },
    { name: 'Night Shift Tee', price: '$58', shape: 'tee', color: '#5a1f24',
      description: '280 GSM jersey with back print. Numbered run of 80.' },
    { name: 'Deposit Cargo', price: '$142', shape: 'cargo', color: '#5b5f4a',
      description: '12 oz ripstop, relaxed taper. Numbered run of 60.' },
    { name: 'Steel Work Jacket', price: '$210', shape: 'jacket', color: '#7e868d',
      description: '14 oz canvas with quilted lining. Numbered run of 40.' },
    { name: 'Keyholder Cap', price: '$42', shape: 'cap', color: '#131518',
      description: 'Washed twill with a brass clasp. Numbered run of 90.' },
    { name: 'Lockbox Tote', price: '$36', shape: 'tote', color: '#d8cfba',
      description: '16 oz canvas with an interior pocket. Numbered run of 100.' },
    { name: 'Combination Hoodie', price: '$134', shape: 'hoodie', color: '#c9a24a', soldOut: true,
      description: '450 GSM brushed fleece with dial embroidery. Numbered run of 60.' }
];

const GARMENTS = {
    tee: '<path d="M34 14 L20 20 L6 36 L18 46 L26 40 L26 88 L74 88 L74 40 L82 46 L94 36 L80 20 L66 14 C62 22 38 22 34 14 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/>',
    hoodie: '<path d="M36 16 C36 4 64 4 64 16 L80 22 L94 58 L82 62 L74 44 L74 90 L26 90 L26 44 L18 62 L6 58 L20 22 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M38 16 C40 30 60 30 62 16" fill="none" stroke="#111" stroke-width="2"/><rect x="36" y="58" width="28" height="14" fill="none" stroke="#111" stroke-width="2"/>',
    cargo: '<path d="M28 8 L72 8 L78 92 L58 92 L50 34 L42 92 L22 92 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><rect x="24" y="48" width="12" height="16" fill="none" stroke="#111" stroke-width="2"/><rect x="64" y="48" width="12" height="16" fill="none" stroke="#111" stroke-width="2"/><path d="M28 16 L72 16" stroke="#111" stroke-width="2"/>',
    jacket: '<path d="M36 12 L20 18 L8 64 L20 66 L26 44 L26 90 L48 90 L48 22 L52 22 L52 90 L74 90 L74 44 L80 66 L92 64 L80 18 L64 12 L56 22 L44 22 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><rect x="30" y="54" width="12" height="10" fill="none" stroke="#111" stroke-width="2"/><rect x="58" y="54" width="12" height="10" fill="none" stroke="#111" stroke-width="2"/>',
    cap: '<path d="M16 62 C16 30 84 30 84 62 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M50 62 L96 62 C96 72 70 74 50 70 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="32" r="3" fill="#111"/>',
    tote: '<path d="M36 34 C36 10 64 10 64 34" fill="none" stroke="#111" stroke-width="3"/><rect x="20" y="32" width="60" height="58" fill="FILL" stroke="#111" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="16" fill="#111">VULT</text>'
};

function productArt(product) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + GARMENTS[product.shape].replaceAll('FILL', product.color) + '</svg>';
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

// Vault entry: turn the dial to each number of the combination to get in.
(function setupVaultGate() {
    const gate = document.getElementById('vaultGate');
    const dial = document.getElementById('vaultDial');
    const face = document.getElementById('vaultFace');
    const readout = document.getElementById('vaultNumber');
    const hint = document.getElementById('vaultHint');
    const steps = document.querySelectorAll('#vaultCode li');
    const COMBINATION = [12, 47, 83];
    const DEG_PER_NUMBER = 3.6;

    let unlocked = false;
    try { unlocked = sessionStorage.getItem('vault-open') === '1'; } catch (e) {}
    if (unlocked) { gate.hidden = true; return; }
    document.body.style.overflow = 'hidden';

    // Ticks and numbers around the dial
    let ticks = '';
    for (let i = 0; i < 100; i++) {
        const a = (i / 100) * Math.PI * 2, long = i % 10 === 0, r2 = long ? 76 : 84;
        const x1 = 100 + Math.sin(a) * 90, y1 = 100 - Math.cos(a) * 90;
        const x2 = 100 + Math.sin(a) * r2, y2 = 100 - Math.cos(a) * r2;
        ticks += '<line x1="' + x1.toFixed(2) + '" y1="' + y1.toFixed(2) + '" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) + '" stroke="#e6e8ea" stroke-width="' + (long ? 2 : 0.8) + '"/>';
        if (long) {
            const xt = 100 + Math.sin(a) * 64, yt = 100 - Math.cos(a) * 64 + 3.5;
            ticks += '<text x="' + xt.toFixed(2) + '" y="' + yt.toFixed(2) + '" text-anchor="middle" font-size="10" fill="#e6e8ea" font-family="IBM Plex Mono, monospace">' + i + '</text>';
        }
    }
    face.insertAdjacentHTML('afterbegin', ticks);

    let rotation = 0;      // degrees, clockwise
    let step = 0;          // which number of the combination is next
    let dragging = false;
    let lastAngle = 0;

    const valueOf = rot => ((Math.round(-rot / DEG_PER_NUMBER) % 100) + 100) % 100;
    const pad = n => String(n).padStart(2, '0');

    function render() {
        face.style.transform = 'rotate(' + rotation + 'deg)';
        const v = valueOf(rotation);
        readout.textContent = pad(v);
        dial.setAttribute('aria-valuenow', v);
        dial.setAttribute('aria-valuetext', pad(v));
    }

    function showStep() {
        steps.forEach((li, i) => {
            li.classList.toggle('done', i < step);
            li.classList.toggle('current', i === step);
        });
    }

    function tryNumber() {
        if (step >= COMBINATION.length) return;
        const v = valueOf(rotation);
        const target = COMBINATION[step];
        // Accept one number either side: one number is only a few pixels of dial on a phone
        const off = ((v - target + 150) % 100) - 50;
        if (Math.abs(off) <= 1) {
            rotation += off * DEG_PER_NUMBER;
            render();
            step++;
            showStep();
            gate.classList.remove('clicked');
            void gate.offsetWidth;
            gate.classList.add('clicked');
            if (step === COMBINATION.length) {
                openVault();
            } else {
                hint.textContent = 'Click. Now turn to ' + pad(COMBINATION[step]) + '.';
            }
        } else {
            hint.textContent = 'That’s ' + pad(v) + '. Turn to ' + pad(COMBINATION[step]) + ', then let go.';
            dial.classList.remove('nope');
            void dial.offsetWidth;
            dial.classList.add('nope');
        }
    }

    function openVault() {
        hint.textContent = 'Unlocked. Welcome in.';
        gate.classList.add('open');
        try { sessionStorage.setItem('vault-open', '1'); } catch (e) {}
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setTimeout(() => {
            gate.hidden = true;
            document.body.style.overflow = '';
        }, reduce ? 300 : 1600);
    }

    function pointerAngle(e) {
        const r = dial.getBoundingClientRect();
        return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
    }

    dial.addEventListener('pointerdown', e => {
        if (gate.classList.contains('open')) return;
        dragging = true;
        lastAngle = pointerAngle(e);
        dial.setPointerCapture(e.pointerId);
        dial.classList.add('turning');
        e.preventDefault();
    });

    dial.addEventListener('pointermove', e => {
        if (!dragging) return;
        const a = pointerAngle(e);
        let delta = a - lastAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        rotation += delta;
        lastAngle = a;
        render();
    });

    function release() {
        if (!dragging) return;
        dragging = false;
        dial.classList.remove('turning');
        rotation = Math.round(rotation / DEG_PER_NUMBER) * DEG_PER_NUMBER;
        render();
        tryNumber();
    }
    dial.addEventListener('pointerup', release);
    dial.addEventListener('pointercancel', release);

    dial.addEventListener('keydown', e => {
        if (gate.classList.contains('open')) return;
        const amount = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            rotation -= amount * DEG_PER_NUMBER;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            rotation += amount * DEG_PER_NUMBER;
        } else if (e.key === 'Enter' || e.key === ' ') {
            tryNumber();
        } else {
            return;
        }
        e.preventDefault();
        render();
    });

    showStep();
    render();
    dial.focus({ preventScroll: true });
})();

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
