import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './client/Home';
import ProductPage from './client/ProductPage'; 
import Cart from './client/Cart';
import NotFoundPage from '../components/client/NotFoundPage';
import Layout from '../components/client/Layout';
import CheckoutForm from './client/CheckoutForm';
import PaymentPage from './client/PaymentPage';
import SocialsPage from './client/SocialsPage';
import AdminLayout from '../components/admin/AdminLayout';
import ProductTablePage from './admin/ProductTablePage';
import AdminDashboard from './admin/AdminDashboard';
import SignInPage from './client/SignInPage';
import OrderTrack from './client/OrderTrack';
import OrderHistory from './client/OrderHistory';
import OrderDetails from './client/OrderDetails';
import Favorites from './client/Favorites';
import OrdersPage from './admin/OrdersPage';
import OrderSummaryPage from './admin/OrderSummary';
import ClientsTablePage from './admin/ClientsTablePage';
import ScentsTablePage from './admin/ScentsTablePage';
import CategoryTablePage from './admin/CategoryTablePage';
import ProductDetailsPage from './admin/ProductDetailsPage';
import DiscountSettings from './admin/DiscountSettings';
import CarouselEditor from './admin/CarouselEditor';
import ProductReviewsPage from './admin/ProductReviewsPage';
import ProtectedRoute from '../components/client/ProtectedRoute';

const App = () => {
  return (
      <Routes>
        {/* Client */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/socials" element={<SocialsPage />} />
          <Route path="/signin" element={<SignInPage />}/>
          <Route path="/orderHistory" element={<OrderHistory />}/>
          <Route path="/orderTrack/:orderID" element={<OrderTrack />}/>
          <Route path="/orderDetails/:orderID" element={<OrderDetails />}/>
          <Route path="/favorites" element={<Favorites />}/>
        </Route>

        {/* Admin Routes - Protected */}
        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productTable"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductTablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordersTable"
            element={
              <ProtectedRoute requiredRole="admin">
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderSummary/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <OrderSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientsTable"
            element={
              <ProtectedRoute requiredRole="admin">
                <ClientsTablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scentsTable"
            element={
              <ProtectedRoute requiredRole="admin">
                <ScentsTablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categoryTable"
            element={
              <ProtectedRoute requiredRole="admin">
                <CategoryTablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productDetailsPage/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productReviews/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discountSettings"
            element={
              <ProtectedRoute requiredRole="admin">
                <DiscountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carouselEditor"
            element={
              <ProtectedRoute requiredRole="admin">
                <CarouselEditor />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
  );
};

export default App;