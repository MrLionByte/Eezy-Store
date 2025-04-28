import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ShoppingBag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find your order. Redirecting...</p>
        <Button onClick={() => navigate('/store')}>Return to Store</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order is being processed.</p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <SummaryRow label="Order Number" value={order.id.replace('order-', '#')} />
          <SummaryRow label="Date" value={new Date(order.date).toLocaleDateString()} />
          <SummaryRow label="Total" value={`$${order.totalAmount.toFixed(2)}`} />
          <SummaryRow label="Payment Method" value={order.paymentMethod === 'credit-card' ? 'Credit/Debit Card' : 'PayPal'} />
        </div>

        {/* Items */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.product.id} className="py-4 flex">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm text-gray-900">{item.product.name}</h3>
                      <p className="text-sm font-medium text-gray-900">${item.product.price}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Address */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-sm text-gray-600 border rounded-lg border-gray-200 p-4">
            <div className="font-medium text-gray-900">{order.address.name}</div>
            <div className="mt-1">
              {order.address.street}<br />
              {order.address.city}, {order.address.state} {order.address.zipCode}<br />
              {order.address.country}
            </div>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <DeliveryStep icon={CheckCircle} title="Order confirmed" subtitle={new Date(order.date).toLocaleString()} active />
            <DeliveryStep icon={Package} title="Processing" subtitle="Not yet started" />
            <DeliveryStep icon={ShoppingBag} title="Shipped" subtitle="Not yet shipped" />
          </div>
        </div>

        <div className="flex space-x-4 justify-center mt-8">
          <Button variant="outline" onClick={() => navigate('/orders')}>
            View Orders
          </Button>
          <Button onClick={() => navigate('/store')}>
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between mb-4">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-900">{value}</div>
  </div>
);

const DeliveryStep = ({ icon: Icon, title, subtitle, active = false }) => (
  <div className="relative flex items-center mb-8">
    <div className={`flex-shrink-0 h-5 w-5 rounded-full ${active ? 'bg-blue-600' : 'bg-gray-200'} flex items-center justify-center`}>
      <Icon className={`w-3 h-3 ${active ? 'text-white' : 'text-gray-400'}`} />
    </div>
    <div className="ml-3">
      <h3 className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default OrderConfirmation;
