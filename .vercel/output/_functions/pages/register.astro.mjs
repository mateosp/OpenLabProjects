/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CZqtZvMq.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Cf_WO8_Y.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Registro" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<main class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pt-20"> <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"> <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Crear una cuenta</h1> <form id="register-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electr\xF3nico</label> <input type="email" id="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"> </div> <div> <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contrase\xF1a</label> <input type="password" id="password" required minlength="6" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"> <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">La contrase\xF1a debe tener al menos 6 caracteres</p> </div> <div> <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contrase\xF1a</label> <input type="password" id="confirm-password" required minlength="6" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"> </div> <div> <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">\nRegistrarse\n</button> </div> </form> <div class="mt-6"> <div class="relative"> <div class="absolute inset-0 flex items-center"> <div class="w-full border-t border-gray-300 dark:border-gray-600"></div> </div> <div class="relative flex justify-center text-sm"> <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">O contin\xFAa con</span> </div> </div> <div class="mt-6"> <button id="google-register-btn" type="button" class="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> <svg class="w-5 h-5" viewBox="0 0 24 24"> <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path> <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path> <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path> <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path> </svg>\nContinuar con Google\n</button> </div> </div> <p id="feedback" class="mt-4 text-sm text-center"></p> <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">\n\xBFYa tienes una cuenta?\n<a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">\nInicia sesi\xF3n aqu\xED\n</a> </p> </div> </div> </main> <script type="module" src="/src/utils/register.js"><\/script> '])), maybeRenderHead()) })}`;
}, "/Users/mateosuarezpaez/Desktop/Proyectos/OpenLab/OpenLabProjects/src/pages/register.astro", void 0);

const $$file = "/Users/mateosuarezpaez/Desktop/Proyectos/OpenLab/OpenLabProjects/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
