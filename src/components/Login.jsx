import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Alert from './Alert';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setAlertMessage('Inicio de sesión exitoso. Bienvenido!');
            setAlertType('success');
            setShowAlert(true);
            setEmail('');
            setPassword('');
            const modalElement = document.getElementById('loginModal');
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            modalInstance && modalInstance.hide();
        } catch (error) {
            setAlertMessage('Error al iniciar sesión: ' + error.message);
            setAlertType('error');
            setShowAlert(true);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <div className="container mt-5">
            <h3>Iniciar Sesión</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>

            <Alert
                show={showAlert}
                onClose={handleCloseAlert}
                message={alertMessage}
                type={alertType}
                title={alertType === 'success' ? '¡Éxito!' : '¡Error!'}
            />
        </div>
    );
};

export default Login;
