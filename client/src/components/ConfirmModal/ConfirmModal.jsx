import React from 'react';
import Modal from '../Modal/Modal';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
