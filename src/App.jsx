import React from 'react';
import Navbar from './components/Navbar';
import ProcesoForm from './components/ProcesoForm';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function App() {
    const handleLogout = (limpiarFormulario) => {
        if (limpiarFormulario) {
            limpiarFormulario();
        }
    };

    return (
        <div>
            <Navbar onLogout={handleLogout} />
            <ProcesoForm onLogout={handleLogout} />
            <LoginModal />
            <RegisterModal />
        </div>
    );
}

export default App;
