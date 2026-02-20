import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionService } from '../../services/subscriptionService';

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscriptions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await subscriptionService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    items: [],
    currentItem: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearCurrentItem, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
