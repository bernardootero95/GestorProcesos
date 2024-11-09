import React from 'react';

const Salidas = ({ salidas, agregarSalida, actualizarSalida, eliminarSalida }) => {
    return (
        <div className="tareas-container">
            {salidas.map((salida, salidaIndex) => (
                <div className="input-group mb-2" key={salidaIndex}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Salida"
                        value={salida}
                        onChange={(e) => actualizarSalida(salidaIndex, e.target.value)}
                        minLength={10}
                        maxLength={100}
                    />
                    <button className="btn btn-danger" onClick={() => eliminarSalida(salidaIndex)} >
                        Eliminar
                    </button>
                </div>
                
            ))}
            <button className="btn btn-sm btn-warning mt-2" onClick={agregarSalida}>
                Añadir Salida
            </button>
        </div>
    );
};

export default Salidas;