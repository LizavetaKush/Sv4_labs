import React from 'react';
import Modal from '../Modal/Modal';
import { getDefaultImage } from '../../utils/imageUtils';
import '../../styles/common.css';

const SubscriptionDetail = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const imageUrl = item.image || getDefaultImage('subscription');
  const recipient = item.recipient;
  const publication = item.publication;

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Детальная информация о подписке" size="large">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img
            src={imageUrl}
            alt="Подписка"
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
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Подписка #{item.id}</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>ID:</strong> {item.id}
          </div>
          {recipient && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Получатель:</strong> {recipient.fullName} ({recipient.code})
              <br />
              <small style={{ color: '#666' }}>
                {recipient.street}, д. {recipient.house}
                {recipient.apartment && `, кв. ${recipient.apartment}`}
              </small>
            </div>
          )}
          {publication && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Издание:</strong> {publication.title} ({publication.type})
              <br />
              <small style={{ color: '#666' }}>
                Индекс: {publication.index} | Цена: {parseFloat(publication.monthlyPrice).toFixed(2)} руб./мес.
              </small>
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <strong>Срок подписки:</strong> {item.duration} {item.duration === 1 ? 'месяц' : item.duration < 5 ? 'месяца' : 'месяцев'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Начало доставки:</strong> {months[item.startMonth - 1]} {item.startYear}
          </div>
          {publication && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <strong>Общая стоимость:</strong>{' '}
              {(parseFloat(publication.monthlyPrice) * item.duration).toFixed(2)} руб.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionDetail;
