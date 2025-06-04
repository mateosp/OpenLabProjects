import { db } from './firebase.js';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
  const projectsGrid = document.getElementById('projects-grid');
  let unsubscribeProjects = null;

  // Mostrar estado de carga
  function showLoading() {
    projectsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Cargando proyectos...</p>
      </div>
    `;
  }

  // Crear tarjeta de proyecto
  function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
    
    // Contenido principal del proyecto
    const mainContent = document.createElement('div');
    mainContent.className = 'p-6';
    mainContent.innerHTML = `
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${project.title}</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-400 flex-grow">${project.description}</p>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium">Autor:</span> 
            <a href="/usuario/${project.authorId}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              ${project.authorEmail}
            </a>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span class="font-medium">Creado:</span> ${project.createdAt?.toDate().toLocaleDateString() || 'N/A'}
          </p>
        </div>
      </div>
    `;
    card.appendChild(mainContent);

    // Sección de comentarios
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section mt-4 border-t border-gray-200 dark:border-gray-700';
    commentsSection.innerHTML = `
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Comentarios</h3>
        
        <!-- Formulario para nuevo comentario -->
        <div class="new-comment-form mb-8">
          <form class="comment-form space-y-4" data-project-id="${project.id}">
            <div>
              <textarea
                class="comment-text w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-indigo-500 resize-none"
                rows="3"
                placeholder="Escribe tu comentario..."
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Publicar comentario
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de comentarios -->
        <div class="comments-list space-y-6" data-project-id="${project.id}">
          <div class="text-center text-gray-500 dark:text-gray-400">
            Cargando comentarios...
          </div>
        </div>
      </div>
    `;
    card.appendChild(commentsSection);

    return card;
  }

  // Mostrar feedback
  function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transition-opacity duration-300`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  try {
    // Configurar query para obtener todos los proyectos ordenados por fecha de creación
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );

    console.log('Configurando listener para todos los proyectos');

    // Suscribirse a cambios en tiempo real
    unsubscribeProjects = onSnapshot(projectsQuery, 
      (snapshot) => {
        console.log('Snapshot recibido, documentos:', snapshot.size);
        projectsGrid.innerHTML = '';

        if (snapshot.empty) {
          console.log('No se encontraron proyectos');
          projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
              <p class="text-gray-500 dark:text-gray-400">No hay proyectos disponibles aún.</p>
            </div>
          `;
          return;
        }

        snapshot.forEach((doc) => {
          console.log('Proyecto encontrado:', doc.id, doc.data());
          const project = { id: doc.id, ...doc.data() };
          const projectCard = createProjectCard(project);
          projectsGrid.appendChild(projectCard);
        });

        // Inicializar los comentarios después de crear las tarjetas
        initializeComments();
      }, 
      (error) => {
        console.error('Error en el listener de proyectos:', error);
        showFeedback('Error al cargar proyectos: ' + error.message, 'error');
        projectsGrid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-red-500">Error al cargar los proyectos. Por favor, recarga la página.</p>
          </div>
        `;
      }
    );
  } catch (error) {
    console.error('Error al inicializar Firestore:', error);
    showFeedback('Error al conectar con la base de datos: ' + error.message, 'error');
    projectsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500">Error al conectar con la base de datos. Por favor, recarga la página.</p>
      </div>
    `;
  }

  // Limpiar listener al desmontar
  window.addEventListener('beforeunload', () => {
    if (unsubscribeProjects) {
      unsubscribeProjects();
    }
  });
});

// Función para inicializar los comentarios
function initializeComments() {
  import('./comments.js').then(module => {
    const { initializeProjectComments } = module;
    document.querySelectorAll('.comments-list').forEach(commentsList => {
      const projectId = commentsList.dataset.projectId;
      initializeProjectComments(projectId, commentsList);
    });

    document.querySelectorAll('.comment-form').forEach(form => {
      const projectId = form.dataset.projectId;
      initializeCommentForm(form, projectId);
    });
  });
}

// Función para inicializar el formulario de comentarios
function initializeCommentForm(form, projectId) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textarea = form.querySelector('.comment-text');
    const text = textarea.value.trim();
    
    if (!text) {
      showFeedback('El comentario no puede estar vacío', 'error');
      return;
    }

    try {
      const { auth, db } = await import('./firebase.js');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      const user = auth.currentUser;
      if (!user) {
        showFeedback('Debes iniciar sesión para comentar', 'error');
        return;
      }

      await addDoc(collection(db, 'comments'), {
        projectId,
        text,
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: serverTimestamp()
      });

      textarea.value = '';
      showFeedback('Comentario publicado exitosamente', 'success');
    } catch (error) {
      console.error('Error al publicar comentario:', error);
      showFeedback('Error al publicar el comentario', 'error');
    }
  });
} 