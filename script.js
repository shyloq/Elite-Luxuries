// Built-in shop items (VULT LABEL Drop 03). store.js replaces this list with the
// live products from the Medusa backend when store-config.js points at one.
// The built-in list has no live stock, so it shows run sizes instead of units left.
let PRODUCTS = [
    { name: 'Vault Hoodie', sizes: ['S', 'M', 'L', 'XL'], price: '$128', shape: 'hoodie', color: '#2b2f35', run: 120,
      description: '450 GSM brushed fleece, boxy fit.' },
    { name: 'Lot Tee', sizes: ['S', 'M', 'L', 'XL', 'XXL'], price: '$54', shape: 'tee', color: '#e9e4d8', run: 150,
      description: '280 GSM jersey, dropped shoulder.' },
    { name: 'Night Shift Tee', sizes: ['S', 'M', 'L', 'XL'], price: '$58', shape: 'tee', color: '#5a1f24', run: 80,
      description: '280 GSM jersey with back print.' },
    { name: 'Deposit Cargo', sizes: ['28', '30', '32', '34', '36'], price: '$142', shape: 'cargo', color: '#5b5f4a', run: 60,
      description: '12 oz ripstop, relaxed taper.' },
    { name: 'Steel Work Jacket', sizes: ['S', 'M', 'L', 'XL'], price: '$210', shape: 'jacket', color: '#7e868d', run: 40,
      description: '14 oz canvas with quilted lining.' },
    { name: 'Keyholder Cap', sizes: ['OS'], price: '$42', shape: 'cap', color: '#131518', run: 90,
      description: 'Washed twill with a brass clasp.' },
    { name: 'Lockbox Tote', sizes: ['OS'], price: '$36', shape: 'tote', color: '#d8cfba', run: 100,
      description: '16 oz canvas with an interior pocket.' },
    { name: 'Combination Hoodie', sizes: ['S', 'M', 'L', 'XL'], price: '$134', shape: 'hoodie', color: '#c9a24a', run: 60, soldOut: true,
      description: '450 GSM brushed fleece with dial embroidery.' }
];

const GARMENTS = {
    tee: '<path d="M34 14 L20 20 L6 36 L18 46 L26 40 L26 88 L74 88 L74 40 L82 46 L94 36 L80 20 L66 14 C62 22 38 22 34 14 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/>',
    hoodie: '<path d="M36 16 C36 4 64 4 64 16 L80 22 L94 58 L82 62 L74 44 L74 90 L26 90 L26 44 L18 62 L6 58 L20 22 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M38 16 C40 30 60 30 62 16" fill="none" stroke="#111" stroke-width="2"/><rect x="36" y="58" width="28" height="14" fill="none" stroke="#111" stroke-width="2"/>',
    cargo: '<path d="M28 8 L72 8 L78 92 L58 92 L50 34 L42 92 L22 92 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><rect x="24" y="48" width="12" height="16" fill="none" stroke="#111" stroke-width="2"/><rect x="64" y="48" width="12" height="16" fill="none" stroke="#111" stroke-width="2"/><path d="M28 16 L72 16" stroke="#111" stroke-width="2"/>',
    jacket: '<path d="M36 12 L20 18 L8 64 L20 66 L26 44 L26 90 L48 90 L48 22 L52 22 L52 90 L74 90 L74 44 L80 66 L92 64 L80 18 L64 12 L56 22 L44 22 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><rect x="30" y="54" width="12" height="10" fill="none" stroke="#111" stroke-width="2"/><rect x="58" y="54" width="12" height="10" fill="none" stroke="#111" stroke-width="2"/>',
    cap: '<path d="M16 62 C16 30 84 30 84 62 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M50 62 L96 62 C96 72 70 74 50 70 Z" fill="FILL" stroke="#111" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="32" r="3" fill="#111"/>',
    tote: '<path d="M36 34 C36 10 64 10 64 34" fill="none" stroke="#111" stroke-width="3"/><rect x="20" y="32" width="60" height="58" fill="FILL" stroke="#111" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-family="Archivo Variable, Arial, sans-serif" font-weight="900" font-stretch="125%" font-size="13" fill="#111">VULT</text>'
};

