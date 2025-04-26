import { Routes, Route  } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage"
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminRoutes() {
    console.log("In Admin Routes");
    return (
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }