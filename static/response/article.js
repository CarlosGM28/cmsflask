function previewImage(event) {
    const output = document.getElementById('image-preview-article');  // El ID debe coincidir con el del HTML
    output.src = URL.createObjectURL(event.target.files[0]);  // Asignar la imagen cargada

    // Mostrar el contenedor de vista previa
    document.getElementById('image-preview-container-article').style.display = 'block';  // Mostrar el contenedor de la imagen
}

// Archivo: articleManagement.js

$(document).ready(function () {
    // Función para registrar un artículo mediante AJAX
    $('#saveArticleForm').on('submit', function (event) {
        event.preventDefault();  // Evitar el envío tradicional del formulario

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario
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
                    toastr.success('Artículo Registrado');

                    // Limpiar el formulario y cerrar el modal
                    $('#otherModal1').modal('hide');  // Cerrar el modal
                    $('#saveArticleForm')[0].reset();  // Limpiar el formulario
                    $('#image-preview-container').hide();  // Ocultar la vista previa

                    // Recargar el carrusel con los nuevos datos
                    loadCarouselImages();  // Llamar a la función que carga los artículos
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

    // Función para cargar las imágenes del carrusel y generar el contenido
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
                        const imageSrc = item.imagen_articulo;
                        const nombreArticulo = item.nombre_articulo;
                        const descripcionArticulo = item.descripcion_articulo;
                        const precioArticulo = item.precio_articulo;
                    
                        const carouselItem = `
                        <div class="panel-body">
                            <div class="product" data-id="${item.id}">
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
                                            <button type="button" class="btn btn-primary btn-labeled edit-article-btn" 
                                                    data-id="${item.id_article}" 
                                                    data-nombre="${nombreArticulo}" 
                                                    data-descripcion="${descripcionArticulo}" 
                                                    data-precio="${precioArticulo}" 
                                                    data-imagen="${imageSrc}">
                                                Editar
                                                <span class="btn-label btn-label-right p-x-10">
                                                    <i class="zmdi zmdi-arrow-right"></i>
                                                </span>
                                            </button>
                                            <button type="button" class="btn btn-danger btn-labeled delete-article-btn"
                                            data-id="${item.id_article}" 
                                            >Eliminar
                                                <span class="btn-label btn-label-right p-x-10">
                                                    <i class="zmdi zmdi-delete"></i>
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

    // Llamar a la función para cargar las imágenes al iniciar la página
    loadCarouselImages();


    // Manejar el evento de clic solo en los botones con la clase "edit-article-btn"
    $(document).on('click', '.edit-article-btn', function() { 
        // Obtener los datos del artículo desde los atributos del botón
        const idArticle = $(this).data('id');
        const nombreArticulo = $(this).data('nombre');
        const descripcionArticulo = $(this).data('descripcion');
        const precioArticulo = $(this).data('precio');
        const imagenArticulo = $(this).data('imagen');
        
        // Llenar los campos del modal con los datos obtenidos
        $('#EditModal #id_article').val(idArticle);  // Llenar el ID del artículo
        $('#EditModal #nombre_articulo').val(nombreArticulo);  // Llenar el nombre
        $('#EditModal #descripcion_articulo').val(descripcionArticulo);  // Llenar la descripción
        $('#EditModal #precio_articulo').val(precioArticulo);  // Llenar el precio
        $('#EditModal #image-preview-edit').attr('src', imagenArticulo);  // Llenar la imagen

        // Asegurarse de que el contenedor de la vista previa esté visible
        $('#image-preview-container-edit').css('display', 'block'); // Mostrar el contenedor de la imagen

        // Mostrar el modal
        $('#EditModal').modal('show');
    });

        // Manejar el evento de clic solo en los botones con la clase "edit-article-btn"
        $(document).on('click', '.delete-article-btn', function() { 
            // Obtener los datos del artículo desde los atributos del botón
            const idArticle = $(this).data('id');
            
            // Llenar los campos del modal con los datos obtenidos
            $('#dangerModal #articledelete').val(idArticle);  // Llenar el ID del artículo
    
            // Mostrar el modal
            $('#dangerModal').modal('show');
        });

    // Función para actualizar un artículo mediante AJAX
    $('#updatearticle').on('submit', function (event) {
        event.preventDefault();  // Evitar el envío tradicional del formulario

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario
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
                    toastr.success('Artículo Actualizado');

                    // Limpiar el formulario y cerrar el modal
                    $('#EditModal').modal('hide');  // Cerrar el modal
                    $('#updatearticle')[0].reset();  // Limpiar el formulario
                    $('#image-preview-container').hide();  // Ocultar la vista previa

                    // Recargar el carrusel con los nuevos datos
                    loadCarouselImages();  // Llamar a la función que carga los artículos
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

    // Función para actualizar un artículo mediante AJAX
    $('#id_article_delete').on('submit', function (event) {
        event.preventDefault();  // Evitar el envío tradicional del formulario

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario
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
                    toastr.success('Artículo Eliminado');

                    // Limpiar el formulario y cerrar el modal
                    $('#dangerModal').modal('hide');  // Cerrar el modal
                    $('#id_article_delete')[0].reset();  // Limpiar el formulario
                    // Recargar el carrusel con los nuevos datos
                    loadCarouselImages();  // Llamar a la función que carga los artículos
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