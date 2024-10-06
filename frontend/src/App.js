import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login'; // Importa tu componente de login

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({ usuario: '', correo: '', contraseña: '' });
  const [editId, setEditId] = useState(null);
  const [editingUser, setEditingUser] = useState({ id: '', usuario: '', correo: '', contraseña: '' });
  const [deleteId, setDeleteId] = useState(''); // Estado para el combo box de eliminación
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('user_id') !== null); // Verifica si el usuario está autenticado

  useEffect(() => {
    if (isAuthenticated) obtenerUsuarios();
  }, [isAuthenticated]);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const crearUsuario = async () => {
    const usuarioExistente = usuarios.find(
      (u) => u.usuario === usuario.usuario || u.correo === usuario.correo
    );

    if (usuarioExistente) {
      setErrorMessage('El nombre de usuario o el correo ya existen. Por favor, elige otros.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/usuarios', usuario);
      obtenerUsuarios();
      setUsuario({ usuario: '', correo: '', contraseña: '' });
      setErrorMessage('');
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/usuarios/${id}`);
      obtenerUsuarios();
      setDeleteId(''); // Limpiar el combo box después de eliminar
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const editarUsuario = async () => {
    try {
      await axios.put(`http://localhost:5000/usuarios/${editId}`, usuario);
      obtenerUsuarios();
      setUsuario({ usuario: '', correo: '', contraseña: '' });
      setEditId(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const manejarCambio = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarCambioEdicion = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value,
    });
  };

  const cargarDatosEdicion = (user) => {
    if (user) {
      setEditingUser({ id: user.id, usuario: user.usuario, correo: user.correo, contraseña: user.contraseña });
    } else {
      setEditingUser({ id: '', usuario: '', correo: '', contraseña: '' });
    }
  };

  const actualizarUsuarioEditado = async () => {
    try {
      await axios.put(`http://localhost:5000/usuarios/${editingUser.id}`, {
        usuario: editingUser.usuario,
        correo: editingUser.correo,
        contraseña: editingUser.contraseña,
      });
      obtenerUsuarios();
      setEditingUser({ id: '', usuario: '', correo: '', contraseña: '' });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleLogin = (userId) => {
    localStorage.setItem('user_id', userId); // Almacena el ID del usuario en el almacenamiento local
    setIsAuthenticated(true); // Actualiza el estado de autenticación
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      {/* Ruta para el login */}
      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      {/* Ruta protegida para el CRUD */}
      <Route
        path="/crud"
        element={
          isAuthenticated ? (
            <div className="container mt-5 position-relative">
              {/* Botón de cerrar sesión en la esquina superior derecha */}
              <button className="btn btn-danger btn-lg position-absolute" style={{ top: '-25px', right: '20px', padding: '10px 20px' }} onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
              </button>

              <h1 className="text-center mb-4">CRUD de Usuarios</h1>

              {/* Formulario para crear usuarios */}
              <div className="card p-4 mb-5">
                <h3 className="mb-3">Crear Usuario</h3>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control mb-3"
                    name="usuario"
                    placeholder="Nombre de usuario"
                    value={usuario.usuario}
                    onChange={manejarCambio}
                  />
                  <input
                    type="email"
                    className="form-control mb-3"
                    name="correo"
                    placeholder="Correo"
                    value={usuario.correo}
                    onChange={manejarCambio}
                  />
                  <input
                    type="password"
                    className="form-control mb-3"
                    name="contraseña"
                    placeholder="Contraseña"
                    value={usuario.contraseña}
                    onChange={manejarCambio}
                  />
                  <button className="btn btn-primary" onClick={editId ? editarUsuario : crearUsuario}>
                    {editId ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </button>
                </div>
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
              </div>

              {/* Tabla de lista de usuarios */}
              <h2 className="mb-4">Lista de Usuarios</h2>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.usuario}</td>
                      <td>{user.correo}</td>
                      <td>
                        <button className="btn btn-warning me-2" onClick={() => cargarDatosEdicion(user)}>
                          Editar
                        </button>
                        <button className="btn btn-danger" onClick={() => eliminarUsuario(user.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Sección de edición de usuarios */}
              <div className="card p-4 mt-5">
                <h3 className="mb-3">Editar Usuario</h3>
                <div className="form-group">
                  <label>ID:</label>
                  <select
                    className="form-select mb-3"
                    value={editingUser.id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const user = usuarios.find((u) => u.id === parseInt(selectedId));
                      cargarDatosEdicion(user);
                    }}
                  >
                    <option value="">Seleccione un ID</option>
                    {usuarios.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.id}
                      </option>
                    ))}
                  </select>

                  <label>Usuario:</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    name="usuario"
                    value={editingUser.usuario}
                    onChange={manejarCambioEdicion}
                    disabled={!editingUser.id}
                  />

                  <label>Correo:</label>
                  <input
                    type="email"
                    className="form-control mb-3"
                    name="correo"
                    value={editingUser.correo}
                    onChange={manejarCambioEdicion}
                    disabled={!editingUser.id}
                  />

                  <label>Contraseña:</label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    name="contraseña"
                    value={editingUser.contraseña}
                    onChange={manejarCambioEdicion}
                    disabled={!editingUser.id}
                  />

                  <button className="btn btn-primary" onClick={actualizarUsuarioEditado} disabled={!editingUser.id}>
                    Actualizar Usuario
                  </button>
                </div>
              </div>

              {/* Sección de eliminación de usuarios */}
              <div className="card p-4 mt-5">
                <h3 className="mb-3">Eliminar Usuario</h3>
                <div className="form-group">
                  <label>ID:</label>
                  <select
                    className="form-select mb-3"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                  >
                    <option value="">Seleccione un ID</option>
                    {usuarios.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.id}
                      </option>
                    ))}
                  </select>

                  <button className="btn btn-danger" onClick={() => eliminarUsuario(deleteId)} disabled={!deleteId}>
                    Eliminar Usuario
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <Navigate to="/login" /> // Redirigir a la página de login si no está autenticado
          )
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
