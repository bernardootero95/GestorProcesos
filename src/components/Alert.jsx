import React from 'react';

const Alert = ({ show, onClose, message, title = 'Mensaje', type = 'info' }) => {
    const alertClass = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    }[type] || 'alert-info';

    return (
        <div 
            className={`modal fade ${show ? 'show d-block' : ''}`} 
            tabIndex="-1" 
            role="dialog" 
            style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog" role="document">
                <div className={`modal-content ${alertClass}`}>
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
