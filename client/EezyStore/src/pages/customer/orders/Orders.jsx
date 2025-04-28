import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OrderStatusIcon } from '../../../components/order/OrderStatusIcon';
import { OrderStatusText } from '../../../components/order/OrderStatusText';
import { useOrders } from './_lib';
import Layout from '../../../components/layout/Layout';
import { Star } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const {
    orders,
    expandedOrder,
    setExpandedOrder,
    ratings,
    handleRatingChange,
    submitRating,
  } = useOrders();

  const renderStars = (orderId, productId, existingRating) => {
    const ratingKey = `${orderId}-${productId}`;
    const currentRating = ratings[ratingKey] || existingRating || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingChange(orderId, productId, i)}
          className={`${i <= currentRating ? 'text-amber-400' : 'text-gray-300'} hover:text-amber-500`}
        >
          <Star className="w-5 h-5" />
        </button>
      );
    }

    return stars;
  };

  if (orders?.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
          <Button onClick={() => navigate('/store')}>Start Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <div className="space-y-6">
        {orders?.map((order) => (
          <motion.div
            key={order.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <div className="flex items-center">
                    <OrderStatusIcon status={order.status} />
                    <h2 className="ml-2 text-lg font-medium text-gray-900">
                      Order {order.id.replace('order-', '#')}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                    <OrderStatusText status={order.status} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <Accordion
                type="single"
                collapsible
                className="w-full"
                value={expandedOrder === order.id ? order.id : undefined}
                onValueChange={(value) => setExpandedOrder(value)}
              >
                <AccordionItem value={order.id} className="border-none">
                  <AccordionTrigger className="py-2 px-4 hover:bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Order Details</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200">
                        {order?.items?.map((item) => {
                          const isRated = order.ratings && order.ratings[item.product.id];

                          return (
                            <li key={item.product.id} className="py-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                                    <p className="text-sm font-medium text-gray-900">${item.product.price}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>

                                  {/* Rating section */}
                                  {order.status === 'delivered' && (
                                    <div className="mt-3">
                                      {isRated ? (
                                        <div className="flex items-center">
                                          <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                                          <div className="flex">
                                            {renderStars(order.id, item.product.id, order.ratings[item.product.id])}
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
                                          <div className="flex items-center mb-2">
                                            <span className="text-sm text-gray-600 mr-2">Rate this product:</span>
                                            <div className="flex">
                                              {renderStars(order.id, item.product.id)}
                                            </div>
                                          </div>
                                          {ratings[`${order.id}-${item.product.id}`] && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => submitRating(order.id, item.product.id)}
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
                            {order.address.name}
                            <br />
                            {order.address.street}
                            <br />
                            {order.address.city}, {order.address.state} {order.address.zipCode}
                            <br />
                            {order.address.country}
                          </address>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h3>
                          <p className="text-sm text-gray-500">
                            {order.paymentMethod === 'credit-card' ? 'Credit/Debit Card' : 'PayPal'}
                          </p>
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
