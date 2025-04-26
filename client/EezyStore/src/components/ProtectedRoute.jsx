import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    
    useEffect(() => {
      const token = localStorage.getItem('access');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        console.log("Token not found");
        
        setIsAuthorized(false);
        return;
      }
      
      if (requireAdmin && !user.isAdmin) {
        console.log("User is not admin");
        
        setIsAuthorized(false);
        return;
      }
      
      setIsAuthorized(true);
    }, [requireAdmin]);
    
    if (isAuthorized === null) {
      console.log("Loading...");
      
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (isAuthorized === false) {
      console.log("Not authorized");
      return <Navigate to={requireAdmin ? "/admin/login" : "/login"} />;
    }
    
    return children;
};

export default ProtectedRoute;