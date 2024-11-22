import os
import random
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
    """Verifica si el archivo tiene una extensión válida."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generar_id_unico():
    """Genera un id_article único comprobando manualmente si ya existe en la base de datos."""
    while True:
        id_article = random.randint(1, 1000)
        
        # Obtener todos los productos de la base de datos
        productos_data = db.child("productos").get().val()

        # Verificar si hay algún producto con el mismo id_article
        if productos_data:
            ids_existentes = [item.get('id_article') for item in productos_data.values() if 'id_article' in item]
            if id_article not in ids_existentes:
                break
        else:
            # Si no hay productos en la base de datos, el id_article es único
            break
    
    return id_article

# Versión sin try/except para identificar errores
def article_file(nombre_articulo, descripcion_articulo, precio_articulo, imagen_articulo):
    id_article = generar_id_unico()

    if imagen_articulo and allo_file(imagen_articulo.filename):
        filename = secure_filename(imagen_articulo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Guardar la imagen en la carpeta destino
        imagen_articulo.save(filepath)
        image_name = filename

        # Crear el diccionario de datos para el artículo
        data = {
            "id_article": id_article,
            "nombre_articulo": nombre_articulo,
            "descripcion_articulo": descripcion_articulo,
            "precio_articulo": precio_articulo,
            "imagen_articulo": f"static/img/productos/{image_name}"
        }

        # Guardar en Firebase Realtime Database
        db.child("productos").push(data)
        message = "Artículo Registrado"
        return jsonify({"message": message}), 200
    message = "Archivo no permitido"
    return jsonify({"message": message}), 400


def view_article():
    produc_date = db.child("productos").get().val()

    products_date = []

    if produc_date:
        for key, prducto_date in produc_date.items():
            produuctos_data = {
                'id_article': prducto_date.get('id_article', ''),
                'descripcion_articulo': prducto_date.get('descripcion_articulo', ''),
                'imagen_articulo': prducto_date.get('imagen_articulo', ''),
                'nombre_articulo': prducto_date.get('nombre_articulo', ''),
                'precio_articulo': prducto_date.get('precio_articulo', '')
            }
            products_date.append(produuctos_data)
    
    return jsonify({"datos": products_date})