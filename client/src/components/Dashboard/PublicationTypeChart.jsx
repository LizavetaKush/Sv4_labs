import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PublicationTypeChart = ({ publications }) => {
  const gasCount = publications.filter((p) => p.type === 'газета').length;
  const journalCount = publications.filter((p) => p.type === 'журнал').length;

  const data = {
    labels: ['Газеты', 'Журналы'],
    datasets: [
      {
        label: 'Количество изданий',
        data: [gasCount, journalCount],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PublicationTypeChart;
