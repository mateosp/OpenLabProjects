/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_z2-EH3IY.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_9gJ_2bDf.mjs';
export { r as renderers } from '../chunks/internal_BsTt5pTQ.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<main class="min-h-[calc(100vh-64px)] flex items-center justify-center "> <div class="dark:bg-slate-800  p-8 rounded-2xl shadow-xl w-full max-w-sm"> <h1 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Iniciar Sesi\xF3n</h1> <form id="login-form" class="space-y-4"> <div> <label for="email" class="block mb-1 text-gray-700 dark:text-white">Correo electr\xF3nico</label> <input type="email" id="email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"> </div> <div> <label for="password" class="block mb-1 text-gray-700 dark:text-white">Contrase\xF1a</label> <input type="password" id="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"> </div> <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition dark:text-white">\nIniciar sesi\xF3n\n</button> <p id="feedback" class="text-sm text-center mt-2"></p> <p class="text-center text-sm mt-4 text-gray-600 dark:text-white">\n\xBFNo tienes cuenta?\n<a href="/register" class="text-blue-500 hover:underline">Registrarse</a> </p> </form> </div> </main> <script type="module" src="/src/utils/login.js"><\/script> '])), maybeRenderHead()) })}`;
}, "/Users/mateosuarezpaez/Desktop/Proyectos/Parcial-DesarrolloWeb/Parcial-DesarrolloWeb/Parcial__2/src/pages/login.astro", void 0);

const $$file = "/Users/mateosuarezpaez/Desktop/Proyectos/Parcial-DesarrolloWeb/Parcial-DesarrolloWeb/Parcial__2/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
