// Where the store backend and the command center live (see backend/README.md and
// command-center/README.md). On this computer the site uses local copies; anywhere else
// it uses the hosted ones. Leave an address empty to run the site without it.
const HOSTED_BACKEND = '';
const HOSTED_COMMAND_CENTER = '';

const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
window.VULT_STORE = {
    backendUrl: LOCAL ? 'http://localhost:9000' : HOSTED_BACKEND,
    commandCenterUrl: LOCAL ? 'http://localhost:3000' : HOSTED_COMMAND_CENTER
};
