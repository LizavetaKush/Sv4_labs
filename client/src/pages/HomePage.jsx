import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/common.css'
import './HomePage.css'

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Система управления подписными изданиями</h1>
        <p>Белпочта - Учет получателей и выписанных изданий</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📰</div>
          <h3>Издания</h3>
          <p>Управление газетами и журналами, на которые можно оформить подписку</p>
          <Link to="/publications" className="btn btn-primary">
            Перейти к изданиям
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>Получатели</h3>
          <p>Управление информацией о получателях подписных изданий</p>
          <Link to="/recipients" className="btn btn-primary">
            Перейти к получателям
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Подписки</h3>
          <p>Управление подписками получателей на различные издания</p>
          <Link to="/subscriptions" className="btn btn-primary">
            Перейти к подпискам
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
