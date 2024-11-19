import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
import pyrebase
from conexion.firebase_config import config

# Inicializar Firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Directorio donde se almacenarán las imágenes localmente
UPLOAD_FOLDER = 'static/img/slider/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Función para verificar si el archivo es válido
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Función que maneja la carga de imágenes
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    
    # Verificar que el archivo sea válido
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Guardar el archivo localmente
        file.save(filepath)

        # Obtener el nombre del archivo (esto se almacenará en Firebase)
        image_name = filename

        # Guardar el nombre de la imagen en Firebase
        data = {
            "image_name": "static/img/slider/"+image_name,
        }

        # Guarda en la base de datos en la ruta 'imagenes'
        db.child("imagenes").push(data)

        return jsonify({"message": "Archivo subido y nombre guardado en Firebase", "filename": image_name}), 200
    
    return "Archivo no permitido", 400

def view_img():
    images_data = db.child("imagenes").get().val()

    slider_data = []

    if images_data:
        for key, image_data in images_data.items():
            images_date = {
                'image_name': image_data.get('image_name', '')
            }
            slider_data.append(images_date)
    
    return jsonify({"datos": slider_data})
