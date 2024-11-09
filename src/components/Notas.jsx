import React, { useState } from 'react';

const Notas = ({notas, setNotas, notaError}) => {
   
    const agregarNota = () => {
        setNotas([...notas, '']);
    };

    const eliminarNota = (index) => {
        setNotas(notas.filter((_, i) => i !== index));
    };

    const actualizarNota = (index, valor) => {
        const nuevosNotas = [...notas];
        nuevosNotas[index] = valor;
        setNotas(nuevosNotas);
    };

    return (
        <div className="mb-3">
            <label>Notas del Proceso</label>
            <div>
                {notas.map((nota, index) => (
                    <div className="input-group mb-2" key={index}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nota"
                            value={nota}
                            onChange={(e) => actualizarNota(index, e.target.value)}
                            minLength={10}
                            maxLength={100}
                        />
                        <button className="btn btn-danger" onClick={() => eliminarNota(index)}>Eliminar</button>
                        <div>
                            {notaError && <small className="text-danger">{notaError}</small>}
                        </div>
                    </div>
                ))}
                <button className="btn btn-sm btn-success mt-2" onClick={agregarNota}>Añadir Nota</button>
            </div>
        </div>
    );
};

export default Notas;
