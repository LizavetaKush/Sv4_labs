import { configureStore } from '@reduxjs/toolkit'
import publicationReducer from './slices/publicationSlice'
import recipientReducer from './slices/recipientSlice'
import subscriptionReducer from './slices/subscriptionSlice'

export const store = configureStore({
  reducer: {
    publications: publicationReducer,
    recipients: recipientReducer,
    subscriptions: subscriptionReducer,
  },
})
