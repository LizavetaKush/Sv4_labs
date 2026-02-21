import React from 'react'
import Modal from '../Modal/Modal'
import './ConfirmDialog.css'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Подтверждение'}>
      <div className="confirm-dialog">
        <p>{message || 'Вы уверены, что хотите выполнить это действие?'}</p>
        <div className="confirm-dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
