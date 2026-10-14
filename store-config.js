// Where the store backend lives (see backend/README.md). On this computer the
// site uses the backend at localhost:9000; anywhere else it uses the hosted one.
// Leave HOSTED_BACKEND empty to run the site without a store.
const HOSTED_BACKEND = '';

window.VULT_STORE = {
    backendUrl: /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:9000' : HOSTED_BACKEND
};
