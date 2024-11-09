import React, { useState } from 'react';

const Controles = ({ controles, setControles, controlError }) => {
    
    const agregarControl = () => {
        setControles([...controles, '']);
    };

    const eliminarControl = (index) => {
        setControles(controles.filter((_, i) => i !== index));
    };

    const actualizarControl = (index, valor) => {
        const nuevosControles = [...controles];
        nuevosControles[index] = valor;
        setControles(nuevosControles);
    };

    return (
        <div className="mb-3">
            <label>Controles del Proceso</label>
            <div>
                {controles.map((control, index) => (
                    <div className="input-group mb-2" key={index}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Control"
                            value={control}
                            onChange={(e) => actualizarControl(index, e.target.value)}
                            minLength={10}
                            maxLength={100}
                        />
                        <button className="btn btn-danger" onClick={() => eliminarControl(index)}>Eliminar</button>
                        <div>
                            {controlError && <small className="text-danger">{controlError}</small>}
                        </div>
                    </div>
                ))}
                <button className="btn btn-sm btn-success mt-2" onClick={agregarControl}>Añadir Control</button>
            </div>
        </div>
    );
};

export default Controles;
