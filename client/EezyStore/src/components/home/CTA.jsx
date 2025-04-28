import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CTA() {
    const navigate = useNavigate();
    const handleStartShopping = () => {
        navigate('/login');
    };
    return (
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Eezy Shopping?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who make Eezy Store their first choice for online shopping.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-colors"
              onClick={handleStartShopping}
            >
              Start Shopping Now
            </Button>
          </div>
        </div>
    )
}