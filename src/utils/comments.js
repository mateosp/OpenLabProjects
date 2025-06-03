import { db } from './firebase.js';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

// Función para formatear la fecha
function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Función para crear el elemento HTML de un comentario
function createCommentElement(comment) {
  const div = document.createElement('div');
  div.className = 'comment bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm';
  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <p class="font-medium text-gray-900 dark:text-white">${comment.authorEmail}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            ${formatDate(comment.createdAt.toDate())}
          </span>
        </div>
        <p class="mt-1 text-gray-600 dark:text-gray-300">${comment.text}</p>
      </div>
    </div>
  `;
  return div;
}

// Función para mostrar mensaje de estado
function showStatusMessage(element, message, isError = false) {
  element.innerHTML = `
    <div class="text-center ${isError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}">
      ${message}
    </div>
  `;
}

// Función para inicializar los comentarios de un proyecto
export function initializeProjectComments(projectId, commentsListElement) {
  // Mostrar mensaje de carga inicial
  showStatusMessage(commentsListElement, 'Cargando comentarios...');

  try {
    // Configurar query para los comentarios del proyecto
    const commentsQuery = query(
      collection(db, 'comments'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    // Suscribirse a cambios en los comentarios
    const unsubscribe = onSnapshot(commentsQuery, 
      (snapshot) => {
        commentsListElement.innerHTML = '';
        
        if (snapshot.empty) {
          showStatusMessage(commentsListElement, 'No hay comentarios aún. ¡Sé el primero en comentar!');
          return;
        }

        snapshot.forEach((doc) => {
          const comment = { id: doc.id, ...doc.data() };
          const commentElement = createCommentElement(comment);
          commentsListElement.appendChild(commentElement);
        });
      },
      (error) => {
        console.error('Error en los comentarios:', error);
        
        // Verificar si el error es por falta de índice
        if (error.code === 'failed-precondition' && error.message.includes('requires an index')) {
          showStatusMessage(
            commentsListElement,
            'Preparando el sistema de comentarios. Por favor, espera unos minutos...',
            true
          );
        } else {
          showStatusMessage(
            commentsListElement,
            'Error al cargar los comentarios. Por favor, recarga la página.',
            true
          );
        }
      }
    );

    // Retornar función para desuscribirse (limpieza)
    return unsubscribe;
  } catch (error) {
    console.error('Error al inicializar comentarios:', error);
    showStatusMessage(
      commentsListElement,
      'Error al inicializar los comentarios. Por favor, recarga la página.',
      true
    );
  }
} 