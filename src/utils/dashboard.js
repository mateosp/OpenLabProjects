// dashboard.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  onSnapshot,
  orderBy,
  getDoc,
  runTransaction,
  increment
} from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
  const emailDisplay = document.getElementById('user-email');
  const projectsGrid = document.getElementById('projects-grid');
  const newProjectBtn = document.getElementById('new-project-btn');
  const projectModal = document.getElementById('project-modal');
  const projectForm = document.getElementById('project-form');
  const modalTitle = document.getElementById('modal-title');
  const cancelBtn = document.getElementById('cancel-btn');
  const deleteModal = document.getElementById('delete-modal');
  const deleteCancelBtn = document.getElementById('delete-cancel-btn');
  const deleteConfirmBtn = document.getElementById('delete-confirm-btn');

  let currentUser = null;
  let projectToDelete = null;
  let unsubscribeProjects = null;

  // Mostrar estado de carga
  function showLoading() {
    projectsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Cargando proyectos...</p>
      </div>
    `;
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

  // Escuchar cambio de estado de autenticación
  onAuthStateChanged(auth, async (user) => {
    console.log('Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'No hay usuario');
    
    if (user) {
      currentUser = user;
      console.log('Usuario actual:', user.email, 'UID:', user.uid);
      emailDisplay.textContent = `Estás conectado como: ${user.email}`;
      
      // Recalcular puntos del usuario al iniciar sesión
      try {
        await recalculateUserPoints(user.uid);
      } catch (error) {
        console.error('Error al recalcular puntos iniciales:', error);
      }

      showLoading();

      try {
        // Verificar la conexión con Firestore y el token de autenticación
        console.log('Verificando token de autenticación...');
        const token = await user.getIdToken();
        console.log('Token de autenticación válido');

        // Verificar la conexión con Firestore
        console.log('Intentando conectar con Firestore...');
        const testQuery = query(collection(db, 'projects'));
        const testSnapshot = await getDocs(testQuery);
        console.log('Conexión con Firestore establecida');

        // Configurar listener para los proyectos del usuario actual
        const projectsQuery = query(
          collection(db, 'projects'),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        console.log('Configurando listener para proyectos de:', user.uid);

        // Limpiar listener anterior si existe
        if (unsubscribeProjects) {
          console.log('Limpiando listener anterior');
          unsubscribeProjects();
        }

        // Suscribirse a cambios en tiempo real
        unsubscribeProjects = onSnapshot(projectsQuery, 
          (snapshot) => {
            console.log('Snapshot recibido, documentos:', snapshot.size);
            projectsGrid.innerHTML = '';

            if (snapshot.empty) {
              console.log('No se encontraron proyectos');
              projectsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                  <p class="text-gray-500 dark:text-gray-400">No tienes proyectos aún. ¡Crea uno nuevo!</p>
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
          }, 
          (error) => {
            console.error('Error en el listener de proyectos:', error);
            if (error.code === 'permission-denied') {
              console.error('Error de permisos en Firestore');
              showFeedback('Error de permisos al acceder a los proyectos', 'error');
            } else if (error.code === 'unauthenticated') {
              console.error('Usuario no autenticado');
              showFeedback('Sesión expirada, por favor inicia sesión nuevamente', 'error');
              setTimeout(() => {
                window.location.href = '/login';
              }, 2000);
            } else {
              showFeedback('Error al cargar proyectos: ' + error.message, 'error');
            }
          }
        );
      } catch (error) {
        console.error('Error al inicializar Firestore:', error);
        if (error.code === 'permission-denied') {
          showFeedback('No tienes permisos para acceder a los proyectos', 'error');
        } else if (error.code === 'unauthenticated') {
          showFeedback('Sesión expirada, por favor inicia sesión nuevamente', 'error');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          showFeedback('Error al conectar con la base de datos: ' + error.message, 'error');
        }
        projectsGrid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-red-500">Error al conectar con la base de datos. Por favor, recarga la página.</p>
          </div>
        `;
      }
    } else {
      console.log('No hay usuario autenticado, redirigiendo a login');
      if (unsubscribeProjects) {
        console.log('Limpiando listener de proyectos');
        unsubscribeProjects();
        unsubscribeProjects = null;
      }
      window.location.href = '/login';
    }
  });

  // Crear tarjeta de proyecto
  function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg';
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${project.title}</h3>
        <div class="flex gap-2">
          <button class="edit-btn text-blue-500 hover:text-blue-600 transition-colors" data-id="${project.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button class="delete-btn text-red-500 hover:text-red-600 transition-colors" data-id="${project.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-400">${project.description}</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-4">
        Creado: ${project.createdAt?.toDate().toLocaleDateString() || 'N/A'}
      </p>
    `;

    // Agregar event listeners para los botones
    card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(project));
    card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(project.id));

    return card;
  }

  // Abrir modal para nuevo proyecto
  function openNewModal() {
    modalTitle.textContent = 'Nuevo Proyecto';
    projectForm.reset();
    document.getElementById('project-id').value = '';
    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex');
  }

  // Abrir modal para editar proyecto
  function openEditModal(project) {
    modalTitle.textContent = 'Editar Proyecto';
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-description').value = project.description;
    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex');
  }

  // Abrir modal de confirmación para eliminar
  function openDeleteModal(projectId) {
    if (!projectId) {
      console.error('No se proporcionó un ID de proyecto válido');
      return;
    }
    projectToDelete = projectId;
    console.log('Proyecto a eliminar:', projectToDelete); // Debug log
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
  }

  // Cerrar modales
  function closeModals() {
    projectModal.classList.add('hidden');
    projectModal.classList.remove('flex');
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    // No reseteamos projectToDelete aquí para evitar problemas de timing
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

  // Event Listeners
  newProjectBtn.addEventListener('click', openNewModal);
  cancelBtn.addEventListener('click', closeModals);
  deleteCancelBtn.addEventListener('click', closeModals);

  // Manejar envío del formulario
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      console.error('Intento de crear proyecto sin usuario autenticado');
      showFeedback('Error: Sesión no válida', 'error');
      return;
    }

    const projectId = document.getElementById('project-id').value;
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();

    console.log('Intentando guardar proyecto:', { projectId, title, description, userId: currentUser.uid });

    // Cerrar el modal inmediatamente
    closeModals();

    try {
      if (projectId) {
        // Actualizar proyecto existente
        console.log('Actualizando proyecto existente:', projectId);
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
          title,
          description,
          updatedAt: serverTimestamp()
        });
        console.log('Proyecto actualizado exitosamente');
        showFeedback('Proyecto actualizado exitosamente');
      } else {
        // Crear nuevo proyecto
        console.log('Creando nuevo proyecto');
        const newProject = {
          title,
          description,
          authorId: currentUser.uid,
          authorEmail: currentUser.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          likes: [],
          dislikes: []
        };
        
        await runTransaction(db, async (transaction) => {
          // Crear el proyecto
          const docRef = await addDoc(collection(db, 'projects'), newProject);
          
          // Recalcular puntos del usuario
          await recalculateUserPoints(currentUser.uid);
        });

        console.log('Proyecto creado exitosamente');
        showFeedback('Proyecto creado exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      showFeedback('Error al guardar el proyecto: ' + error.message, 'error');
    }
  });

  // Manejar eliminación de proyecto
  deleteConfirmBtn.addEventListener('click', async () => {
    if (!projectToDelete || !currentUser) {
      console.error('No hay proyecto seleccionado o usuario no autenticado');
      showFeedback('Error: No se puede eliminar el proyecto', 'error');
      return;
    }

    try {
      console.log('Intentando eliminar proyecto:', projectToDelete);
      
      // Verificar que el proyecto existe y pertenece al usuario
      const projectRef = doc(db, 'projects', projectToDelete);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('El proyecto no existe');
      }

      const projectData = projectDoc.data();
      if (projectData.authorId !== currentUser.uid) {
        throw new Error('No tienes permisos para eliminar este proyecto');
      }

      // Eliminar el proyecto
      await deleteDoc(projectRef);
      console.log('Proyecto eliminado exitosamente');
      showFeedback('Proyecto eliminado exitosamente');
      closeModals();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      showFeedback('Error al eliminar el proyecto: ' + error.message, 'error');
    }
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === projectModal || e.target === deleteModal) {
      closeModals();
    }
  });

  // Limpiar listener al desmontar
  window.addEventListener('beforeunload', () => {
    if (unsubscribeProjects) {
      unsubscribeProjects();
    }
  });
});
