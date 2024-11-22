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
    """Verifica si el archivo tiene una extensión válida."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def article_update(id_articulo, nombre_articulo, descripcion_articulo, precio_articulo, imagen_articulo):
    """Actualiza un artículo en la base de datos de Firebase."""

    # Obtener todos los productos de la base de datos
    produc_date = db.child("productos").get().val()

    # Buscar el producto con el id_articulo
    producto_to_update = None
    key_to_update = None

    if produc_date:
        for key, articulo in produc_date.items():
            # Comparar el ID del artículo en la base de datos con el ID proporcionado
            if str(articulo.get("id_article")) == str(id_articulo):
                producto_to_update = articulo
                key_to_update = key
                break

    # Verificar si se encontró el producto
    if not producto_to_update:
        return jsonify({"message": "Artículo no encontrado"}), 404

    # Manejo de la imagen, si se proporciona una nueva imagen válida
    nueva_imagen_path = None
    if imagen_articulo and allo_file(imagen_articulo.filename):
        filename = secure_filename(imagen_articulo.filename)
        nueva_imagen_path = os.path.join(UPLOAD_FOLDER, filename)

        # Si la imagen es diferente de la existente, eliminar la antigua
        if producto_to_update.get('imagen_articulo') != f"static/img/productos/{filename}":
            old_image_path = producto_to_update.get('imagen_articulo')
            if old_image_path and os.path.exists(old_image_path):
                try:
                    os.remove(old_image_path)
                except Exception as e:
                    print(f"Error al eliminar la imagen antigua: {e}")

            # Guardar la nueva imagen en la carpeta de productos
            imagen_articulo.save(nueva_imagen_path)

    # Preparar los datos a actualizar en Firebase
    data = {
        "id_article": id_articulo,
        "nombre_articulo": nombre_articulo,
        "descripcion_articulo": descripcion_articulo,
        "precio_articulo": precio_articulo
    }

    # Si hay una nueva imagen, actualizar el campo correspondiente
    if nueva_imagen_path:
        data["imagen_articulo"] = f"static/img/productos/{filename}"

    # Actualizar los datos del producto en Firebase usando la clave específica
    db.child("productos").child(key_to_update).update(data)

    # Mensaje de confirmación de actualización
    message = "Artículo actualizado"
    if not nueva_imagen_path:
        message += " sin cambio de imagen"

    return jsonify({"message": message, "id_article": id_articulo}), 200

def personal_update(dni_editar, nombre_completo_editar, cargo_editar, departamento_editar, correo_empresa_editar, telefono_editar, fecha_contratacion_editar, imagen_articulo_editar):
    """Actualiza los datos de un empleado en la base de datos de Firebase."""

    # Obtener los datos actuales del personal desde Firebase
    personal_data = db.child("personal").get().val()

    # Buscar el personal con el DNI proporcionado
    personal_to_update = None
    if personal_data:
        for dni, data in personal_data.items():
            if dni == dni_editar:
                personal_to_update = data
                break

    # Verificar si se encontró el personal
    if not personal_to_update:
        return jsonify({"message": "Personal no encontrado"}), 404

    # Manejo de la imagen, si se proporciona una nueva imagen válida
    nueva_imagen_path = None
    if imagen_articulo_editar and allo_file(imagen_articulo_editar.filename):
        filename = secure_filename(imagen_articulo_editar.filename)
        nueva_imagen_path = os.path.join(UPLOAD_FOLDER, filename)

        # Si la imagen es diferente de la existente, eliminar la antigua
        old_image_path = personal_to_update.get('imagen_articulo')
        if old_image_path and os.path.exists(old_image_path):
            try:
                os.remove(old_image_path)  # Eliminar la antigua imagen
            except Exception as e:
                print(f"Error al eliminar la imagen antigua: {e}")

        # Guardar la nueva imagen
        imagen_articulo_editar.save(nueva_imagen_path)

    # Preparar los datos a actualizar en Firebase
    data = {
        "dni": dni_editar,
        "nombre_completo": nombre_completo_editar,
        "cargo": cargo_editar,
        "departamento": departamento_editar,
        "correo_empresa": correo_empresa_editar,
        "telefono": telefono_editar,
        "fecha_contratacion": fecha_contratacion_editar
    }

    # Si hay una nueva imagen, actualizar el campo correspondiente
    if nueva_imagen_path:
        data["imagen_articulo"] = f"static/img/personal/{filename}"

    # Actualizar los datos del personal en Firebase usando el DNI como clave
    db.child("personal").child(dni_editar).update(data)

    # Mensaje de confirmación de actualización
    message = "Datos del personal actualizados"
    if not nueva_imagen_path:
        message += " sin cambio de imagen"

    return jsonify({"message": message, "dni": dni_editar}), 200
