import api from '../api/axiosConfig';
import API_ENDPOINTS from '../config/apiEndpoints';

export const authService = {
    signup: async (userData) => {
        const response = await api.post(API_ENDPOINTS.auth.signup, userData);
        return response.data;
      },
    
    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.auth.login, credentials);
        return response.data;
      },

    adminLogin: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.adminAuth.login, credentials);
        return response.data;
      },
  
    logout: async () => {
        const response = await api.post(API_ENDPOINTS.auth.logout);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
      },
};


export const adminCustomerService = {
  list: async () => {
    const response = await api.get(API_ENDPOINTS.adminCustomerManagement.list);
    return response.data;
  },

  approve: async (customerId, userName) => {
    const response = await api.patch(API_ENDPOINTS.adminCustomerManagement.approve, { 
     id: customerId, username: userName });
    return response.data;
  },

  block: async (customerId) => {
    const response = await api.patch(API_ENDPOINTS.adminCustomerManagement.block, { id: customerId });
    return response.data;
  },

  unBlock: async (customerId) => {
    const response = await api.patch(API_ENDPOINTS.adminCustomerManagement.unBlock, { id: customerId });
    return response.data;
  },
};



export const adminProductService = {
  list: async () => {
    const response = await api.get(API_ENDPOINTS.AdminProductsManagement.list);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post(
      API_ENDPOINTS.AdminProductsManagement.create, 
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  },

  edit: async (id, productData) => {
    const response = await api.put(
      `${API_ENDPOINTS.AdminProductsManagement.edit}${id}/`, 
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  },  

  softDelete: async (id) => {
    const response = await api.patch(`${API_ENDPOINTS.AdminProductsManagement.delete}${id}/soft-delete/`);
    return response.data;
  },
};


export const productService = {
  list: async () => {
    const response = await api.get(API_ENDPOINTS.products.list);
    return response.data;
  },
};

export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post(API_ENDPOINTS.cart.add, {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  getCart: async () => {
    const response = await api.get(API_ENDPOINTS.cart.get);
    return response.data;
  },
  
  update: async(itemId, newQuantity) => {
    const response = await api.patch(`${API_ENDPOINTS.cart.update}${itemId}/update/`, {quantity: newQuantity});
    return response.data
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`${API_ENDPOINTS.cart.remove}${itemId}/remove/`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete(API_ENDPOINTS.cart.clear);
    return response.data;
  }
};


export const addressService = {
  list: async () => {
    const response = await api.get(API_ENDPOINTS.checkout.get_add);
    return response.data;
  },

  create: async (address) => {
    const response = await api.post(API_ENDPOINTS.checkout.get_add, address);
    return response.data;
  },

  select: async (addressId) => {
    const response = await api.patch(`${API_ENDPOINTS.checkout.select}${addressId}/`);
    return response.data;
  }
};


export const checkOutService = {
  details: async () => {
    const response = await api.get(API_ENDPOINTS.checkout.list);
    return response.data;
  },

  placeOrder: async (selectedAddressId) => {
    const response = await api.post(API_ENDPOINTS.checkout.placeOrder, { address_id: selectedAddressId });
    return response.data;
  },
};

