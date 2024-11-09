import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { doc, collection, addDoc } from 'firebase/firestore';
import { auth } from '../../firebaseConfig';

const SaveJsonButton = ({ jsonData }) => {
    const [status, setStatus] = useState('');

    const handleSaveJson = async () => {
        try {
            // Verificar si el usuario está autenticado
            const user = auth.currentUser;
            if (!user) {
                setStatus('Debes iniciar sesión para guardar el JSON.');
                return;
            }

            // Referencia al documento del usuario
            const userDocRef = doc(db, 'Usuarios', user.uid);

            // Guardar el JSON en la subcolección 'jsonData' del usuario
            await addDoc(collection(userDocRef, 'jsonData'), jsonData);

            setStatus('JSON guardado exitosamente en la subcolección de Firestore.');
        } catch (error) {
            console.error('Error al guardar el JSON en Firestore:', error);
            setStatus('Error al guardar el JSON');
        }
    };

    return (
        <div>
            <button className="btn btn-success" onClick={handleSaveJson}>
                Guardar JSON en la Subcolección de Firestore
            </button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default SaveJsonButton;
