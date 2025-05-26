import logging
from django.db import transaction
from django.db.models import F
from django.contrib.auth.models import User, Group
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError

from core_app.models import Product, Rating, Address, Order, OrderItem, Cart, CartItem

from .serializers import (
    UserSerializer, LoginSerializer, ProductSerializer,
    CartItemSerializer, CartSerializer,
    UpdateCartItemSerializer, RemoveCartItemSerializer,
    AddressSerializer, CheckoutCartSerializer,
    OrderSerializer)

# Create your views here.

logger = logging.getLogger(__name__)

class SignupView(generics.CreateAPIView):
    """
    Create a new user account.
    
    Allows any user to sign up by providing the required user details.
    Returns a success message upon successful creation.

    * `POST` - Create a new user
    
    Request Body:
    - username: User's unique identifier (string, required)
    - password: User's password (string, required)
    - confirm_password: User's password to confirm (string, required)
    - email: User's email address (string, required)
    - first_name: User's first name identifier (string, required)
    - last_name: User's last name (string, optional)
    
    Responses:
    - 201: User created successfully, awaiting admin approval
    - 400: Bad request with error message
    """
    
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            logger.error("Error in signup" ,extra={'data': str(e)})
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        logger.info('Info' ,f'User signed up successfully {user.username}')
        return Response({
            'message': 'User created successfully, wait for admin approval.', 
        }, status=status.HTTP_201_CREATED)
        

class LoginView(APIView):
    """
    Login for a user.
    
    Allows any user to login by providing the email and password.
    Returns a success message upon successful login.

    * `POST` - Login as user.
    
    Request Body:
    - email: User's email address (string, required)
    - password: User's password (string, required)
    
    Responses:
    - 200: User logged in successfully
    - 400: Bad request with error message
    - 403: If user is inactive (not approved)
    """
    
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            logger.info('Info', f'{user.username} logged in successfully')
            response = Response({
                'user': UserSerializer(self.request.user).data,
                "access": access_token,
            }, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=True, 
                samesite='None',
                max_age=86400,  # 1 day
            )
            
            response.set_cookie('ua', request.META.get('HTTP_USER_AGENT', ''))
            response.set_cookie('ip', request.META.get('REMOTE_ADDR', ''))

            return response

        except ValidationError as ve:
            # Let DRF handle validation error properly (status 400)
            raise ve

        except Exception as e:
            logger.error("Unexpected error during login", extra={'data': str(e)})
            return Response({
                "error": "internal-error",
                "message": "An unexpected error occurred. Please try again later."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        

class LogoutView(APIView):
    """
    Logout for a user.
    
    Allows authenticated user to properly logout by adding refresh
    to the blacklist.
    Returns a success message upon logout.

    * `POST` - Logout.
    
    Request Body:
    - refresh: refresh token to be blacklisted
    
    Responses:
    - 205: User logged out successfully
    - 400: Bad request with error message
    - 403: If user is inactive (not approved)
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            logger.exception("Error occurred in Exception", extra={'data': {str(e)}})
            return Response(
                {"message": "Invalid token or already logged out."}
                , status=status.HTTP_400_BAD_REQUEST
            )
            return
        
        logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)


class SecureTokenRefreshView(TokenRefreshView):
    """
    Logout for a user.
    
    Allows authenticated user to properly logout by adding refresh
    to the blacklist.
    Returns a success message upon logout.

    * `POST` - Logout.
    
    Request Body:
    - refresh: refresh token to be blacklisted
    
    Responses:
    - 205: User logged out successfully
    - 400: Bad request with error message
    - 403: If user is inactive (not approved)
    """
    
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        ip = request.META.get('REMOTE_ADDR', '')

        refresh_token = request.COOKIES.get('refresh')
        
        if not refresh_token:
            logger.error("Error - Refresh token missing")
            return Response({'detail': 'Refresh token missing.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except InvalidToken:
            logger.exception('Invalid Token', extra={'data': refresh_token})
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
        

class ListAllProductsView(generics.ListAPIView):
    """
    Retrieve a list of all active products with ratings for the authenticated user.

    This endpoint allows an authenticated user to view all products that are active.
    Each product includes its average rating and total rating count.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Method:
    - GET: Returns a list of products.

    Responses:
    - 200: Successfully retrieved the list of products.
    - 403: If the user is not authenticated or inactive.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]  
    queryset = Product.objects.active().with_ratings()


class ListAllCartsView(generics.ListAPIView):
    """
    Retrieve the authenticated user's cart(s) with items and product details.

    This endpoint allows an authenticated user to view their own cart(s),
    including associated items and product information.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Method:
    - GET: Fetch the list of carts belonging to the authenticated user.

    Request Body:
    - None

    Responses:
    - 200: Successfully retrieved cart(s).
    - 403: Forbidden if the user is not authenticated.
    """
    
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user) 


