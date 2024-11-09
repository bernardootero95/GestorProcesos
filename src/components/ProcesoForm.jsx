import React, { useState, useEffect, useRef  } from 'react';
import { db, auth } from '../../firebaseConfig';
import { doc, collection, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import Resultados from './Resultados';
import Responsables from './Responsables';
import Entradas from './Entradas';
import Controles from './Controles';
import Notas from './Notas';
import Actividades from './Actividades';
import { onAuthStateChanged } from 'firebase/auth';
import Alert from './Alert';
import Preview from './Preview';
import html2canvas from 'html2canvas';

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
    const [alertType, setAlertType] = useState('info');
    const [showPreview, setShowPreview] = useState(false);
    const previewRef = useRef();

    const generarVistaPrevia = () => {
        setShowPreview(true);
    };

    const cerrarVistaPrevia = () => {
        setShowPreview(false);
    };

    const exportarAPDF = async () => {
        if (previewRef.current) {
            const canvas = await html2canvas(previewRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // Ancho de la página A4 en mm
            const pageHeight = 297; // Altura de la página A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${nombreProceso.replace(/\s+/g, '_')}_proceso.pdf`);
        }
    };

    const imprimirPreview = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Vista Previa del Proceso</title></head><body>');
        printWindow.document.write(previewRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
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
            setAlertMessage('Error al cargar los procesos desde Firebase:', error);
            setAlertType('error');
            setShowAlert(true);
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
                setAlertMessage('Proceso cargado exitosamente.');
                setAlertType('success');
                setShowAlert(true);
            } else {
                setAlertMessage('Proceso no encontrado. ');
                setAlertType('error');
                setShowAlert(true);
            }
        } else {
            setAlertMessage('Seleccione un proceso de la lista.');
            setAlertType('info');
            setShowAlert(true);
        }
    };

    const guardarFormularioEnFirestore = async () => {
        const user = auth.currentUser;
        if (!user) {
            setAlertMessage('Debe iniciar sesión para guardar el formulario.');
            setAlertType('info');
            setShowAlert(true);
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
                setAlertMessage('Formulario actualizado exitosamente en Firestore.');
                setAlertType('success');
                setShowAlert(true);
                setProcesoId(null); // Volver al estado inicial
            } else {
                // Crear un nuevo proceso
                await addDoc(collection(doc(db, 'Usuarios', user.uid), 'Procesos'), formularioData);
                setAlertMessage('Formulario guardado exitosamente en Firestore.');
                setAlertType('success');
                setShowAlert(true);
            }
            // Recargar la lista de procesos después de guardar/actualizar
            cargarProcesosDelUsuario(user.uid);
        } catch (error) {
            setAlertMessage('Error al guardar el formulario en Firestore:', error);
            setAlertType('error');
            setShowAlert(true);
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
        setAlertMessage('Formulario descargado exitosamente.');
        setAlertType('success');
        setShowAlert(true);
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
                    setProcesoId(null); 
                    setAlertMessage('Formulario cargado exitosamente.');
                    setAlertType('success');
                    setShowAlert(true);
                } catch (error) {
                    setAlertMessage('Error al cargar el archivo .pro:', error);
                    setAlertType('error');
                    setShowAlert(true);
                }
            };
            reader.readAsText(file);
        } else {
            setAlertMessage('Por favor, seleccione un archivo con la extensión .pro.');
            setAlertType('info');
            setShowAlert(true);
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
                        <button type="button" className="btn btn-secondary me-2" onClick={generarVistaPrevia}>
                            Vista Previa del Proceso
                        </button>
                    </div>
                </form>
            </div>
            <Alert
                show={showAlert}
                onClose={handleCloseAlert}
                message={alertMessage}
                type={alertType}
                title={alertType === 'success' ? '¡Éxito!' : '¡Error!'}
            />
            {showPreview && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Vista Previa del Proceso</h5>
                                <button type="button" className="btn-close" onClick={cerrarVistaPrevia}></button>
                            </div>
                            <div className="modal-body" ref={previewRef}>
                                <Preview
                                    nombreProceso={nombreProceso}
                                    proposito={proposito}
                                    resultados={resultados}
                                    actividades={actividades}
                                    responsables={responsables}
                                    entradas={entradas}
                                    controles={controles}
                                    notas={notas}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cerrarVistaPrevia}>Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={exportarAPDF}>Exportar a PDF</button>
                                <button type="button" className="btn btn-info" onClick={imprimirPreview}>Imprimir</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcesoForm;
