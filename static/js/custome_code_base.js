// Al cargar la página, se aplica el tema almacenado en localStorage
document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(storedTheme);
});

// Función para cambiar y aplicar el tema
function setTheme(theme) {
    // Guardamos el tema en localStorage
    localStorage.setItem('theme', theme);

    const body = document.getElementById('body');
    const cont = document.getElementById('#main-content');
    const hour = new Date().getHours();

    // Removemos todas las clases posibles del body
    body.classList.remove('theme-day', 'theme-night', 'theme-auto');
    cont.classList.remove('theme-day', 'theme-night', 'theme-auto');

    if (theme === 'day') {
        body.classList.add('theme-day');  // Aplicamos el tema de día
        cont.classList.add('theme-day');  // Aplicamos el tema de día
    } else if (theme === 'night') {
        body.classList.add('theme-night');  // Aplicamos el tema de noche
        cont.classList.add('theme-day');  // Aplicamos el tema de día
    } else if (theme === 'auto') {
        // Tema automático basado en la hora del día
        if (hour >= 6 && hour < 18) {
            body.classList.add('theme-day');  // Día entre 6am y 6pm
            cont.classList.add('theme-day');  // Aplicamos el tema de día
        } else {
            body.classList.add('theme-night');  // Noche fuera de ese rango
            cont.classList.add('theme-day');  // Aplicamos el tema de día
        }
    }
}

// Escuchar los clics en los botones para cambiar el tema
document.querySelector('.icon-btn[data-theme="day"]').addEventListener('click', () => setTheme('day'));
document.querySelector('.icon-btn[data-theme="night"]').addEventListener('click', () => setTheme('night'));
document.querySelector('.icon-btn[data-theme="auto"]').addEventListener('click', () => setTheme('auto'));

  // Función para actualizar la vista previa de la imagen
  function previewImage(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('image-preview-container');
    const previewImage = document.getElementById('image-preview');
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block'; // Mostrar vista previa
      };
      
      reader.readAsDataURL(file);
    }
  }

  $(document).ready(function() {
    // Crear un ID único basado en el timestamp o cualquier otro criterio único
    $('.myDropzone').each(function(index) {
      var uniqueId = 'myDropzone-' + new Date().getTime() + '-' + index; // Genera un ID único
      $(this).attr('id', uniqueId);  // Asigna el ID único a cada formulario
      
      // Inicializar Dropzone con el ID único
      new Dropzone('#' + uniqueId, {
        // Opciones de Dropzone aquí
        url: "http://big-bang-studio.com/file-upload"
      });
    });
  });
  