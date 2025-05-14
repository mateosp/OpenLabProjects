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
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg';
    card.innerHTML = `
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${project.title}</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-400 flex-grow">${project.description}</p>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium">Autor:</span> ${project.authorEmail}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span class="font-medium">Creado:</span> ${project.createdAt?.toDate().toLocaleDateString() || 'N/A'}
          </p>
        </div>
      </div>
    `;

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