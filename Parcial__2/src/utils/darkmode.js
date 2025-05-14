// Función para obtener el tema actual
function getTheme() {
  // Verificar si hay un tema guardado en localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Si no hay tema guardado, verificar la preferencia del sistema
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

// Función para aplicar el tema
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

// Función para alternar el tema
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButton(isDark);
}

// Función para actualizar el ícono del botón
function updateThemeButton(isDark) {
  const themeButton = document.getElementById('theme-toggle');
  if (!themeButton) return;

  const sunIcon = themeButton.querySelector('.sun-icon');
  const moonIcon = themeButton.querySelector('.moon-icon');

  if (isDark) {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
}

// Inicializar el tema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  // Agregar el botón de tema al navbar si no existe
  const navbar = document.querySelector('nav');
  if (navbar && !document.getElementById('theme-toggle')) {
    const themeButton = document.createElement('button');
    themeButton.id = 'theme-toggle';
    themeButton.className = 'p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2';
    themeButton.innerHTML = `
      <svg class="sun-icon w-5 h-5 text-gray-800 dark:text-gray-200 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg class="moon-icon w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Cambiar tema</span>
    `;
    themeButton.addEventListener('click', toggleTheme);
    
    // Buscar el botón de registro y colocar el botón de tema después de él
    const registerButton = navbar.querySelector('nav-toggle');
    if (registerButton) {
      registerButton.parentNode.insertBefore(themeButton, registerButton.nextSibling);
    } else {
      // Si no se encuentra el botón de registro, insertar al final
      navbar.appendChild(themeButton);
    }

    // Actualizar el ícono inicial
    updateThemeButton(document.documentElement.classList.contains('dark'));
  }
});