import React from 'react';
import Modal from '../Modal/Modal';
import { getDefaultImage } from '../../utils/imageUtils';
import '../../styles/common.css';

const RecipientDetail = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const imageUrl = item.image || getDefaultImage('recipient');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Детальная информация о получателе" size="large">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img
            src={imageUrl}
            alt={item.fullName}
            style={{
              width: '100%',
              maxWidth: '300px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          />
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>{item.fullName}</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>ID:</strong> {item.id}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Код получателя:</strong> {item.code}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Адрес:</strong> {item.street}, д. {item.house}
            {item.apartment && `, кв. ${item.apartment}`}
          </div>
          {item.subscriptions && item.subscriptions.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <strong>Количество подписок:</strong> {item.subscriptions.length}
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {item.subscriptions.map((sub) => (
                  <li key={sub.id}>
                    Подписка #{sub.id} - {sub.publication?.title || 'Издание'} ({sub.duration} мес.)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RecipientDetail;
