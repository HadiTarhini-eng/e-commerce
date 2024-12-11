// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Use the 'client' from 'react-dom'
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider } from './components/client/AuthContext';

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <AuthProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
);
