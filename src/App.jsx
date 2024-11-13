import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage'; 
import Cart from './Pages/Cart';
import NotFoundPage from './components/NotFoundPage';
import Layout from './components/Layout';
import CheckoutForm from './Pages/CheckoutForm';
import PaymentTypePage from './Pages/PaymentTypePage';
import SocialsPage from './Pages/SocialsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Wrap the routes in the Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/payment" element={<PaymentTypePage />} />
          <Route path="/socials" element={<SocialsPage />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
