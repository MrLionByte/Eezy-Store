import { motion } from "framer-motion"; 
import { ShoppingCart, ShieldCheck, Package, TrendingUp } from "lucide-react"; 

const FeaturesSection = () => {
  return (
    <motion.div 
      className="bg-gray-50 py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Eezy Store?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We make online shopping simple, secure, and satisfying.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[ 
            {
              icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
              title: "Easy Shopping",
              description: "Browse through our curated collection with our intuitive interface.",
              bgColor: "bg-blue-100"
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
              title: "Secure Checkout",
              description: "Your transactions are protected with state-of-the-art security.",
              bgColor: "bg-green-100"
            },
            {
              icon: <Package className="w-6 h-6 text-purple-600" />,
              title: "Fast Delivery",
              description: "Get your products delivered to your doorstep in record time.",
              bgColor: "bg-purple-100"
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
              title: "Best Deals",
              description: "Amazing discounts and offers updated regularly for our customers.",
              bgColor: "bg-amber-100"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturesSection;
