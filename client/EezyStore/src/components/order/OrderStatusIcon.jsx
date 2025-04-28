import { Package, Truck, ShoppingBag, Check } from 'lucide-react';

export const OrderStatusIcon = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Package className="w-5 h-5 text-amber-500" />;
    case 'processing':
      return <Truck className="w-5 h-5 text-blue-500" />;
    case 'shipped':
      return <ShoppingBag className="w-5 h-5 text-purple-500" />;
    case 'delivered':
      return <Check className="w-5 h-5 text-green-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};
