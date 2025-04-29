from django.urls import path
from .views import (AdminLoginView, ListAllCustomersView, 
                    ApproveCustomerView, BlockUserView, 
                    UnblockUserView, ProductCreateView,
                    ProductListView,ProductUpdateView,
                    ProductSoftDeleteView, OrderDetailView,
                    OrderListView, OrderStatusUpdateView)

urlpatterns = [
    path('login', AdminLoginView.as_view(), name='admin_login'),
    
    path('customers', ListAllCustomersView.as_view(), name='customers-list'),
    path('approve-customer', ApproveCustomerView.as_view(), name='approve-customer'),
    path('block-customer', BlockUserView.as_view(), name='block-customer'),
    path('unblock-customer', UnblockUserView.as_view(), name='unblock-customer'),
    
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/create/', ProductCreateView.as_view(), name='product-create'),
    path('products/<int:pk>/', ProductUpdateView.as_view(), name='product-update'),
    path('products/<int:pk>/soft-delete/', ProductSoftDeleteView.as_view(), name='product-soft-delete'),

    path('orders/', OrderListView.as_view(), name='admin-order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='admin-order-detail'),
    path('orders/<int:pk>/status/', OrderStatusUpdateView.as_view(), name='admin-order-status-update'),

]