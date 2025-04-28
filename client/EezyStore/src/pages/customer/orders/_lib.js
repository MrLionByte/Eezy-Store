import { useState } from 'react';

// Dummy data for orders
const dummyOrders = [
  {
    id: 'order-123',
    status: 'delivered',
    date: '2025-04-27',
    totalAmount: 99.99,
    items: [
      {
        product: {
          id: 'prod-001',
          name: 'Product 1',
          image: 'https://via.placeholder.com/150',
          price: 49.99,
        },
        quantity: 1,
      },
      {
        product: {
          id: 'prod-002',
          name: 'Product 2',
          image: 'https://via.placeholder.com/150',
          price: 50.00,
        },
        quantity: 1,
      },
    ],
    ratings: {
      'prod-001': 4,
      'prod-002': 5,
    },
    address: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Sample City',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
    },
    paymentMethod: 'credit-card',
  },
  {
    id: 'order-124',
    status: 'pending',
    date: '2025-04-26',
    totalAmount: 79.99,
    items: [
      {
        product: {
          id: 'prod-003',
          name: 'Product 3',
          image: 'https://via.placeholder.com/150',
          price: 79.99,
        },
        quantity: 1,
      },
    ],
    ratings: {},
    address: {
      name: 'Jane Smith',
      street: '456 Elm St',
      city: 'Other City',
      state: 'NY',
      zipCode: '54321',
      country: 'USA',
    },
    paymentMethod: 'paypal',
  },
];

export const useOrders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [ratings, setRatings] = useState({});

  const handleRatingChange = (orderId, productId, rating) => {
    setRatings(prev => ({
      ...prev,
      [`${orderId}-${productId}`]: rating
    }));
  };

  const submitRating = (orderId, productId) => {
    const ratingKey = `${orderId}-${productId}`;
    const rating = ratings[ratingKey];
    
    if (rating) {
      // Here you would call an API to submit the rating
      console.log(`Submitted rating ${rating} for product ${productId} in order ${orderId}`);
    }
  };

  return {
    orders,
    expandedOrder,
    setExpandedOrder,
    ratings,
    handleRatingChange,
    submitRating,
  };
};
