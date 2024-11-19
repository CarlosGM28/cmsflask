function previewImage(event) {
    const output = document.getElementById('image-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById('image-preview-container').style.display = 'block';
}

// Función AJAX para enviar el formulario sin recargar la página
$(document).ready(function () {
    $('form').on('submit', function (event) {
        event.preventDefault();  // Evitar que el formulario se envíe de manera tradicional

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario (en este caso, 'upload_article')
            type: 'POST',
            data: formData,
            contentType: false,  // Necesario para enviar archivos
            processData: false,  // Necesario para enviar archivos
            success: function (response) {
                // Verificar si la respuesta contiene el mensaje y nombre de archivo
                if (response && response.message) {
                    // Mostrar notificación de éxito con Toastr
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        positionClass: "toast-bottom-right",
                        timeOut: 10000
                    };
                    toastr.success('Articulo Registrado');

                    // Limpiar el formulario y cerrar el modal
                    $('#otherModal1').modal('hide');  // Cerrar el modal
                    $('form')[0].reset();  // Limpiar el formulario
                    $('#image-preview-container').hide();  // Ocultar la vista previa
                } else {
                    toastr.error('Hubo un problema con la respuesta del servidor.');
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


function loadCarouselImages() {
    $.ajax({
        url: '/upload-article',  // Ruta para obtener los artículos
        type: "GET",
        success: function (response) {
            const $carouselContainer = $('#article_gerative');

            // Limpiar el contenido previo
            $carouselContainer.empty();

            // Comprobar si hay productos para agregar
            if (response["datos"] && response["datos"].length > 0) {
                // Iterar sobre los datos recibidos y agregar los productos
                response["datos"].forEach(function (item) {
                    const imageSrc = item.imagen_articulo;  // Usar 'imagen_articulo' para la URL de la imagen
                    const nombreArticulo = item.nombre_articulo;
                    const descripcionArticulo = item.descripcion_articulo;
                    const precioArticulo = item.precio_articulo;

                    const carouselItem = `
                        <div class="panel-body">
                            <div class="product">
                                <div class="row">
                                    <div class="col-sm-5">
                                        <div class="p-images m-b-30 m-sm-b-0">
                                            <div class="m-b-20">
                                                    <img src="${imageSrc}" alt="${nombreArticulo}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-7">
                                        <div class="p-title">
                                            <h3 class="m-y-0">${nombreArticulo}</h3>
                                        </div>
                                        <div class="p-price">
                                            <span class="pp-price-current m-r-5">$${precioArticulo}</span>
                                        </div>
                                        <div class="p-text">
                                            <p>${descripcionArticulo}</p>
                                        </div>
                                        <hr>
                                        <div class="p-cart">
                                            <button type="button" class="btn btn-primary btn-labeled">Editar
                                                <span class="btn-label btn-label-right p-x-10">
                                                    <i class="zmdi zmdi-arrow-right"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    // Agregar el item al contenedor
                    $carouselContainer.append(carouselItem);
                });
            } else {
                $carouselContainer.append('<p>No se encontraron productos.</p>'); // Mensaje si no hay productos
            }
        },
        error: function () {
            alert("Error al cargar los productos.");
        }
    });
}

// Llamar a la función para cargar las imágenes
loadCarouselImages();
