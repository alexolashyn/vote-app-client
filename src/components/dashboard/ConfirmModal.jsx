import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

const ConfirmModal = ({isOpen, onClose, onConfirm, title, message}) => {
    const {t} = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn btn-dark btn-cancel" onClick={onClose}>{t('cancel')}</button>
                    <button className="btn btn-dark" onClick={onConfirm}>{t('closePoll')}</button>
                </div>
            </div>
        </div>
    );
};

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default ConfirmModal;
