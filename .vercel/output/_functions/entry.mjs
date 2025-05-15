import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_L1RAE56A.mjs';
import { manifest } from './manifest_BKyGKbRk.mjs';

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
    "middlewareSecret": "c64c096f-2747-48d0-a77d-0e2bfe38bb57",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
