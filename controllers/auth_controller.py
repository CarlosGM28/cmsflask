from flask import session, redirect, url_for, render_template
from conexion.firebase_config import firebase  

def login_user(email, password):
    try:
        auth_instance = firebase.auth()
        user = auth_instance.sign_in_with_email_and_password(email, password)
        session['user'] = user['localId']  
        return redirect(url_for('inicio_dashboard'))  
    except Exception as e:
        error = "Error en el inicio de sesión. Verifica tus credenciales."
        return render_template('vistas/login.html', error=error)