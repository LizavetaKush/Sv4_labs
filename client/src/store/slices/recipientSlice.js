import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { recipientService } from '../../services/recipientService'

export const fetchRecipients = createAsyncThunk(
  'recipients/fetchRecipients',
  async (params, { rejectWithValue }) => {
    try {
      const response = await recipientService.getRecipients(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRecipientById = createAsyncThunk(
  'recipients/fetchRecipientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await recipientService.getRecipientById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createRecipient = createAsyncThunk(
  'recipients/createRecipient',
  async (data, { rejectWithValue }) => {
    try {
      const response = await recipientService.createRecipient(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateRecipient = createAsyncThunk(
  'recipients/updateRecipient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await recipientService.updateRecipient(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteRecipient = createAsyncThunk(
  'recipients/deleteRecipient',
  async (id, { rejectWithValue }) => {
    try {
      await recipientService.deleteRecipient(id)
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

const recipientSlice = createSlice({
  name: 'recipients',
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
      .addCase(fetchRecipients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchRecipientById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecipientById.fulfilled, (state, action) => {
        state.loading = false
        state.currentItem = action.payload
      })
      .addCase(fetchRecipientById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createRecipient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRecipient.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createRecipient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateRecipient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRecipient.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((item) => item._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentItem && state.currentItem._id === action.payload._id) {
          state.currentItem = action.payload
        }
      })
      .addCase(updateRecipient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteRecipient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRecipient.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item._id !== action.payload)
        if (state.currentItem && state.currentItem._id === action.payload) {
          state.currentItem = null
        }
      })
      .addCase(deleteRecipient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentItem, clearError } = recipientSlice.actions
export default recipientSlice.reducer
