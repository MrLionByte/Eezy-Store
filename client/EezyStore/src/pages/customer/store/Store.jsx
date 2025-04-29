import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Layout from '../../../components/layout/Layout';
import { useProducts } from './_lib'; 


const Store = () => {
  const { products, productRatings, addToCart, loading } = useProducts();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" stroke="#f59e0b" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-amber-400" />);
    }
    return stars;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <motion.div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2 text-gray-900">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {renderStars(productRatings[product.id] ?? product.average_rating)}
                    <span className="text-sm text-gray-500 ml-2">
                      ({productRatings[product.id] ?? product?.average_rating ?? 0})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Store;
