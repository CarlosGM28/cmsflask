import pyrebase

# Configuración de Firebase
config = {
    "apiKey": "AIzaSyDaVuT62I-I7fv4ItGDPQOHhM0QZyRpgD4",
    "authDomain": "cms-client-b5fd0.firebaseapp.com",
    "databaseURL": "https://cms-client-b5fd0-default-rtdb.firebaseio.com/",
    "projectId": "cms-client-b5fd0",
    "storageBucket": "cms-client-b5fd0.firebasestorage.app",
    "messagingSenderId": "309224825170",
    "appId": "1:309224825170:web:1dc6e73f6db3aa0bf61a8b",
    "measurementId": "G-5VF3G5HWWE"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()