import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    
    useEffect(() => {
      const token = localStorage.getItem('access');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user) {
        localStorage.removeItem('access')
        localStorage.removeItem('user')
        setIsAuthorized(false);
        return;
      }
      
      if (requireAdmin && !user.isAdmin) {
        setIsAuthorized(false);
        return;
      }
      
      if (token && user){
        setIsAuthorized(true);
      } else {
        localStorage.removeItem('access')
        localStorage.removeItem('user')
        setIsAuthorized(false);
      }
      
    }, [requireAdmin]);
    
    if (isAuthorized === null) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (isAuthorized === false) {
      return <Navigate to={requireAdmin ? "/admin/login" : "/login"} />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;