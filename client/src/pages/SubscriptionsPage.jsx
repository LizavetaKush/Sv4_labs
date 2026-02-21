import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchSubscriptions,
  deleteSubscription,
  clearError,
} from '../store/slices/subscriptionSlice'
import Modal from '../components/Modal/Modal'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'
import SubscriptionForm from '../components/SubscriptionForm/SubscriptionForm'
import SubscriptionDetail from '../components/SubscriptionDetail/SubscriptionDetail'
import '../styles/common.css'
import './SubscriptionsPage.css'

const SubscriptionsPage = () => {
  const dispatch = useDispatch()
  const { items, loading, error, pagination } = useSelector((state) => state.subscriptions)

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
    recipientCode: '',
    publicationIndex: '',
    duration: '',
    startYear: '',
  })

  useEffect(() => {
    dispatch(fetchSubscriptions(filters))
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
      recipientCode: '',
      publicationIndex: '',
      duration: '',
      startYear: '',
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

  const handleView = (item) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteSubscription(selectedItem._id)).unwrap()
      toast.success('Подписка успешно удалена')
      setIsDeleteOpen(false)
      setSelectedItem(null)
      dispatch(fetchSubscriptions(filters))
    } catch (err) {
      toast.error(err || 'Не удалось удалить подписку')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedItem(null)
    dispatch(fetchSubscriptions(filters))
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Подписки</h2>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Добавить подписку
          </button>
        </div>

        <div className="filters">
          <div className="filters-row">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Поиск по получателю, изданию..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Код получателя"
                value={filters.recipientCode}
                onChange={(e) => setFilters({ ...filters, recipientCode: e.target.value, page: 1 })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Индекс издания"
                value={filters.publicationIndex}
                onChange={(e) => setFilters({ ...filters, publicationIndex: e.target.value, page: 1 })}
              />
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value, page: 1 })}
              >
                <option value="">Все сроки</option>
                <option value="1">1 месяц</option>
                <option value="3">3 месяца</option>
                <option value="6">6 месяцев</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                placeholder="Год начала"
                value={filters.startYear}
                onChange={(e) => setFilters({ ...filters, startYear: e.target.value, page: 1 })}
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
                    <th onClick={() => handleSort('recipientCode')} style={{ cursor: 'pointer' }}>
                      Получатель {filters.sort === 'recipientCode' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('publicationIndex')} style={{ cursor: 'pointer' }}>
                      Издание {filters.sort === 'publicationIndex' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('duration')} style={{ cursor: 'pointer' }}>
                      Срок {filters.sort === 'duration' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('startYear')} style={{ cursor: 'pointer' }}>
                      Начало {filters.sort === 'startYear' && (filters.order === 'asc' ? '↑' : '↓')}
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
                        <td>
                          {item.recipientCode?.code || item.recipientCode} - {item.recipientCode?.fullName || ''}
                        </td>
                        <td>
                          {item.publicationIndex?.index || item.publicationIndex} - {item.publicationIndex?.title || ''}
                        </td>
                        <td>{item.duration} {item.duration === 1 ? 'месяц' : 'месяца'}</td>
                        <td>{item.startMonth}.{item.startYear}</td>
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
        title={selectedItem ? 'Редактировать подписку' : 'Добавить подписку'}
      >
        <SubscriptionForm
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
        title="Детальная информация о подписке"
      >
        <SubscriptionDetail item={selectedItem} />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedItem(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить эту подписку?`}
      />
    </div>
  )
}

export default SubscriptionsPage
