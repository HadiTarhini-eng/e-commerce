// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state of the cart
const initialState = {
  items: [],
  total: 0,
};

// Create a slice for the cart
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingProduct = state.items.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += quantity; // Increase quantity if item already in cart
      } else {
        state.items.push({ ...product, quantity });
      }

      // Recalculate total
      state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      // Recalculate total
      state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find(item => item.id === id);
      if (product) {
        product.quantity = quantity;
      }

      // Recalculate total
      state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
  },
});

// Export actions to be used in components
export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

// Export the reducer to be added to the store
export default cartSlice.reducer;
