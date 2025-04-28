import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && token){
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('access')
      localStorage.removeItem('user')
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/store" />;
  }

  return children;
};

export default PublicRoute;
