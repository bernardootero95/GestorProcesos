import React, { useState } from 'react';
import Tareas from './Tareas';

const Actividades = ({ actividades, setActividades, actividadesError }) => {
    

    const agregarActividad = () => {
        setActividades([...actividades, { nombre: '', tareas: [] }]);
    };

    const eliminarActividad = (index) => {
        setActividades(actividades.filter((_, i) => i !== index));
    };

    const actualizarActividad = (index, valor) => {
        const nuevasActividades = [...actividades];
        nuevasActividades[index].nombre = valor;
        setActividades(nuevasActividades);
    };

    const agregarTarea = (actividadIndex) => {
        const nuevasActividades = [...actividades];
        nuevasActividades[actividadIndex].tareas.push('');
        setActividades(nuevasActividades);
    };

    const actualizarTarea = (actividadIndex, tareaIndex, valor) => {
        const nuevasActividades = [...actividades];
        nuevasActividades[actividadIndex].tareas[tareaIndex] = valor;
        setActividades(nuevasActividades);
    };

    const eliminarTarea = (actividadIndex, tareaIndex) => {
        const nuevasActividades = [...actividades];
        nuevasActividades[actividadIndex].tareas = nuevasActividades[actividadIndex].tareas.filter((_, i) => i !== tareaIndex);
        setActividades(nuevasActividades);
    };


    return (
        <div className="mb-3">
            <label>Actividades del Proceso</label>
            <div>
            {actividades.map((actividad, index) => (
                <div className="mb-3" key={index}>
                    <div className='input-group mb-2'>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de la Actividad"
                            value={actividad.nombre}
                            onChange={(e) => actualizarActividad(index, e.target.value)}
                            minLength={10}
                            maxLength={100}
                        />
                        <button className="btn btn-danger" onClick={() => eliminarActividad(index)}>Eliminar</button>
                    </div>
                    {actividadesError && <small className="text-danger">{actividadesError}</small>}
                    <Tareas
                        tareas={actividad.tareas}
                        agregarTarea={() => agregarTarea(index)}
                        actualizarTarea={(tareaIndex, valor) => actualizarTarea(index, tareaIndex, valor)}
                        eliminarTarea={(tareaIndex) => eliminarTarea(index, tareaIndex)}
                    />

                </div>
            ))}
            <button className="btn btn-sm btn-success mt-2 " onClick={agregarActividad}>
                Añadir Actividad
            </button>
            </div>
        </div>
    );
};

export default Actividades;
