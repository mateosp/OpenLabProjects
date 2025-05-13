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
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      feedback.textContent = 'Registro exitoso ✅';
      feedback.className = 'text-green-600 text-sm text-center mt-2';
      form.reset();
    } catch (error) {
      feedback.textContent = error.message;
      feedback.className = 'text-red-500 text-sm text-center mt-2';
      setTimeout(()=>{
        feedback.textContent = '';
      }, 3000)
    }
  });
});
