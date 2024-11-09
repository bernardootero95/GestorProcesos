import React from 'react';
import Salidas from './Salidas';

const Resultados = ({ resultados, setResultados, resultadoError }) => {
    const agregarResultado = () => {
        setResultados([...resultados, { nombre: '', salidas: [] }]);
    };

    const eliminarResultado = (index) => {
        setResultados(resultados.filter((_, i) => i !== index));
    };

    const actualizarResultado = (index, valor) => {
        const nuevosResultados = [...resultados];
        nuevosResultados[index].nombre = valor;
        setResultados(nuevosResultados);
    };

    const agregarSalida = (resultadoIndex) => {
        const nuevosResultados = [...resultados];
        nuevosResultados[resultadoIndex].salidas.push('');
        setResultados(nuevosResultados);
    };

    const actualizarSalida = (resultadoIndex, salidaIndex, valor) => {
        const nuevosResultados = [...resultados];
        nuevosResultados[resultadoIndex].salidas[salidaIndex] = valor;
        setResultados(nuevosResultados);
    };

    const eliminarSalida = (resultadoIndex, salidaIndex) => {
        const nuevosResultados = [...resultados];
        nuevosResultados[resultadoIndex].salidas = nuevosResultados[resultadoIndex].salidas.filter((_, i) => i !== salidaIndex);
        setResultados(nuevosResultados);
    };

    return (
        <div className="mb-3">
            <label>Resultados del Proceso</label>
            <div>
                {resultados.map((resultado, index) => (
                    <div className="mb-3" key={index}>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre del Resultado"
                                value={resultado.nombre}
                                onChange={(e) => actualizarResultado(index, e.target.value)}
                                minLength={10}
                                maxLength={100}
                            />
                            <button className="btn btn-danger" onClick={() => eliminarResultado(index)}>Eliminar</button>
                        </div>
                        {resultadoError && <small className="text-danger">{resultadoError}</small>}
                        <Salidas
                            salidas={resultado.salidas}
                            agregarSalida={() => agregarSalida(index)}
                            actualizarSalida={(salidaIndex, valor) => actualizarSalida(index, salidaIndex, valor)}
                            eliminarSalida={(salidaIndex) => eliminarSalida(index, salidaIndex)}
                        />
                    </div>
                ))}
                <button className="btn btn-sm btn-success mt-2" onClick={agregarResultado}>
                    Añadir Resultado
                </button>
            </div>
        </div>
    );
};

export default Resultados;
