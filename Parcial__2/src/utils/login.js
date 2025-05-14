import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const feedback = document.getElementById('feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      console.log('Intentando iniciar sesión:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sesión iniciada exitosamente:', userCredential.user.uid);
      
      feedback.textContent = 'Iniciando sesión...';
      feedback.className = 'text-green-600 text-sm text-center mt-2';

      // Redirigir al dashboard inmediatamente
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      feedback.textContent = error.code === 'auth/invalid-credential' 
        ? 'Correo o contraseña incorrecta' 
        : 'Error al iniciar sesión';
      feedback.className = 'text-red-500 text-sm text-center mt-2';
    }
  });
});
