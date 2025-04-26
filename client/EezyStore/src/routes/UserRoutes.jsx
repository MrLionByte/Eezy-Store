import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/login/LoginPage';
import SignupPage from '../pages/auth/signup/SignupPage';
import HomePage from '../pages/customer/Home';

import TestPage from '../pages/test/Test';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

export default function UserRoutes() {
  console.log("In UserRoutes");
  
  return (
    <Routes>
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

      <Route
        path="/store"
        element={
          <ProtectedRoute requireAdmin={false}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path='test' element={<TestPage />} />
    </Routes>
  );
}
