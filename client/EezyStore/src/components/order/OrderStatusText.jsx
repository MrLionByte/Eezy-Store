export const OrderStatusText = ({ status }) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-500">Pending</span>;
      case 'processing':
        return <span className="text-blue-500">Processing</span>;
      case 'shipped':
        return <span className="text-purple-500">Shipped</span>;
      case 'delivered':
        return <span className="text-green-500">Delivered</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };
  