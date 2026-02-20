import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteSubscription } from '../../store/slices/subscriptionSlice';
import '../../styles/common.css';
import './AdvancedSubscriptionTable.css';

const columnHelper = createColumnHelper();

const AdvancedSubscriptionTable = ({
  subscriptions,
  recipients,
  publications,
  onView,
  onEdit,
}) => {
  const dispatch = useDispatch();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const data = useMemo(() => {
    return subscriptions.map((sub) => {
      const recipient = recipients.find((r) => r.id === (sub.recipientId || sub.recipient?.id));
      const publication = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
      const cost = publication
        ? parseFloat(publication.monthlyPrice) * sub.duration
        : 0;

      return {
        id: sub.id,
        recipientName: recipient?.fullName || 'Неизвестно',
        recipientCode: recipient?.code || '',
        publicationTitle: publication?.title || 'Неизвестно',
        publicationIndex: publication?.index || '',
        duration: sub.duration,
        startMonth: sub.startMonth,
        startYear: sub.startYear,
        cost: cost,
        originalData: sub,
      };
    });
  }, [subscriptions, recipients, publications]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="table-checkbox"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="table-checkbox"
          />
        ),
        size: 50,
      }),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        size: 80,
        enableSorting: true,
      }),
      columnHelper.accessor('recipientName', {
        header: 'Получатель',
        cell: (info) => (
          <div>
            <div className="cell-primary">{info.getValue()}</div>
            <div className="cell-secondary">Код: {info.row.original.recipientCode}</div>
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('publicationTitle', {
        header: 'Издание',
        cell: (info) => (
          <div>
            <div className="cell-primary">{info.getValue()}</div>
            <div className="cell-secondary">Индекс: {info.row.original.publicationIndex}</div>
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('duration', {
        header: 'Срок (мес.)',
        cell: (info) => `${info.getValue()} мес.`,
        enableSorting: true,
        size: 120,
      }),
      columnHelper.accessor('startMonth', {
        header: 'Месяц начала',
        cell: (info) => {
          const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
          ];
          return monthNames[info.getValue() - 1] || info.getValue();
        },
        enableSorting: true,
        size: 150,
      }),
      columnHelper.accessor('startYear', {
        header: 'Год начала',
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 120,
      }),
      columnHelper.accessor('cost', {
        header: 'Стоимость',
        cell: (info) => `${info.getValue().toFixed(2)} руб.`,
        enableSorting: true,
        size: 150,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => (
          <div className="table-actions">
            <button
              className="btn btn-sm btn-info"
              onClick={() => onView(row.original.originalData)}
            >
              Просмотр
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onEdit(row.original.originalData)}
            >
              Редактировать
            </button>
          </div>
        ),
        size: 200,
      }),
    ],
    [onView, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleBulkDelete = async () => {
    if (selectedCount === 0) {
      toast.warning('Выберите подписки для удаления');
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedCount} подписок?`)) {
      return;
    }

    try {
      const deletePromises = selectedRows.map((row) =>
        dispatch(deleteSubscription(row.original.id)).unwrap()
      );
      await Promise.all(deletePromises);
      toast.success(`Удалено ${selectedCount} подписок`);
      setRowSelection({});
    } catch (error) {
      toast.error('Ошибка при удалении подписок');
    }
  };

  const handleSelectAll = () => {
    if (table.getIsAllRowsSelected()) {
      setRowSelection({});
    } else {
      const allRowIds = {};
      table.getRowModel().rows.forEach((row) => {
        allRowIds[row.id] = true;
      });
      setRowSelection(allRowIds);
    }
  };

  return (
    <div className="advanced-table-container">
      <div className="table-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            placeholder="Поиск по всем полям..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="table-search-input"
          />
        </div>
        <div className="toolbar-right">
          {selectedCount > 0 && (
            <div className="selected-info">
              Выбрано: <strong>{selectedCount}</strong>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleBulkDelete}
                style={{ marginLeft: '1rem' }}
              >
                Удалить выбранные
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setRowSelection({})}
                style={{ marginLeft: '0.5rem' }}
              >
                Снять выделение
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="advanced-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="th-content">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="sort-indicator">
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted()] ?? ' ↕'}
                        </span>
                      )}
                    </div>
                    {header.column.getCanFilter() && (
                      <div className="column-filter">
                        <input
                          type="text"
                          value={header.column.getFilterValue() ?? ''}
                          onChange={(e) => header.column.setFilterValue(e.target.value)}
                          placeholder="Фильтр..."
                          className="column-filter-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-table">
                  Нет данных для отображения
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.getIsSelected() ? 'row-selected' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          Показано {table.getRowModel().rows.length} из {data.length} записей
        </div>
        <div className="pagination-controls">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            ««
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <span className="pagination-page-info">
            Страница{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </strong>
          </span>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »»
          </button>
        </div>
        <div className="pagination-size">
          <label>
            Записей на странице:
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="pagination-select"
            >
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSubscriptionTable;
