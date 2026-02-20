import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recipientService } from '../../services/recipientService';

export const fetchRecipients = createAsyncThunk(
  'recipients/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await recipientService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecipientById = createAsyncThunk(
  'recipients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await recipientService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRecipient = createAsyncThunk(
  'recipients/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await recipientService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRecipient = createAsyncThunk(
  'recipients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await recipientService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRecipient = createAsyncThunk(
  'recipients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await recipientService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const recipientSlice = createSlice({
  name: 'recipients',
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
      .addCase(fetchRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecipientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchRecipientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRecipient.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateRecipient.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(deleteRecipient.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearCurrentItem, clearError } = recipientSlice.actions;
export default recipientSlice.reducer;
