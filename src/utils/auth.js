// src/scripts/auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const feedback = document.getElementById('feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      console.log('Intentando crear usuario:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario creado exitosamente:', userCredential.user.uid);
      
      feedback.textContent = 'Usuario creado exitosamente';
      feedback.className = 'text-green-600 text-sm text-center mt-2';
      form.reset();

      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      feedback.textContent = error.code === 'auth/email-already-in-use' 
        ? 'Este correo ya ha sido registrado' 
        : 'Error al crear la cuenta';
      feedback.className = 'text-red-500 text-sm text-center mt-2';
      setTimeout(() => {
        feedback.textContent = '';
      }, 3000);
    }
  });
});

// Función para actualizar la UI según el estado de autenticación
function updateAuthUI(user) {
  const authButtons = document.getElementById('auth-buttons');
  const userButtons = document.getElementById('user-buttons');
  const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
  const mobileUserButtons = document.getElementById('mobile-user-buttons');

  if (user) {
    // Usuario autenticado
    authButtons?.classList.add('hidden');
    userButtons?.classList.remove('hidden');
    mobileAuthButtons?.classList.add('hidden');
    mobileUserButtons?.classList.remove('hidden');
  } else {
    // Usuario no autenticado
    authButtons?.classList.remove('hidden');
    userButtons?.classList.add('hidden');
    mobileAuthButtons?.classList.remove('hidden');
    mobileUserButtons?.classList.add('hidden');
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
