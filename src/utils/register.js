import { auth, googleProvider } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const feedback = document.getElementById('feedback');
  const googleRegisterBtn = document.getElementById('google-register-btn');

  // Función para manejar el registro con Google
  async function handleGoogleRegister() {
    try {
      feedback.textContent = 'Registrando con Google...';
      feedback.className = 'text-blue-600 text-sm text-center mt-2';
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Registro exitoso con Google:', result.user.uid);
      
      feedback.textContent = 'Registro exitoso...';
      feedback.className = 'text-green-600 text-sm text-center mt-2';

      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error al registrar con Google:', error);
      feedback.textContent = 'Error al registrar con Google: ' + error.message;
      feedback.className = 'text-red-500 text-sm text-center mt-2';
    }
  }

  // Event listener para el botón de Google
  googleRegisterBtn.addEventListener('click', handleGoogleRegister);

  // Manejar registro con email y contraseña
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      feedback.textContent = 'Las contraseñas no coinciden';
      feedback.className = 'text-red-500 text-sm text-center mt-2';
      return;
    }

    try {
      console.log('Intentando registrar usuario:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario registrado exitosamente:', userCredential.user.uid);
      
      feedback.textContent = 'Registro exitoso...';
      feedback.className = 'text-green-600 text-sm text-center mt-2';

      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error al registrar:', error);
      feedback.textContent = error.code === 'auth/email-already-in-use'
        ? 'Este correo electrónico ya está registrado'
        : 'Error al registrar: ' + error.message;
      feedback.className = 'text-red-500 text-sm text-center mt-2';
    }
  });
}); 