import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';


export default function Hero() {
    const navigate = useNavigate();

    const handleStartShopping = () => {
        navigate('/login');
    };
    
    return (
        <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 md:pr-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Shopping Made <span className="text-blue-600">Eezy</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Find everything you need with just a few clicks. Quality products, seamless checkout, and fast delivery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
                onClick={handleStartShopping}
              >
                Start Shopping
              </Button>
            </motion.div>
          </div>
          <motion.div 
            className="mt-10 md:mt-0 md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <img 
              src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
              alt="Shopping experience" 
              className="w-full h-auto object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </motion.div>
    )
}