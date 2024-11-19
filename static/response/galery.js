$(document).ready(function() {
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
                                    <button type="button" class="btn btn-outline-primary">Editar</button>
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
});