import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import Alert from './Alert';

const Register = ({ onRegisterSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Crear usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar el nombre y UID en Firestore usando el UID como ID del documento
            await setDoc(doc(db, 'Usuarios', user.uid), {
                UID: user.uid,
                nombre: name
            });
            setAlertMessage('Usuario registrado exitosamente.');
            setAlertType('success');
            setShowAlert(true);
            setName('');
            setEmail('');
            setPassword('');

            // Llamar a la función de éxito de registro pasada como prop
            if (onRegisterSuccess) {
                onRegisterSuccess();
            }

            // Cerrar el modal de registro
            setTimeout(() => {
                const modalElement = document.getElementById('registerModal');
                if (modalElement) {
                    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            }, 2000)
            
        } catch (error) {
            setAlertMessage('Error al registrar: ' + error.message);
            setAlertType('error');
            setShowAlert(true);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Registro de Usuario</h3>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Registrar</button>
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

export default Register;
