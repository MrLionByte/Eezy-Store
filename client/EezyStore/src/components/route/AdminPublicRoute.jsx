import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user.isAdmin) {
        console.log("User is admin");
        
        setIsAuthenticated(true);
        console.log(isAuthenticated);
        
    } else{
        console.log("User is not admin");
        setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    console.log("User is authenticated");
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PublicRoute;