function productArt(product) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + GARMENTS[product.shape].replaceAll('FILL', product.color) + '</svg>';
}

const pad2 = n => String(n).padStart(2, '0');

// One owner for the page's overlays (vault entry, product view, bag). The newest open
// overlay owns focus: everything else on the page is inert and the page does not scroll.
// The one exception is the product view on wide screens, which opens below the top bar:
// there the bar stays live, so the bag and the menu still work from a product.
const Overlays = (() => {
    const stack = [];
    const wide = window.matchMedia('(min-width: 900px)');
    function sync() {
        const top = stack[stack.length - 1] || null;
        const view = document.getElementById('productModal');
        const barLive = top === view && wide.matches;
        document.querySelectorAll('body > .bar, body > main, body > .foot, body > [data-overlay]').forEach(el => {
            el.inert = top !== null && el !== top && !(barLive && el.classList.contains('bar'));
        });
        view.setAttribute('aria-modal', String(!barLive));
        document.body.style.overflow = top ? 'hidden' : '';
    }
    wide.addEventListener('change', sync);
    return {
        open(el) {
            if (!stack.includes(el)) stack.push(el);
            sync();
        },
        close(el) {
            const i = stack.indexOf(el);
            if (i !== -1) stack.splice(i, 1);
            sync();
        },
        isTop(el) { return stack[stack.length - 1] === el; }
    };
})();

// Product view state (the view itself is set up further down)
const productModal = document.getElementById('productModal');
let modalProduct = null;
let modalIndex = -1;
let modalReturnFocus = null;
// Products with an Add to bag request in flight, and the size (variant id) being added
const addingProducts = new Map();
// The recorder's panel: it closes out the monitor wall after every render
const wallDvr = document.getElementById('wallDvr');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// The box the camera's motion detection draws around a garment
const TRACK = '<span class="track" aria-hidden="true"></span>';

// Each product is a camera on the monitor wall; camera 01 is the vault door.
function cameraLabel(index) {
    return 'CAM ' + pad2(index + 2);
}

function stockText(product) {
    if (product.soldOut) return 'Sold out' + (product.run ? ' · run of ' + product.run : '');
    if (typeof product.left === 'number') {
        return product.left + (product.run ? ' of ' + product.run : '') + ' left';
    }
    return product.run ? 'Run of ' + product.run : '';
}

// Live grain for the camera feeds, drawn once and tiled by CSS
(function makeNoise() {
    try {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        const image = ctx.createImageData(size, size);
        for (let i = 0; i < image.data.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
            image.data[i + 3] = 255;
        }
        ctx.putImageData(image, 0, 0);
        document.documentElement.style.setProperty('--noise', 'url(' + canvas.toDataURL('image/png') + ')');
    } catch (e) {}
})();

// Camera timestamps. Timecode clocks ("tc") also count frames, 25 a second as CCTV
// records, while they are on screen; with reduced motion they show the time only.
const clockTime = now => pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds());
const timecode = now => clockTime(now) + (reduceMotion.matches ? '' : ':' + pad2(Math.floor(now.getMilliseconds() / 40)));

function updateClocks() {
    const now = new Date();
    const time = clockTime(now);
    const date = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
    document.querySelectorAll('.osd-clock').forEach(el => {
        if (el.dataset.format === 'full') {
            el.innerHTML = '<span class="osd-date">' + date + '&nbsp;</span>' + time;
        } else {
            el.textContent = el.dataset.format === 'tc' ? timecode(now) : time;
        }
    });
}

// Tick on the second, so every clock on the page changes together
(function tickClocks() {
    updateClocks();
    setTimeout(tickClocks, 1000 - (Date.now() % 1000));
})();

