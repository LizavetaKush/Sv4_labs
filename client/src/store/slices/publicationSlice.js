import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicationService } from '../../services/publicationService'

export const fetchPublications = createAsyncThunk(
  'publications/fetchPublications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await publicationService.getPublications(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPublicationById = createAsyncThunk(
  'publications/fetchPublicationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await publicationService.getPublicationById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPublication = createAsyncThunk(
  'publications/createPublication',
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicationService.createPublication(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePublication = createAsyncThunk(
  'publications/updatePublication',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await publicationService.updatePublication(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deletePublication = createAsyncThunk(
  'publications/deletePublication',
  async (id, { rejectWithValue }) => {
    try {
      await publicationService.deletePublication(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
}

const publicationSlice = createSlice({
  name: 'publications',
  initialState,
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchPublicationById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublicationById.fulfilled, (state, action) => {
        state.loading = false
        state.currentItem = action.payload
      })
      .addCase(fetchPublicationById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createPublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPublication.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createPublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updatePublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePublication.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((item) => item._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentItem && state.currentItem._id === action.payload._id) {
          state.currentItem = action.payload
        }
      })
      .addCase(updatePublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deletePublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePublication.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item._id !== action.payload)
        if (state.currentItem && state.currentItem._id === action.payload) {
          state.currentItem = null
        }
      })
      .addCase(deletePublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentItem, clearError } = publicationSlice.actions
export default publicationSlice.reducer
