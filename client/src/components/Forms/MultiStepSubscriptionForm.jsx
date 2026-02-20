import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { createSubscription } from '../../store/slices/subscriptionSlice';
import { fetchRecipients } from '../../store/slices/recipientSlice';
import { fetchPublications } from '../../store/slices/publicationSlice';
import api from '../../services/api';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/common.css';
import './EnhancedForms.css';

const subscriptionSchema = z.object({
  recipientId: z.number().min(1, 'Выберите получателя'),
  publicationId: z.number().min(1, 'Выберите издание'),
  duration: z.enum(['1', '3', '6'], {
    errorMap: () => ({ message: 'Выберите срок подписки' }),
  }),
  startDate: z.date({
    required_error: 'Выберите дату начала подписки',
  }),
  startMonth: z.number().min(1).max(12),
  startYear: z.number().min(2000).max(2100),
  image: z.instanceof(FileList).optional(),
  additionalInfo: z.string().max(1000, 'Максимум 1000 символов').optional(),
  characteristics: z
    .array(
      z.object({
        name: z.string().min(1, 'Название характеристики обязательно'),
        value: z.string().min(1, 'Значение характеристики обязательно'),
      })
    )
    .optional(),
});

const MultiStepSubscriptionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { items: recipients } = useSelector((state) => state.recipients);
  const { items: publications } = useSelector((state) => state.publications);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    mode: 'onBlur',
    defaultValues: {
      characteristics: [],
      startDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'characteristics',
  });

  const selectedRecipient = watch('recipientId');
  const selectedPublication = watch('publicationId');
  const startDate = watch('startDate');

  useEffect(() => {
    dispatch(fetchRecipients({ limit: 10000 }));
    dispatch(fetchPublications({ limit: 10000 }));
  }, [dispatch]);

  useEffect(() => {
    if (startDate) {
      setValue('startMonth', startDate.getMonth() + 1);
      setValue('startYear', startDate.getFullYear());
      trigger(['startMonth', 'startYear']);
    }
  }, [startDate, setValue, trigger]);

  const recipientOptions = recipients.map((r) => ({
    value: r.id,
    label: `${r.fullName} (${r.code})`,
  }));

  const publicationOptions = publications.map((p) => ({
    value: p.id,
    label: `${p.title} (${p.index})`,
  }));

  const handleRecipientChange = (selectedOption) => {
    setValue('recipientId', selectedOption?.value || null);
    trigger('recipientId');
  };

  const handlePublicationChange = (selectedOption) => {
    setValue('publicationId', selectedOption?.value || null);
    trigger('publicationId');
  };

  const handleDateChange = (date) => {
    setValue('startDate', date);
    trigger('startDate');
  };

  const addCharacteristic = () => {
    append({ name: '', value: '' });
  };

  const removeCharacteristic = (index) => {
    remove(index);
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['recipientId', 'publicationId'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['duration', 'startDate', 'startMonth', 'startYear'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    try {
      const subscriptionData = {
        recipientId: data.recipientId,
        publicationId: data.publicationId,
        duration: parseInt(data.duration),
        startMonth: data.startMonth,
        startYear: data.startYear,
        additionalInfo: data.additionalInfo || '',
        characteristics: data.characteristics || [],
      };

      if (data.image && data.image[0]) {
        const formData = new FormData();
        Object.keys(subscriptionData).forEach((key) => {
          if (key === 'characteristics') {
            formData.append(key, JSON.stringify(subscriptionData[key]));
          } else {
            formData.append(key, subscriptionData[key]);
          }
        });
        formData.append('image', data.image[0]);
        await dispatch(createSubscription(formData)).unwrap();
      } else {
        await dispatch(createSubscription(subscriptionData)).unwrap();
      }

      toast.success('Подписка успешно создана!');
      navigate('/subscriptions');
    } catch (error) {
      toast.error(error.message || 'Ошибка при создании подписки');
    }
  };

  return (
    <div className="enhanced-form-container">
      <div className="enhanced-form-card">
        <h2>Создание подписки</h2>

        <div className="steps-indicator">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`step ${currentStep >= step ? 'active' : ''} ${
                currentStep === step ? 'current' : ''
              }`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Получатель и издание'}
                {step === 2 && 'Параметры подписки'}
                {step === 3 && 'Дополнительно'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Шаг 1: Выбор получателя и издания</h3>

              <div className="form-group">
                <label className="form-label">
                  Получатель <span className="required">*</span>
                </label>
                <Select
                  options={recipientOptions}
                  onChange={handleRecipientChange}
                  placeholder="Начните вводить имя получателя..."
                  isSearchable
                  className={`react-select-container ${errors.recipientId ? 'error' : ''}`}
                  classNamePrefix="react-select"
                />
                {errors.recipientId && (
                  <div className="form-error">{errors.recipientId.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Издание <span className="required">*</span>
                </label>
                <Select
                  options={publicationOptions}
                  onChange={handlePublicationChange}
                  placeholder="Начните вводить название издания..."
                  isSearchable
                  className={`react-select-container ${errors.publicationId ? 'error' : ''}`}
                  classNamePrefix="react-select"
                />
                {errors.publicationId && (
                  <div className="form-error">{errors.publicationId.message}</div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h3>Шаг 2: Параметры подписки</h3>

              <div className="form-group">
                <label className="form-label">
                  Срок подписки <span className="required">*</span>
                </label>
                <select
                  {...register('duration')}
                  className={`form-select ${errors.duration ? 'error' : ''}`}
                >
                  <option value="">Выберите срок</option>
                  <option value="1">1 месяц</option>
                  <option value="3">3 месяца</option>
                  <option value="6">6 месяцев</option>
                </select>
                {errors.duration && (
                  <div className="form-error">{errors.duration.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Дата начала подписки <span className="required">*</span>
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className={`form-input ${errors.startDate ? 'error' : ''}`}
                  placeholderText="Выберите дату"
                  wrapperClassName="datepicker-wrapper"
                />
                {errors.startDate && (
                  <div className="form-error">{errors.startDate.message}</div>
                )}
                {startDate && (
                  <small className="form-hint">
                    Месяц: {startDate.getMonth() + 1}, Год: {startDate.getFullYear()}
                  </small>
                )}
              </div>

              <input type="hidden" {...register('startMonth')} />
              <input type="hidden" {...register('startYear')} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h3>Шаг 3: Дополнительная информация</h3>

              <div className="form-group">
                <label className="form-label">Дополнительная информация</label>
                <textarea
                  {...register('additionalInfo')}
                  className={`form-input ${errors.additionalInfo ? 'error' : ''}`}
                  placeholder="Введите дополнительную информацию о подписке..."
                  rows={4}
                />
                {errors.additionalInfo && (
                  <div className="form-error">{errors.additionalInfo.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Фото (необязательно)</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  className="file-input"
                />
                {errors.image && (
                  <div className="form-error">{errors.image.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Дополнительные характеристики
                  <button
                    type="button"
                    onClick={addCharacteristic}
                    className="btn btn-secondary btn-sm"
                    style={{ marginLeft: '1rem' }}
                  >
                    + Добавить
                  </button>
                </label>

                {fields.map((field, index) => (
                  <div key={field.id} className="dynamic-field-group">
                    <input
                      {...register(`characteristics.${index}.name`)}
                      placeholder="Название характеристики"
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <input
                      {...register(`characteristics.${index}.value`)}
                      placeholder="Значение"
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeCharacteristic(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Удалить
                    </button>
                  </div>
                ))}

                {fields.length === 0 && (
                  <p className="form-hint">
                    Нажмите "Добавить" для создания дополнительных характеристик
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary"
              >
                Назад
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Далее
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Создание...' : 'Создать подписку'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepSubscriptionForm;
