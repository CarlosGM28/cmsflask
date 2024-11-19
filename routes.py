from flask import Flask, render_template,Blueprint, request, redirect, url_for,jsonify, session
from functools import wraps
from datetime import datetime
from controllers.auth_controller import login_user
from controllers.upload_controller import upload_file, view_img
from controllers.img_controller import upload_galery, view_galery
from controllers.article_controller import article_file, view_article


app = Flask(__name__)
upload_routes = Blueprint('upload_routes', __name__)
app.secret_key = 'mi_secreto'  

@app.route('/')
def home():
    return render_template('index.html')

# Ruta para "inicio-dashboard"
@app.route('/wp-inicio')
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
@app.route('/suscriptores')
def suscriptores():
    return render_template('base.html', content_template='dashboard/suscriptores.html')

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

@app.route('/galery', methods=['POST', 'GET'])
def galery():
    if request.method == 'POST':
        return upload_galery()
    if request.method == 'GET':
        return view_galery()

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))