# MVC Login and CRUD System with Flask and React

This project implements a user management system (CRUD) with authentication, using Flask in the backend and React in the frontend. The application is connected to a MySQL database for storing user data.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints API](#endpoints-api)
- [Security](#security)
- [License](#license)

## Description
This system uses the MVC (Model-View-Controller) architecture pattern and is designed to allow user registration, authentication, and management in a MySQL database. Passwords are stored securely using hashing.

## Features
- User authentication (login and logout).
- User CRUD: Create, Read, Update, and Delete.
- React frontend, connected to a Flask backend.
- MySQL database for data persistence.
- Password hashing for added security.
- Session Management.

## Requirements
Before you begin, make sure you have installed:

- **Python 3.x**
- **Node.js and npm**
- **MySQL**
- **Git**

### Dependencies
The Python and Node.js dependencies are located in the `requirements.txt` and `package.json` files, respectively.

## Installation
Follow these steps to run the project locally.

### Backend (Flask)

1. Clone this repository:
   ```bash
   git clone https://github.com/CrisJurado10/Sistema_MVC_Login_Crud_FLASK-REACT.git
   cd Sistema_MVC_Login_Crud_FLASK-REACT/backend
Create a virtual environment and install the dependencies:

terminal
Copy code
python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

Set up the MySQL database:
Create a MySQL database called Crud_Usuarios.
Run these codes in your MYSQL:

1.- CREATE DATABASE Crud_Usuarios1;

2.-USE Crud_Usuarios;
3.-CREATE TABLE users ( id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL );



Update the credentials in app.py if necessary:
## Database Credentials
python
Copy code
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'your_MySQL_user'
app.config['MYSQL_PASSWORD'] = 'your_MySQL_password'
app.config['MYSQL_DB'] = 'Crud_Users'

Run the Flask app:
terminal
Copy code
flask run
Frontend (React)
Go to the frontend folder:

terminal
Copy code
cd ../frontend

Install the Node.js dependencies:
terminal
Copy code
npm install

Start the React app:
terminal
Copy code
npm start

## Usage
Once both servers (Flask and React) are running, access the app from English:http://localhost:3000. The interface will allow you to perform CRUD operations and user authentication.

## Endpoints API
Method	Route	Description
GET	/users	List all users
POST	/users	Create a new user
PUT	/users/<id>	Update a user
DELETE	/users/<id>	Delete a user
POST	/login	Login

## API Endpoints
Method Route Description
GET /users List all users
POST /users Create a new user
PUT /users/<id> Update a user
DELETE /users/<id> Delete a user
POST /login Login

## Security
User passwords are stored using hashing to ensure security, so login using the username or email and password in plain text, it does not work with the hash.
The application uses sessions for authentication management.

## License
This project is licensed under the terms of the MIT license.

## Author
Cristian Jurado

## Mail
cjalejo10@gmail.com
