import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(zoomPlugin);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SubscriptionsByMonthChart = ({ subscriptions, yearFilter }) => {
  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const chartData = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) {
      return [];
    }

    // Фильтруем подписки по году, если выбран фильтр
    const filteredSubs = yearFilter && yearFilter !== ''
      ? subscriptions.filter((s) => s.startYear === yearFilter)
      : subscriptions;

    if (filteredSubs.length === 0) {
      return [];
    }

    const monthlyData = {};
    filteredSubs.forEach((sub) => {
      if (sub.startYear && sub.startMonth) {
        const key = `${sub.startYear}-${sub.startMonth}`;
        if (!monthlyData[key]) {
          monthlyData[key] = {
            year: sub.startYear,
            month: sub.startMonth,
            count: 0,
          };
        }
        monthlyData[key].count++;
          }
        });

        const sorted = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return sorted;
  }, [subscriptions, yearFilter]);

  const data = {
    labels: chartData.map(
      (d) => {
        const monthName = monthNames[d.month - 1] || `Месяц ${d.month}`;
        return `${monthName} ${d.year}`;
      }
    ),
    datasets: [
      {
        label: 'Количество подписок',
        data: chartData.map((d) => d.count),
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `Подписок: ${context.parsed.y}`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Период',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество подписок',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  if (chartData.length === 0) {
    return (
      <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Нет данных для отображения</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {subscriptions.length === 0
              ? 'Подписки не найдены'
              : yearFilter && yearFilter !== ''
              ? `Нет подписок за ${yearFilter} год`
              : 'Нет данных о подписках'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default SubscriptionsByMonthChart;
