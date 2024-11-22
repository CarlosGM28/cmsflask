import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
import pyrebase
from conexion.firebase_config import config

# Inicializar Firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Directorio donde se almacenarán los videos localmente
UPLOAD_FOLDER = 'static/video/'
ALLOWED_EXTENSIONS = {'mp4'}

# Función para verificar si el archivo es válido
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Función que maneja la carga de videos
def upload_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # Verificar que el archivo sea válido
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Guardar el archivo localmente
        file.save(filepath)

        # Obtener el nombre del archivo (esto se almacenará en Firebase)
        video_name = filename

        # Guardar el nombre del video en Firebase (opcional)
        data = {
            "video_name": "static/video/" + video_name,
        }

        # Guarda en la base de datos en la ruta 'videos'
        db.child("videos").push(data)

        # Devolver solo un mensaje de éxito sin enviar la URL del video
        return jsonify({
            "message": "Video Guardado"
        }), 200
    
    return jsonify({"error": "Archivo no permitido"}), 400

# Función para ver videos almacenados
def view_video():
    # Obtener los datos almacenados en la ruta 'videos'
    videos_data = db.child("videos").get().val()

    slider_data = []

    if videos_data:
        for key, video_data in videos_data.items():
            video_item = {
                'video_name': video_data.get('video_name', '')
            }
            slider_data.append(video_item)
    
    return jsonify({"datos": slider_data})