import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchRecipients,
  deleteRecipient,
} from '../../store/slices/recipientSlice';
import RecipientForm from './RecipientForm';
import RecipientDetail from './RecipientDetail';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import '../../styles/common.css';

const RecipientList = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.recipients);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [streetFilter, setStreetFilter] = useState('');

  useEffect(() => {
    const params = { ...filters };
    if (searchTerm) params.search = searchTerm;
    if (streetFilter) params.street = streetFilter;
    dispatch(fetchRecipients(params));
  }, [dispatch, filters, searchTerm, streetFilter]);

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
      await dispatch(deleteRecipient(selectedItem.id)).unwrap();
      toast.success('Получатель успешно удален');
      if (items.length === 1 && filters.page > 1) {
        setFilters({ ...filters, page: filters.page - 1 });
      } else {
        dispatch(fetchRecipients(filters));
      }
    } catch (error) {
      const errorMessage = error.message || 'Ошибка при удалении получателя';
      toast.error(errorMessage);
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
        <h2 className="card-title">Получатели</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Добавить получателя
        </button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Поиск по коду, ФИО или улице..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <input
          type="text"
          placeholder="Фильтр по улице..."
          value={streetFilter}
          onChange={(e) => {
            setStreetFilter(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-input"
          style={{ minWidth: '150px' }}
        />
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Нет получателей</h3>
          <p>Добавьте первого получателя, нажав кнопку "Добавить получателя"</p>
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
                  <th onClick={() => handleSort('code')} style={{ cursor: 'pointer' }}>
                    Код {filters.sortBy === 'code' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('fullName')} style={{ cursor: 'pointer' }}>
                    ФИО {filters.sortBy === 'fullName' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th>Адрес</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.code}</td>
                    <td>{item.fullName}</td>
                    <td>
                      {item.street}, д. {item.house}
                      {item.apartment && `, кв. ${item.apartment}`}
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

      <RecipientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
          dispatch(fetchRecipients(filters));
        }}
      />

      <RecipientDetail
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
        message={`Вы уверены, что хотите удалить получателя "${selectedItem?.fullName}"?`}
      />
    </div>
  );
};

export default RecipientList;
