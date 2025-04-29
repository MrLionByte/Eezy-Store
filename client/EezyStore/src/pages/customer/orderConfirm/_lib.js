import api from "@/lib/api";

export const useCheckout = () => {
  const placeOrder = async (addressId, cartItems) => {
    try {
      const response = await api.post('/cart/place_order/', {
        address_id: addressId
      });

      const newOrder = {
        id: response.data.order_id,
        date: new Date().toISOString(),
        totalAmount: response.data.total_amount,
        paymentMethod: "credit-card",
        items: cartItems,
        address: response.data.address
      };

      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  return { placeOrder };
};
