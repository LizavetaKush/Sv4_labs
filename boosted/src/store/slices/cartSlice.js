import { createSlice } from '@reduxjs/toolkit';

// Загрузка корзины из localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Сохранение корзины в localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Валидация товара для корзины
const validateCartItem = (product, quantity) => {
  const errors = [];
  
  if (!product || !product.id) {
    errors.push('Product is required');
  }
  
  if (!quantity || quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }
  
  if (quantity > 100) {
    errors.push('Quantity cannot exceed 100');
  }
  
  if (product && product.status && product.status.toLowerCase().includes('out of stock')) {
    errors.push('Product is out of stock');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    error: null,
  },
  reducers: {
    // Добавление товара в корзину
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const validation = validateCartItem(product, quantity);
      
      if (!validation.isValid) {
        state.error = validation.errors.join(', ');
        return;
      }
      
      const existingItem = state.items.find(
        item => item.id === product.id && item.category === product.category
      );
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > 100) {
          state.error = 'Total quantity cannot exceed 100';
          return;
        }
        existingItem.quantity = newQuantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      
      saveCartToStorage(state.items);
      state.error = null;
    },
    
    // Удаление товара из корзины
    removeFromCart: (state, action) => {
      const { productId, category } = action.payload;
      
      if (!productId || !category) {
        state.error = 'Product ID and category are required';
        return;
      }
      
      state.items = state.items.filter(
        item => !(item.id === productId && item.category === category)
      );
      
      saveCartToStorage(state.items);
      state.error = null;
    },
    
    // Обновление количества товара
    updateQuantity: (state, action) => {
      const { productId, category, quantity } = action.payload;
      
      if (!productId || !category) {
        state.error = 'Product ID and category are required';
        return;
      }
      
      if (quantity <= 0) {
        // Если количество 0 или меньше, удаляем товар
        state.items = state.items.filter(
          item => !(item.id === productId && item.category === category)
        );
      } else if (quantity > 100) {
        state.error = 'Quantity cannot exceed 100';
        return;
      } else {
        const item = state.items.find(
          item => item.id === productId && item.category === category
        );
        
        if (item) {
          item.quantity = quantity;
        } else {
          state.error = 'Product not found in cart';
          return;
        }
      }
      
      saveCartToStorage(state.items);
      state.error = null;
    },
    
    // Очистка корзины
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
      state.error = null;
    },
    
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearError,
} = cartSlice.actions;

// Селекторы
export const selectCartItems = (state) => state.cart.items;
export const selectCartError = (state) => state.cart.error;

export const selectCartTotal = (state) => {
  return state.cart.items.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );
};

export const selectCartItemsCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};

export default cartSlice.reducer;
