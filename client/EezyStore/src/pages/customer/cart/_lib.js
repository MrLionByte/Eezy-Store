import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { cartService } from '../../../services/apiService'; 

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
        if (fetchFromBackend){
            fetchCart();
            setFetchFromBackend(false)
        }
    }, [fetchFromBackend]);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      console.log(data);
      
      const cartData = data[0] || {};  // Safeguard if there's no data
        setCartItems(cartData?.items || []);  // Access items from the response correctly
        calculateTotal(cartData?.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity > 10) {
      toast({
        title: 'Limit Reached',
        description: 'You cannot order more than 10 units.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await cartService.update(itemId, newQuantity);
      fetchCart();
      toast({ title: "Updated!", description: "Quantity updated successfully." });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      try {
        const response = await cartService.removeItem(itemId);
        console.log(response);
        
        toast({ title: "Removed", description: "Item removed from cart." });
        setFetchFromBackend(true);
    } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      try {
        await cartService.clearCart();
        setCartItems([]);
        setTotalPrice(0);
        toast({ title: "Cart Cleared" });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems?.length > 0) {
      navigate('/checkout');
    }
  };

  return {
    cartItems,
    totalPrice,
    handleQuantityChange,
    removeFromCart,
    clearCart,
    handleCheckout,
    navigate
  };
};
