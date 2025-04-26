import { useState } from "react";
import { Home, ShoppingCart, Package, Star, ChevronDown, ChevronUp, Check, Truck, Clock } from "lucide-react";

// Mock data for products
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 249.99,
    image: "/api/placeholder/300/300",
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "/api/placeholder/300/300",
    rating: 4.2,
    reviews: 74
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 34.99,
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 56
  },
  {
    id: 4,
    name: "Fitness Smartwatch",
    price: 199.99,
    image: "/api/placeholder/300/300",
    rating: 4.1,
    reviews: 93
  }
];

// Mock data for orders
const initialOrders = [
  {
    id: "ORD-1234",
    date: "April 15, 2025",
    items: [products[0], products[2]],
    total: 284.98,
    status: "delivered",
    address: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA"
    }
  },
  {
    id: "ORD-5678",
    date: "April 22, 2025",
    items: [products[1]],
    total: 29.99,
    status: "processing",
    address: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown", 
      state: "CA",
      zip: "12345",
      country: "USA"
    }
  }
];

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState(initialOrders);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
      isDefault: true
    }
  ]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false
  });
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [productRatings, setProductRatings] = useState({});
  const [ratingProduct, setRatingProduct] = useState(null);
  
  // Cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };
  
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Checkout functions
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({...newAddress, [name]: value});
  };
  
  const saveNewAddress = () => {
    // Simple validation
    const requiredFields = ['name', 'street', 'city', 'state', 'zip', 'country'];
    const isValid = requiredFields.every(field => newAddress[field].trim() !== '');
    
    if (!isValid) {
      alert("Please fill all address fields");
      return;
    }
    
    const newId = savedAddresses.length ? Math.max(...savedAddresses.map(a => a.id)) + 1 : 1;
    
    const addressToSave = {
      ...newAddress,
      id: newId
    };
    
    // If this is the first address or marked as default
    if (newAddress.isDefault || savedAddresses.length === 0) {
      setSavedAddresses([
        ...savedAddresses.map(a => ({...a, isDefault: false})),
        {...addressToSave, isDefault: true}
      ]);
      setSelectedAddressId(newId);
    } else {
      setSavedAddresses([...savedAddresses, addressToSave]);
    }
    
    setAddingNewAddress(false);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false
    });
  };
  
  const placeOrder = () => {
    const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
    
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: [...cart],
      total: parseFloat(cartTotal),
      status: "processing",
      address: {...selectedAddress}
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCheckingOut(false);
    setShowOrders(true);
  };
  
  // Rating functions
  const startRating = (product) => {
    setRatingProduct(product);
  };
  
  const submitRating = (rating) => {
    if (!ratingProduct) return;
    
    setProductRatings({
      ...productRatings,
      [ratingProduct.id]: rating
    });
    
    setRatingProduct(null);
  };
  
  // Render star ratings
  const renderStars = (rating, interactive = false, productId = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              interactive 
                ? "cursor-pointer hover:text-yellow-500" 
                : star <= rating 
                  ? "text-yellow-500 fill-yellow-500" 
                  : star <= rating + 0.5 
                    ? "text-yellow-500 fill-yellow-500" 
                    : "text-gray-300"
            }`}
            onClick={interactive ? () => submitRating(star) : undefined}
            fill={interactive && productRatings[productId] && star <= productRatings[productId] ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };
  
  // Status indicators
  const getStatusIndicator = (status) => {
    switch(status) {
      case "processing":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-orange-500" />;
      case "delivered":
        return <Check className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Home className="w-6 h-6 text-blue-600" />
              <span className="ml-2 font-bold text-xl text-gray-900">ShopEase</span>
            </div>
            
            {/* Navigation icons */}
            <div className="flex items-center space-x-6">
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 relative"
                onClick={() => {
                  setShowCart(!showCart);
                  setShowOrders(false);
                  setIsCheckingOut(false);
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setShowOrders(!showOrders);
                  setShowCart(false);
                  setIsCheckingOut(false);
                }}
              >
                <Package className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Cart Overlay */}
        {showCart && !isCheckingOut && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Cart ({totalItems} items)</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={`cart-${item.product.id}`} className="flex items-center border-b pb-4">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-blue-600 font-semibold">${item.product.price}</p>
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-sm text-red-500 hover:text-red-700 mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-semibold text-lg mb-6">
                      <span>Total:</span>
                      <span>${cartTotal}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Checkout Overlay */}
        {isCheckingOut && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Checkout</h2>
                <button onClick={() => setIsCheckingOut(false)} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {cart.map(item => (
                    <div key={`checkout-${item.product.id}`} className="flex justify-between mb-2">
                      <span>{item.quantity} × {item.product.name}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-3 pt-3 font-semibold flex justify-between">
                    <span>Total:</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Delivery Address</h3>
                  <button 
                    onClick={() => setAddingNewAddress(!addingNewAddress)}
                    className="text-blue-600 text-sm"
                  >
                    {addingNewAddress ? "Cancel" : "+ Add New Address"}
                  </button>
                </div>
                
                {!addingNewAddress ? (
                  <div className="space-y-3">
                    {savedAddresses.map(address => (
                      <div 
                        key={address.id}
                        className={`border rounded p-3 cursor-pointer ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{address.name}</span>
                          {address.isDefault && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Default</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newAddress.name}
                          onChange={handleAddressChange}
                          className="w-full rounded border-gray-300 shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={newAddress.street}
                          onChange={handleAddressChange}
                          className="w-full rounded border-gray-300 shadow-sm p-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            className="w-full rounded border-gray-300 shadow-sm p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressChange}
                            className="w-full rounded border-gray-300 shadow-sm p-2"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zip"
                            value={newAddress.zip}
                            onChange={handleAddressChange}
                            className="w-full rounded border-gray-300 shadow-sm p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={newAddress.country}
                            onChange={handleAddressChange}
                            className="w-full rounded border-gray-300 shadow-sm p-2"
                          />
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="default-address"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="default-address" className="ml-2 text-sm text-gray-700">Make this my default address</label>
                      </div>
                      <button
                        onClick={saveNewAddress}
                        className="bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors mt-2"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={placeOrder}
                disabled={cart.length === 0 || !selectedAddressId}
                className={`w-full py-3 rounded-lg font-semibold ${
                  cart.length === 0 || !selectedAddressId 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
        
        {/* Orders Overlay */}
        {showOrders && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Orders</h2>
                <button onClick={() => setShowOrders(false)} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{order.id}</span>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <div className="flex items-center">
                            {getStatusIndicator(order.status)}
                            <span className="ml-2 text-sm capitalize">{order.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        {order.items.map(item => (
                          <div key={`order-${order.id}-item-${item.product ? item.product.id : item.id}`} className="flex py-2">
                            <img 
                              src={item.product ? item.product.image : item.image} 
                              alt={item.product ? item.product.name : item.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="ml-3 flex-grow">
                              <p className="font-medium">{item.product ? item.product.name : item.name}</p>
                              <div className="flex justify-between text-sm">
                                <span>${item.product ? item.product.price : item.price}</span>
                                <span>Qty: {item.quantity || 1}</span>
                              </div>
                              {order.status === "delivered" && (
                                <button 
                                  onClick={() => startRating(item.product || item)}
                                  className="text-sm text-blue-600 mt-1"
                                >
                                  Rate product
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping address:</span>
                          </div>
                          <p className="text-sm mt-1">
                            {order.address.name}, {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}, {order.address.country}
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Rating Modal */}
        {ratingProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => setRatingProduct(null)}></div>
            <div className="bg-white rounded-lg p-6 w-full max-w-sm relative z-10">
              <h3 className="text-lg font-semibold mb-4">Rate this product</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={ratingProduct.image} 
                  alt={ratingProduct.name} 
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <p className="font-medium">{ratingProduct.name}</p>
                  <div className="mt-2 flex justify-center">
                    {renderStars(0, true, ratingProduct.id)}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setRatingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => submitRating(5)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-medium mb-2 text-gray-900">{product.name}</h3>
                  
                  <div className="flex items-center mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500 ml-2">
                      ({productRatings[product.id] ? productRatings[product.id] : product.rating}) - {product.reviews} reviews
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          © 2025 ShopEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}