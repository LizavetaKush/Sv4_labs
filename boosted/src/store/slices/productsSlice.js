import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boardsData from '../../data/boards.json';
import accessoriesData from '../../data/accessories.json';
import scootersData from '../../data/scooters.json';

// Валидация продукта
const validateProduct = (product) => {
  const errors = [];
  
  if (!product.title || product.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (product.price !== undefined && product.price !== null) {
    if (typeof product.price !== 'number' || product.price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }
  
  if (product.status && !['In Stock', 'Out of Stock', 'Pre-order', 'IN STOCK', 'OUT OF STOCK'].includes(product.status)) {
    errors.push('Status must be one of: In Stock, Out of Stock, Pre-order');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Асинхронная загрузка продуктов
export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (_, { rejectWithValue }) => {
    try {
      const boards = boardsData.map(board => ({
        ...board,
        category: 'board',
        uniqueId: `board-${board.id}`,
      }));
      
      const accessories = accessoriesData.map(accessory => ({
        ...accessory,
        category: 'accessory',
        uniqueId: `accessory-${accessory.id}`,
      }));
      
      const scooters = scootersData.map(scooter => ({
        ...scooter,
        category: 'scooter',
        uniqueId: `scooter-${scooter.id}`,
      }));
      
      const allProducts = [...boards, ...accessories, ...scooters];
      
      // Удаление дубликатов
      const seenIds = new Set();
      const uniqueProducts = allProducts.filter(product => {
        const id = product.uniqueId || `${product.category}-${product.id}`;
        if (seenIds.has(id)) {
          return false;
        }
        seenIds.add(id);
        return true;
      });
      
      return uniqueProducts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      priceRange: [0, 5000],
      status: 'all',
      category: 'all',
    },
    sortBy: 'title', // 'title', 'price-asc', 'price-desc'
  },
  reducers: {
    // Создание продукта
    addProduct: (state, action) => {
      const validation = validateProduct(action.payload);
      
      if (!validation.isValid) {
        state.error = validation.errors.join(', ');
        return;
      }
      
      const maxId = Math.max(...state.items.map(p => p.id || 0), 0);
      const productCategory = action.payload.category || 'other';
      const newProduct = {
        ...action.payload,
        id: maxId + 1,
        category: productCategory,
        uniqueId: `${productCategory}-${maxId + 1}`,
        status: action.payload.status || 'In Stock',
      };
      
      state.items.push(newProduct);
      state.error = null;
    },
    
    // Обновление продукта
    updateProduct: (state, action) => {
      const { id, category, ...updates } = action.payload;
      const validation = validateProduct({ ...updates, id, category });
      
      if (!validation.isValid) {
        state.error = validation.errors.join(', ');
        return;
      }
      
      const index = state.items.findIndex(
        p => p.id === id && p.category === category
      );
      
      if (index !== -1) {
        const existingProduct = state.items[index];
        state.items[index] = {
          ...existingProduct,
          ...updates,
          id,
          category,
          uniqueId: existingProduct.uniqueId || `${category}-${id}`,
        };
        state.error = null;
      } else {
        state.error = 'Product not found';
      }
    },
    
    // Удаление продукта
    deleteProduct: (state, action) => {
      const { id, category } = action.payload;
      state.items = state.items.filter(
        p => !(p.id === id && p.category === category)
      );
      state.error = null;
    },
    
    // Удаление нескольких продуктов
    deleteProducts: (state, action) => {
      const idsToDelete = action.payload;
      state.items = state.items.filter(
        p => !idsToDelete.some(
          ({ id, category }) => p.id === id && p.category === category
        )
      );
      state.error = null;
    },
    
    // Установка фильтров
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Сброс фильтров
    resetFilters: (state) => {
      const maxPrice = Math.max(...state.items.map(p => p.price || 0), 5000);
      state.filters = {
        search: '',
        priceRange: [0, maxPrice],
        status: 'all',
        category: 'all',
      };
    },
    
    // Установка сортировки
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const maxPrice = Math.max(...action.payload.map(p => p.price || 0), 5000);
        state.filters.priceRange = [0, maxPrice];
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load products';
      });
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  setFilters,
  resetFilters,
  setSortBy,
  clearError,
} = productsSlice.actions;

// Селекторы
export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;
export const selectSortBy = (state) => state.products.sortBy;

// Селектор для отфильтрованных и отсортированных продуктов
export const selectFilteredAndSortedProducts = (state) => {
  const { items, filters, sortBy } = state.products;
  
  let filtered = items.filter(product => {
    // Поиск по тексту
    const matchesSearch = !filters.search ||
      product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    // Фильтр по цене
    const matchesPrice = !product.price ||
      (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]);
    
    // Фильтр по статусу
    const matchesStatus = filters.status === 'all' ||
      (filters.status === 'in-stock' && product.status?.toLowerCase().includes('stock') && !product.status?.toLowerCase().includes('out')) ||
      (filters.status === 'out-of-stock' && product.status?.toLowerCase().includes('out'));
    
    // Фильтр по категории
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    
    return matchesSearch && matchesPrice && matchesStatus && matchesCategory;
  });
  
  // Сортировка
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'title':
      default:
        return a.title.localeCompare(b.title);
    }
  });
  
  return filtered;
};

export default productsSlice.reducer;
