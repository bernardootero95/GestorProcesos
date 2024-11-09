import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Alert from './Alert';

const Navbar = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userDoc = await getDoc(doc(db, 'Usuarios', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().nombre);
                    } else {
                        setAlertMessage('No se encontró el documento del usuario.');
                        setAlertType('error');
                        setShowAlert(true);
                    }
                } catch (error) {
                    setAlertMessage('Error al obtener el nombre del usuario:' + error.message);
                    setAlertType('error');
                    setShowAlert(true);
                }
            } else {
                setUser(null);
                setUserName('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setAlertMessage('Sesión cerrada exitosamente');
                setAlertType('success');
                setShowAlert(true);
                if (onLogout) {
                    onLogout(); // Llama a la función de limpieza del formulario
                }
                window.location.reload();
            })
            .catch((error) => {
                setAlertMessage('Error al cerrar sesión:' + error.message);
                setAlertType('error');
                setShowAlert(true);
            });
    };

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Gestión de Procesos</a>
                <div className="ms-auto">
                    {user ? (
                        <div className="d-flex align-items-center">
                            <span className="text-light me-3">Hola, {userName}</span>
                            <button className="btn btn-outline-light" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <>
                            <button 
                                className="btn btn-outline-light me-2" 
                                data-bs-toggle="modal" 
                                data-bs-target="#loginModal"
                            >
                                Iniciar Sesión
                            </button>
                            <button 
                                className="btn btn-outline-light" 
                                data-bs-toggle="modal" 
                                data-bs-target="#registerModal"
                            >
                                Registrarse
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
        <Alert
                show={showAlert}
                onClose={handleCloseAlert}
                message={alertMessage}
                type={alertType}
                title={alertType === 'success' ? '¡Éxito!' : '¡Error!'}
            />
        </>
    );
};

export default Navbar;
