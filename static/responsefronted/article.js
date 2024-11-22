function loadCarouselImages() {
    $.ajax({
        url: '/upload-article',  // Ruta para obtener los artículos
        type: "GET",
        success: function (response) {
            const $carouselContainer = $('#productarticulo');

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
                            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                                    <div class="text-center p-4">
                                        <div class="d-inline-block border border-primary rounded-pill px-3 mb-3">s/. ${precioArticulo}</div>
                                        <h3 class="mb-3">${nombreArticulo}</h3>
                                        <span>${descripcionArticulo}</span>
                                    </div>
                                    <div class="position-relative mt-auto">
                                        <img class="img-fluid" src="${imageSrc}" alt="${nombreArticulo}">
                                        <div class="product-overlay">
                                            <a class="btn btn-lg-square btn-outline-light rounded-circle" href=""><i class="fa fa-eye text-primary"></i></a>
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