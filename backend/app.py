#sirve
#login y crud totalmente funcional
from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash  # Importa la función para hashear y verificar contraseñas

app = Flask(__name__)
CORS(app)

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'Crud_Usuarios'
app.secret_key = 'tu_clave_secreta'

mysql = MySQL(app)

# Ruta para crear un nuevo usuario con validación de duplicados
@app.route('/usuarios', methods=['POST'])
def add_usuario():
    data = request.json
    nombre = data['usuario']
    correo = data['correo']
    contraseña = data['contraseña']
    
    cursor = mysql.connection.cursor()

    # Verificar si el nombre de usuario o el correo ya existen
    cursor.execute("SELECT * FROM usuarios WHERE usuario = %s OR correo = %s", (nombre, correo))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        return jsonify({'error': 'El nombre de usuario o el correo ya existen'}), 400

    # Hashear la contraseña antes de insertarla en la base de datos
    hashed_password = generate_password_hash(contraseña)

    # Si no existe, insertar el nuevo usuario con la contraseña hasheada
    cursor.execute("INSERT INTO usuarios (usuario, correo, contraseña) VALUES (%s, %s, %s)", (nombre, correo, hashed_password))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Usuario creado'}), 201

# Ruta para obtener todos los usuarios
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM usuarios")
    resultados = cursor.fetchall()
    cursor.close()
    
    usuarios = []
    for fila in resultados:
        usuarios.append({
            'id': fila[0],
            'usuario': fila[1],
            'correo': fila[2],
            'contraseña': fila[3]
        })
    
    return jsonify(usuarios), 200

# Ruta para editar un usuario
@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    data = request.json
    nombre = data['usuario']
    correo = data['correo']
    contraseña = data['contraseña']

    # Hashear la nueva contraseña antes de guardarla
    hashed_password = generate_password_hash(contraseña)
    
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE usuarios SET usuario=%s, correo=%s, contraseña=%s WHERE id=%s", (nombre, correo, hashed_password, id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Usuario actualizado'}), 200

# Ruta para eliminar un usuario
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id=%s", (id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Usuario eliminado'}), 200

# Autenticación de sesión login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        datos = request.get_json()
        usuario = datos.get('usuario')
        contraseña = datos.get('contraseña')

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id, contraseña FROM usuarios WHERE usuario = %s OR correo = %s", (usuario, usuario))
        usuario_db = cursor.fetchone()
        cursor.close()

        if usuario_db:
            id_usuario = usuario_db[0]
            contraseña_db = usuario_db[1]

            # Verificar si la contraseña ingresada en texto plano coincide con la contraseña hasheada en la base de datos
            if check_password_hash(contraseña_db, contraseña):  # Aquí estamos verificando la contraseña hasheada
                session['usuario'] = usuario  # Almacenar el usuario en la sesión
                session.permanent = False  # La sesión no es permanente
                return jsonify({'message': 'Login exitoso', 'user_id': id_usuario}), 200
            
            # Si la contraseña no coincide, devolver error
            return jsonify({'message': 'Credenciales inválidas'}), 400
        else:
            # No existe el usuario
            return jsonify({'message': 'Credenciales inválidas'}), 400

    # Renderizar la página de login para el método GET
    return render_template('login.html')

# Ruta que maneja todas las rutas desconocidas y las redirige a React
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')  

if __name__ == '__main__':
    app.run(debug=True)
