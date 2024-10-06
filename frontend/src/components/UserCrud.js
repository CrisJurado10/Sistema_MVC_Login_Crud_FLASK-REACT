import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function UserCrud({ isAuthenticated }) {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [editId, setEditId] = useState(null); // ID del usuario a editar
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            // Actualiza usuario existente
            try {
                await axios.put(`http://localhost:5000/api/users/${editId}`, form);
                setEditId(null); // Reinicia el ID de edición
            } catch (error) {
                console.error('Error actualizando usuario:', error);
            }
        } else {
            // Crea nuevo usuario
            const userExists = users.find(user => user.username === form.username || user.email === form.email);
            if (userExists) {
                setErrorMessage('El nombre de usuario o el correo ya existen. Por favor, elige otros.');
                return;
            }

            try {
                await axios.post('http://localhost:5000/api/users', form);
            } catch (error) {
                console.error('Error creando usuario:', error);
            }
        }
        
        loadUsers();
        setForm({ username: '', email: '', password: '' });
        setErrorMessage(''); // Limpia el mensaje de error
    };

    const handleEdit = (user) => {
        setForm({ username: user.username, email: user.email, password: user.password });
        setEditId(user.id); // Establece el ID del usuario que se va a editar
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            loadUsers();
        } catch (error) {
            console.error('Error eliminando usuario:', error);
        }
    };

    const crudContent = isAuthenticated ? (
        <div>
            <h1>CRUD de Usuarios</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    value={form.username} 
                    onChange={handleChange} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">{editId ? 'Update User' : 'Create User'}</button>
            </form>

            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <Navigate to="/login" />
    );

    return crudContent;
}

export default UserCrud;
