import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchPublications,
  deletePublication,
} from '../../store/slices/publicationSlice';
import PublicationForm from './PublicationForm';
import PublicationDetail from './PublicationDetail';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import ExportButtons from '../Export/ExportButtons';
import SortablePublicationList from './SortablePublicationList';
import '../../styles/common.css';

const PublicationList = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.publications);
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
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' или 'sortable'

  useEffect(() => {
    const params = { ...filters };
    if (searchTerm) params.search = searchTerm;
    if (typeFilter) params.type = typeFilter;
    dispatch(fetchPublications(params));
  }, [dispatch, filters, searchTerm, typeFilter]);

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
      await dispatch(deletePublication(selectedItem.id)).unwrap();
      toast.success('Издание успешно удалено');
      if (items.length === 1 && filters.page > 1) {
        setFilters({ ...filters, page: filters.page - 1 });
      } else {
        dispatch(fetchPublications(filters));
      }
    } catch (error) {
      toast.error(error.message || 'Ошибка при удалении издания');
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
        <h2 className="card-title">Издания</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <ExportButtons type="publications" data={items} />
          <div className="view-mode-toggle" style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Табличный вид"
            >
              📋 Таблица
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'sortable' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('sortable')}
              title="Сортировка перетаскиванием"
            >
              ↕️ Перетаскивание
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Добавить издание
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Поиск по индексу или названию..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setFilters({ ...filters, page: 1 });
          }}
          className="form-select"
          style={{ minWidth: '150px' }}
        >
          <option value="">Все виды</option>
          <option value="газета">Газета</option>
          <option value="журнал">Журнал</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Нет изданий</h3>
          <p>Добавьте первое издание, нажав кнопку "Добавить издание"</p>
        </div>
      ) : viewMode === 'sortable' ? (
        <SortablePublicationList
          publications={items}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    ID {filters.sortBy === 'id' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('index')} style={{ cursor: 'pointer' }}>
                    Индекс {filters.sortBy === 'index' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                    Вид {filters.sortBy === 'type' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Название {filters.sortBy === 'title' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('monthlyPrice')} style={{ cursor: 'pointer' }}>
                    Цена {filters.sortBy === 'monthlyPrice' && (filters.sortOrder === 'ASC' ? '↑' : '↓')}
                  </th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.index}</td>
                    <td>{item.type}</td>
                    <td>{item.title}</td>
                    <td>{parseFloat(item.monthlyPrice).toFixed(2)} руб.</td>
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

      <PublicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
          dispatch(fetchPublications(filters));
        }}
      />

      <PublicationDetail
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
        message={`Вы уверены, что хотите удалить издание "${selectedItem?.title}"?`}
      />
    </div>
  );
};

export default PublicationList;
