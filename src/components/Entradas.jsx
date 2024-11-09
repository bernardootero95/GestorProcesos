import React, { useState } from 'react';

const Entradas = ({entradas, setEntradas, entradaError}) => {
    

    const agregarEntrada = () => {
        setEntradas([...entradas, '']);
    };

    const eliminarEntrada = (index) => {
        setEntradas(entradas.filter((_, i) => i !== index));
    };

    const actualizarEntrada = (index, valor) => {
        const nuevasEntradas = [...entradas];
        nuevasEntradas[index] = valor;
        setEntradas(nuevasEntradas);
    };

    return (
        <div className="mb-3">
            <label>Entradas del Proceso</label>
            <div>
                {entradas.map((entrada, index) => (
                    <div>
                        <div className="input-group mb-2" key={index}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Entrada"
                                value={entrada}
                                onChange={(e) => actualizarEntrada(index, e.target.value)}
                                minLength={10}
                                maxLength={100}
                            />
                            <button className="btn btn-danger" onClick={() => eliminarEntrada(index)}>Eliminar</button>
                        </div>
                        {entradaError && <small className="text-danger">{entradaError}</small>}
                    </div>
                ))}
                <button className="btn btn-sm btn-success mt-2" onClick={agregarEntrada}>Añadir Entrada</button>
            </div>
        </div>
    );
};

export default Entradas;
