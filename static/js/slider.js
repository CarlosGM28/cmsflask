Dropzone.autoDiscover = false; 

$(document).ready(function() {
  // Obtén el valor del campo oculto
  var conditionValue = $("#dropzoneCondition").val();
  
  var url = "/upload"; // Valor por defecto
  var maxFiles = 1; // Número máximo de archivos por defecto

  // Condiciones según el valor del campo oculto
  if (conditionValue === "upload") {
    url = "/upload"; // URL para subir archivos
    maxFiles = 1; // Permitir solo 1 archivo
  } else if (conditionValue === "galery") {
    url = "/galery"; // URL para la galería
    maxFiles = 6; // Permitir hasta 6 archivos
  }

  // Inicializar Dropzone con configuraciones dinámicas
  var myDropzone = new Dropzone("#myDropzone", {
    url: url, // Usa la URL condicionada
    maxFiles: maxFiles, // Usa el límite de archivos condicionado
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
  
      toastr.success('Imagen subida con éxito: ' + response.filename);
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
});
