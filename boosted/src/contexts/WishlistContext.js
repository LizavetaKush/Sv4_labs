import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(
        item => item.id === product.id && item.category === product.category
      );
      if (exists) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId, category) => {
    setWishlistItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.category === category))
    );
  };

  const isInWishlist = (productId, category) => {
    return wishlistItems.some(
      item => item.id === productId && item.category === category
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

