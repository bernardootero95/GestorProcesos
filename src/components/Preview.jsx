import React from 'react';

const Preview = ({ nombreProceso, proposito, resultados, actividades, responsables, entradas, controles, notas }) => {
    return (
        <div>
            <h4 className="text-center">{nombreProceso.toUpperCase()}</h4>
            <h5>PROPÓSITO</h5>
            <p>{proposito}</p>

            <h5>RESULTADOS</h5>
            {resultados.map((resultado, index) => (
                <div key={index}>
                    <p><strong>{index + 1}. {resultado.nombre}</strong></p>
                    {resultado.salidas && resultado.salidas.length > 0 && (
                        <ul>
                            {resultado.salidas.map((salida, i) => (
                                <li key={i}>{salida}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}

            <h5>ACTIVIDADES</h5>
            {actividades.map((actividad, index) => (
                <div key={index}>
                    <p><strong>{index + 1}. {actividad.nombre}</strong></p>
                    {actividad.tareas && actividad.tareas.length > 0 && (
                        <ul>
                            {actividad.tareas.map((tarea, i) => (
                                <li key={i}>{tarea}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}

            <h5>RESPONSABLES</h5>
            <ul>
                {responsables.map((responsable, index) => (
                    <li key={index}>{responsable}</li>
                ))}
            </ul>

            <h5>ENTRADAS</h5>
            <ul>
                {entradas.map((entrada, index) => (
                    <li key={index}>{entrada}</li>
                ))}
            </ul>

            <h5>CONTROLES</h5>
            <ul>
                {controles.map((control, index) => (
                    <li key={index}>{control}</li>
                ))}
            </ul>

            <h5>NOTAS</h5>
            <ul>
                {notas.map((nota, index) => (
                    <li key={index}>{nota}</li>
                ))}
            </ul>
        </div>
    );
};

export default Preview;
