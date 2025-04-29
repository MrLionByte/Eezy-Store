import { useState, useEffect } from 'react';
import { addressService,checkOutService } from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';

export const useCheckout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    try {
      const response = await checkOutService.details();
      console.log(response);
      
      setCartItems(response.cart_items);
      setTotalPrice(response.total_price);
    } catch (error) {
      console.error('Failed to fetch cart details:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await addressService.list();
      setAddresses(data);
      console.log(data);
      
      const defaultAddress = data.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const placeOrder = async () => {
    try {
      const placedOrder = await checkOutService.placeOrder(selectedAddressId);
      clearCart();
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/store');
      }, 1500);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addAddress = async (address) => {
    try {
      const payload = {
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        postal_code: address.zipCode,
        country: address.country,
        is_default: address.isDefault,
      };
      const data = await addressService.create(payload);
      await fetchAddresses(); // refresh after add
      if (address.isDefault) {
        setSelectedAddressId(data.id);
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const selectAddress = async (addressId) => {
    try {
      await addressService.select(addressId);
      setSelectedAddressId(addressId);
      await fetchAddresses(); // refresh after selecting
    } catch (error) {
      console.error('Failed to select address:', error);
    }
  };


  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    await addAddress(newAddress);
    setNewAddress({
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    setIsNewAddressOpen(false);
  };
  
  const confirmPlaceOrder = () => {
    placeOrder(cartItems, selectedAddressId, paymentMethod);
    setIsOrderConfirmOpen(true);
    clearCart();
  };

  return {
    cartItems,
    totalPrice,
    addresses,
    selectedAddressId,
    paymentMethod,
    isNewAddressOpen,
    newAddress,
    isOrderConfirmOpen,
    showSuccessModal,
    setShowSuccessModal,
    setIsOrderConfirmOpen,
    setSelectedAddressId,
    setPaymentMethod,
    setIsNewAddressOpen,
    setNewAddress,
    clearCart,
    addAddress,
    selectAddress,
    handleNewAddressChange,
    handleAddressSubmit,
    placeOrder,
    confirmPlaceOrder,
  };
};
