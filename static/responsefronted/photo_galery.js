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
                        <div class="col-4">
                            <img class="img-fluid bg-light rounded p-1" src="${item['image_name']}" alt="Image">
                        </div>
                    `;
                });
            } else {
                carouselHTML = '<div class="text-center text-light">No hay imágenes disponibles</div>';
            }

            // Insertar el HTML generado en el contenedor del carrusel
            document.querySelector('#phogalery').innerHTML = carouselHTML;
        },
        error: function() {
            // Manejo del error en caso de que la solicitud falle
            document.querySelector('#phogalery').innerHTML = '<div class="text-center text-light">Error al cargar las imágenes</div>';
        }
    });
});