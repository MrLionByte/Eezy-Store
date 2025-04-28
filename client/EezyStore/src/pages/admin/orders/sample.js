// Dummy data for orders
export const orders = [
    {
      id: "ORD-1234",
      customer: "John Smith",
      email: "john.smith@example.com",
      date: "2025-04-25T08:30:00",
      status: "processing",
      items: [
        { name: "Premium T-Shirt", price: 29.99, quantity: 2 },
        { name: "Denim Jeans", price: 59.99, quantity: 1 }
      ],
      total: 119.97,
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA"
      },
      payment: "Credit Card"
    },
    {
      id: "ORD-1235",
      customer: "Emma Johnson",
      email: "emma.j@example.com",
      date: "2025-04-24T14:15:00",
      status: "shipped",
      items: [
        { name: "Wireless Headphones", price: 149.99, quantity: 1 },
        { name: "Phone Case", price: 24.99, quantity: 1 }
      ],
      total: 174.98,
      address: {
        line1: "456 Park Avenue",
        line2: "",
        city: "Boston",
        state: "MA",
        zip: "02108",
        country: "USA"
      },
      payment: "PayPal"
    },
    {
      id: "ORD-1236",
      customer: "Michael Davis",
      email: "michael.davis@example.com",
      date: "2025-04-24T09:45:00",
      status: "delivered",
      items: [
        { name: "Fitness Tracker", price: 89.99, quantity: 1 }
      ],
      total: 89.99,
      address: {
        line1: "789 Oak Street",
        line2: "",
        city: "San Francisco",
        state: "CA",
        zip: "94107",
        country: "USA"
      },
      payment: "Credit Card"
    },
    {
      id: "ORD-1237",
      customer: "Sarah Williams",
      email: "sarah.w@example.com",
      date: "2025-04-23T16:20:00",
      status: "pending",
      items: [
        { name: "Winter Jacket", price: 179.99, quantity: 1 },
        { name: "Wool Scarf", price: 34.99, quantity: 2 },
        { name: "Gloves", price: 24.99, quantity: 1 }
      ],
      total: 274.96,
      address: {
        line1: "101 Pine Road",
        line2: "Unit 7",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "USA"
      },
      payment: "Bank Transfer"
    },
    {
      id: "ORD-1238",
      customer: "Robert Brown",
      email: "r.brown@example.com",
      date: "2025-04-23T11:10:00",
      status: "cancelled",
      items: [
        { name: "Smartwatch", price: 249.99, quantity: 1 }
      ],
      total: 249.99,
      address: {
        line1: "222 Cedar Lane",
        line2: "",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "USA"
      },
      payment: "Credit Card"
    }
  ];