import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from './_lib'; 
import { toast } from "@/hooks/use-toast";
import Layout from '../../../components/layout/Layout';

const Cart = () => {
  const {
    cartItems,
    totalPrice,
    handleQuantityChange,
    removeFromCart,
    clearCart,
    handleCheckout,
    navigate
  } = useCart();

  const [editingItemId, setEditingItemId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(null);

  useEffect(() => {
    if (editingItemId) {
      const item = cartItems.find((cartItem) => cartItem.id === editingItemId);
      if (item) {
        setNewQuantity(item.quantity);
      }
    }
  }, [editingItemId, cartItems]);

  const handleLocalQuantityChange = (change) => {
    setNewQuantity(prev => Math.max(1, prev + change));
  };

  const handleConfirmQuantity = async () => {
    if (newQuantity > 10) {
      toast({
        title: 'Limit Reached',
        description: 'You cannot order more than 10 units.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await handleQuantityChange(editingItemId, newQuantity); 
      toast({ title: "Updated!", description: "Quantity updated successfully." });
      setEditingItemId(null); 
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <Button onClick={() => navigate('/store')}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <motion.li 
                    key={item.id}
                    className="py-6 flex"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                      <img
                        src={item?.product?.image || '/default-image.jpg'} 
                        alt={item?.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          {item?.product?.name}
                        </h3>
                        <p className="ml-4 text-base font-medium text-blue-600">
                          ${item?.product?.price}
                        </p>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">{item?.product?.description}</p>

                      <div className="flex-1 flex items-end justify-between mt-4">
                        {editingItemId === item.id ? (
                          <div className="flex items-center border rounded">
                            <button
                              type="button"
                              onClick={() => handleLocalQuantityChange(-1)} // Decrease
                              className="p-2"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4">{newQuantity}</span>
                            <button
                              type="button"
                              onClick={() => handleLocalQuantityChange(1)} // Increase
                              className="p-2"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <Button onClick={handleConfirmQuantity} className="ml-4">
                              Confirm Quantity
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center border rounded">
                            <button
                              type="button"
                              onClick={() => setEditingItemId(item.id)} // Set the item as editable
                              className="p-2"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setEditingItemId(item.id)} // Set the item as editable
                              className="p-2"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)} // Use removeFromCart logic from the custom hook
                          className="text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => navigate('/store')}>
                  Continue Shopping
                </Button>
                {/* <Button variant="destructive" onClick={clearCart}>
                  Clear Cart
                </Button> */}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="divide-y">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button className="mt-6 w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Cart;
