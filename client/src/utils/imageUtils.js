// Утилита для работы с изображениями
export const getDefaultImage = (type) => {
  // Возвращаем placeholder изображение в base64 или URL
  const images = {
    publication: 'https://via.placeholder.com/300x200?text=Издание',
    recipient: 'https://via.placeholder.com/200x200?text=Получатель',
    subscription: 'https://via.placeholder.com/300x200?text=Подписка',
  };
  return images[type] || 'https://via.placeholder.com/300x200';
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
