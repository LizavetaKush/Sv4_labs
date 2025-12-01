import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const savedCompare = localStorage.getItem('compare');
    return savedCompare ? JSON.parse(savedCompare) : [];
  });

  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    setCompareItems(prevItems => {
      const exists = prevItems.some(
        item => item.id === product.id && item.category === product.category
      );
      if (exists) {
        return prevItems;
      }
      // Максимум 3 товара для сравнения
      if (prevItems.length >= 3) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeFromCompare = (productId, category) => {
    setCompareItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.category === category))
    );
  };

  const isInCompare = (productId, category) => {
    return compareItems.some(
      item => item.id === productId && item.category === category
    );
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const value = {
    compareItems,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

