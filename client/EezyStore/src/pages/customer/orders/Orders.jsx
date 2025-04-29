import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OrderStatusIcon } from '../../../components/order/OrderStatusIcon';
import { OrderStatusText } from '../../../components/order/OrderStatusText';
import { useOrders } from './_lib';
import Layout from '../../../components/layout/Layout';
import { Star, Package } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const {
    orders,
    expandedOrder,
    setExpandedOrder,
    ratings,
    loading,
    error,
    handleRatingChange,
    submitRating,
  } = useOrders();

  const renderStars = (orderId, productId, existingRating) => {
    const ratingKey = `${orderId}-${productId}`;
    const currentRating = ratings[ratingKey] || existingRating || 0;
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.button
          key={i}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={existingRating ? undefined : () => handleRatingChange(orderId, productId, i)}
          className={`${i <= currentRating ? 'text-amber-400' : 'text-gray-300'} hover:text-amber-500`}
        >
          <Star className="w-5 h-5" />
        </motion.button>
      );
    }
  
    return stars;
  };

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOrderDelivered = (status) => {
    return status === 'delivered';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading orders...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen px-6 py-12 text-center">
          <Package className="w-20 h-20 text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">No Orders Yet</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't placed any orders. Let's fix that!</p>
          <Button onClick={() => navigate('/store')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full">
            Start Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <OrderStatusIcon status={order.status} />
                      <h2 className="ml-2 text-lg font-semibold text-gray-900">
                        {`Order #${order.id}`}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.created_at)}
                    </p>
                    {order.status === 'delivered' &&
                            <p className="text-sm text-green-500 mt-1">
                              Delivered on : {formatDate(order.updated_at)}
                            </p>
                            }
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                      <OrderStatusText status={order.status} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      Total: {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={expandedOrder === order.id ? String(order.id) : undefined}
                  onValueChange={(value) => setExpandedOrder(value ? Number(value) : null)}
                >
                  <AccordionItem value={String(order.id)} className="border-none">
                    <AccordionTrigger className="py-2 px-4 hover:bg-gray-50 rounded-md">
                      <span className="text-sm font-medium text-gray-700">Order Details</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="flow-root">
                        <ul className="divide-y divide-gray-200">
                          {order.items.map((item) => {
                            const isRated = item.rating !== null;
                            const canRate = isOrderDelivered(order.status);

                            return (
                              <li key={item.id} className="py-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                                    <img
                                      src={"http://localhost:8000/"+`${item.product.image}`}
                                      alt={item.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <div className="flex justify-between">
                                      <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                                      <p className="text-sm font-medium text-gray-900">{formatCurrency(item.product_price)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>

                                    {canRate && (
                                      <div className="mt-3">
                                        {isRated ? (
                                          <div className="flex items-center">
                                            <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                                            <div className="flex">
                                              {renderStars(order.id, item.id, item.rating)}
                                            </div>
                                            {/* Allow changing existing rating */}
                                            {ratings[`${order.id}-${item.id}`] && ratings[`${order.id}-${item.id}`] !== item.rating && (
                                              <p className='bg-red-200 rounded-full p-3 text-red-500'>Already rated product</p>
                                            )}
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="flex items-center mb-2">
                                              <span className="text-sm text-gray-600 mr-2">Rate this product:</span>
                                              <div className="flex">
                                                {renderStars(order.id, item.id)}
                                              </div>
                                            </div>
                                            {ratings[`${order.id}-${item.id}`] && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => submitRating(order.id, item.id)}
                                              >
                                                Submit Rating
                                              </Button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                            <address className="text-sm not-italic text-gray-500">
                              {order.address}
                            </address>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
                            <p className="text-sm text-gray-500">
                              Placed on : {formatDate(order.created_at)}
                            </p>
                            {order.status === 'delivered' &&
                            <p className="text-sm text-gray-500">
                              Delivered on : {formatDate(order.updated_at)}
                            </p>
                            }
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;