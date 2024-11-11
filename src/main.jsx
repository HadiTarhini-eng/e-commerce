// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Use the 'client' from 'react-dom'
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
