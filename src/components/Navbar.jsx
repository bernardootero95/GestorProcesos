import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Navbar = ({ onLogout }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                alert('Sesión cerrada exitosamente');
                if (onLogout) {
                    onLogout(); // Llama a la función de limpieza del formulario
                }
            })
            .catch((error) => {
                console.error('Error al cerrar sesión:', error);
                alert('Error al cerrar sesión');
            });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Gestión de Procesos</a>
                <div className="ms-auto">
                    {user ? (
                        <button className="btn btn-outline-light" onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
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
    );
};

export default Navbar;
