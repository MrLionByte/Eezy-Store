import { motion } from 'framer-motion';
import { CheckCircle, PlusCircle, CreditCard, Home, Wallet, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCheckout } from './_lib'; 

const Checkout = () => {
  const {
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
    placeOrder,
    handleAddressSubmit,
    handleNewAddressChange,
    confirmPlaceOrder,
  } = useCheckout();

  const  imageBaseUrl = import.meta.env.VITE_IMAGE_URL;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
              
              <Dialog open={isNewAddressOpen} onOpenChange={setIsNewAddressOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddressSubmit} className="space-y-4 mt-4">

                    <div className="grid grid-cols-1 gap-4">
                      {['name', 'street', 'city', 'state', 'zipCode', 'country', 'phone'].map((field) => (
                        <div key={field}>
                          <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                          <Input
                            id={field}
                            name={field}
                            value={newAddress[field]}
                            onChange={handleNewAddressChange}
                            required
                          />
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={newAddress.isDefault}
                          onChange={handleNewAddressChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <Label htmlFor="isDefault">Set as default address</Label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsNewAddressOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Address</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {addresses?.length === 0 ? (
              <div className="text-center py-8">
                <Home className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                <p className="mt-1 text-sm text-gray-500">Add a shipping address to continue.</p>
              </div>
            ) : (
              <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4">
                {addresses?.map((address) => (
                  <div key={address.id} className={`relative rounded-lg border p-4 ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value={address.id} id={address.id} className="absolute top-4 left-4" />
                    <div className="pl-7">
                      <div className="font-medium text-gray-900">{address.name}</div>
                      <div className="text-gray-500 mt-1">
                        {address.street}<br />{address.city}, {address.state} {address.postal_code}<br />{address.country}<br />{address.phone}
                      </div>
                      {address.isDefault && (
                        <div className="mt-2 inline-flex items-center text-xs text-blue-600">
                          <CheckCircle className="w-3 h-3 mr-1" /> Default address
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-4">
              <Button variant="outline" className="flex items-center w-full" disabled>
                <Wallet className="mr-2" /> UPI (Coming Soon)
              </Button>
              <Button variant="outline" className="flex items-center w-full" disabled>
                <CreditCard className="mr-2" /> Wallet (Coming Soon)
              </Button>
              <Button variant="default" className="flex items-center w-full" disabled={false}>
                <Landmark className="mr-2" /> Cash on Delivery (Available)
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {cartItems?.map((item) => (
                  <li key={item.product.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm text-gray-900">{item.product.name}</h3>
                        <p className="text-sm font-medium text-gray-900">${item.product.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${totalPrice?.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            </div>

            <div className="mt-6">

              <AlertDialog open={isOrderConfirmOpen} onOpenChange={setIsOrderConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedAddressId || cartItems?.length === 0}
                  >
                    Place Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p>Are you sure you want to place this order?</p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmPlaceOrder}>Yes, Place Order</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>By placing your order, you agree to our {' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Terms and Conditions</a> and {' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Order Successful!</h2>
            <p>Check order status in order section</p>
            <p className="mb-4">Redirecting to store...</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/store');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go to Store Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
