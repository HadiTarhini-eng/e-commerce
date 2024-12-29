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

        Admin
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/productTable" element={<ProductTablePage />} />
          <Route path="/ordersTable" element={<OrdersPage />} />
          <Route path="/orderSummary/:id" element={<OrderSummaryPage />} />
          <Route path="/clientsTable" element={<ClientsTablePage />} />
          <Route path="/scentsTable" element={<ScentsTablePage />} />
          <Route path="/categoryTable" element={<CategoryTablePage />} />
          <Route path="/productDetailsPage/:id" element={<ProductDetailsPage />} />
          <Route path="/productReviews/:id" element={<ProductReviewsPage />} />
          <Route path="/discountSettings" element={<DiscountSettings />} />
          <Route path="/carouselEditor" element={<CarouselEditor />} />
        </Route>
      </Routes>
  );
};

export default App;
