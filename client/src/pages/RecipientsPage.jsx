import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchRecipients,
  deleteRecipient,
  clearError,
} from '../store/slices/recipientSlice'
import Modal from '../components/Modal/Modal'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'
import RecipientForm from '../components/RecipientForm/RecipientForm'
import RecipientDetail from '../components/RecipientDetail/RecipientDetail'
import '../styles/common.css'
import './RecipientsPage.css'

const RecipientsPage = () => {
  const dispatch = useDispatch()
  const { items, loading, error, pagination } = useSelector((state) => state.recipients)

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
    code: '',
    street: '',
  })

  useEffect(() => {
    dispatch(fetchRecipients(filters))
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
      code: '',
      street: '',
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
      await dispatch(deleteRecipient(selectedItem._id)).unwrap()
      toast.success('Получатель успешно удален')
      setIsDeleteOpen(false)
      setSelectedItem(null)
      dispatch(fetchRecipients(filters))
    } catch (err) {
      toast.error(err || 'Не удалось удалить получателя. Возможно, на него оформлены подписки.')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedItem(null)
    dispatch(fetchRecipients(filters))
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Получатели</h2>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Добавить получателя
          </button>
        </div>

        <div className="filters">
          <div className="filters-row">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Поиск по коду, ФИО, адресу..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Фильтр по коду"
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value, page: 1 })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Фильтр по улице"
                value={filters.street}
                onChange={(e) => setFilters({ ...filters, street: e.target.value, page: 1 })}
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
                    <th onClick={() => handleSort('code')} style={{ cursor: 'pointer' }}>
                      Код {filters.sort === 'code' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('fullName')} style={{ cursor: 'pointer' }}>
                      Ф.И.О. {filters.sort === 'fullName' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Адрес</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        Нет данных
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item._id}>
                        <td>{item.code}</td>
                        <td>{item.fullName}</td>
                        <td>
                          {item.address?.street}, д. {item.address?.house}, кв. {item.address?.apartment}
                        </td>
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
        title={selectedItem ? 'Редактировать получателя' : 'Добавить получателя'}
      >
        <RecipientForm
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
        title="Детальная информация о получателе"
      >
        <RecipientDetail item={selectedItem} />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedItem(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить получателя "${selectedItem?.fullName}"?`}
      />
    </div>
  )
}

export default RecipientsPage
