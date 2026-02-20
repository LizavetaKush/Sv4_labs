import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchPublications } from '../../store/slices/publicationSlice';
import '../../styles/common.css';
import './SortablePublicationList.css';

const SortableItem = ({ id, publication, onView, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div className="item-content">
        <div className="item-header">
          <h3>{publication.title}</h3>
          <span className="item-badge">{publication.type}</span>
        </div>
        <div className="item-details">
          <p><strong>Индекс:</strong> {publication.index}</p>
          <p><strong>Цена:</strong> {parseFloat(publication.monthlyPrice).toFixed(2)} руб./мес.</p>
        </div>
        <div className="item-actions">
          <button onClick={() => onView(publication)} className="btn btn-sm btn-info">
            Просмотр
          </button>
          <button onClick={() => onEdit(publication)} className="btn btn-sm btn-primary">
            Редактировать
          </button>
          <button onClick={() => onDelete(publication)} className="btn btn-sm btn-danger">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

const SortablePublicationList = ({ publications, onView, onEdit, onDelete }) => {
  const [items, setItems] = useState(publications.map((p) => p.id));
  const [activeId, setActiveId] = useState(null);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        toast.success('Порядок изменен!');
        return newItems;
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  React.useEffect(() => {
    setItems(publications.map((p) => p.id));
  }, [publications]);

  const sortedPublications = items
    .map((id) => publications.find((p) => p.id === id))
    .filter(Boolean);

  const activePublication = activeId
    ? publications.find((p) => p.id === activeId)
    : null;

  return (
    <div className="sortable-list-container">
      <div className="sortable-list-header">
        <h3>Список изданий (перетаскивайте для изменения порядка)</h3>
        <p className="sortable-hint">
          <span className="drag-icon">⋮⋮</span> Перетащите элемент за иконку для изменения порядка
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="sortable-list">
            {sortedPublications.map((publication) => (
              <SortableItem
                key={publication.id}
                id={publication.id}
                publication={publication}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activePublication ? (
            <div className="sortable-item dragging-overlay">
              <div className="drag-handle">
                <span className="drag-icon">⋮⋮</span>
              </div>
              <div className="item-content">
                <div className="item-header">
                  <h3>{activePublication.title}</h3>
                  <span className="item-badge">{activePublication.type}</span>
                </div>
                <div className="item-details">
                  <p><strong>Индекс:</strong> {activePublication.index}</p>
                  <p><strong>Цена:</strong> {parseFloat(activePublication.monthlyPrice).toFixed(2)} руб./мес.</p>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SortablePublicationList;
