// src/scripts/auth.js
import { auth } from './firebase.js';
import { signOut } from 'firebase/auth';

// Función para actualizar la UI según el estado de autenticación
function updateAuthUI(user) {
  const authButtons = document.getElementById('auth-buttons');
  const userButtons = document.getElementById('user-buttons');
  const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
  const mobileUserButtons = document.getElementById('mobile-user-buttons');
  const mainNavLinks = document.getElementById('main-nav-links');
  const mobileMainNavLinks = document.getElementById('mobile-main-nav-links');

  if (user) {
    // Usuario autenticado
    authButtons?.classList.add('hidden');
    userButtons?.classList.remove('hidden');
    mobileAuthButtons?.classList.add('hidden');
    mobileUserButtons?.classList.remove('hidden');
    mainNavLinks?.classList.remove('hidden');
    mainNavLinks?.classList.add('flex');
    mobileMainNavLinks?.classList.remove('hidden');
  } else {
    // Usuario no autenticado
    authButtons?.classList.remove('hidden');
    userButtons?.classList.add('hidden');
    mobileAuthButtons?.classList.remove('hidden');
    mobileUserButtons?.classList.add('hidden');
    mainNavLinks?.classList.remove('flex');
    mainNavLinks?.classList.add('hidden');
    mobileMainNavLinks?.classList.add('hidden');
  }
}

// Función para manejar el cierre de sesión
async function handleLogout() {
  try {
    await signOut(auth);
    window.location.href = '/';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Por favor, intente nuevamente.');
  }
}

// Escuchar cambios en el estado de autenticación
auth.onAuthStateChanged((user) => {
  updateAuthUI(user);
});

// Agregar event listeners para los botones de cierre de sesión
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout-button');
  const mobileLogoutButton = document.getElementById('mobile-logout-button');

  logoutButton?.addEventListener('click', handleLogout);
  mobileLogoutButton?.addEventListener('click', handleLogout);
});
