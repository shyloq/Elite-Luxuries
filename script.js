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

// Garment drawings, 100x100. FILL is the product's colour; shading, seams and
// stitching are drawn over it in black or white at low opacity, so they work on
// any colour. Tops hang from the rail on a hanger; the cap and tote stand on the floor.
const INK = 'stroke="#111" stroke-width="1.1" stroke-linejoin="round"';
const SEAM = 'fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".7"';
const STITCH = 'fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".5" stroke-dasharray="1.1 1"';
const FOLD = 'fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8" stroke-linecap="round"';
const SHADE = 'fill="#000" fill-opacity=".1"';
const DEEP = 'fill="#000" fill-opacity=".18"';
const LIGHT = 'fill="#fff" fill-opacity=".05"';
const RAIL = '<path d="M-60 1.5 H160" stroke="#2c2d2a" stroke-width="2.4"/><path d="M-60 .6 H160" stroke="#fff" stroke-opacity=".25" stroke-width=".5"/>';
const HANGER = '<path d="M50 2.2 C47.6 2.2 47.4 5.6 50 6.2 V9" fill="none" stroke="#3a3b37" stroke-width="1"/>' +
    '<path d="M27 17.5 L50 9 L73 17.5" fill="none" stroke="#3a3b37" stroke-width="1.6" stroke-linecap="round"/>';
const FLOOR = (rx, cy = 92) => '<ellipse cx="50" cy="' + cy + '" rx="' + rx + '" ry="2.6" fill="#000" fill-opacity=".28"/>';
// Knitted rib: short parallel lines across a band
function rib(x1, y1, x2, y2, len, n, angle = 0) {
    let out = '';
    for (let i = 0; i <= n; i++) {
        const x = x1 + (x2 - x1) * i / n, y = y1 + (y2 - y1) * i / n;
        const dx = Math.sin(angle) * len, dy = Math.cos(angle) * len;
        out += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' l' + dx.toFixed(2) + ' ' + dy.toFixed(2) + ' ';
    }
    return '<path d="' + out + '" fill="none" stroke="#000" stroke-opacity=".28" stroke-width=".45"/>';
}

