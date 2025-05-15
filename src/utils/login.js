import { auth, googleProvider } from './firebase.js';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const feedback = document.getElementById('feedback');
  const googleLoginBtn = document.getElementById('google-login-btn');

  // Función para manejar el inicio de sesión con Google
  async function handleGoogleLogin() {
    try {
      feedback.textContent = 'Iniciando sesión con Google...';
      feedback.className = 'text-blue-600 text-sm text-center mt-2';
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sesión iniciada exitosamente con Google:', result.user.uid);
      
      feedback.textContent = 'Iniciando sesión...';
      feedback.className = 'text-green-600 text-sm text-center mt-2';

      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      feedback.textContent = 'Error al iniciar sesión con Google: ' + error.message;
      feedback.className = 'text-red-500 text-sm text-center mt-2';
    }
  }

  // Event listener para el botón de Google
  googleLoginBtn.addEventListener('click', handleGoogleLogin);

  // Manejar inicio de sesión con email y contraseña
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

      // Redirigir al dashboard
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
