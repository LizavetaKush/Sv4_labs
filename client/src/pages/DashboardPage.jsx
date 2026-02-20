import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublications } from '../store/slices/publicationSlice';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import { fetchRecipients } from '../store/slices/recipientSlice';
import PublicationTypeChart from '../components/Dashboard/PublicationTypeChart';
import TopPublicationsChart from '../components/Dashboard/TopPublicationsChart';
import SubscriptionsByMonthChart from '../components/Dashboard/SubscriptionsByMonthChart';
import PriceComparisonChart from '../components/Dashboard/PriceComparisonChart';
import '../styles/common.css';
import './DashboardPage.css';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items: publications } = useSelector((state) => state.publications);
  const { items: subscriptions } = useSelector((state) => state.subscriptions);
  const { items: recipients } = useSelector((state) => state.recipients);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchPublications({ limit: 10000 })),
          dispatch(fetchSubscriptions({ limit: 10000 })),
          dispatch(fetchRecipients({ limit: 10000 })),
        ]);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Загрузка данных для аналитики...</div>;
  }

  const availableYears = [...new Set(subscriptions.map((s) => s.startYear))].sort((a, b) => b - a);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Дашборд аналитики</h1>
        <div className="dashboard-filters">
          <label>
            Год для анализа:
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value) : '')}
              className="form-select"
            >
              <option value="">Все годы</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Распределение изданий по видам</h2>
          <PublicationTypeChart publications={publications} />
        </div>

        <div className="dashboard-card">
          <h2>Топ-10 изданий по количеству подписок</h2>
          <TopPublicationsChart
            publications={publications}
            subscriptions={subscriptions}
          />
        </div>

        <div className="dashboard-card full-width">
          <h2>Динамика подписок по месяцам</h2>
          <SubscriptionsByMonthChart
            subscriptions={subscriptions}
            yearFilter={yearFilter}
          />
        </div>

        <div className="dashboard-card full-width">
          <h2>Сравнение стоимости подписок по видам изданий</h2>
          <PriceComparisonChart
            publications={publications}
            subscriptions={subscriptions}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
