import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
import pyrebase
from conexion.firebase_config import config

# Inicializar Firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

UPLOAD_FOLDER = 'static/img/personal/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allo_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_personal(dni, nombre_completo, cargo, departamento, correo_empresa, telefono, fecha_contratacion, imagen_articulo):

    if imagen_articulo and allo_file(imagen_articulo.filename):
        filename = secure_filename(imagen_articulo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        imagen_articulo.save(filepath)

        image_name = filename

        # Crear el diccionario de datos con los nuevos campos
        data = {
            "dni": dni,
            "nombre_completo": nombre_completo,
            "cargo": cargo,
            "departamento": departamento,
            "correo_empresa": correo_empresa,
            "telefono": telefono,
            "fecha_contratacion": fecha_contratacion,
            "imagen_personal": f"static/img/personal/{image_name}"  # Ruta de la imagen en el servidor
        }

        # Usar el DNI como clave única en Firebase
        db.child("personal").child(dni).set(data)

        return jsonify({"message": "Personal registrado", "filename": image_name}), 200

    return "Archivo no permitido", 400

def view_personal():
    personal_data = db.child("personal").get().val()

    personal_list = []

    if personal_data:
        # Iterar sobre los datos de cada personal
        for dni, data in personal_data.items():
            # Crear un diccionario con los datos del personal
            personal_info = {
                'dni': dni,  # Incluir el DNI como identificador único
                'nombre_completo': data.get('nombre_completo', ''),
                'cargo': data.get('cargo', ''),
                'departamento': data.get('departamento', ''),
                'correo_empresa': data.get('correo_empresa', ''),
                'telefono': data.get('telefono', ''),
                'fecha_contratacion': data.get('fecha_contratacion', ''),
                'imagen_articulo': data.get('imagen_articulo', '')  # Ruta de la imagen en el servidor
            }
            personal_list.append(personal_info)
    
    return jsonify({"datos": personal_list})
