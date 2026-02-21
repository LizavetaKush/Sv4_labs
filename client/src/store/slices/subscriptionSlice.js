import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { subscriptionService } from '../../services/subscriptionService'

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptions(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchSubscriptionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptionById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (data, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.createSubscription(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.updateSubscription(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteSubscription = createAsyncThunk(
  'subscriptions/deleteSubscription',
  async (id, { rejectWithValue }) => {
    try {
      await subscriptionService.deleteSubscription(id)
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

const subscriptionSlice = createSlice({
  name: 'subscriptions',
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
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false
        state.currentItem = action.payload
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((item) => item._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentItem && state.currentItem._id === action.payload._id) {
          state.currentItem = action.payload
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item._id !== action.payload)
        if (state.currentItem && state.currentItem._id === action.payload) {
          state.currentItem = null
        }
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentItem, clearError } = subscriptionSlice.actions
export default subscriptionSlice.reducer
