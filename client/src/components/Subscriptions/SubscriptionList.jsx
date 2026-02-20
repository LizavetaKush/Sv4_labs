import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchSubscriptions,
  deleteSubscription,
} from '../../store/slices/subscriptionSlice';
import { fetchRecipients } from '../../store/slices/recipientSlice';
import { fetchPublications } from '../../store/slices/publicationSlice';
import SubscriptionForm from './SubscriptionForm';
import SubscriptionDetail from './SubscriptionDetail';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import '../../styles/common.css';

const SubscriptionList = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.subscriptions);
  const { items: recipients } = useSelector((state) => state.recipients);
  const { items: publications } = useSelector((state) => state.publications);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'id',
    sortOrder: 'ASC',
  });
  const [recipientFilter, setRecipientFilter] = useState('');
  const [publicationFilter, setPublicationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');

  useEffect(() => {
    dispatch(fetchRecipients({ limit: 1000 }));
    dispatch(fetchPublications({ limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    const params = { ...filters };
    if (recipientFilter) params.recipientId = recipientFilter;
    if (publicationFilter) params.publicationId = publicationFilter;
    if (durationFilter) params.duration = durationFilter;
    dispatch(fetchSubscriptions(params));
  }, [dispatch, filters, recipientFilter, publicationFilter, durationFilter]);

  const handleCreate = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleView = async (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteSubscription(selectedItem.id)).unwrap();
      toast.success('Подписка успешно удалена');
      if (items.length === 1 && filters.page > 1) {
        setFilters({ ...filters, page: filters.page - 1 });
      } else {
        dispatch(fetchSubscriptions(filters));
      }
    } catch (error) {
      toast.error(error.message || 'Ошибка при удалении подписки');
    }
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSort = (field) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setFilters({ ...filters, sortBy: field, sortOrder: newOrder });
  };

  if (loading && items.length === 0) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Подписки</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Добавить подписку
        </button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <select
          value={recipientFilter}
          onChange={(e) => {
            setRecipientFilter(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-select"
          style={{ minWidth: '200px' }}
        >
          <option value="">Все получатели</option>
          {recipients.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fullName} ({r.code})
            </option>
          ))}
        </select>
        <select
          value={publicationFilter}
          onChange={(e) => {
            setPublicationFilter(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-select"
          style={{ minWidth: '200px' }}
        >
          <option value="">Все издания</option>
          {publications.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <select
          value={durationFilter}
          onChange={(e) => {
            setDurationFilter(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-select"
          style={{ minWidth: '150px' }}
        >
          <option value="">Все сроки</option>
          <option value="1">1 месяц</option>
          <option value="3">3 месяца</option>
          <option value="6">6 месяцев</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Нет подписок</h3>
          <p>Добавьте первую подписку, нажав кнопку "Добавить подписку"</p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    ID {filters.sortBy === 'id' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th>Получатель</th>
                  <th>Издание</th>
                  <th onClick={() => handleSort('duration')} style={{ cursor: 'pointer' }}>
                    Срок {filters.sortBy === 'duration' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th>Начало доставки</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.recipient?.fullName || 'Неизвестно'}
                      <br />
                      <small style={{ color: '#666' }}>{item.recipient?.code}</small>
                    </td>
                    <td>
                      {item.publication?.title || 'Неизвестно'}
                      <br />
                      <small style={{ color: '#666' }}>{item.publication?.type}</small>
                    </td>
                    <td>{item.duration} мес.</td>
                    <td>
                      {item.startMonth}/{item.startYear}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleView(item)}
                        >
                          Просмотр
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(item)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Назад
              </button>
              <span>
                Страница {pagination.page} из {pagination.totalPages} (Всего: {pagination.total})
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pagination.totalPages}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}

      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
          dispatch(fetchSubscriptions(filters));
        }}
      />

      <SubscriptionDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDelete}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить подписку #${selectedItem?.id}?`}
      />
    </div>
  );
};

export default SubscriptionList;
