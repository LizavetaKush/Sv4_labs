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

const PriceComparisonChart = ({ publications, subscriptions }) => {
  const comparisonData = useMemo(() => {
    // Группируем подписки по видам изданий
    const byType = {
      газета: {
        subscriptions: [],
        totalCost: 0,
        count: 0,
      },
      журнал: {
        subscriptions: [],
        totalCost: 0,
        count: 0,
      },
    };

    subscriptions.forEach((sub) => {
      const pub = publications.find(
        (p) => p.id === (sub.publicationId || sub.publication?.id)
      );
      if (pub && byType[pub.type]) {
        const cost = parseFloat(pub.monthlyPrice) * sub.duration;
        byType[pub.type].subscriptions.push(cost);
        byType[pub.type].totalCost += cost;
        byType[pub.type].count++;
      }
    });

    // Вычисляем средние значения
    return {
      газета: {
        avgPrice: byType.газета.count > 0
          ? byType.газета.totalCost / byType.газета.count
          : 0,
        totalCost: byType.газета.totalCost,
        count: byType.газета.count,
      },
      журнал: {
        avgPrice: byType.журнал.count > 0
          ? byType.журнал.totalCost / byType.журнал.count
          : 0,
        totalCost: byType.журнал.totalCost,
        count: byType.журнал.count,
      },
    };
  }, [publications, subscriptions]);

  const data = {
    labels: ['Газеты', 'Журналы'],
    datasets: [
      {
        label: 'Средняя стоимость подписки (руб.)',
        data: [
          comparisonData.газета.avgPrice,
          comparisonData.журнал.avgPrice,
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
      {
        label: 'Общая стоимость всех подписок (руб.)',
        data: [
          comparisonData.газета.totalCost,
          comparisonData.журнал.totalCost,
        ],
        backgroundColor: 'rgba(118, 75, 162, 0.8)',
        borderColor: 'rgba(118, 75, 162, 1)',
        borderWidth: 2,
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
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            const type = context.label;
            const count =
              type === 'Газеты'
                ? comparisonData.газета.count
                : comparisonData.журнал.count;
            return `${label}: ${value} руб. (${count} подписок)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Вид издания',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Стоимость (руб.)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(0) + ' руб.';
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

export default PriceComparisonChart;
