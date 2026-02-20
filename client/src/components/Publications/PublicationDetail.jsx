import React from 'react';
import Modal from '../Modal/Modal';
import { getDefaultImage } from '../../utils/imageUtils';
import '../../styles/common.css';

const PublicationDetail = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const imageUrl = item.image || getDefaultImage('publication');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Детальная информация об издании" size="large">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img
            src={imageUrl}
            alt={item.title}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          />
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>{item.title}</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>ID:</strong> {item.id}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Индекс:</strong> {item.index}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Вид издания:</strong> {item.type}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Стоимость подписки на 1 месяц:</strong>{' '}
            {parseFloat(item.monthlyPrice).toFixed(2)} руб.
          </div>
          {item.subscriptions && item.subscriptions.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <strong>Количество подписок:</strong> {item.subscriptions.length}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PublicationDetail;
