import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicationService } from '../../services/publicationService';

export const fetchPublications = createAsyncThunk(
  'publications/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await publicationService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPublicationById = createAsyncThunk(
  'publications/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await publicationService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPublication = createAsyncThunk(
  'publications/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicationService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePublication = createAsyncThunk(
  'publications/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await publicationService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePublication = createAsyncThunk(
  'publications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await publicationService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const publicationSlice = createSlice({
  name: 'publications',
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
      .addCase(fetchPublications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPublicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchPublicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPublication.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePublication.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(deletePublication.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearCurrentItem, clearError } = publicationSlice.actions;
export default publicationSlice.reducer;
