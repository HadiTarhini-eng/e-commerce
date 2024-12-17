import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [
    // Example products
    // {
    //   productId: 1,
    //   title: 'Product 1',
    //   category: 'Category 1',
    //   newPrice: 100,
    //   quantity: 2,
    //   image: 'image_url',
    // },
  ],
  checkoutData: { // New state to store checkout data
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    paymentMethod: {
      id: '', // payment method id
      label: '', // payment method label
    },
    deliveryMethod: {
      id: '', // delivery method id
      label: '', // delivery method label
      deliveryPrice: 0, // delivery price (without '$')
    },
    sendAsGift: false,
    noteForDriver: '',
    totalWithoutDelivery: 0,
    totalWithDelivery: 0, // Added to store the total with delivery
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add product to the cart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.productId === product.productId);
      if (existingProduct) {
        existingProduct.quantity += product.quantity; // Update quantity if the product already exists
      } else {
        state.cart.push(product); // Otherwise, add the product to the cart
      }
    },

    // Remove product from the cart
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item.productId !== productId);
    },

    // Update product quantity in the cart
    updateQuantity: (state, action) => {
      const { id, newQuantity } = action.payload;
      const existingProduct = state.cart.find((item) => item.productId === id);
      if (existingProduct) {
        existingProduct.quantity = newQuantity;
      }
    },

    // Clear all products from the cart
    clearCart: (state) => {
      state.cart = [];
    },

    // Update checkout data in the state
    updateCheckoutData: (state, action) => {
      const { field, value } = action.payload;

      if (field === 'paymentMethod' || field === 'deliveryMethod') {
        // If the field is paymentMethod or deliveryMethod, handle differently
        if (field === 'deliveryMethod' && value && typeof value === 'object') {
          state.checkoutData.deliveryMethod = value;
        } else if (field === 'paymentMethod' && value && typeof value === 'object') {
          state.checkoutData.paymentMethod = value;
        }
      } else {
        state.checkoutData[field] = value;
      }

      // Handle totalWithoutDelivery and totalWithDelivery separately
      if (field === 'totalWithoutDelivery') {
        state.checkoutData.totalWithoutDelivery = value;
      }

      if (field === 'totalWithDelivery') {
        state.checkoutData.totalWithDelivery = value;
      }
    },

    // Clear checkout data (optional, after order submission)
    clearCheckoutData: (state) => {
      state.checkoutData = initialState.checkoutData;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, updateCheckoutData, clearCheckoutData } = cartSlice.actions;

export default cartSlice.reducer;
