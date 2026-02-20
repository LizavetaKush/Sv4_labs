import { configureStore } from '@reduxjs/toolkit';
import publicationReducer from './slices/publicationSlice';
import recipientReducer from './slices/recipientSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    publications: publicationReducer,
    recipients: recipientReducer,
    subscriptions: subscriptionReducer,
  },
});
