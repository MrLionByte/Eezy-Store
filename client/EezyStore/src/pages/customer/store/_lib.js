import { useState, useEffect } from 'react';
import {toast} from "@/hooks/use-toast";
import { cartService, productService } from '../../../services/apiService';
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.list();
      setProducts(data);
      // Optionally set ratings separately if needed
      const ratings = {};
      data.forEach(product => {
        ratings[product.id] = product.average_rating || 0;
      });
      setProductRatings(ratings);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const updatedCart = await cartService.addToCart(product.id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      console.log(updatedCart);
      
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { products, productRatings, loading, addToCart };
};