const GARMENTS = {
    tee: RAIL + HANGER +
        '<path d="M35 15 L21 20 L7 35 L18 45 L26 39 L26 90 Q50 92 74 90 L74 39 L82 45 L93 35 L79 20 L65 15 C61 22 39 22 35 15 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M26 39 L26 90 Q30 90.4 33 90.5 L32 41 Z" ' + SHADE + '/><path d="M74 39 L74 90 Q70 90.4 67 90.5 L68 41 Z" ' + DEEP + '/>' +
        '<path d="M7 35 L18 45 L20 43 L10 33 Z" ' + SHADE + '/><path d="M93 35 L82 45 L80 43 L90 33 Z" ' + DEEP + '/>' +
        '<ellipse cx="50" cy="42" rx="6" ry="13" ' + LIGHT + '/>' +
        '<path d="M35 15 C39 22 61 22 65 15 L63 16 C59 24.5 41 24.5 37 16 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M37.5 17.5 C41.5 25 58.5 25 62.5 17.5" ' + STITCH + '/>' +
        '<path d="M26 39 C27 31 26 25 22.5 20.5 M74 39 C73 31 74 25 77.5 20.5" ' + SEAM + '/>' +
        '<path d="M9.6 36.6 L19.6 44 M90.4 36.6 L80.4 44 M26.3 86.6 Q50 88.6 73.7 86.6" ' + STITCH + '/>' +
        '<path d="M40 58 Q43 72 40.5 88 M61 52 Q58 68 61.5 88 M33 30 Q38 33 41 31" ' + FOLD + '/>',
    hoodie: RAIL + HANGER +
        '<path d="M36 17 C35 5 65 5 64 17 L80 23 Q88 38 94 58 L84 62 Q79 50 75 43 L75 85 L25 85 L25 43 Q21 50 16 62 L6 58 Q12 38 20 23 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M25 43 L25 85 L32 85 L31 45 Z" ' + SHADE + '/><path d="M75 43 L75 85 L68 85 L69 45 Z" ' + DEEP + '/>' +
        '<path d="M6 58 Q12 38 20 23 L22 26 Q15 41 10 59.5 Z" ' + SHADE + '/><path d="M94 58 Q88 38 80 23 L78 26 Q85 41 90 59.5 Z" ' + DEEP + '/>' +
        '<ellipse cx="50" cy="44" rx="8" ry="12" ' + LIGHT + '/>' +
        '<path d="M37.5 17 C38.5 29 61.5 29 62.5 17 C61 23 39 23 37.5 17 Z" fill="#000" fill-opacity=".45" ' + INK + '/>' +
        '<path d="M36 17 C37 25 63 25 64 17" ' + STITCH + '/>' +
        '<path d="M36 17 L25 43 M64 17 L75 43" ' + SEAM + '/>' +
        '<path d="M46 25.5 Q45.6 33 45 40 M54 25.5 Q54.4 33 55 41" fill="none" stroke="#efece4" stroke-width="1.1" stroke-linecap="round"/>' +
        '<path d="M44.4 40 h1.4 v3 h-1.4 z M54.3 41 h1.4 v3 h-1.4 z" fill="#c8c4b8" stroke="#111" stroke-width=".4"/>' +
        '<path d="M34 58 L66 58 L70 77 L30 77 Z" fill="FILL" ' + INK + '/><path d="M34 58 L30 77 L33 77 L36.5 58 Z M66 58 L70 77 L67 77 L63.5 58 Z" ' + DEEP + '/>' +
        '<path d="M34.8 59.2 L65.2 59.2 M30.9 75.8 L69.1 75.8" ' + STITCH + '/>' +
        '<path d="M25 85 L75 85 L75 92 Q50 93.5 25 92 Z" fill="FILL" ' + INK + '/>' + rib(26.5, 85.6, 73.5, 85.6, 6.2, 22) +
        '<path d="M6 58 L16 62 L14.4 67 L4.4 63 Z M94 58 L84 62 L85.6 67 L95.6 63 Z" fill="FILL" ' + INK + '/>' +
        rib(6.6, 59, 15.4, 62.6, 4, 5, -0.36) + rib(93.4, 59, 84.6, 62.6, 4, 5, 0.36) +
        '<path d="M42 64 Q45 70 43 76 M58 47 Q56 52 59 57 M30 30 Q34 33 37 31" ' + FOLD + '/>',
    cargo: '<path d="M30 1.5 H70" stroke="#2c2d2a" stroke-width="2"/><path d="M33 1.5 V8.5 M67 1.5 V8.5" stroke="#3a3b37" stroke-width="1.2"/>' +
        '<path d="M31.5 6.5 h3 v3.5 h-3 z M65.5 6.5 h3 v3.5 h-3 z" fill="#4a4b47"/>' +
        '<path d="M27 8 L73 8 L78 90 L57 90 L50 32 L43 90 L22 90 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M50 32 L43 90 L47.5 90 L51 37 Z" ' + DEEP + '/><path d="M50 32 L57 90 L60 90 L52 33 Z" ' + SHADE + '/>' +
        '<path d="M27 8 L22 90 L25 90 L29.5 9 Z" ' + SHADE + '/><path d="M73 8 L78 90 L75 90 L70.5 9 Z" ' + DEEP + '/>' +
        '<path d="M27 8 L73 8 L73.4 14 L26.6 14 Z" fill="FILL" ' + INK + '/><path d="M27.2 12.6 L72.8 12.6" ' + STITCH + '/>' +
        '<path d="M31 7.3 h2.2 v7.6 h-2.2 z M41 7.3 h2.2 v7.6 h-2.2 z M56.8 7.3 h2.2 v7.6 h-2.2 z M66.8 7.3 h2.2 v7.6 h-2.2 z" fill="FILL" stroke="#111" stroke-width=".5"/>' +
        '<circle cx="50" cy="11" r="1.3" fill="#2a2a28"/>' +
        '<path d="M50 14 V31" ' + SEAM + '/><path d="M53.2 14 V27 Q53.2 30.5 50 31.5" ' + STITCH + '/>' +
        '<path d="M28 15 Q35 17 37 26 M72 15 Q65 17 63 26" ' + SEAM + '/>' +
        '<path d="M23.4 46 L35 46 L35.6 65 L24.3 65 Z M76.6 46 L65 46 L64.4 65 L75.7 65 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M24.2 47.6 L34.3 47.6 M75.8 47.6 L65.7 47.6" ' + STITCH + '/>' +
        '<path d="M23.1 43.6 L35.3 43.6 L35.4 49.2 L23.4 49.2 Z M76.9 43.6 L64.7 43.6 L64.6 49.2 L76.6 49.2 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M23.4 49.2 L35.4 49.2 L35.5 50.6 L23.5 50.6 Z M76.6 49.2 L64.6 49.2 L64.5 50.6 L76.5 50.6 Z" ' + DEEP + '/>' +
        '<circle cx="29.3" cy="47.4" r=".9" fill="#2a2a28"/><circle cx="70.7" cy="47.4" r=".9" fill="#2a2a28"/>' +
        '<path d="M22.4 86.6 L42.6 86.6 M57.4 86.6 L77.6 86.6" ' + STITCH + '/>' +
        '<path d="M26 70 Q32 72 39 69 M61 69 Q68 72 74 70 M27 76 Q33 77 40 75 M60 75 Q67 77 73 76 M36 20 Q38 26 37 31" ' + FOLD + '/>',
    jacket: RAIL + HANGER +
        '<path d="M36 12 L20 18 L8 64 L20 66 L26 44 L26 90 L74 90 L74 44 L80 66 L92 64 L80 18 L64 12 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M26 44 L26 90 L32 90 L31 46 Z" ' + SHADE + '/><path d="M74 44 L74 90 L68 90 L69 46 Z" ' + DEEP + '/>' +
        '<path d="M8 64 L20 18 L22 21 L11 64.5 Z" ' + SHADE + '/><path d="M92 64 L80 18 L78 21 L89 64.5 Z" ' + DEEP + '/>' +
        '<path d="M41 12 Q50 15 59 12 L50 22 Z" fill="#000" fill-opacity=".4"/>' +
        '<path d="M41 12 L32.5 21 L47 31 L50 22 Z M59 12 L67.5 21 L53 31 L50 22 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M34.2 21 L46.4 29.4 M65.8 21 L53.6 29.4" ' + STITCH + '/>' +
        '<path d="M50 31 V90" ' + SEAM + '/><path d="M47.8 31 V88" ' + STITCH + '/>' +
        '<circle cx="52.6" cy="38" r="1.35" fill="#2a2a28"/><circle cx="52.6" cy="50" r="1.35" fill="#2a2a28"/><circle cx="52.6" cy="62" r="1.35" fill="#2a2a28"/><circle cx="52.6" cy="74" r="1.35" fill="#2a2a28"/>' +
        '<path d="M31 40 L43 40 L43 52 L31 52 Z M57 40 L69 40 L69 52 L57 52 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M30.4 37.8 L43.6 37.8 L43.6 42.6 L30.4 42.6 Z M56.4 37.8 L69.6 37.8 L69.6 42.6 L56.4 42.6 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M30.4 42.6 L43.6 42.6 L43.6 44 L30.4 44 Z M56.4 42.6 L69.6 42.6 L69.6 44 L56.4 44 Z" ' + DEEP + '/>' +
        '<path d="M30 62 L45 62 L45 79 L30 79 Z M55 62 L70 62 L70 79 L55 79 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M31 63.4 L44 63.4 M56 63.4 L69 63.4 M26.3 87 L73.7 87" ' + STITCH + '/>' +
        '<path d="M8 64 L20 66 L19.3 70.4 L7.1 68.4 Z M92 64 L80 66 L80.7 70.4 L92.9 68.4 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M26 44 Q25 30 21 19 M74 44 Q75 30 79 19" ' + SEAM + '/>' +
        '<path d="M37 55 Q39 58 38 61 M63 55 Q61 58 62 61 M14 40 Q16 44 15 49" ' + FOLD + '/>',
    cap: FLOOR(38, 72.5) +
        '<path d="M16 62 C16 30 84 30 84 62 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M16 62 C16 46 22 38 30 34 C24 42 22 52 23 62 Z" ' + SHADE + '/><path d="M30 40 Q40 34 50 33 Q43 40 39 52 Z" ' + LIGHT + '/>' +
        '<path d="M50 31 Q41 45 39 62 M50 31 Q62 44 66 62" ' + SEAM + '/>' +
        '<path d="M51.8 33 Q43.6 46 41.6 61 M48.2 33 Q60 45 63.8 61" ' + STITCH + '/>' +
        '<circle cx="31" cy="46" r="1.1" fill="#000" fill-opacity=".55"/><circle cx="68" cy="45" r="1.1" fill="#000" fill-opacity=".55"/>' +
        '<path d="M16 62 C17 59 83 59 84 62 Z" ' + DEEP + '/>' +
        '<path d="M50 62 L96 62 C96 72 70 74 50 70 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M53 64.2 L93.5 64.2 M53 66.4 C66 68.2 82 68.4 92.5 66.4" ' + STITCH + '/>' +
        '<path d="M50 70 C70 74 96 72 96 62 L96 64.5 C94 73 70 76 50 72 Z" fill="#000" fill-opacity=".35"/>' +
        '<circle cx="50" cy="31" r="2.4" fill="FILL" ' + INK + '/>' +
        '<path d="M14.6 54.5 h4.4 v5.4 h-4.4 z" fill="#b08d3c" stroke="#111" stroke-width=".5"/>',
    tote: FLOOR(36, 91) +
        '<path d="M34 33 C34 7 46 7 46 33 M54 33 C54 7 66 7 66 33" fill="none" stroke="#111" stroke-width="4.6"/>' +
        '<path d="M34 33 C34 7 46 7 46 33 M54 33 C54 7 66 7 66 33" fill="none" stroke="FILL" stroke-width="2.8"/>' +
        '<path d="M34 33 C34 9 46 9 46 33 M54 33 C54 9 66 9 66 33" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".9"/>' +
        '<path d="M20 32 L80 32 L82 90 L18 90 Z" fill="FILL" ' + INK + '/>' +
        '<path d="M20 32 L18 90 L23 90 L24 32 Z" ' + SHADE + '/><path d="M80 32 L82 90 L77 90 L76 32 Z" ' + DEEP + '/>' +
        '<path d="M18 90 L82 90 L81.6 86 L18.4 86 Z" fill="#000" fill-opacity=".12"/>' +
        '<path d="M31.8 32.6 h5 v7 h-5 z M43.2 32.6 h5 v7 h-5 z M51.8 32.6 h5 v7 h-5 z M63.2 32.6 h5 v7 h-5 z" ' + STITCH + '/>' +
        '<path d="M20.4 36.4 L79.6 36.4 M21 88 L79 88" ' + STITCH + '/>' +
        '<path d="M34 44 Q36 52 33 60 M68 48 Q66 56 69 64" ' + FOLD + '/>' +
        '<text x="50" y="68" text-anchor="middle" font-family="Archivo Variable, Arial, sans-serif" font-weight="900" font-stretch="125%" font-size="12.5" fill="#111" fill-opacity=".86">VULT</text>'
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
