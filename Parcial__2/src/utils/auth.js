// src/scripts/auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
