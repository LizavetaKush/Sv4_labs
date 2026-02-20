import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/common.css';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Система управления подписными изданиями</h1>
        <p>Управляйте изданиями, получателями и подписками в одном месте</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📰</div>
          <h3>Издания</h3>
          <p>Управление газетами и журналами</p>
          <Link to="/publications" className="btn btn-primary">
            Перейти к изданиям
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>Получатели</h3>
          <p>Управление получателями подписок</p>
          <Link to="/recipients" className="btn btn-primary">
            Перейти к получателям
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Подписки</h3>
          <p>Управление подписками на издания</p>
          <Link to="/subscriptions" className="btn btn-primary">
            Перейти к подпискам
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Аналитика</h3>
          <p>Графики и статистика по данным</p>
          <Link to="/dashboard" className="btn btn-primary">
            Перейти к аналитике
          </Link>
        </div>
      </div>

      <div className="info-section">
        <h2>Возможности системы</h2>
        <ul className="info-list">
          <li>✅ Полное управление CRUD операциями для всех сущностей</li>
          <li>✅ Пагинация, сортировка и фильтрация данных</li>
          <li>✅ Поиск по нескольким полям одновременно</li>
          <li>✅ Валидация форм на стороне клиента</li>
          <li>✅ Детальный просмотр с фотографиями</li>
          <li>✅ Подтверждение удаления записей</li>
          <li>✅ Адаптивный интерфейс для всех устройств</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
