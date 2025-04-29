import { useState, useEffect } from 'react';
import { orderService } from '../../../services/apiService'; 

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.list();
      
      const ordersArray = data.orders || (Array.isArray(data) ? data : []);
      
      setOrders(ordersArray);
    } catch (err) {
      // console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRatingChange = (orderId, productId, rating) => {
    setRatings(prev => ({
      ...prev,
      [`${orderId}-${productId}`]: rating,
    }));
  };

  const submitRating = async (orderId, productId) => {
    const ratingKey = `${orderId}-${productId}`;
    const rating = ratings[ratingKey];

    if (rating) {
      try {
        setLoading(true);
        
        const order = orders.find(o => o.id === orderId);
        
        if (order && order.status !== 'delivered') {
          setError('You can only rate products from delivered orders');
          return;
        }
        
        await orderService.rating(orderId, productId, rating);
        
        setOrders(currentOrders => 
          currentOrders.map(order => {
            if (order.id === orderId) {
              return {
                ...order,
                items: order.items.map(item => {
                  if (item.id === productId) {
                    return {
                      ...item,
                      rating: rating
                    };
                  }
                  return item;
                })
              };
            }
            return order;
          })
        );
        
        setRatings(prev => {
          const newRatings = { ...prev };
          delete newRatings[ratingKey];
          return newRatings;
        });
      } catch (error) {
        // console.error('Error submitting rating:', error);
        setError('Failed to submit rating');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    orders,
    expandedOrder,
    setExpandedOrder,
    ratings,
    handleRatingChange,
    submitRating,
    loading,
    error,
    refreshOrders: fetchOrders,
  };
};