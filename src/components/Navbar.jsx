import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Obtener el nombre del usuario desde Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'Usuarios', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().nombre);
                    } else {
                        console.log('No se encontró el documento del usuario.');
                    }
                } catch (error) {
                    console.error('Error al obtener el nombre del usuario:', error);
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
                alert('Sesión cerrada exitosamente');
                if (onLogout) {
                    onLogout(); // Llama a la función de limpieza del formulario
                }
                window.location.reload();
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
    );
};

export default Navbar;
