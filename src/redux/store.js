import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import cartReducer from './cartSlice'; // Import your cartSlice

// Set up persist configuration for cart slice
const persistConfig = {
  key: 'root', // Key under which the state is saved in storage
  storage, // Use localStorage for persistence
  whitelist: ['cart', 'checkoutData'], // Only persist the cart state (you can persist more slices if needed)
};

// Persisted reducer
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer, // Use persisted reducer for cart
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // You can ignore specific actions
        ignoredPaths: ['register'], // Or ignore specific paths in the state
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
