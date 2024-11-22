// Función para cargar los datos del personal
function loadPersonal() {
    $.ajax({
        url: '/upload_personal',  // Ruta para obtener los datos del personal
        type: "GET",
        success: function (response) {
            const $tableBody = $('#tableBody'); // Contenedor del cuerpo de la tabla

            // Limpiar el contenido previo
            $tableBody.empty();

            // Comprobar si hay personal para agregar
            if (response["datos"] && response["datos"].length > 0) {
                // Iterar sobre los datos recibidos y agregar cada empleado como fila en la tabla
                response["datos"].forEach(function (item) {
                    const dni = item.dni;  // Agregar el DNI primero
                    const nombreCompleto = item.nombre_completo;
                    const cargo = item.cargo;
                    const departamento = item.departamento;
                    const correoEmpresa = item.correo_empresa;
                    const telefono = item.telefono;
                    const fechaContratacion = item.fecha_contratacion;
                    const imgpersonal = item.imagen_personal;

                    const tableRow = `
                        <tr>
                            <td>${dni}</td>
                            <td>${nombreCompleto}</td>
                            <td>${cargo}</td>
                            <td>${departamento}</td>
                            <td>${correoEmpresa}</td>
                            <td>${telefono}</td>
                            <td>${fechaContratacion}</td>
                            <td class="text-center">
                                <div class="button-container">
                                    <button type="button" class="btn btn-primary editar_modal" 
                                    data-dni="${dni}" 
                                    data-nombre_completo="${nombreCompleto}" 
                                    data-cargo="${cargo}" 
                                    data-departamento="${departamento}" 
                                    data-correo_empresa="${correoEmpresa}" 
                                    data-telefono="${telefono}" 
                                    data-fecha_contratacion="${fechaContratacion}" 
                                    data-fecha_imagen="${imgpersonal}">
                                        <i class="zmdi zmdi-edit"></i>
                                    </button>
                                    <button type="button" class="btn btn-danger delete_personal"
                                    data-dni="${dni}">
                                        <i class="zmdi zmdi-delete"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
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
}

// Función para previsualizar la imagen seleccionada
function previewImage(event) {
    const output = document.getElementById('image-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById('image-preview-container').style.display = 'block';
}

// Función para imprimir el nombre del archivo seleccionado en un input
function updateFileNameInput(event) {
    const fileInput = event.target;
    const fileName = fileInput.files[0] ? fileInput.files[0].name : 'No file selected';
    
    // Asignar el nombre del archivo a un input específico
    const fileNameInput = document.getElementById('file-name-input');
    fileNameInput.value = fileName;
}


// Función AJAX para enviar el formulario sin recargar la página
$(document).ready(function () {
    // Evento al enviar el formulario del artículo
    $('#personalRegister').on('submit', function (event) {
        event.preventDefault();  // Evitar el envío tradicional del formulario

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario (ej. 'upload_article')
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
                    toastr.success('Personal Registrado');

                    // Limpiar el formulario y cerrar el modal
                    $('#otherModal1').modal('hide');  // Cerrar el modal
                    $('form')[0].reset();  // Limpiar el formulario
                    $('#image-preview-container').hide();  // Ocultar la vista previa

                    // Recargar los datos del personal después de un registro exitoso
                    loadPersonal();
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

    // Cargar los datos del personal al cargar la página
    loadPersonal();
});

// Función AJAX para enviar el formulario sin recargar la página
$(document).ready(function () {
    // Evento al enviar el formulario del artículo
    $('#id_delete_personal').on('submit', function (event) {
        event.preventDefault();  // Evitar el envío tradicional del formulario

        var formData = new FormData(this);  // Crear objeto FormData con los datos del formulario

        $.ajax({
            url: $(this).attr('action'),  // La URL de acción del formulario (ej. 'upload_article')
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
                    toastr.success('Personal Registrado');

                    // Limpiar el formulario y cerrar el modal
                    $('#dangerModal').modal('hide');  // Cerrar el modal
                    $('form')[0].reset();  // Limpiar el formulario
                    $('#image-preview-container').hide();  // Ocultar la vista previa

                    // Recargar los datos del personal después de un registro exitoso
                    loadPersonal();
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

    // Cargar los datos del personal al cargar la página
    loadPersonal();
});


$(document).on('click', '.editar_modal', function() {
    // Obtener los datos de los atributos data- del botón
    var dni = $(this).data('dni');
    var nombreCompleto = $(this).data('nombre_completo');
    var cargo = $(this).data('cargo');
    var departamento = $(this).data('departamento');
    var correoEmpresa = $(this).data('correo_empresa');
    var telefono = $(this).data('telefono');
    var fechaContratacion = $(this).data('fecha_contratacion');
    var imagen = $(this).data('imagen_personal'); // Si tienes una imagen asociada

    // Llenar los campos del formulario en el modal
    $('#dni_editar').val(dni);
    $('#nombre_completo_editar').val(nombreCompleto);
    $('#cargo_editar').val(cargo);
    $('#departamento_editar').val(departamento);
    $('#correo_empresa_editar').val(correoEmpresa);
    $('#telefono_editar').val(telefono);
    $('#fecha_contratacion_editar').val(fechaContratacion);

    // Si hay imagen, mostrarla en la vista previa
    if (imagen) {
        $('#image-preview-container_editar').show();
        $('#image-preview_editar').attr('src', imagen);
    } else {
        $('#image-preview-container_editar').hide();
    }

    // Mostrar el modal
    $('#editarPersonal').modal('show');
});


$(document).on('click', '.delete_personal', function() {
    // Obtener los datos de los atributos data- del botón
    var dni = $(this).data('dni');

    // Llenar los campos del formulario en el modal
    $('#personaldelete').val(dni);
    console.log(dni)
    // Mostrar el modal
    $('#dangerModal').modal('show');
});