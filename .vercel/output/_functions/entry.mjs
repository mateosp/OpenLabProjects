import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BYY5laPq.mjs';
import { manifest } from './manifest_0itUw6Pj.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/dashboard.astro.mjs');
const _page2 = () => import('./pages/explorar.astro.mjs');
const _page3 = () => import('./pages/login.astro.mjs');
const _page4 = () => import('./pages/perfil.astro.mjs');
const _page5 = () => import('./pages/proyectos.astro.mjs');
const _page6 = () => import('./pages/register.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/dashboard.astro", _page1],
    ["src/pages/explorar.astro", _page2],
    ["src/pages/login.astro", _page3],
    ["src/pages/perfil.astro", _page4],
    ["src/pages/proyectos.astro", _page5],
    ["src/pages/register.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "150a02b0-c451-487a-94c3-03559ae1000a",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
