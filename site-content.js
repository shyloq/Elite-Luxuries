// The store's editable text and layout, and the Next drop countdown and waitlist, from the
// command center (command-center/). store-config.js says where it is. Without it, or if
// it does not answer, the page keeps the text written in index.html.
(function siteContent() {
    const base = ((window.VULT_STORE || {}).commandCenterUrl || '').replace(/\/$/, '');
    if (!base) return;

    const next = document.getElementById('next');
    let launchAt = null;
    let countdownTimer = 0;

    function setText(key, value) {
        if (typeof value !== 'string' || !value) return;
        document.querySelectorAll('[data-content="' + key + '"]').forEach(el => { el.textContent = value; });
    }

    function applyContent(c) {
        ['statement', 'heroButton', 'dropTitle', 'nextTitle', 'nextNote', 'infoTitle', 'infoLede'].forEach(k => setText(k, c[k]));

        const announce = document.getElementById('announce');
        announce.textContent = c.announcement || '';
        announce.hidden = !c.announcement;

        if (Array.isArray(c.infoRows)) {
            const list = document.getElementById('infoRows');
            list.replaceChildren(...c.infoRows.map(row => {
                const item = document.createElement('div');
                item.className = 'log-row';
                const dt = document.createElement('dt');
                dt.textContent = row.label;
                const dd = document.createElement('dd');
                dd.textContent = row.value;
                item.append(dt, dd);
                return item;
            }));
        }

        // Sections after the opening camera, in the owner's order; hidden ones leave the page
        const layout = c.layout || {};
        const main = document.querySelector('main');
        (layout.order || []).forEach(id => {
            const section = document.getElementById(id);
            if (section) main.appendChild(section);
        });
        ['drop', 'info'].forEach(id => { document.getElementById(id).hidden = (layout.hidden || []).includes(id); });
        next.hidden = (layout.hidden || []).includes('next');
        document.querySelectorAll('a[href="#drop"]').forEach(a => { a.hidden = (layout.hidden || []).includes('drop'); });
        document.querySelectorAll('a[href="#info"]').forEach(a => { a.hidden = (layout.hidden || []).includes('info'); });

        if (layout.mainFeed && typeof setMainFeed === 'function') setMainFeed(layout.mainFeed);
    }

    const pad = n => String(n).padStart(2, '0');
    function tick() {
        const out = document.getElementById('nextCountdown');
        if (!launchAt) { out.textContent = 'Date to be announced'; return; }
        const left = Math.max(0, Math.floor((launchAt - Date.now()) / 1000));
        if (!left) { out.textContent = 'Open now'; clearInterval(countdownTimer); return; }
        const d = Math.floor(left / 86400), h = Math.floor(left % 86400 / 3600), m = Math.floor(left % 3600 / 60), s = left % 60;
        out.textContent = pad(d) + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's';
        out.setAttribute('aria-label', d + ' days, ' + h + ' hours, ' + m + ' minutes to go');
    }

    function applyLaunch(launch) {
        document.getElementById('nextName').textContent = (launch && launch.name) || '';
        launchAt = launch && launch.launch_at ? Date.parse(launch.launch_at) : null;
        tick();
        clearInterval(countdownTimer);
        if (launchAt && launchAt > Date.now()) countdownTimer = setInterval(tick, 1000);
    }

    fetch(base + '/api/site')
        .then(res => (res.ok ? res.json() : Promise.reject(new Error('status ' + res.status))))
        .then(data => {
            applyContent(data.content || {});
            applyLaunch(data.launch);
        })
        .catch(e => console.warn('VULT command center unavailable; keeping the built-in text.', e));

    // Waitlist sign-up from the store
    const form = document.getElementById('waitlistForm');
    const status = document.getElementById('waitlistStatus');
    const submit = document.getElementById('waitlistSubmit');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = form.email.value.trim();
        if (!form.reportValidity()) return;
        submit.disabled = true;
        status.textContent = 'Joining...';
        try {
            const res = await fetch(base + '/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'store', company: form.company.value })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || 'The waitlist is unavailable. Try again soon.');
            form.reset();
            status.textContent = "You're on the list. We'll email you before the vault opens.";
        } catch (err) {
            status.textContent = err.message === 'Failed to fetch' ? 'The waitlist is unavailable. Try again soon.' : err.message;
            form.email.focus();
        } finally {
            submit.disabled = false;
        }
    });
})();
