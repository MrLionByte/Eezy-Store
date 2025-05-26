import { Link, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Package, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

const Layout = (props) => {

  const { children } = props;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Home className="w-6 h-6 text-blue-600" />
              <span className="ml-2 font-bold text-xl text-gray-900">eezy-store</span>
            </Link>
            
              <div className="flex items-center space-x-6">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => navigate('/store')}
                >
                  <Home className="w-5 h-5" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => navigate('/orders')}
                >
                  <Package className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-32">
                    {/* <DropdownMenuItem 
                      // onClick={() => navigate('/profile')}
                      >
                      Profile
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => {
                      localStorage.clear(); 
                      navigate('/login');
                    }}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          © 2025 Eezy Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