(function runTimecode() {
    const onScreen = new Set();
    let running = false;
    function frame() {
        if (!onScreen.size || reduceMotion.matches) { running = false; return; }
        const text = timecode(new Date());
        onScreen.forEach(el => { if (el.textContent !== text) el.textContent = text; });
        requestAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target));
        if (onScreen.size && !running) { running = true; requestAnimationFrame(frame); }
    });
    document.querySelectorAll('.osd-clock[data-format="tc"]').forEach(el => observer.observe(el));
    reduceMotion.addEventListener('change', () => {
        updateClocks();
        if (onScreen.size && !running) { running = true; requestAnimationFrame(frame); }
    });
})();

function renderShop() {
    const grid = document.getElementById('shopGrid');
    // A late render (live products arriving) replaces the tiles; keep a focused tile's place
    const focusedTile = [...grid.children].indexOf(document.activeElement);
    grid.innerHTML = '';
    PRODUCTS.forEach((product, index) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        // The first camera is the wall's main feed
        tile.className = 'feed-tile' + (index === 0 ? ' feed-tile--main' : '') + (product.soldOut ? ' feed-tile--lost' : '');
        tile.innerHTML =
            (product.soldOut
                ? '<div class="feed-tile__nosignal" aria-hidden="true"><span>No signal</span></div>'
                : '<div class="feed-tile__art">' + productArt(product) + TRACK + '</div>') +
            '<div class="feed-noise" aria-hidden="true"></div>' +
            '<p class="osd osd--tl" aria-hidden="true"><span class="rec-dot"></span><span class="feed-tile__cam"></span></p>' +
            '<p class="osd osd--tr" aria-hidden="true"><time class="osd-clock" data-format="time"></time></p>' +
            '<p class="osd osd--bl feed-tile__label"><span class="feed-tile__name"></span><span class="feed-tile__meta"></span></p>';
        tile.querySelector('.feed-tile__cam').textContent = cameraLabel(index);
        tile.querySelector('.feed-tile__name').textContent = product.name;
        tile.querySelector('.feed-tile__meta').textContent = product.soldOut
            ? 'Sold out'
            : [product.price, stockText(product)].filter(Boolean).join(' · ');
        tile.addEventListener('click', () => openProductModal(index, tile));
        grid.appendChild(tile);
    });
    grid.appendChild(wallDvr);
    document.getElementById('wallDvrChannels').textContent =
        'CH 02' + (PRODUCTS.length > 1 ? '-' + cameraLabel(PRODUCTS.length - 1).slice(4) : '') + ' · 25 FPS';

    const gone = PRODUCTS.filter(p => p.soldOut).length;
    const count = PRODUCTS.length + ' pieces' + (gone ? ' · ' + gone + ' sold out' : '');
    document.getElementById('shopCount').textContent = count;
    document.getElementById('heroStatus').textContent =
        'Drop 03 · ' + (PRODUCTS.length - gone) + ' of ' + PRODUCTS.length + ' in stock';
    updateClocks();
    if (focusedTile !== -1 && grid.children[focusedTile]) grid.children[focusedTile].focus({ preventScroll: true });

    // The product view may be showing a product from the list this render replaced
    if (!productModal.hidden && modalProduct) {
        const i = PRODUCTS.findIndex(p => (modalProduct.id && p.id === modalProduct.id) || p.name === modalProduct.name);
        if (i === -1) closeProductModal();
        else openProductModal(i, null, { refresh: true });
    }
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
    Overlays.open(gate);

    // Ticks and numbers around the dial
    let ticks = '';
    for (let i = 0; i < 100; i++) {
        const a = (i / 100) * Math.PI * 2, long = i % 10 === 0, r2 = long ? 76 : 84;
        const x1 = 100 + Math.sin(a) * 90, y1 = 100 - Math.cos(a) * 90;
        const x2 = 100 + Math.sin(a) * r2, y2 = 100 - Math.cos(a) * r2;
        ticks += '<line class="dial-tick" x1="' + x1.toFixed(2) + '" y1="' + y1.toFixed(2) + '" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) + '" stroke-width="' + (long ? 2 : 0.8) + '"/>';
        if (long) {
            const xt = 100 + Math.sin(a) * 64, yt = 100 - Math.cos(a) * 64 + 4;
            ticks += '<text class="dial-num" x="' + xt.toFixed(2) + '" y="' + yt.toFixed(2) + '" text-anchor="middle">' + i + '</text>';
        }
    }
    face.insertAdjacentHTML('afterbegin', ticks);

    let rotation = 0;      // degrees, clockwise
    let step = 0;          // which number of the combination is next
    let dragging = false;
    let lastAngle = 0;
    let stillTimer = 0;

    // CAM 00 draws its motion box around the door while the dial is moving
    function motion() {
        gate.classList.add('motion');
        clearTimeout(stillTimer);
        stillTimer = setTimeout(() => { if (!dragging) gate.classList.remove('motion'); }, 900);
    }

    const valueOf = rot => ((Math.round(-rot / DEG_PER_NUMBER) % 100) + 100) % 100;

    function render() {
        face.style.transform = 'rotate(' + rotation + 'deg)';
        const v = valueOf(rotation);
        readout.textContent = pad2(v);
        dial.setAttribute('aria-valuenow', v);
        dial.setAttribute('aria-valuetext', pad2(v));
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
                hint.textContent = 'Click. Now turn to ' + pad2(COMBINATION[step]) + '.';
            }
        } else {
            hint.textContent = 'That’s ' + pad2(v) + '. Turn to ' + pad2(COMBINATION[step]) + ', then let go.';
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
            Overlays.close(gate);
            document.querySelector('.cam-hero .btn').focus({ preventScroll: true });
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
        motion();
    });

    function release() {
        if (!dragging) return;
        dragging = false;
        motion();
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
        motion();
    });

    showStep();
    render();
    dial.focus({ preventScroll: true });
})();

