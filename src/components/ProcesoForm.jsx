import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import { doc, collection, getDocs, addDoc } from 'firebase/firestore';
import Resultados from './Resultados';
import Responsables from './Responsables';
import Entradas from './Entradas';
import Controles from './Controles';
import Notas from './Notas';
import Actividades from './Actividades';

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

    useEffect(() => {
        const cargarProcesosAlIniciar = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    return;
                }

                const procesosRef = collection(doc(db, 'Usuarios', user.uid), 'Procesos');
                const querySnapshot = await getDocs(procesosRef);
                const procesos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setProcesosCargados(procesos);
            } catch (error) {
                console.error('Error al cargar los procesos desde Firebase:', error);
            }
        };

        cargarProcesosAlIniciar();
    }, []);

    const limpiarFormulario = () => {
        setNombreProceso('');
        setProposito('');
        setResultados([]);
        setActividades([]);
        setResponsables([]);
        setEntradas([]);
        setControles([]);
        setNotas([]);
        setProcesoSeleccionado(null);
    };

    useEffect(() => {
        if (onLogout) {
            onLogout(limpiarFormulario);
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
            await addDoc(collection(doc(db, 'Usuarios', user.uid), 'Procesos'), formularioData);
            alert('Formulario guardado exitosamente en Firestore.');
        } catch (error) {
            console.error('Error al guardar el formulario en Firestore:', error);
            alert('Hubo un error al intentar guardar el formulario.');
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

                    <button type="button" className="btn btn-primary mt-3 ms-2" onClick={guardarFormularioEnFirestore}>
                        Guardar Formulario en Firestore
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProcesoForm;
