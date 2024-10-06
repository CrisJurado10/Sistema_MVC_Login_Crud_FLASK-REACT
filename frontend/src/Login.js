import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ usuario: '', contraseña: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', credentials);
      if (response.status === 200) {
        const userId = response.data.user_id; // Asegúrate de que tu API envíe el ID del usuario
        console.log('ID del usuario:', userId); // Para debug
        onLogin(userId); // Llama a la función para almacenar el ID
        navigate('/crud'); // Navega a la página de CRUD
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales inválidas. Por favor, intenta nuevamente.');
      } else {
        setError('Hubo un error al intentar iniciar sesión. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: 'linear-gradient(to bottom right, #e3e3e3, #b0b0b0)' }}>
      <div className="col-md-4">
        <div className="card shadow" style={{ padding: '40px' }}>
          <div className="card-body">
            <h2 className="text-center mb-4" style={{ fontSize: '2.5rem' }}>Iniciar Sesión</h2>
            <form onSubmit={manejarSubmit}>
              <div className="form-group mb-3">
                <label style={{ fontSize: '1.2rem' }}>Usuario o Correo</label>
                <input
                  type="text"
                  className="form-control form-control-lg" // Clase para hacer el input más grande
                  name="usuario"
                  placeholder="Usuario o Correo"
                  value={credentials.usuario}
                  onChange={manejarCambio}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label style={{ fontSize: '1.2rem' }}>Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg" // Clase para hacer el input más grande
                  name="contraseña"
                  placeholder="Contraseña"
                  value={credentials.contraseña}
                  onChange={manejarCambio}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Iniciar Sesión</button> {/* Clase para hacer el botón más grande */}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
