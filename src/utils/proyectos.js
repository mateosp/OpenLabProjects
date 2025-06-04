import { db, auth } from './firebase.js';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc, runTransaction, getDocs, where } from 'firebase/firestore';

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
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <button class="like-btn ${project.likes?.includes(auth.currentUser?.uid) ? 'text-green-500' : 'text-gray-400'}" data-project-id="${project.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <span class="likes-count text-sm font-medium text-gray-600 dark:text-gray-400">${project.likes?.length || 0}</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="dislike-btn ${project.dislikes?.includes(auth.currentUser?.uid) ? 'text-red-500' : 'text-gray-400'}" data-project-id="${project.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 0v2a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
              <span class="dislikes-count text-sm font-medium text-gray-600 dark:text-gray-400">${project.dislikes?.length || 0}</span>
            </div>
          </div>
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

    // Agregar event listeners para likes/dislikes
    const likeBtn = mainContent.querySelector('.like-btn');
    const dislikeBtn = mainContent.querySelector('.dislike-btn');

    likeBtn.addEventListener('click', () => handleLike(project.id));
    dislikeBtn.addEventListener('click', () => handleDislike(project.id));

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
      const { collection, addDoc, serverTimestamp, doc, updateDoc, increment, runTransaction } = await import('firebase/firestore');

      const user = auth.currentUser;
      if (!user) {
        showFeedback('Debes iniciar sesión para comentar', 'error');
        return;
      }

      await runTransaction(db, async (transaction) => {
        // Crear el comentario
        await addDoc(collection(db, 'comments'), {
          projectId,
          text,
          authorId: user.uid,
          authorEmail: user.email,
          createdAt: serverTimestamp()
        });

        // Actualizar puntos del usuario
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(2)
        });
      });

      textarea.value = '';
      showFeedback('Comentario publicado exitosamente', 'success');
    } catch (error) {
      console.error('Error al publicar comentario:', error);
      showFeedback('Error al publicar el comentario', 'error');
    }
  });
}

// Función para recalcular puntos del usuario
async function recalculateUserPoints(userId) {
  try {
    // Obtener todos los proyectos del usuario
    const projectsQuery = query(
      collection(db, 'projects'),
      where('authorId', '==', userId)
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    
    let totalPoints = 0;
    
    // Puntos base por proyectos creados
    totalPoints += projectsSnapshot.size; // +1 por cada proyecto

    // Sumar likes y restar dislikes de cada proyecto
    for (const projectDoc of projectsSnapshot.docs) {
      const projectData = projectDoc.data();
      totalPoints += (projectData.likes?.length || 0); // +1 por cada like
      totalPoints -= (projectData.dislikes?.length || 0); // -1 por cada dislike
    }

    // Actualizar puntos del usuario
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      points: totalPoints
    });

    return totalPoints;
  } catch (error) {
    console.error('Error al recalcular puntos:', error);
    throw error;
  }
}

// Manejar likes
async function handleLike(projectId) {
  if (!auth.currentUser) {
    showFeedback('Debes iniciar sesión para dar like', 'error');
    return;
  }

  try {
    const userId = auth.currentUser.uid;
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Proyecto no encontrado');
    }

    const projectData = projectDoc.data();
    const hasLiked = projectData.likes?.includes(userId);
    const authorId = projectData.authorId;

    await runTransaction(db, async (transaction) => {
      if (hasLiked) {
        // Quitar like
        await updateDoc(projectRef, {
          likes: arrayRemove(userId)
        });
      } else {
        // Agregar like y quitar dislike si existe
        await updateDoc(projectRef, {
          likes: arrayUnion(userId),
          dislikes: arrayRemove(userId)
        });
      }
      
      // Recalcular puntos del autor
      await recalculateUserPoints(authorId);
    });

    showFeedback(hasLiked ? 'Like removido' : 'Like agregado');
  } catch (error) {
    console.error('Error al manejar like:', error);
    showFeedback('Error al procesar like', 'error');
  }
}

// Manejar dislikes
async function handleDislike(projectId) {
  if (!auth.currentUser) {
    showFeedback('Debes iniciar sesión para dar dislike', 'error');
    return;
  }

  try {
    const userId = auth.currentUser.uid;
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Proyecto no encontrado');
    }

    const projectData = projectDoc.data();
    const hasDisliked = projectData.dislikes?.includes(userId);
    const authorId = projectData.authorId;

    await runTransaction(db, async (transaction) => {
      if (hasDisliked) {
        // Quitar dislike
        await updateDoc(projectRef, {
          dislikes: arrayRemove(userId)
        });
      } else {
        // Agregar dislike y quitar like si existe
        await updateDoc(projectRef, {
          dislikes: arrayUnion(userId),
          likes: arrayRemove(userId)
        });
      }
      
      // Recalcular puntos del autor
      await recalculateUserPoints(authorId);
    });

    showFeedback(hasDisliked ? 'Dislike removido' : 'Dislike agregado');
  } catch (error) {
    console.error('Error al manejar dislike:', error);
    showFeedback('Error al procesar dislike', 'error');
  }
} 