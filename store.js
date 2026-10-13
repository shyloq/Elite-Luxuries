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

    // One cart per shopper: adds that overlap share the same creation request
    let cartRequest = null;
    async function ensureCart() {
        if (cart) return cart;
        if (!cartRequest) {
            cartRequest = api('/store/carts', { method: 'POST', body: { region_id: region.id } })
                .then(data => {
                    cart = data.cart;
                    writeCartId(cart.id);
                    return cart;
                })
                .finally(() => { cartRequest = null; });
        }
        return cartRequest;
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

    function lineQuantity(lineId) {
        const line = cart && cart.items.find(i => i.id === lineId);
        return line ? line.quantity : 0;
    }

    function changeQuantity(lineId, step) {
        const base = pendingQty.has(lineId) ? pendingQty.get(lineId) : lineQuantity(lineId);
        const next = Math.max(0, base + step);
        pendingQty.set(lineId, next);
        const shown = els.items.querySelector('[data-line="' + lineId + '"] .bag-qty span');
        if (shown) shown.textContent = next;
        qtyQueue = qtyQueue.then(() => setQuantity(lineId, next));
    }

    async function setQuantity(lineId, quantity) {
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
        // Rows update in place, so focus only needs a new home when its row was removed
        const focusedRow = document.activeElement.closest('[data-line]');
        renderBag();
        if (focusedRow && !document.contains(focusedRow) && !els.drawer.hidden) {
            (els.checkout.disabled ? els.close : els.checkout).focus({ preventScroll: true });
        }
    }

    function showBagMessage(text) {
        const message = document.createElement('p');
        message.className = 'bag-empty';
        message.textContent = text;
        els.items.replaceChildren(message);
    }

    // A row is built once per line; later renders update it in place, so a button the
    // shopper is pressing or has focused is never swapped out underneath them.
    function bagRow(lineId) {
        const row = document.createElement('div');
        row.className = 'bag-item';
        row.dataset.line = lineId;
        row.innerHTML =
            '<div class="bag-thumb"></div>' +
            '<div class="bag-meta"><span class="bag-name"></span><span class="bag-variant"></span></div>' +
            '<div class="bag-qty">' +
                '<button type="button" data-step="-1" aria-label="Remove one"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7 H12"/></svg></button>' +
                '<span></span>' +
                '<button type="button" data-step="1" aria-label="Add one"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7 H12 M7 2 V12"/></svg></button>' +
            '</div>';
        row.querySelectorAll('[data-step]').forEach(btn => {
            btn.addEventListener('click', () => changeQuantity(lineId, Number(btn.dataset.step)));
        });
        return row;
    }

    function renderBag() {
        const items = (cart && cart.items) || [];
        const count = items.reduce((n, item) => n + item.quantity, 0);
        els.count.textContent = count;
        els.subtotal.textContent = money(cart ? cart.item_total : 0);
        els.checkout.disabled = !connected || count === 0;

        if (state === 'loading') return showBagMessage('Opening the vault. One moment.');
        if (!connected) return showBagMessage('The store is offline right now, so the bag is unavailable.');
        if (count === 0) return showBagMessage('Your bag is empty.');

        const lines = items.slice().sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
        const keep = new Set(lines.map(item => item.id));
        [...els.items.children].forEach(node => {
            if (!node.dataset.line || !keep.has(node.dataset.line)) node.remove();
        });
        lines.forEach((item, index) => {
            let row = [...els.items.children].find(node => node.dataset.line === item.id);
            if (!row) row = bagRow(item.id);
            const thumb = row.querySelector('.bag-thumb');
            const product = PRODUCTS.find(p => p.id === item.product_id);
            if (!thumb.firstChild && product) thumb.innerHTML = productArt(product);
            row.querySelector('.bag-name').textContent = item.product_title;
            row.querySelector('.bag-variant').textContent = 'Size ' + item.variant_title + ' · ' + money(item.unit_price);
            row.querySelector('.bag-qty span').textContent =
                pendingQty.has(item.id) ? pendingQty.get(item.id) : item.quantity;
            // Only move a row when it is out of place; moving a node drops focus and clicks
            if (els.items.children[index] !== row) els.items.insertBefore(row, els.items.children[index] || null);
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
        els.note.textContent = '';
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
        els.button.focus({ preventScroll: true });
    }

    let placing = false;

    async function placeOrder(event) {
        event.preventDefault();
        if (placing) return;
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
        // aria-disabled rather than disabled: a disabled button drops keyboard focus
        placing = true;
        els.submit.setAttribute('aria-disabled', 'true');
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
            // The email keeps its own case inside the upper-case confirmation
            els.doneText.textContent = 'Order #' + order.display_id + ' is placed under ';
            const email = document.createElement('span');
            email.className = 'bag-email';
            email.textContent = order.email;
            els.doneText.append(email, '.');
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
            placing = false;
            els.submit.removeAttribute('aria-disabled');
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
            // Restore a returning shopper's bag before anything can be added to it
            await loadCart();
            connected = true;
            state = 'connected';
            document.querySelectorAll('.store-toast--loading').forEach(t => t.remove());
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
