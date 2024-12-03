import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/client/Home';
import ProductPage from './Pages/client/ProductPage'; 
import Cart from './Pages/client/Cart';
import NotFoundPage from './components/client/NotFoundPage';
import Layout from './components/client/Layout';
import CheckoutForm from './Pages/client/CheckoutForm';
import PaymentTypePage from './Pages/client/PaymentTypePage';
import SocialsPage from './Pages/client/SocialsPage';
import AdminLayout from './components/admin/AdminLayout';
import ProductTablePage from './Pages/admin/ProductTablePage';
import AdminDashboard from './Pages/admin/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Client */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/payment" element={<PaymentTypePage />} />
          <Route path="/socials" element={<SocialsPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/productTable" element={<ProductTablePage />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
