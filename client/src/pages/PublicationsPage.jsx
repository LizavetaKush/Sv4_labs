import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchPublications,
  deletePublication,
  clearError,
} from '../store/slices/publicationSlice'
import Modal from '../components/Modal/Modal'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'
import PublicationForm from '../components/PublicationForm/PublicationForm'
import PublicationDetail from '../components/PublicationDetail/PublicationDetail'
import '../styles/common.css'
import './PublicationsPage.css'

const PublicationsPage = () => {
  const dispatch = useDispatch()
  const { items, loading, error, pagination } = useSelector((state) => state.publications)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    dispatch(fetchPublications(filters))
  }, [dispatch, filters])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 })
  }

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
    })
  }

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage })
  }

  const handleSort = (field) => {
    const order = filters.sort === field && filters.order === 'asc' ? 'desc' : 'asc'
    setFilters({ ...filters, sort: field, order, page: 1 })
  }

  const handleAdd = () => {
    setSelectedItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleView = async (item) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePublication(selectedItem._id)).unwrap()
      toast.success('Издание успешно удалено')
      setIsDeleteOpen(false)
      setSelectedItem(null)
      dispatch(fetchPublications(filters))
    } catch (err) {
      toast.error(err || 'Не удалось удалить издание. Возможно, на него оформлены подписки.')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedItem(null)
    dispatch(fetchPublications(filters))
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Издания</h2>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Добавить издание
          </button>
        </div>

        <div className="filters">
          <div className="filters-row">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Поиск по индексу, названию, типу..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              >
                <option value="">Все типы</option>
                <option value="газета">Газета</option>
                <option value="журнал">Журнал</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                placeholder="Мин. цена"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                placeholder="Макс. цена"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
              />
            </div>
          </div>
          <div className="filters-actions">
            <button className="btn btn-secondary" onClick={handleReset}>
              Сбросить
            </button>
            <button className="btn btn-primary" onClick={handleSearch}>
              Поиск
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('index')} style={{ cursor: 'pointer' }}>
                      Индекс {filters.sort === 'index' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                      Тип {filters.sort === 'type' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                      Название {filters.sort === 'title' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('monthlyPrice')} style={{ cursor: 'pointer' }}>
                      Цена/мес {filters.sort === 'monthlyPrice' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        Нет данных
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item._id}>
                        <td>{item.index}</td>
                        <td>{item.type}</td>
                        <td>{item.title}</td>
                        <td>{item.monthlyPrice.toFixed(2)} руб.</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-primary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                              onClick={() => handleView(item)}
                            >
                              Просмотр
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                              onClick={() => handleEdit(item)}
                            >
                              Редактировать
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                              onClick={() => handleDeleteClick(item)}
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Назад
                </button>
                <span>
                  Страница {pagination.page} из {pagination.pages} (Всего: {pagination.total})
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Вперед
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={selectedItem ? 'Редактировать издание' : 'Добавить издание'}
      >
        <PublicationForm
          item={selectedItem}
          onClose={handleFormClose}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedItem(null)
        }}
        title="Детальная информация об издании"
      >
        <PublicationDetail item={selectedItem} />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedItem(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить издание "${selectedItem?.title}"?`}
      />
    </div>
  )
}

export default PublicationsPage
