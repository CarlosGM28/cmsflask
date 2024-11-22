from flask import Flask, render_template,Blueprint, request, redirect, url_for, session
from functools import wraps
from controllers.auth_controller import login_user
from controllers.upload_controller import upload_file, view_img
from controllers.img_controller import upload_galery, view_galery
from controllers.article_controller import article_file, view_article
from controllers.video_controller import upload_video, view_video
from controllers.personal_controller import upload_personal, view_personal
from controllers.update_cotroller import article_update, personal_update
from controllers.delete_controller import article_delete, galery_delete, video_delete, personal_delete

app = Flask(__name__)
upload_routes = Blueprint('upload_routes', __name__)
app.secret_key = 'mi_secreto'  

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/nosotros')
def nosotros():
    return render_template('vistas/about.html')

@app.route('/servicios')
def servicios():
    return render_template('vistas/service.html')

@app.route('/productos')
def productos():
    return render_template('vistas/product.html')

@app.route('/contacto')
def contacto():
    return render_template('vistas/contact.html')

# Ruta para "inicio-dashboard"
@app.route('/pc-inicio')
def inicio_dashboard():
    return render_template('base.html', content_template='dashboard/inicio.html')

# Ruta para "slider"
@app.route('/slider')
def slider():
    return render_template('base.html', content_template='dashboard/slider.html')

# Ruta para "articulos"
@app.route('/articulos')
def articulos():
    return render_template('base.html', content_template='dashboard/articulos.html')
# Ruta para "imagenes"
@app.route('/imagenes')
def imagenes():
    return render_template('base.html', content_template='dashboard/imagenes.html')
# Ruta para "videos"
@app.route('/videos')
def videos():
    return render_template('base.html', content_template='dashboard/videos.html')

# Ruta para "suscriptores"
@app.route('/personal')
def personal():
    return render_template('base.html', content_template='dashboard/personal.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        return login_user(email, password)
    
    return render_template('vistas/login.html')

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    if request.method == 'POST':
        return upload_file()
    if request.method == 'GET':
        return view_img()

@app.route('/upload-article', methods=['POST', 'GET'])
def upload_article():
    if request.method == 'POST':
        nombre_articulo = request.form['nombre_articulo']
        descripcion_articulo = request.form['descripcion_articulo']
        precio_articulo = request.form['precio_articulo']
        imagen_articulo = request.files['imagen_articulo']

        return article_file(nombre_articulo, descripcion_articulo, precio_articulo, imagen_articulo)
    if request.method == 'GET':
        return view_article()

@app.route('/articulos/update_articulos', methods=['POST'])
def update_article():
    if request.method == 'POST':
        id_articulo=request.form['id_article']
        nombre_articulo = request.form['nombre_articulo']
        descripcion_articulo = request.form['descripcion_articulo']
        precio_articulo = request.form['precio_articulo']
        imagen_articulo = request.files['imagen_articulo']

        return article_update(id_articulo,nombre_articulo, descripcion_articulo, precio_articulo, imagen_articulo)

@app.route('/articulos/delete_articulos', methods=['POST'])
def update_delete():
    if request.method == 'POST':
        img_name=request.form['imgdelete']
        return article_delete(img_name)

@app.route('/galery', methods=['POST', 'GET'])
def galery():
    if request.method == 'POST':
        return upload_galery()
    if request.method == 'GET':
        return view_galery()
    
@app.route('/galery/galery_delete', methods=['POST', 'GET'])
def img_delete():
    if request.method == 'POST':
        image_name=request.form['imgdelete']
        return galery_delete(image_name)
    
@app.route('/upload_video', methods=['POST', 'GET'])
def video():
    if request.method == 'POST':
        return upload_video()
    if request.method == 'GET':
        return view_video()

@app.route('/video/video/delete', methods=['POST', 'GET'])
def delete_video():
    if request.method == 'POST':
        video_name=request.form['videodelete']
        return video_delete(video_name)
    
@app.route('/upload_personal', methods=['POST', 'GET'])
def personales():
    if request.method == 'POST':
        dni = request.form['dni']
        nombre_completo = request.form['nombre_completo']
        cargo = request.form['cargo']
        departamento = request.form['departamento']
        correo_empresa = request.form['correo_empresa']
        telefono = request.form['telefono']
        fecha_contratacion = request.form['fecha_contratacion']
        imagen_articulo = request.files['imagen_articulo']
        return upload_personal(dni,nombre_completo,cargo,departamento,correo_empresa,telefono,fecha_contratacion,imagen_articulo)
    if request.method == 'GET':
        return view_personal()
    
@app.route('/personal/update_personal', methods=['POST'])
def update_personal():
    if request.method == 'POST':
        dni_editar = request.form['dni_editar']
        nombre_completo_editar = request.form['nombre_completo_editar']
        cargo_editar = request.form['cargo_editar']
        departamento_editar = request.form['departamento_editar']
        correo_empresa_editar = request.form['correo_empresa_editar']
        telefono_editar = request.form['telefono_editar']
        fecha_contratacion_editar = request.form['fecha_contratacion_editar']
        imagen_articulo_editar = request.files['imagen_articulo_editar']


        return personal_update(dni_editar,nombre_completo_editar, cargo_editar, departamento_editar, correo_empresa_editar, telefono_editar, fecha_contratacion_editar, imagen_articulo_editar)
    
@app.route('/personal/delete_personal', methods=['POST'])
def delete_personal():
    if request.method == 'POST':
        dni_delete = request.form['personaldelete']

        return personal_delete(dni_delete)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))