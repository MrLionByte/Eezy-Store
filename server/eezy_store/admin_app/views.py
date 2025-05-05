import logging
from django.contrib.auth.models import User, Group
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Prefetch

from core_app.models import Address, Product, Rating, Order, OrderItem

from .permission import IsAdmin
from .serializers import (LoginSerializer, CustomerListSerializer,
                          ProductSerializer, OrderSerializer,
                          OrderDetailSerializer,OrderStatusUpdateSerializer
                          )

logger = logging.getLogger(__name__)

class CustomerPagination(PageNumberPagination):
    """Custom pagination for customers list"""
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductPagination(PageNumberPagination):
    """Custom pagination for customers list"""
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class OrderPagination(PageNumberPagination):
    """Custom pagination for customers list"""
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminLoginView(APIView):
    """
    Admin Login View.

    Allows a superuser (admin) to log in and receive JWT tokens.

    * POST - Login as admin with username and password.

    Request Body (application/json):
    - username (str): Admin username.
    - password (str): Admin password.

    Responses:
    - 200: Admin logged in successfully, returns access token and user info.
    - 400: Validation error (e.g., incorrect credentials or permission denied).
    - 403: If user is inactive or not permitted.
    - Sets HTTP-only secure cookie with refresh token.
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        login(request, user)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        is_admin = user.is_superuser
        logger.info('Info', f'Admin logged in successfully : {user.username}')
        response = Response({
            'user': LoginSerializer(self.request.user).data,
            'is_admin': is_admin,
            "access": access_token,
        }, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            secure=True,  # Use only with HTTPS
            samesite='None',
            max_age=86400,  # 1 day
        )
        
        response.set_cookie('ua', request.META.get('HTTP_USER_AGENT', ''))
        response.set_cookie('ip', request.META.get('REMOTE_ADDR', ''))

        return response


class ListAllCustomersView(generics.ListAPIView):
    """
    List all registered customers.

    Allows admin users to view all users assigned to the 'Customer' group.

    * GET - Retrieve all customer records with pagination.

    Request Body:
    - None

    Responses:
    - 200: List of customers with detailed information.
    - 403: If the user is not an admin or lacks permissions.
    """
    
    serializer_class = CustomerListSerializer
    permission_classes = [IsAdmin]
    pagination_class = CustomerPagination
    
    def get_queryset(self):
        queryset = User.objects.filter(
            groups__name='Customer', 
            is_staff=False, 
            is_superuser=False
            ).order_by(
                '-date_joined'
                ).prefetch_related('groups')
        return queryset
    
    
class ApproveCustomerView(APIView):
    """
    Approve a customer account.

    Allows admin users to activate (approve) a customer who has registered but not yet logged in.

    * PATCH - Approve a customer by setting `is_active` to True.

    Request Body:
    - id (int): ID of the customer to be approved.
    - username (str): Username of the customer.

    Responses:
    - 200: Customer approved successfully.
    - 400: Missing fields or customer already logged in.
    - 404: Customer not found with provided ID and username.
    - 403: If the user is not an admin.
    """
    
    permission_classes = [IsAdmin]
    
    def patch(self, request):
        try:
            customer_id = request.data['id']
            customer_username = request.data['username']
            logger.info("Received approval request", extra={'id': customer_id, 'username': customer_username})

        except KeyError:
            logger.warning("Approval request missing required fields", extra={'data': request.data})
            return Response(
                {"detail": "Customer ID and username are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customer = get_object_or_404(User, id=customer_id, username=customer_username)
        
        try: 
            if customer.last_login:
                logger.info("Approval blocked", extra={'reason': "Customer already logged in", 'id': customer_id})
                return Response(
                    {"detail": "Customer has already got approved and logged in. Cannot approve.Contact support"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
            customer.is_active = True
            customer.save()
            
            logger.info("Customer approved successfully", extra={'id': customer_id})
            return Response(
                {
                    "action": "successful",
                    "detail": "Customer approved successfully"
                    },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.exception("Unexpected error during customer approval", extra={'error': str(e)})
            return Response(
                {"detail": f"An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    
class BlockUserView(APIView):
    """
    Block a customer account.

    Allows admin users to deactivate a customer account by setting `is_active` to False.

    * PATCH - Block a specific user.

    Request Body:
    - id (int): ID of the user to be blocked.

    Responses:
    - 200: User blocked successfully.
    - 400: User is already blocked or missing required fields.
    - 403: If the user is not an admin.
    - 404: User not found.
    - 500: Unexpected server error.
    """

    permission_classes = [IsAdmin]

    def patch(self, request):
        try:
            user_id = request.data['id']
            user = get_object_or_404(User, id=user_id)

            if user.is_active:
                user.is_active = False
                user.save()
                logger.info(f"User {user_id} blocked successfully.")
                return Response({"detail": "User blocked successfully"}, status=status.HTTP_200_OK)
            else:
                logger.info(f"User {user_id} already blocked.")
                return Response({"detail": "User is already blocked."}, status=status.HTTP_400_BAD_REQUEST)

        except KeyError:
            logger.warning("Blocking request missing required fields", extra={'data': request.data})
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception(f"Unexpected error while blocking user: {e}")
            return Response({"detail": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UnblockUserView(APIView):
    """
    Unblock a customer account.

    Allows admin users to reactivate a previously blocked customer account by setting `is_active` to True.

    * PATCH - Unblock a specific user.

    Request Body:
    - id (int): ID of the user to be unblocked.

    Responses:
    - 200: User unblocked successfully.
    - 400: User is not blocked or missing required fields.
    - 403: If the user is not an admin.
    - 404: User not found.
    - 500: Unexpected server error.
    """

    permission_classes = [IsAdmin]

    def patch(self, request):
        try:
            user_id = request.data['id']
            user = get_object_or_404(User, id=user_id)

            if not user.is_active:
                user.is_active = True
                user.save()
                logger.info(f"User {user_id} unblocked successfully.")
                return Response({"detail": "User unblocked successfully"}, status=status.HTTP_200_OK)
            else:
                logger.info(f"User {user_id} blocked successfully.")
                return Response({"detail": "User is not blocked."}, status=status.HTTP_400_BAD_REQUEST)

        except KeyError:
            logger.warning("Unblocking request missing required fields", extra={'data': request.data})
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception(f"Unexpected error while unblocking user: {e}")
            return Response({"detail": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductListView(generics.ListAPIView):
    """
    List all products for admin.

    Allows authenticated admin users to view all available (non-deleted) products,
    along with their average rating and total number of ratings.

    * GET - View Products.

    Request Body:
    - None required.

    Responses:
    - 200: List of products with pagination.
    - 400: Bad request with error message.
    - 403: If the user is not an admin.
    """
    
    permission_classes = [IsAdmin]
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    
    def get_queryset(self):
        return Product.objects.with_ratings().filter(
            is_deleted=False)
    

class ProductCreateView(generics.CreateAPIView):
    """
    Add a new product.

    Allows authenticated admin users to add a new product to the system.

    * POST - Add a product.

    Request Body:
    - name: string (required)
    - description: string (optional)
    - price: decimal (required)
    - image: file (optional)

    Responses:
    - 201: Product created successfully.
    - 400: Bad request with validation errors.
    - 403: If the user is not an admin.
    """
    
    permission_classes = [IsAdmin]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info("Added a new product", extra={'data': serializer.validated_data})
   

class ProductUpdateView(generics.UpdateAPIView):
    """
    Update an existing product.

    Allows authenticated admin users to update the details of an existing product.

    * PATCH - Update product information.

    Request Body:
    - name: string (optional)
    - description: string (optional)
    - price: decimal (optional)
    - image: file (optional)

    Responses:
    - 200: Product updated successfully.
    - 400: Bad request with validation errors.
    - 403: If the user is not an admin.
    - 404: Product not found.
    """
    
    permission_classes = [IsAdmin]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    
class ProductSoftDeleteView(generics.UpdateAPIView):
    """
    Soft delete a product.

    Allows authenticated admin users to soft-delete a product. A soft-deleted product is marked as deleted without 
    removing it from the database.

    * PATCH - Soft delete a product.

    Request Body:
    - None

    Responses:
    - 200: Product soft-deleted successfully.
    - 400: Product has already been soft-deleted.
    - 403: If the user is not an admin.
    - 404: Product not found.
    """
    
    permission_classes = [IsAdmin]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.is_deleted:
            logger.error(f"Product already soft deleted", extra={'data': instance.id})
            return Response(
                {"error": "This product has already been soft-deleted."},
                status=status.HTTP_400_BAD_REQUEST
            )
        instance.soft_delete()
        logger.info('Product deleted successfully', extra={'data': instance.id})
        return Response(
            {"detail": "Product soft-deleted successfully"},
            status=status.HTTP_200_OK)


class OrderListView(generics.ListAPIView):
    """
    List all orders with efficient ORM queries for admin panel.

    Allows authenticated admin users to view all orders, optimized with 
    `select_related` and `prefetch_related` to minimize database queries 
    and improve performance.

    * GET - List all orders with associated user, address, and items.

    Request Body:
    - None

    Responses:
    - 200: A list of all orders with associated user, address, and items.
    - 403: If user is not an admin.
    - 404: If no orders are found.
    """
    
    permission_classes = [IsAdmin]
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        return Order.objects.all() \
            .select_related('user', 'address') \
            .prefetch_related(
                Prefetch(
                    'items',
                    queryset=OrderItem.objects.select_related('product')
                )
            ) \
            .order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"orders": serializer.data}, status=status.HTTP_200_OK)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Retrieve detailed information about a specific order.

    Allows authenticated admin users to view a single order along with
    user details, shipping address, and associated items.

    * GET - Retrieve a specific order by its ID.

    Request Body:
    - None

    Responses:
    - 200: Order details retrieved successfully.
    - 400: Bad request with error message.
    - 403: If user is not an admin.
    - 404: If the order with the given ID does not exist.
    """
    
    permission_classes = [IsAdmin]
    serializer_class = OrderDetailSerializer
    
    def get_queryset(self):
        return Order.objects.all() \
            .select_related('user', 'address') \
            .prefetch_related(
                Prefetch(
                    'items',
                    queryset=OrderItem.objects.select_related('product')
                )
            )


class OrderStatusUpdateView(generics.UpdateAPIView):
    """
    Update the status of an order.

    Allows authenticated admin users to update the status of a specific order.

    * PATCH - Update the status of an order (e.g., pending → shipped, delivered, etc.).

    Request Body:
    - status: The new status for the order.

    Responses:
    - 200: Order status updated successfully.
    - 400: Bad request with validation error.
    - 403: If user is not an admin.
    - 404: If the order with the given ID does not exist.
    """
    
    permission_classes = [IsAdmin]
    serializer_class = OrderStatusUpdateSerializer
    queryset = Order.objects.all()
    http_method_names = ['patch']
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        data = {'status': serializer.validated_data.get('status')}
        self.perform_update(serializer)
        
        logger.info(f'Order_id: {instance.id} Order status updated successfully', extra={'data': serializer.validated_data})
        return Response(serializer.data)