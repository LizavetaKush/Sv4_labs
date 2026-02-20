import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopPublicationsChart = ({ publications, subscriptions }) => {
  const topPublications = useMemo(() => {
    // Подсчитываем количество подписок для каждого издания
    const publicationCounts = subscriptions.reduce((acc, sub) => {
      const pubId = sub.publicationId || sub.publication?.id;
      if (pubId) {
        acc[pubId] = (acc[pubId] || 0) + 1;
      }
      return acc;
    }, {});

    // Сортируем и берем топ-10
    const sorted = Object.entries(publicationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => {
        const pub = publications.find((p) => p.id === parseInt(id));
        return {
          id: parseInt(id),
          title: pub?.title || 'Неизвестно',
          count,
        };
      });

    return sorted;
  }, [publications, subscriptions]);

  const data = {
    labels: topPublications.map((p) => p.title.length > 30 ? p.title.substring(0, 30) + '...' : p.title),
    datasets: [
      {
        label: 'Количество подписок',
        data: topPublications.map((p) => p.count),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
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
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex;
            return topPublications[index].title;
          },
          label: function (context) {
            return `Подписок: ${context.parsed.x}`;
          },
        },
      },
    },
    scales: {
      x: {
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
      y: {
        title: {
          display: true,
          text: 'Издания',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopPublicationsChart;
