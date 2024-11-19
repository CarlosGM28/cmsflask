import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
import pyrebase
from conexion.firebase_config import config

# Inicializar Firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

UPLOAD_FOLDER = 'static/img/productos/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allo_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def article_file(nombre_articulo, descripcion_articulo, precio_articulo, imagen_articulo):

    if imagen_articulo and allo_file(imagen_articulo.filename):
        filename = secure_filename(imagen_articulo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        imagen_articulo.save(filepath)

        image_name = filename

        data = {
            "nombre_articulo": nombre_articulo,
            "descripcion_articulo": descripcion_articulo,
            "precio_articulo": precio_articulo,
            "imagen_articulo": f"static/img/productos/{image_name}"  # Ruta de la imagen en el servidor
        }

        # Guardar en Firebase Realtime Database
        db.child("productos").push(data)

        return jsonify({"message": "Articulo Registrado", "filename": image_name}), 200
    
    return "Archivo no permitido", 400


def view_article():
    produc_date = db.child("productos").get().val()

    products_date = []

    if produc_date:
        for key, prducto_date in produc_date.items():
            produuctos_data = {
                'descripcion_articulo': prducto_date.get('descripcion_articulo', ''),
                'imagen_articulo': prducto_date.get('imagen_articulo', ''),
                'nombre_articulo': prducto_date.get('nombre_articulo', ''),
                'precio_articulo': prducto_date.get('precio_articulo', '')
            }
            products_date.append(produuctos_data)
    
    return jsonify({"datos": products_date})