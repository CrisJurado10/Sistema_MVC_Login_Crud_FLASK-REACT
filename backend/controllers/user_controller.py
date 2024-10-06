from flask import jsonify, request
from app import mysql
from werkzeug.security import generate_password_hash # Importar funciones de hashing

def get_users():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, email FROM users")
    users = cur.fetchall()
    cur.close()
    
    return jsonify([{
        "id": user[0],
        "username": user[1],
        "email": user[2]
    } for user in users])


def create_user():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    
    # Hashear la contraseña antes de insertarla en la base de datos
    hashed_password = generate_password_hash(password)

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
    mysql.connection.commit()
    cur.close()
    
    return jsonify({"message": "User created!"}), 201

def update_user(user_id):
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    
    cur = mysql.connection.cursor()
    cur.execute("UPDATE users SET username = %s, email = %s, password = %s WHERE id = %s", (username, email, password, user_id))
    mysql.connection.commit()
    cur.close()
    
    return jsonify({"message": "User updated!"})

def delete_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM users WHERE id = %s", [user_id])
    mysql.connection.commit()
    cur.close()
    
    return jsonify({"message": "User deleted!"})
