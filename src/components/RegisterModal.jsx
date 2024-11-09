import React from 'react';
import Register from './Register';

const RegisterModal = () => (
    <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="registerModalLabel">Bienvenido</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <Register/>
                </div>
            </div>
        </div>
    </div>
);

export default RegisterModal;