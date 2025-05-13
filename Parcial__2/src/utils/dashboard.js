// dashboard.js
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
  const emailDisplay = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');

  // Escuchar cambio de estado
  onAuthStateChanged(auth, (user) => {
    if (user) {
      emailDisplay.textContent = `Estás conectado como: ${user.email}`;
    } else {
      // Solo redirige si ya se completó el DOM y no estamos en proceso de logout
      if (!window._loggingOut) {
        window.location.href = '/login';
      }
    }
  });

  // Logout con bandera de control
  logoutBtn.addEventListener('click', async () => {
    window._loggingOut = true; // Evita el loop de redirección
    await signOut(auth);
    window.location.href = '/login';
  });
});
