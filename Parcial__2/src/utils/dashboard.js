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
  getDoc
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

  // Escuchar cambio de estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      emailDisplay.textContent = `Estás conectado como: ${user.email}`;
      setupProjectsListener();
    } else {
      if (unsubscribeProjects) {
        unsubscribeProjects();
        unsubscribeProjects = null;
      }
      window.location.href = '/login';
    }
  });

  // Configurar listener en tiempo real para proyectos
  function setupProjectsListener() {
    if (!currentUser) return;

    // Limpiar listener anterior si existe
    if (unsubscribeProjects) {
      unsubscribeProjects();
    }

    const projectsQuery = query(
      collection(db, 'projects'),
      where('authorId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    // Suscribirse a cambios en tiempo real
    unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      projectsGrid.innerHTML = '';

      if (snapshot.empty) {
        projectsGrid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No tienes proyectos aún. ¡Crea uno nuevo!</p>
          </div>
        `;
        return;
      }

      snapshot.forEach((doc) => {
        const project = { id: doc.id, ...doc.data() };
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
      });
    }, (error) => {
      console.error('Error al escuchar cambios:', error);
      showFeedback('Error al cargar proyectos', 'error');
    });
  }

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
    const projectId = document.getElementById('project-id').value;
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();

    // Cerrar el modal inmediatamente
    closeModals();

    try {
      if (projectId) {
        // Actualizar proyecto existente
        await updateDoc(doc(db, 'projects', projectId), {
          title,
          description,
          updatedAt: serverTimestamp()
        });
        showFeedback('Proyecto actualizado exitosamente');
      } else {
        // Crear nuevo proyecto
        await addDoc(collection(db, 'projects'), {
          title,
          description,
          authorId: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        showFeedback('Proyecto creado exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      showFeedback('Error al guardar el proyecto', 'error');
    }
  });

  // Manejar eliminación de proyecto
  deleteConfirmBtn.addEventListener('click', async () => {
    const projectId = projectToDelete;
    if (!projectId || !currentUser) return;

    // Cerrar el modal inmediatamente
    closeModals();

    // Eliminar el proyecto de la UI inmediatamente
    const projectElement = document.querySelector(`[data-id="${projectId}"]`)?.closest('.bg-white');
    if (projectElement) {
      projectElement.remove();
    }

    // Si no hay más proyectos, mostrar mensaje
    if (projectsGrid.children.length === 0) {
      projectsGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No tienes proyectos aún. ¡Crea uno nuevo!</p>
        </div>
      `;
    }

    // Realizar la eliminación en Firestore en segundo plano
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
      showFeedback('Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      showFeedback('Error al eliminar el proyecto', 'error');
      // Si hay error, el listener de Firestore restaurará el proyecto
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
