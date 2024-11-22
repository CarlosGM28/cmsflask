// Función para abreviar el nombre del archivo si es muy largo
function abreviarNombreArchivo(nombre, maxLength) {
    if (nombre.length > maxLength) {
        // Mostrar el inicio y el final del nombre del archivo con puntos suspensivos en el medio
        const inicio = nombre.substring(0, Math.floor(maxLength / 2));
        const final = nombre.substring(nombre.length - Math.floor(maxLength / 2));
        return `${inicio}...${final}`;
    }
    return nombre;
}

// Función para previsualizar el video seleccionado
function previewVideo(event) {
    var file = event.target.files[0];
    var fileURL = URL.createObjectURL(file);

    // Mostrar el video en el iframe
    var videoPreview = document.getElementById('videoPreview');
    videoPreview.src = fileURL;
    videoPreview.style.display = 'block';

    // Mostrar el nombre del archivo seleccionado (abreviado si es muy largo)
    var fileNameLabel = document.getElementById('fileName');
    fileNameLabel.textContent = abreviarNombreArchivo(file.name, 30);  // Aquí puedes ajustar el límite (30 caracteres)

    // Mostrar el botón para guardar el video
    document.getElementById('saveVideoButton').style.display = 'inline-block';
}

  
  $(document).ready(function () {
    // Manejo del evento submit del formulario
    $('#videoUploadForm').on('submit', function (event) {
        event.preventDefault();  // Evitar envío tradicional del formulario

        var formData = new FormData(this);  // Crear FormData con los datos del formulario

        $.ajax({
            url: '/upload_video',  // URL del endpoint en el backend
            type: 'POST',
            data: formData,
            contentType: false,  // Necesario para enviar archivos
            processData: false,  // Necesario para enviar archivos
            success: function (response) {
                // Verificar si la respuesta contiene el mensaje
                if (response && response.message) {
                    // Mostrar notificación de éxito con Toastr
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        positionClass: "toast-bottom-right",
                        timeOut: 10000
                    };
                    toastr.success(response.message);

                    // Limpiar el formulario después de la subida
                    $('#videoUploadForm')[0].reset();
                    $('#fileName').text('Ningún archivo seleccionado');
                    $('#videoPreview').attr('src', '').css('display', 'none');
                }
            },
            error: function (xhr, status, error) {
                console.log("Error al subir el archivo:", xhr.responseText);
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
});


$(document).ready(function() {
    $.ajax({
        url: '/upload_video',
        type: "GET",
        success: function(response) {
            // Generar el HTML para el carrusel
            var carouselHTML = '';

            // Iterar sobre los datos recibidos
            if (response["datos"] && response["datos"].length > 0) {
                response["datos"].forEach(function(item) {
                    // Generar cada item del carrusel con el formato proporcionado
                    carouselHTML += `
                        <div class="col-md-6">
                            <div class="col-md-12 col-sm-6">
                            <video controls style="width: 100%; height: 400px;">
                                <source src="${item['video_name']}" type="video/mp4">
                                Tu navegador no soporta la etiqueta de video.
                            </video>
                                <div class="cp-content">
                                    <button type="button" class="btn btn-outline-primary">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                carouselHTML = '<div class="text-center text-light">No hay imágenes disponibles</div>';
            }

            // Insertar el HTML generado en el contenedor del carrusel
            document.querySelector('#videogerate').innerHTML = carouselHTML;
        },
        error: function() {
            // Manejo del error en caso de que la solicitud falle
            document.querySelector('#videogerate').innerHTML = '<div class="text-center text-light">Error al cargar las imágenes</div>';
        }
    });
});