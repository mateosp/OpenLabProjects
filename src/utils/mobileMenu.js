// Función para inicializar el menú móvil
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMenuButton = document.getElementById('close-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenu || !mobileMenuButton || !closeMenuButton) {
    console.warn('Elementos del menú móvil no encontrados');
    return;
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;
    
    mobileMenu.classList.toggle('hidden');
    document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
  }

  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  closeMenuButton.addEventListener('click', toggleMobileMenu);

  // Cerrar el menú al hacer clic fuera
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      toggleMobileMenu();
    }
  });

  // Cerrar el menú al cambiar el tamaño de la ventana a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      toggleMobileMenu();
    }
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initMobileMenu); 