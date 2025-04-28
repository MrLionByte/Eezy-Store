import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/Home';
import LoginPage from '../pages/customer/auth/login/LoginPage';
import SignupPage from '../pages/customer/auth/signup/SignupPage';
import Store from '../pages/customer/store/Store';
import Cart from '../pages/customer/cart/Cart';
import CheckOut from '../pages/customer/checkout/checkout';
import Orders from '../pages/customer/orders/Orders';
import OrderConfirm from '../pages/customer/orderConfirm/OrderConfirm'; 

import TestPage from '../pages/test/Test';
import ProtectedRoute from '../components/route/ProtectedRoute';
import PublicRoute from '../components/route/PublicRoute';

export default function UserRoutes() {
  
  return (
    <Routes>
      <Route path="/" 
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>} />

      <Route path="login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>} />
      
      <Route path="signup" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>} />


      <Route element={<ProtectedRoute requireAdmin={false} />}>
        <Route path="store" element={<Store />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<CheckOut />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirm />} />
        <Route path="orders" element={<Orders />} />
        </Route>

      {/* Other Routes */}
      <Route path="test" element={<TestPage />} />

      {/* Optional: Fallback for user side */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
