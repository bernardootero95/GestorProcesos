import React, { useState } from 'react';

const Responsables = ({responsables, setResponsables, responsableError}) => {

    const agregarResponsables = () => {
        setResponsables([...responsables, '']);
    };

    const eliminarResponsable = (index) => {
        setResponsables(responsables.filter((_, i) => i !== index));
    };

    const actualizarResponsable = (index, valor) => {
        const nuevosResponsables = [...responsables];
        nuevosResponsables[index] = valor;
        setResponsables(nuevosResponsables);
    };

    return (
        <div className="mb-3">
            <label>Responsables del Proceso</label>
            <div>
                {responsables.map((responsable, index) => (
                    <div>
                        <div className="input-group mb-2" key={index}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Responsable"
                            value={responsable}
                            onChange={(e) => actualizarResponsable(index, e.target.value)}
                            minLength={10}
                            maxLength={100}
                        />
                        <button className="btn btn-danger" onClick={() => eliminarResponsable(index)}>Eliminar</button>
                        </div>
                        {responsableError && <small className="text-danger">{responsableError}</small>}
                    </div>
                ))}
                <button className="btn btn-sm btn-success mt-2" onClick={agregarResponsables}>Añadir Responsable</button>
            </div>
        </div>
    );
};

export default Responsables;
