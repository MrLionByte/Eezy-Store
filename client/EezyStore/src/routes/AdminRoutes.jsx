import { Routes, Route  } from "react-router-dom";
import AdminLoginPage from "../pages/admin/adminAuth/AdminLoginPage"
import AdminInterface from "../pages/admin/AdminInterface";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import CustomerManagement from "../pages/admin/customerManagement/CustomerManagement";
import Products from "../pages/admin/products/Product";
import Orders from "../pages/admin/orders/Orders";
import ProtectedRoute from "../components/route/ProtectedRoute";
import AdminPublicRoute from "../components/route/AdminPublicRoute";

export default function AdminRoutes() {
    return (
      <Routes>
        <Route path="login" element={
          <AdminPublicRoute>
            <AdminLoginPage />
          </AdminPublicRoute>
        } />
        
        <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/" element={<AdminInterface />}>

          <Route index element={<AdminDashboard />} /> 
          <Route path="products" element={<Products />} />
          <Route path="customer-management" element={<CustomerManagement />} />
          <Route path="orders" element={<Orders />} />
          {/* <Route path="settings" element={<Settings />} /> */}
          {/* <Route path="reports" element={<Reports />} /> */}
          {/* <Route path="analytics" element={<Analytics />} /> */}
          {/* <Route path="notifications" element={<Notifications />} /> */}
          {/* <Route path="support" element={<Support />} /> */}
        </Route>
      </Route>

      </Routes>
    );
  }