class AddToCartView(generics.GenericAPIView):
    """
    Add a product to the authenticated user's cart.

    Allows an authenticated user to add a product to their cart.
    If the product already exists in the cart, the quantity will be updated.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Method:
    - POST: Add or update a product in the user's cart.

    Request Body (JSON):
    - product_id (int): ID of the product to add. (required)
    - quantity (int): Quantity to add. Defaults to 1 if not provided.

    Responses:
    - 200: Product added or updated successfully in the cart.
    - 400: Missing or invalid product ID.
    - 404: Product not found.
    - 403: Forbidden if the user is not authenticated.
    """
    
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            logger.warning('Product ID required')
            return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            
            logger.error('Product Not Found', extra={'data': f'Product ID : {product_id}'})
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateCartItemView(generics.UpdateAPIView):
    """
    Update the quantity of a specific cart item for the authenticated user.

    This endpoint allows an authenticated user to update the quantity of a cart item.
    The item must belong to the user's cart. The quantity must be an integer between 1 and 10.

    Permissions:
    - Requires the user to be authenticated.
    - The cart item must belong to the authenticated user.

    HTTP Method:
    - PATCH: Partially update a cart item's quantity.

    Request Body (JSON):
    - quantity (int): The new quantity for the cart item. (required, max 10)

    Responses:
    - 200: Quantity updated successfully.
    - 400: Missing or invalid quantity, or quantity exceeds allowed limit.
    - 403: Unauthorized access if the cart item does not belong to the user.
    - 404: Cart item not found.
    """
    
    queryset = CartItem.objects.all()
    serializer_class = UpdateCartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        item = self.get_object()
        if item.cart.user != request.user:
            logger.warning("Unauthorized - Not current user(s) cart", extra={'data': item.cart})
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        quantity = request.data.get('quantity')
        
        if quantity is None:
            logger.warning("Quantity is not added")
            return Response({'error': 'Quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
        except ValueError:
            logger.error("ValueError - Quantity is not in integer format")
            return Response({'error': 'Invalid quantity.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity > 10:
            logger.warning("Quantity exceeded the limit")
            return Response({'error': 'Max 10 quantity allowed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        item.quantity = quantity
        item.save()
        return Response({'message': 'Quantity updated'}, status=status.HTTP_200_OK)


class RemoveCartItemView(generics.DestroyAPIView):
    """
    Remove a cart item from the authenticated user's cart.

    This endpoint allows an authenticated user to delete a specific cart item.
    The item must belong to the user's cart.

    Permissions:
    - Requires the user to be authenticated.
    - The cart item must belong to the authenticated user.

    HTTP Method:
    - DELETE: Remove a cart item.

    Request Body:
    - None

    Responses:
    - 204: Item removed from cart successfully.
    - 403: Unauthorized if the item does not belong to the user.
    - 404: Cart item not found.
    """
    
    queryset = CartItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        item = self.get_object()
        if item.cart.user != request.user:
            logger.warning("Unauthorized - Not current user(s) cart", extra={'data': item.cart})
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        item.delete()
        return Response({'message': 'Item removed from cart.'}, status=status.HTTP_204_NO_CONTENT)
    
    
class AddressListCreateView(generics.ListCreateAPIView):
    """
    List and create shipping addresses for the authenticated user.

    This endpoint allows an authenticated user to:
    - View all their saved addresses (sorted by newest first).
    - Add a new address. If the new address is marked as default, 
      it will automatically unset any previously default address.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Methods:
    - GET: Retrieve a list of the user's addresses.
    - POST: Create a new address.

    Request Body (POST):
    - street, city, state, postal_code, country, is_default, etc. (based on Address model)

    Responses:
    - 200: Successfully retrieved address list.
    - 201: Address created successfully.
    - 400: Invalid or incomplete address data.
    - 403: Forbidden if user is not authenticated.
    """
    
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        address = Address.objects.filter(user=self.request.user).order_by('-created_at')
        return address
    
    def perform_create(self, serializer):
        if serializer.validated_data.get('is_default', False):
            Address.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
   
        serializer.save(user=self.request.user)


class AddressSelectView(generics.UpdateAPIView):
    """
    Set a specific address as the default for the authenticated user.

    This endpoint allows an authenticated user to mark one of their saved addresses
    as the default address. Any previously default address will be unset.

    Permissions:
    - Requires the user to be authenticated.
    - The address must belong to the authenticated user.

    HTTP Method:
    - PATCH: Update the `is_default` field of the selected address.

    Path Parameter:
    - pk (int): ID of the address to be set as default.

    Request Body:
    - None (selection is based on the address ID in the URL)

    Responses:
    - 200: Address set as default successfully.
    - 403: Unauthorized if the address does not belong to the user.
    - 404: Address not found.
    """
    
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Address.objects.all()

    def update(self, request, *args, **kwargs):
        address_id = kwargs.get('pk')

        try:
            address = Address.objects.get(pk=address_id, user=request.user)
        except Address.DoesNotExist:
            logger.warning("Address not found for the current user", extra={'data': request.user})
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

        Address.objects.filter(user=request.user, is_default=True).update(is_default=False)
        address.is_default = True
        address.save(update_fields=['is_default'])

        serializer = self.get_serializer(address)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class CheckoutView(APIView):
    """
    Retrieve the current user's cart items and calculate the total price.

    This endpoint allows an authenticated user to view all items currently in their cart,
    along with the computed total cost based on product price and quantity.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Method:
    - GET: Retrieve cart items and total price.

    Responses:
    - 200: Successfully retrieved cart items and total price.
    - 403: Unauthorized if the user is not authenticated.
    """
    
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            cart = Cart.objects.prefetch_related('items__product').get(user=request.user)
            serializer = CartSerializer(cart)
            total_price = sum(item.quantity * item.product.price for item in cart.get_cart_items())

            return Response({
                'cart_items': serializer.data['items'],
                'total_price': total_price
            })
        except Cart.DoesNotExist:
            logger.warning("DoesNotExist - Current user(s) cart not exist", extra={'data': request.user})
            return Response({
                'cart_items': [],
                'total_price': 0
            })


class PlaceOrderView(APIView):
    """
    Place an order from the user's cart.

    This endpoint allows an authenticated user to place an order using a selected address.
    It creates an order record with all cart items, calculates the total amount, and clears the cart.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Method:
    - POST: Submit an order request.

    Request Body:
    - address_id (int): ID of the user's address to associate with the order.

    Responses:
    - 201: Order placed successfully.
    - 400: Missing address ID, empty cart, or other validation error.
    - 403: If the user is not authenticated.
    - 404: Address or cart not found.
    - 500: Database transaction failed.
    """
    
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        address_id = request.data.get('address_id')

        if not address_id:
            logger.warning("Address id is not given")
            return Response({'detail': 'Address ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            logger.warning("Current user's address not found", extra={'data': request.user})
            return Response({'detail': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            cart = Cart.objects.prefetch_related('items__product').get(user=request.user)
            cart_items = cart.get_cart_items()

            if not cart_items.exists():
                logger.warning("Cart is empty", extra={'data': cart})
                return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    status='approved',
                    total_amount=0 
                )

                total = 0
                order_items = []
                
                for item in cart_items:
                    order_item = OrderItem(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price=item.product.price
                    )
                    total += item.quantity * item.product.price
                    order_items.append(order_item)
            
                OrderItem.objects.bulk_create(order_items)

                order.total_amount = total
                order.save()

                cart.items.all().delete()
                
                logger.info(f"Order {order.id} created successfully for user {request.user.username}")

            serialized_order = OrderSerializer(order)

            return Response({
                'detail': 'Order placed successfully.',
                'order': serialized_order.data
            }, status=status.HTTP_201_CREATED)

        except Cart.DoesNotExist:
            logger.warning("Cart not found for user", extra={'data': request.user})
            return Response({'detail': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error placing order for user {request.user.username}: {str(e)}")
            return Response({
                'detail': 'Failed to place order. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class OrderListView(APIView):
    """
    Retrieve all orders placed by the authenticated user.

    Allows an authenticated user to view a list of all their previous orders, including
    associated products, quantities, and delivery addresses.

    Permissions:
    - Requires the user to be authenticated.

    HTTP Method:
    - GET: Fetch list of user orders.

    Request Body:
    - None

    Responses:
    - 200: Returns a list of orders with related order items and address details.
    - 401: If the user is not authenticated.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        orders = Order.objects.filter(user=request.user) \
            .select_related('address') \
            .prefetch_related(
                'items__product',
            ) \
            .order_by('-created_at')

        serializer = OrderSerializer(orders, many=True, context={'user': request.user})
        return Response({"orders": serializer.data}, status=status.HTTP_200_OK)


class RatingSubmitView(APIView):
    """
    Submit a product rating for an order item.

    Allows an authenticated user to rate a product from a delivered order.

    * POST - Submit rating for a product in an order item.

    Path Parameter:
    - order_item_id (int): ID of the order item being rated.

    Request Body (application/json):
    - rating (int): Rating score between 1 and 5.

    Conditions:
    - User must be authenticated.
    - The order must be delivered.
    - The user must not have already rated the product.

    Responses:
    - 201: Rating submitted successfully.
    - 400: Invalid input, rating already exists, or order not delivered.
    - 404: Order item not found.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, order_item_id):
        order_item = OrderItem.objects.filter(id=order_item_id).first()
        if not order_item:
            logger.warning("Order not found for current user", extra={'data': request.user})
            return Response({"error": "Order item not found"}, status=status.HTTP_404_NOT_FOUND)

        if order_item.order.status != 'delivered':
            logger.warning("Order nis not delivered yet", extra={'data': order_item})
            return Response({"error": "Order must be delivered to rate products"}, status=status.HTTP_400_BAD_REQUEST)

        if Rating.objects.filter(product=order_item.product, user=request.user).exists():
            logger.warning("Already rated the product once", extra={'data': order_item.product})
            return Response({"error": "You have already rated this product"}, status=status.HTTP_400_BAD_REQUEST)

        rating_score = request.data.get('rating')
        try:
            rating_score = int(rating_score)
            if rating_score < 1 or rating_score > 5:
                logger.warning("Rating exceeded the given limit", extra={'data': rating_score})
                return Response({"error": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError):
            logger.error("Rating type is not in the required format")
            return Response({"error": "Invalid rating value"}, status=status.HTTP_400_BAD_REQUEST)

        Rating.objects.create(product=order_item.product, user=request.user, score=rating_score)
        return Response({"message": "Rating submitted successfully"}, status=status.HTTP_201_CREATED)

