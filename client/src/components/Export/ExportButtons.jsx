import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { exportPublicationsToWord, exportSubscriptionsToWord } from '../../utils/exportToWord';
import { exportPublicationsToExcel, exportSubscriptionsToExcel } from '../../utils/exportToExcel';
import { fetchPublications } from '../../store/slices/publicationSlice';
import { fetchSubscriptions } from '../../store/slices/subscriptionSlice';
import { fetchRecipients } from '../../store/slices/recipientSlice';
import '../../styles/common.css';
import './ExportButtons.css';

const ExportButtons = ({ type, data, recipients, publications }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleExportWord = async () => {
    try {
      setLoading(true);
      
      if (type === 'publications') {
        const result = await dispatch(fetchPublications({ limit: 10000 })).unwrap();
        const exportData = result.data || data;
        await exportPublicationsToWord(exportData);
        toast.success('Отчет экспортирован в Word');
      } else if (type === 'subscriptions') {
        const [subsResult, recsResult, pubsResult] = await Promise.all([
          dispatch(fetchSubscriptions({ limit: 10000 })).unwrap(),
          dispatch(fetchRecipients({ limit: 10000 })).unwrap(),
          dispatch(fetchPublications({ limit: 10000 })).unwrap(),
        ]);
        const exportData = subsResult.data || data;
        const exportRecipients = recsResult.data || recipients || [];
        const exportPublications = pubsResult.data || publications || [];
        await exportSubscriptionsToWord(exportData, exportRecipients, exportPublications);
        toast.success('Отчет экспортирован в Word');
      }
    } catch (error) {
      console.error('Ошибка экспорта в Word:', error);
      toast.error('Ошибка при экспорте в Word');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      
      if (type === 'publications') {
        const result = await dispatch(fetchPublications({ limit: 10000 })).unwrap();
        const exportData = result.data || data;
        await exportPublicationsToExcel(exportData);
        toast.success('Отчет экспортирован в Excel');
      } else if (type === 'subscriptions') {
        const [subsResult, recsResult, pubsResult] = await Promise.all([
          dispatch(fetchSubscriptions({ limit: 10000 })).unwrap(),
          dispatch(fetchRecipients({ limit: 10000 })).unwrap(),
          dispatch(fetchPublications({ limit: 10000 })).unwrap(),
        ]);
        const exportData = subsResult.data || data;
        const exportRecipients = recsResult.data || recipients || [];
        const exportPublications = pubsResult.data || publications || [];
        await exportSubscriptionsToExcel(exportData, exportRecipients, exportPublications);
        toast.success('Отчет экспортирован в Excel');
      }
    } catch (error) {
      console.error('Ошибка экспорта в Excel:', error);
      toast.error('Ошибка при экспорте в Excel');
    } finally {
      setLoading(false);
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="export-buttons">
      <button
        className="btn btn-success"
        onClick={handleExportWord}
        disabled={loading}
        title="Экспорт в Word"
      >
        📄 Word
      </button>
      <button
        className="btn btn-success"
        onClick={handleExportExcel}
        disabled={loading}
        title="Экспорт в Excel"
      >
        📊 Excel
      </button>
    </div>
  );
};

export default ExportButtons;
