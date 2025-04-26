const API_ENDPOINTS = {
    auth: {
      login: '/customer/login',
      signup: '/customer/signup',
      logout: '/customer/logout',
      refreshToken: '/customer/token/refresh',
    },

    adminAuth: {
        login: '/admin/login',
    },
    
    products: {
      list: '/products/',
      detail: (id) => `/products/${id}/`,
      categories: '/products/categories/',
      featured: '/products/featured/',
    },
    
    orders: {
      create: '/orders/',
      list: '/orders/',
      detail: (id) => `/orders/${id}/`,
      cancel: (id) => `/orders/${id}/cancel/`,
    },
    
    cart: {
      get: '/cart/',
      add: '/cart/add/',
      update: '/cart/update/',
      remove: '/cart/remove/',
      clear: '/cart/clear/',
    },

  };
  
  export default API_ENDPOINTS;