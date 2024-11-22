$.ajax({
    url: '/upload_personal',  // Ruta para obtener los datos del personal
    type: "GET",
    success: function (response) {
        const $tableBody = $('#personalProfesional'); // Asegúrate de tener un contenedor con este id en la tabla

        // Limpiar el contenido previo
        $tableBody.empty();

        // Comprobar si hay personal para agregar
        if (response["datos"] && response["datos"].length > 0) {
            // Iterar sobre los datos recibidos y agregar cada empleado como fila en la tabla
            response["datos"].forEach(function (item) {
                const imageSrc = item.imagen_articulo;
                const nombreCompleto = item.nombre_completo;
                const cargo = item.cargo;

                const tableRow = `
                <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
                    <div class="team-item text-center rounded overflow-hidden">
                        <img class="img-fluid" src="${imageSrc}" alt="">
                        <div class="team-text">
                            <div class="team-title">
                                <h5>${nombreCompleto}</h5>
                                <span>${cargo}</span>
                            </div>
                            <div class="team-social">
                                <a class="btn btn-square btn-light rounded-circle" href=""><i class="fab fa-facebook-f"></i></a>
                                <a class="btn btn-square btn-light rounded-circle" href=""><i class="fab fa-twitter"></i></a>
                                <a class="btn btn-square btn-light rounded-circle" href=""><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                // Agregar la fila a la tabla
                $tableBody.append(tableRow);
            });
        } else {
            $tableBody.append('<tr><td colspan="8">No se encontraron empleados.</td></tr>'); // Mensaje si no hay empleados
        }
    },
    error: function () {
        alert("Error al cargar los datos del personal.");
    }
});
