/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CZqtZvMq.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Cf_WO8_Y.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Proyectos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Proyectos" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<main class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pt-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Proyectos</h1> <p class="mt-2 text-gray-600 dark:text-gray-400">Explora los proyectos creados por nuestra comunidad</p> </div> <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <div class="col-span-full text-center py-12"> <p class="text-gray-500 dark:text-gray-400">Cargando proyectos...</p> </div> </div> </div> </main> <script type="module" src="/src/utils/proyectos.js"><\/script> '])), maybeRenderHead()) })}`;
}, "/Users/mateosuarezpaez/Desktop/Proyectos/OpenLab/OpenLabProjects/src/pages/proyectos.astro", void 0);

const $$file = "/Users/mateosuarezpaez/Desktop/Proyectos/OpenLab/OpenLabProjects/src/pages/proyectos.astro";
const $$url = "/proyectos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Proyectos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
