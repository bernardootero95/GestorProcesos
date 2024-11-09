import React from 'react';

const Tareas = ({ tareas, agregarTarea, actualizarTarea, eliminarTarea }) => {
    return (
        <div className="tareas-container">
            {tareas.map((tarea, tareaIndex) => (
                <div className="input-group mb-2" key={tareaIndex}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tarea"
                        value={tarea}
                        onChange={(e) => actualizarTarea(tareaIndex, e.target.value)}
                        minLength={10}
                        maxLength={100}
                    />
                    <button className="btn btn-danger" onClick={() => eliminarTarea(tareaIndex)} >
                        Eliminar
                    </button>
                </div>
                
            ))}
            <button className="btn btn-sm btn-warning mt-2" onClick={agregarTarea}>
                Añadir Tarea
            </button>
        </div>
    );
};

export default Tareas;
