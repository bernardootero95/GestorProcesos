import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import { doc, collection, getDocs, addDoc, setDoc } from 'firebase/firestore';
import Resultados from './Resultados';
import Responsables from './Responsables';
import Entradas from './Entradas';
import Controles from './Controles';
import Notas from './Notas';
import Actividades from './Actividades';
import { onAuthStateChanged } from 'firebase/auth';
import Alert from './Alert';

const ProcesoForm = ({ onLogout }) => {
    const [nombreProceso, setNombreProceso] = useState('');
    const [proposito, setProposito] = useState('');
    const [resultados, setResultados] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [controles, setControles] = useState([]);
    const [notas, setNotas] = useState([]);
    const [procesosCargados, setProcesosCargados] = useState([]);
    const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
    const [procesoId, setProcesoId] = useState(null); // Estado para el ID del proceso seleccionado
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleShowAlert = () => {
        setAlertMessage('Este es un mensaje de prueba');
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                cargarProcesosDelUsuario(user.uid);
            } else {
                setProcesosCargados([]);
            }
        });
        return () => unsuscribe();
    }, []);

    const cargarProcesosDelUsuario = async (uid) => {
        try {
            const procesosRef = collection(doc(db, 'Usuarios', uid), 'Procesos');
            const querySnapshot = await getDocs(procesosRef);
            const procesos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProcesosCargados(procesos);
        } catch (error) {
            <Alert show={showAlert} onClose={handleCloseAlert}/>
            console.error('Error al cargar los procesos desde Firebase:', error);
        }
    };

    const limpiarFormulario = () => {
        setNombreProceso('');
        setProposito('');
        setResultados([]);
        setActividades([]);
        setResponsables([]);
        setEntradas([]);
        setControles([]);
        setNotas([]);
        setProcesoId(null);
    };

    const handleNuevoFormulario = () => {
        if (window.confirm('¿Desea guardar los cambios antes de crear un nuevo formulario?')) {
            guardarFormularioEnFirestore();
        }
        limpiarFormulario();
    };

    useEffect(() => {
        if (onLogout) {
            onLogout(() => {
                if (window.confirm('¿Desea guardar los cambios antes de cerrar sesión?')) {
                    guardarFormularioEnFirestore();
                }
                limpiarFormulario();
            });
        }
    }, [onLogout]);

    const cargarProcesoEnFormulario = () => {
        if (procesoSeleccionado) {
            const proceso = procesosCargados.find(p => p.id === procesoSeleccionado);
            if (proceso) {
                setNombreProceso(proceso.nombreProceso || '');
                setProposito(proceso.proposito || '');
                setResultados(proceso.resultados || []);
                setActividades(proceso.actividades || []);
                setResponsables(proceso.responsables || []);
                setEntradas(proceso.entradas || []);
                setControles(proceso.controles || []);
                setNotas(proceso.notas || []);
                setProcesoId(proceso.id);
                alert('Proceso cargado exitosamente.');
            } else {
                alert('Proceso no encontrado.');
            }
        } else {
            alert('Seleccione un proceso de la lista.');
        }
    };

    const guardarFormularioEnFirestore = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Debe iniciar sesión para guardar el formulario.');
            return;
        }

        const formularioData = {
            nombreProceso,
            proposito,
            resultados,
            actividades,
            responsables,
            entradas,
            controles,
            notas,
            fecha: new Date().toISOString()
        };

        try {
            if (procesoId) {
                // Actualizar proceso existente
                await setDoc(doc(db, 'Usuarios', user.uid, 'Procesos', procesoId), formularioData);
                alert('Formulario actualizado exitosamente en Firestore.');
                setProcesoId(null); // Volver al estado inicial
            } else {
                // Crear un nuevo proceso
                await addDoc(collection(doc(db, 'Usuarios', user.uid), 'Procesos'), formularioData);
                alert('Formulario guardado exitosamente en Firestore.');
            }
            // Recargar la lista de procesos después de guardar/actualizar
            cargarProcesosDelUsuario(user.uid);
        } catch (error) {
            console.error('Error al guardar el formulario en Firestore:', error);
            alert('Hubo un error al intentar guardar el formulario.');
        }
    };

    const descargarFormulario = () => {
        const formularioData = {
            nombreProceso,
            proposito,
            resultados,
            actividades,
            responsables,
            entradas,
            controles,
            notas
        };

        const jsonData = JSON.stringify(formularioData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${nombreProceso.replace(/\s+/g, '_')}_proceso.pro`;
        link.click();
        URL.revokeObjectURL(url);

        alert('Formulario descargado exitosamente.');
    };

    const cargarFormulario = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.pro')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    setNombreProceso(jsonData.nombreProceso || '');
                    setProposito(jsonData.proposito || '');
                    setResultados(jsonData.resultados || []);
                    setActividades(jsonData.actividades || []);
                    setResponsables(jsonData.responsables || []);
                    setEntradas(jsonData.entradas || []);
                    setControles(jsonData.controles || []);
                    setNotas(jsonData.notas || []);
                    setProcesoId(null); // Se asegura de que se trate como un nuevo proceso
                    alert('Formulario cargado exitosamente.');
                } catch (error) {
                    console.error('Error al cargar el archivo .pro:', error);
                    alert('Hubo un error al cargar el archivo .pro.');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, seleccione un archivo con la extensión .pro.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="form-container">
                <h3>Agregar o Editar Proceso</h3>
                {procesosCargados.length > 0 && (
                    <div className="mb-3">
                        <label htmlFor="procesoSeleccionado" className="form-label">Seleccionar Proceso</label>
                        <select
                            className="form-select"
                            id="procesoSeleccionado"
                            value={procesoSeleccionado || ''}
                            onChange={(e) => setProcesoSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un proceso...</option>
                            {procesosCargados.map((proceso) => (
                                <option key={proceso.id} value={proceso.id}>
                                    {proceso.nombreProceso}
                                </option>
                            ))}
                        </select>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={cargarProcesoEnFormulario}
                        >
                            Cargar Proceso
                        </button>
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                        <label htmlFor="nombreProceso" className="form-label">Nombre del Proceso</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombreProceso" 
                            value={nombreProceso} 
                            onChange={(e) => setNombreProceso(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="proposito" className="form-label">Propósito del Proceso</label>
                        <textarea 
                            className="form-control" 
                            id="proposito" 
                            rows="2" 
                            value={proposito} 
                            onChange={(e) => setProposito(e.target.value)}
                            required
                        />
                    </div>

                    <Resultados resultados={resultados} setResultados={setResultados} />
                    <Actividades actividades={actividades} setActividades={setActividades} />
                    <Responsables responsables={responsables} setResponsables={setResponsables} />
                    <Entradas entradas={entradas} setEntradas={setEntradas} />
                    <Controles controles={controles} setControles={setControles} />
                    <Notas notas={notas} setNotas={setNotas} />
                    <div className="mt-3">
                        <button type="button" className="btn btn-primary me-2" onClick={guardarFormularioEnFirestore}>
                            {procesoId ? 'Actualizar Formulario' : 'Guardar Formulario'}
                        </button>
                        <button type="button" className="btn btn-secondary me-2" onClick={descargarFormulario}>
                            Descargar Formulario
                        </button>
                        <label className="btn btn-info me-2">
                            Cargar Formulario
                            <input type="file" className="d-none" onChange={cargarFormulario} />
                        </label>
                        <button type="button" className="btn btn-warning" onClick={handleNuevoFormulario}>
                            Nuevo Formulario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProcesoForm;
