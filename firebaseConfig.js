// Importa las funciones necesarias de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
    apiKey: 'AIzaSyCoCv9MJ3tcOvBnXyvdFG3yW50CeiP9IOw',
    authDomain: 'gestionproceso-a73bb.firebaseapp.com',
    projectId: 'gestionproceso-a73bb',
    storageBucket: 'gestionproceso-a73bb.firebasestorage.app',
    messagingSenderId: '958724326926',
    appId: '1:958724326926:web:407c74b073af4c01c9de5f'
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Auth
export const auth = getAuth(app);

export const db = getFirestore(app);
