import React from "react";

const Alert = ({mensaje}) => {

    return (
        <div 
            className="modal fade" 
            id="loginModal" 
            tabIndex="-1" 
            aria-labelledby="loginModalLabel" 
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <a></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
