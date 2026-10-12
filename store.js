// Connects the site to the Medusa backend in backend/: live products and stock,
// the bag, and checkout. Settings come from store-config.js, which the backend's
// seed script writes. Without it, the shop keeps the built-in product list.
const VultStore = (() => {
    const config = window.VULT_STORE || {};
    const CART_KEY = 'vult-cart-id';
    const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];

    // 'loading' until the store answers, then 'connected' or 'offline'
    let state = config.backendUrl && config.publishableKey ? 'loading' : 'offline';
    let connected = false;
    let region = null;
    let cart = null;
    const COLOR = /^#[0-9a-f]{3,8}$/i;

    const els = {
        button: document.getElementById('bagButton'),
        count: document.getElementById('bagCount'),
        scrim: document.getElementById('bagScrim'),
        drawer: document.getElementById('bagDrawer'),
        close: document.getElementById('bagClose'),
        view: document.getElementById('bagView'),
        items: document.getElementById('bagItems'),
        subtotal: document.getElementById('bagSubtotal'),
        checkout: document.getElementById('bagCheckout'),
        note: document.getElementById('bagNote'),
        form: document.getElementById('checkoutForm'),
        back: document.getElementById('checkoutBack'),
        submit: document.getElementById('checkoutSubmit'),
        error: document.getElementById('checkoutError'),
        done: document.getElementById('orderDone'),
        doneText: document.getElementById('orderDoneText'),
        doneTotals: document.getElementById('orderDoneTotals'),
        doneClose: document.getElementById('orderDoneClose')
    };

    async function api(path, { method = 'GET', body } = {}) {
        const res = await fetch(config.backendUrl.replace(/\/$/, '') + path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': config.publishableKey
            },
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data.message || 'The store did not respond (' + res.status + ').');
            error.status = res.status;
            throw error;
        }
        return data;
    }

    function money(amount) {
        const value = Number(amount) || 0;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: (region && region.currency_code || 'usd').toUpperCase(),
            minimumFractionDigits: Number.isInteger(value) ? 0 : 2
        }).format(value);
    }

    function sizeRank(size) {
        const i = SIZE_ORDER.indexOf(size);
        return i >= 0 ? i : 100 + (parseFloat(size) || 0);
    }

    function readCartId() {
        try { return localStorage.getItem(CART_KEY); } catch (e) { return null; }
    }

    function writeCartId(id) {
        try {
            if (id) localStorage.setItem(CART_KEY, id); else localStorage.removeItem(CART_KEY);
        } catch (e) {}
    }

    // Medusa product -> the shape the shop grid and product pop-up use
    function toShopProduct(p) {
        const meta = p.metadata || {};
        const variants = (p.variants || [])
            .map(v => ({
                id: v.id,
                size: v.title,
                price: v.calculated_price ? v.calculated_price.calculated_amount : null,
                inStock: v.manage_inventory === false || (v.inventory_quantity || 0) > 0
            }))
            .sort((a, b) => sizeRank(a.size) - sizeRank(b.size));
        const prices = variants.map(v => v.price).filter(n => n !== null);
        const all = p.variants || [];
        const tracked = all.filter(v => v.manage_inventory !== false);
        return {
            id: p.id,
            name: p.title,
            description: p.description || '',
            price: prices.length ? money(Math.min(...prices)) : '',
            shape: GARMENTS[meta.shape] ? meta.shape : 'tee',
            color: COLOR.test(meta.color || '') ? meta.color : '#d9d9d9',
            position: Number(meta.position) || 0,
            run: Number(meta.run) || null,
            // Units left across sizes, straight from stock; unknown (null) when any size is not tracked
            left: all.length && tracked.length === all.length
                ? tracked.reduce((n, v) => n + Math.max(0, v.inventory_quantity || 0), 0)
                : null,
            variants,
            soldOut: variants.length > 0 && variants.every(v => !v.inStock)
        };
    }

    async function loadProducts() {
        const params = new URLSearchParams({
            region_id: region.id,
            limit: '100',
            fields: '+metadata,*variants.calculated_price,+variants.inventory_quantity'
        });
        const { products } = await api('/store/products?' + params);
        PRODUCTS = products.map(toShopProduct).sort((a, b) => a.position - b.position);
        renderShop();
    }

    async function loadCart() {
        const id = readCartId();
        if (!id) return;
        try {
            const data = await api('/store/carts/' + id);
            cart = data.cart.completed_at ? null : data.cart;
        } catch (e) {
            cart = null;
        }
        if (!cart) writeCartId(null);
    }

    async function ensureCart() {
        if (cart) return cart;
        const data = await api('/store/carts', { method: 'POST', body: { region_id: region.id } });
        cart = data.cart;
        writeCartId(cart.id);
        return cart;
    }

    function friendlyError(error) {
        if (/inventory/i.test(error.message)) return 'Not enough left in that size.';
        return error.message;
    }

    async function addToBag(variantId) {
        await ensureCart();
        try {
            const data = await api('/store/carts/' + cart.id + '/line-items', {
                method: 'POST',
                body: { variant_id: variantId, quantity: 1 }
            });
            cart = data.cart;
        } catch (e) {
            throw new Error(friendlyError(e));
        }
        renderBag();
    }

    // Quantity clicks queue up: rapid clicks add to the pending target instead of
    // each sending the quantity from the last render.
    const pendingQty = new Map();
    let qtyQueue = Promise.resolve();

    function changeQuantity(lineId, current, step) {
        const base = pendingQty.has(lineId) ? pendingQty.get(lineId) : current;
        const next = Math.max(0, base + step);
        pendingQty.set(lineId, next);
        const shown = els.items.querySelector('[data-line="' + lineId + '"] .bag-qty span');
        if (shown) shown.textContent = next;
        qtyQueue = qtyQueue.then(() => setQuantity(lineId, next, step));
    }

    async function setQuantity(lineId, quantity, step) {
        if (pendingQty.get(lineId) !== quantity) return; // a later click replaced this one
        els.note.textContent = '';
        try {
            const path = '/store/carts/' + cart.id + '/line-items/' + lineId;
            const data = quantity > 0
                ? await api(path, { method: 'POST', body: { quantity } })
                : await api(path, { method: 'DELETE' });
            cart = data.cart || data.parent;
        } catch (e) {
            els.note.textContent = friendlyError(e);
        }
        if (pendingQty.get(lineId) !== quantity) return; // more clicks arrived; their request renders
        pendingQty.delete(lineId);
        const focusInBag = els.drawer.contains(document.activeElement) || document.activeElement === document.body;
        renderBag();
        if (focusInBag && !els.drawer.hidden) {
            // The row's buttons were rebuilt; keep the shopper's place
            const same = els.items.querySelector('[data-line="' + lineId + '"] [data-step="' + step + '"]');
            (same || (els.checkout.disabled ? els.close : els.checkout)).focus();
        }
    }

    function renderBag() {
        const items = (cart && cart.items) || [];
        const count = items.reduce((n, item) => n + item.quantity, 0);
        els.count.textContent = count;
        els.subtotal.textContent = money(cart ? cart.item_total : 0);
        els.checkout.disabled = !connected || count === 0;

        els.items.innerHTML = '';
        if (state === 'loading') {
            els.items.innerHTML = '<p class="bag-empty">Opening the vault. One moment.</p>';
            return;
        }
        if (!connected) {
            els.items.innerHTML = '<p class="bag-empty">The store is offline right now, so the bag is unavailable.</p>';
            return;
        }
        if (count === 0) {
            els.items.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
            return;
        }
        items
            .slice()
            .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
            .forEach(item => {
                const product = PRODUCTS.find(p => p.id === item.product_id);
                const row = document.createElement('div');
                row.className = 'bag-item';
                row.dataset.line = item.id;
                row.innerHTML =
                    '<div class="bag-thumb">' + (product ? productArt(product) : '') + '</div>' +
                    '<div class="bag-meta"><span class="bag-name"></span><span class="bag-variant"></span></div>' +
                    '<div class="bag-qty">' +
                        '<button type="button" data-step="-1" aria-label="Remove one"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7 H12"/></svg></button>' +
                        '<span></span>' +
                        '<button type="button" data-step="1" aria-label="Add one"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7 H12 M7 2 V12"/></svg></button>' +
                    '</div>';
                row.querySelector('.bag-name').textContent = item.product_title;
                row.querySelector('.bag-variant').textContent = 'Size ' + item.variant_title + ' · ' + money(item.unit_price);
                row.querySelector('.bag-qty span').textContent = item.quantity;
                row.querySelectorAll('[data-step]').forEach(btn => {
                    btn.addEventListener('click', () => changeQuantity(item.id, item.quantity, Number(btn.dataset.step)));
                });
                els.items.appendChild(row);
            });
    }

    // Switching panels moves focus into the panel that is now showing
    function showPanel(name, moveFocus = true) {
        els.view.hidden = name !== 'bag';
        els.form.hidden = name !== 'checkout';
        els.done.hidden = name !== 'done';
        if (!moveFocus) return;
        if (name === 'bag') (els.checkout.disabled ? els.close : els.checkout).focus();
        if (name === 'checkout') els.form.querySelector('input').focus();
        if (name === 'done') els.doneClose.focus();
    }

    function openBag() {
        document.querySelectorAll('.store-toast').forEach(t => t.remove());
        showPanel('bag', false);
        renderBag();
        els.drawer.hidden = false;
        els.scrim.hidden = false;
        Overlays.open(els.drawer);
        els.close.focus();
    }

    function closeBag() {
        els.drawer.hidden = true;
        els.scrim.hidden = true;
        Overlays.close(els.drawer);
        els.button.focus();
    }

    async function placeOrder(event) {
        event.preventDefault();
        // A field of spaces is an empty field
        els.form.querySelectorAll('input').forEach(input => { input.value = input.value.trim(); });
        if (!els.form.reportValidity()) return;
        const f = Object.fromEntries(new FormData(els.form));
        const address = {
            first_name: f.first_name,
            last_name: f.last_name,
            address_1: f.address_1,
            city: f.city,
            province: f.province,
            postal_code: f.postal_code,
            country_code: 'us'
        };
        els.error.textContent = '';
        els.submit.disabled = true;
        els.submit.textContent = 'Placing order...';
        try {
            const id = cart.id;
            await api('/store/carts/' + id, {
                method: 'POST',
                body: { email: f.email, shipping_address: address, billing_address: address }
            });
            const { shipping_options } = await api('/store/shipping-options?cart_id=' + id);
            if (!shipping_options.length) throw new Error('We can’t ship to that address yet.');
            await api('/store/carts/' + id + '/shipping-methods', {
                method: 'POST',
                body: { option_id: shipping_options[0].id }
            });
            const { payment_collection } = await api('/store/payment-collections', {
                method: 'POST',
                body: { cart_id: id }
            });
            await api('/store/payment-collections/' + payment_collection.id + '/payment-sessions', {
                method: 'POST',
                body: { provider_id: 'pp_system_default' }
            });
            const result = await api('/store/carts/' + id + '/complete', { method: 'POST' });
            if (result.type !== 'order') {
                throw new Error((result.error && result.error.message) || 'The order could not be placed.');
            }

            const order = result.order;
            cart = null;
            writeCartId(null);
            renderBag();
            els.doneText.textContent = 'Order #' + order.display_id + ' is placed under ' + order.email + '.';
            els.doneTotals.innerHTML = '';
            [['Items', order.item_total], ['Shipping', order.shipping_total], ['Total', order.total]].forEach(([label, value]) => {
                const row = document.createElement('div');
                row.className = 'bag-row';
                row.innerHTML = '<span></span><span></span>';
                row.children[0].textContent = label;
                row.children[1].textContent = value === 0 && label === 'Shipping' ? 'Free' : money(value);
                els.doneTotals.appendChild(row);
            });
            els.form.reset();
            showPanel('done');
            loadProducts().catch(() => {});
        } catch (e) {
            els.error.textContent = friendlyError(e);
        } finally {
            els.submit.disabled = false;
            els.submit.textContent = 'Place order';
        }
    }

    els.button.addEventListener('click', openBag);
    els.close.addEventListener('click', closeBag);
    els.scrim.addEventListener('click', closeBag);
    els.doneClose.addEventListener('click', closeBag);
    els.checkout.addEventListener('click', () => showPanel('checkout'));
    els.back.addEventListener('click', () => showPanel('bag'));
    els.form.addEventListener('submit', placeOrder);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && Overlays.isTop(els.drawer)) closeBag();
    });

    async function init() {
        renderBag();
        if (state === 'offline') return;
        try {
            const { regions } = await api('/store/regions');
            region = regions[0];
            if (!region) throw new Error('The store has no region set up.');
            await loadProducts();
            connected = true;
            state = 'connected';
            await loadCart();
        } catch (e) {
            connected = false;
            state = 'offline';
            console.warn('VULT store backend unavailable; showing the built-in product list.', e);
        }
        renderBag();
    }

    init();

    return {
        get connected() { return connected; },
        get state() { return state; },
        addToBag,
        openBag
    };
})();
