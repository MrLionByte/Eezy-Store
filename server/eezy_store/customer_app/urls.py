from django.urls import path
from .views import (SignupView, LoginView,
                    LogoutView, SecureTokenRefreshView,
                    ListAllProductsView, ListAllCartsView,
                    AddToCartView, UpdateCartItemView,
                    RemoveCartItemView, AddressListCreateView,
                    AddressSelectView, CheckoutView,
                    PlaceOrderView)

urlpatterns = [
    path('signup', SignupView.as_view(), name='signup'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('token/refresh', SecureTokenRefreshView.as_view(), name='token_refresh'),

    path('products/', ListAllProductsView.as_view(), name='list-products'),

    path('carts/', ListAllCartsView.as_view(), name='list-all-carts'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/item/<int:pk>/update/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('cart/item/<int:pk>/remove/', RemoveCartItemView.as_view(), name='remove-cart-item'),

    path('cart/checkout/', CheckoutView.as_view(), name='checkout'),
    path('cart/checkout/place-order/', PlaceOrderView.as_view(), name='place-order'),
    
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/select/<int:pk>/', AddressSelectView.as_view(), name='address-select'),

]