document.getElementById('lockVault').addEventListener('click', () => {
    try { sessionStorage.removeItem('vault-open'); } catch (e) {}
    history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'instant' });
    location.reload();
});

// Product view: the selected camera, fullscreen
// options.refresh: the list was re-rendered while the view was open; keep the shopper's place
function openProductModal(index, opener, options = {}) {
    const product = PRODUCTS[index];
    const list = document.getElementById('modalSize');
    const previous = list.querySelector('input:checked');
    const keepSize = options.refresh && previous ? previous.nextElementSibling.textContent : null;
    const sizeHadFocus = options.refresh && list.contains(document.activeElement);
    modalProduct = product;
    modalIndex = index;
    if (!options.refresh) modalReturnFocus = opener || document.activeElement;

    document.getElementById('modalCam').textContent = cameraLabel(index);
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.price;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalStock').textContent = stockText(product);
    document.getElementById('modalFeed').classList.toggle('cam-view__feed--lost', !!product.soldOut);
    document.getElementById('modalImage').innerHTML = product.soldOut
        ? '<div class="feed-tile__nosignal"><span>No signal</span></div>'
        : productArt(product) + TRACK;

    // Live products carry variants with stock; the built-in list only has size names
    list.innerHTML = '';
    const sizes = product.variants || (product.sizes || []).map(size => ({ id: '', size, inStock: !product.soldOut }));
    let firstInStock = null;
    const inFlight = addingProducts.get(product.name);
    sizes.forEach(v => {
        const label = document.createElement('label');
        label.className = 'size';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'size';
        input.value = v.id;
        input.disabled = !v.inStock;
        const text = document.createElement('span');
        text.textContent = v.size;
        if (!v.inStock) label.title = v.size + ' is sold out';
        label.append(input, text);
        list.appendChild(label);
        if (v.inStock && !firstInStock) firstInStock = input;
        if (v.inStock && v.size === keepSize) firstInStock = input;
        // Reopened while its add is in flight: show the size being added
        if (v.inStock && inFlight && v.id === inFlight) firstInStock = input;
    });
    if (firstInStock) firstInStock.checked = true;

    const addButton = document.getElementById('modalAdd');
    addButton.disabled = !firstInStock;
    if (addingProducts.has(product.name)) {
        addButton.setAttribute('aria-disabled', 'true');
        addButton.textContent = 'Adding...';
    } else {
        addButton.removeAttribute('aria-disabled');
        addButton.textContent = firstInStock ? 'Add to bag' : 'Sold out';
    }

    productModal.hidden = false;
    Overlays.open(productModal);
    if (!options.refresh) {
        (firstInStock ? addButton : document.getElementById('modalClose')).focus();
    } else if (sizeHadFocus) {
        (firstInStock || document.getElementById('modalClose')).focus();
    }
}

