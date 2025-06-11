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

    adminDashboardData: {
      list: '/admin/top-products/',
    },
    
    adminCustomerManagement: {
      list: '/admin/customers',
      approve: '/admin/approve-customer',
      block: '/admin/block-customer',
      unBlock: '/admin/unblock-customer',
    },

    AdminProductsManagement: {
      list: '/admin/products/',
      create: '/admin/products/create/',
      edit: '/admin/products/',
      delete: '/admin/products/',
    },

    AdminOrdersManagement: {
      order: '/admin/orders/',
    },

    products: {
      list: '/customer/products/',
      detail: (id) => `/products/${id}/`,
      categories: '/products/categories/',
      featured: '/products/featured/',
    },

    cart: {
      get: '/customer/carts/',
      add: '/customer/cart/add/',
      update: '/customer/cart/item/',
      remove: '/customer/cart/item/',
    },

    checkout: {
      get_add: '/customer/addresses/',
      select: '/customer/addresses/select/',
      list: '/customer/cart/checkout/',
      placeOrder: '/customer/cart/checkout/place-order/'
    },

    orders: {
      list: '/customer/orders/',
      rate: '/customer/orders/rate/',
    },
  };
  
  export default API_ENDPOINTS;