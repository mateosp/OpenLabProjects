/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_z2-EH3IY.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_9gJ_2bDf.mjs';
export { r as renderers } from '../chunks/internal_BsTt5pTQ.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Mi Perfil" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<main class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pt-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Header --> <div class="flex justify-between items-center mb-8"> <div> <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1> <p id="user-email" class="text-gray-600 dark:text-gray-400">Cargando usuario...</p> </div> <button id="new-project-btn" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path> </svg>\nNuevo Proyecto\n</button> </div> <!-- Projects Grid --> <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Los proyectos se cargar\xE1n din\xE1micamente aqu\xED --> </div> <!-- Modal para crear/editar proyecto --> <div id="project-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center"> <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"> <h2 id="modal-title" class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nuevo Proyecto</h2> <form id="project-form" class="space-y-4"> <input type="hidden" id="project-id"> <div> <label for="project-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">T\xEDtulo</label> <input type="text" id="project-title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"> </div> <div> <label for="project-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripci\xF3n</label> <textarea id="project-description" required rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea> </div> <div class="flex justify-end gap-3"> <button type="button" id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">\nCancelar\n</button> <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">\nGuardar\n</button> </div> </form> </div> </div> <!-- Modal de confirmaci\xF3n para eliminar --> <div id="delete-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center"> <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">\xBFEst\xE1s seguro?</h3> <p class="text-gray-600 dark:text-gray-400 mb-6">Esta acci\xF3n no se puede deshacer.</p> <div class="flex justify-end gap-3"> <button type="button" id="delete-cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">\nCancelar\n</button> <button type="button" id="delete-confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md">\nEliminar\n</button> </div> </div> </div> </div> </main> <script type="module" src="/src/utils/dashboard.js"><\/script> '])), maybeRenderHead()) })}`;
}, "/Users/mateosuarezpaez/Desktop/Proyectos/Parcial-DesarrolloWeb/Parcial-DesarrolloWeb/Parcial__2/src/pages/dashboard.astro", void 0);

const $$file = "/Users/mateosuarezpaez/Desktop/Proyectos/Parcial-DesarrolloWeb/Parcial-DesarrolloWeb/Parcial__2/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
