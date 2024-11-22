Dropzone.autoDiscover = false; 

$(document).ready(function() {


  // Inicializar Dropzone para la galería (solo galería)
  var myDropzone = new Dropzone("#myDropzone", {
    url: "/galery", // URL para la galería
    maxFiles: 6, // Permitir hasta 6 archivos
    maxFilesize: 5, // Tamaño máximo de archivo en MB
    acceptedFiles: "image/*", // Solo imágenes
    addRemoveLinks: true, // Permite eliminar archivos
    paramName: "file", // Nombre del parámetro del archivo para el backend

    init: function() {
      // Evento cuando se añade un archivo a la cola
      this.on("addedfile", function(file) {
        console.log("Archivo añadido:", file);
      });

      // Evento cuando se elimina un archivo
      this.on("removedfile", function(file) {
        console.log("Archivo eliminado:", file);
      });
    },

    sending: function(file, xhr, formData) {
      // Puedes agregar datos adicionales antes de la carga aquí
    },

    success: function(file, response) {
      // Mostrar notificación de éxito con Toastr
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-bottom-right",  
        timeOut: 10000 // Duración del Toast
      };

      $('#myDropzone')[0].reset();  // Limpiar el formulario
      toastr.success('Imagen subida con éxito: ' + response.filename);

      // Recargar las imágenes del carrusel después de subir una nueva
      loadImages();
    },

    error: function(file, response) {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-bottom-right",  
        timeOut: 10000 // Duración del Toast
      };

      toastr.error('Error al subir el archivo: ' + response);
    }
  });

    // Función para cargar las imágenes en el carrusel
    function loadImages() {
        $.ajax({
            url: '/galery',
            type: "GET",
            success: function(response) {
                // Generar el HTML para el carrusel
                var carouselHTML = '';

                // Iterar sobre los datos recibidos
                if (response["datos"] && response["datos"].length > 0) {
                    response["datos"].forEach(function(item) {
                        // Generar cada item del carrusel con el formato proporcionado
                        carouselHTML += `
                            <div class="col-md-4">
                                <div class="col-md-12 col-sm-6">
                                <div class="catalog-products">
                                    <div class="c-product">
                                    <a class="cp-img" style="background-image: url(${item['image_name']})" href="#">
                                    </a>
                                    <div class="cp-content">
                                        <button type="button" class="btn btn-outline-primary delete-btn" data-image="${item['image_name']}">Eliminar</button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    carouselHTML = '<div class="text-center text-light">No hay imágenes disponibles</div>';
                }

                // Insertar el HTML generado en el contenedor del carrusel
                document.querySelector('#image_generative').innerHTML = carouselHTML;
            },
            error: function() {
                // Manejo del error en caso de que la solicitud falle
                document.querySelector('#image_generative').innerHTML = '<div class="text-center text-light">Error al cargar las imágenes</div>';
            }
        });
    }

    // Función para manejar la eliminación de imagen
    $(document).on('click', '.delete-btn', function() {
        var imageName = $(this).data('image');  // Obtener el nombre de la imagen desde el atributo del botón

        // Asignar el nombre de la imagen al campo oculto del formulario de eliminación
        $('#id_img_delete #imgdelete').val(imageName);

        // Mostrar el modal de confirmación
        $('#dangerModal').modal('show');
    });

    // Función para manejar el envío del formulario de eliminación
    $('#id_img_delete').on('submit', function(event) {
        event.preventDefault();  // Evitar el envío tradicional del formulario

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario
            type: 'POST',
            data: formData,
            contentType: false,  // Necesario para enviar archivos
            processData: false,  // Necesario para enviar archivos
            success: function(response) {
                // Verificar si la respuesta contiene el mensaje
                if (response && response.message) {
                    // Mostrar notificación de éxito con Toastr
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        positionClass: "toast-bottom-right",
                        timeOut: 10000
                    };
                    toastr.success('Imagen Eliminada');

                    // Limpiar el formulario y cerrar el modal
                    $('#dangerModal').modal('hide');  // Cerrar el modal
                    $('#id_img_delete')[0].reset();  // Limpiar el formulario

                    // Recargar el carrusel con los nuevos datos
                    loadImages();  // Llamar a la función que carga los artículos
                } else {
                    toastr.error('Hubo un problema con la respuesta del servidor.');
                }
            },
            error: function(xhr, status, error) {
                console.log("Error al eliminar la imagen:", xhr.responseText);
                // Mostrar notificación de error con Toastr
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    positionClass: "toast-bottom-right",
                    timeOut: 10000
                };
                toastr.error('Hubo un problema con la solicitud. ' + xhr.responseText);
            }
        });
    });

    // Llamar a la función para cargar las imágenes al iniciar la página
    loadImages();
});