import React from 'react';

const TransactionModal = ({ visible, message }) => {
    if (!visible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content tx-modal">
                <div className="spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default TransactionModal;