function closeProductModal() {
    productModal.hidden = true;
    Overlays.close(productModal);
    // The tile that opened the view may have been replaced by a re-render
    let target = modalReturnFocus;
    if (!target || !document.contains(target)) target = document.querySelectorAll('.feed-tile')[modalIndex];
    if (target) target.focus();
}

// kind: 'error' or 'loading'. One toast at a time.
function showToast(message, kind) {
    if (!document.getElementById('bagDrawer').hidden) {
        // The open bag shows changes itself; an error goes to its own status line
        if (kind === 'error') document.getElementById('bagNote').textContent = message;
        return;
    }
    document.querySelectorAll('.store-toast').forEach(t => t.remove());
    const notification = document.createElement('div');
    notification.className = 'store-toast' + (kind ? ' store-toast--' + kind : '');
    notification.setAttribute('role', 'status');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

async function addToCart() {
    // Remember what is being added: the shopper may switch products before the bag answers
    const product = modalProduct;
    if (addingProducts.has(product.name)) return;
    const state = typeof VultStore === 'undefined' ? 'offline' : VultStore.state;
    if (state === 'loading') {
        showToast('The store is still loading. Try again in a moment.', 'loading');
        return;
    }
    if (state !== 'connected') {
        showToast('The store is offline right now. Try again soon.', 'error');
        return;
    }
    const checked = document.querySelector('#modalSize input:checked');
    if (!checked || !checked.value) {
        showToast('Pick a size first.', 'error');
        return;
    }
    const size = checked.nextElementSibling.textContent;
    const addButton = document.getElementById('modalAdd');
    addingProducts.set(product.name, checked.value);
    addButton.setAttribute('aria-disabled', 'true');
    addButton.textContent = 'Adding...';
    try {
        await VultStore.addToBag(checked.value);
        const stillShowing = () => modalProduct && modalProduct.name === product.name;
        if (stillShowing() && !productModal.hidden) closeProductModal();
        showToast(product.name + ' (' + size + ') added to your bag.');
    } catch (e) {
        showToast(product.name + ': ' + e.message, 'error');
    } finally {
        addingProducts.delete(product.name);
        // Only reset the button if it still belongs to this product
        if (modalProduct && modalProduct.name === product.name) {
            addButton.removeAttribute('aria-disabled');
            addButton.textContent = addButton.disabled ? 'Sold out' : 'Add to bag';
        }
    }
}

document.getElementById('modalAdd').addEventListener('click', addToCart);

// With the bar live beside a product, its links leave the product view first
document.querySelector('.bar').addEventListener('click', e => {
    if (e.target.closest('a') && !productModal.hidden) closeProductModal();
});
document.getElementById('modalClose').addEventListener('click', closeProductModal);

productModal.addEventListener('click', e => {
    if (e.target === productModal) closeProductModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && Overlays.isTop(productModal)) closeProductModal();
});
