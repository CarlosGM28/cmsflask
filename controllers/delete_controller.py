import os
from flask import request, jsonify
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

def article_delete(id_articulo):
    """Elimina un artículo de la base de datos de Firebase y maneja la imagen asociada."""

    # Obtener todos los productos de la base de datos
    produc_date = db.child("productos").get().val()

    # Buscar el producto con el id_articulo
    producto_to_delete = None
    key_to_delete = None

    if produc_date:
        for key, articulo in produc_date.items():
            # Comparar el ID del artículo en la base de datos con el ID proporcionado
            if str(articulo.get("id_article")) == str(id_articulo):
                producto_to_delete = articulo
                key_to_delete = key
                break

    # Verificar si se encontró el producto
    if not producto_to_delete:
        return jsonify({"message": "Artículo no encontrado"}), 404

    # Eliminar la imagen asociada al producto si existe
    old_image_path = producto_to_delete.get('imagen_articulo')
    if old_image_path and os.path.exists(old_image_path):
        try:
            os.remove(old_image_path)
        except Exception as e:
            print(f"Error al eliminar la imagen: {e}")

    # Eliminar el artículo de Firebase
    db.child("productos").child(key_to_delete).remove()

    return jsonify({"message": "Artículo eliminado con éxito", "id_article": id_articulo}), 200

def galery_delete(image_name):
    """Elimina un artículo de la base de datos de Firebase y maneja la imagen asociada."""

    # Obtener todos los productos de la base de datos
    produc_data = db.child("galery").get().val()

    # Buscar el producto con el nombre de imagen que se va a eliminar
    producto_to_delete = None
    key_to_delete = None

    if produc_data:
        for key, product in produc_data.items():
            # Comparamos el 'image_name' de la base de datos con el proporcionado
            if product.get("image_name") == image_name:
                producto_to_delete = product
                key_to_delete = key
                break

    # Verificar si se encontró el producto
    if not producto_to_delete:
        return jsonify({"message": "Artículo no encontrado"}), 404

    # Obtener el nombre del archivo de la imagen
    old_image_name = producto_to_delete.get('image_name')

    # Usamos directamente la ruta de la imagen que ya viene completa
    image_path = old_image_name
    
    # Eliminar la imagen de la carpeta si existe
    if os.path.exists(image_path):
        try:
            os.remove(image_path)
        except Exception as e:
            return jsonify({"message": f"Error al eliminar la imagen: {e}"}), 500
    else:
        return jsonify({"message": f"Imagen no encontrada en la carpeta: {image_path}"}), 404
    
    # Eliminar el artículo de Firebase
    db.child("galery").child(key_to_delete).remove()

    # Retornar la respuesta de éxito
    return jsonify({"message": "Artículo eliminado con éxito", "id_article": key_to_delete}), 200

def video_delete(video_name):
    """Elimina un video de la base de datos de Firebase y maneja el archivo asociado."""

    # Obtener todos los videos de la base de datos
    video_data = db.child("videos").get().val()

    # Buscar el video con el nombre proporcionado
    video_to_delete = None
    key_to_delete = None

    if video_data:
        for key, video in video_data.items():
            # Comparamos el 'video_name' almacenado en la base de datos con el proporcionado
            if video.get("video_name") == video_name:
                video_to_delete = video
                key_to_delete = key
                break

    # Verificar si se encontró el video
    if not video_to_delete:
        return jsonify({"message": "Video no encontrado"}), 404

    # Obtener la ruta del archivo del video
    old_video_path = video_to_delete.get('video_name')

    # Verificar si la ruta del video existe
    if os.path.exists(old_video_path):
        try:
            os.remove(old_video_path)
        except Exception as e:
            return jsonify({"message": f"Error al eliminar el video: {e}"}), 500
    else:
        return jsonify({"message": f"Video no encontrado en la carpeta: {old_video_path}"}), 404

    # Eliminar el video de Firebase
    db.child("videos").child(key_to_delete).remove()

    # Retornar la respuesta de éxito
    return jsonify({"message": "Video eliminado con éxito", "id_video": key_to_delete}), 200

def personal_delete(dni_delete):
    """Elimina los datos de un empleado de la base de datos de Firebase y maneja el archivo de la imagen asociado."""

    # Obtener los datos del personal en la base de datos
    personal_data = db.child("personal").get().val()

    # Buscar el personal con el dni proporcionado
    personal_to_delete = None
    key_to_delete = None

    if personal_data:
        for key, personal in personal_data.items():
            # Comparamos el 'dni' almacenado en la base de datos con el proporcionado
            if personal.get("dni") == dni_delete:
                personal_to_delete = personal
                key_to_delete = key
                break

    # Verificar si se encontró el personal
    if not personal_to_delete:
        return jsonify({"message": "Personal no encontrado"}), 404

    # Obtener la ruta del archivo de la imagen
    image_path = personal_to_delete.get('imagen_personal')

    # Verificar si la ruta de la imagen existe
    if os.path.exists(image_path):
        try:
            os.remove(image_path)  # Eliminar el archivo de la imagen
        except Exception as e:
            return jsonify({"message": f"Error al eliminar la imagen: {e}"}), 500
    else:
        return jsonify({"message": f"Imagen no encontrada en la carpeta: {image_path}"}), 404

    # Eliminar los datos del personal en Firebase
    db.child("personal").child(key_to_delete).remove()

    # Retornar la respuesta de éxito
    return jsonify({"message": "Personal eliminado con éxito", "dni": dni_delete}), 200