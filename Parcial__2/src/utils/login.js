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
      await signInWithEmailAndPassword(auth, email, password);
      feedback.className = 'text-green-600 text-sm text-center mt-2';

      setTimeout(() => {
        window.location.href = '/dashboard';
      });
    } catch (error) {
      feedback.textContent = 'Correo o contraseña incorrecta';
      feedback.className = 'text-red-500 text-sm text-center mt-2';
    }
  });
});
