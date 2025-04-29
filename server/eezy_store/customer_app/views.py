from django.contrib.auth.models import User, Group
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken

from core_app.models import Product, Rating, Address, Order, OrderItem, Cart, CartItem

from .serializers import (
    UserSerializer, LoginSerializer, ProductSerializer,
    CartItemSerializer, CartSerializer,
    UpdateCartItemSerializer, RemoveCartItemSerializer,
    AddressSerializer, CheckoutCartSerializer,
    OrderSerializer)

# Create your views here.


class SignupView(generics.CreateAPIView):
    """_summary_

    Args:
        generics (_type_): 

    Returns:
        _type_: 
    """
    
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Error" ,e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        return Response({
            'message': 'User created successfully, wait for admin approval.', 
        }, status=status.HTTP_201_CREATED)
        

class LoginView(APIView):
    """_summary_

    Args:
        APIView (_type_): _description_

    Returns:
        _type_: _description_
    """
    
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        print(user)
        login(request, user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        response = Response({
            'user': UserSerializer(self.request.user).data,
            "access": access_token,
        }, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            secure=True,  # Use only with HTTPS
            # secure=False,  # Use only with HTTP
            samesite='Lax',
            max_age=86400,  # 1 day
        )
        
        response.set_cookie('ua', request.META.get('HTTP_USER_AGENT', ''))
        response.set_cookie('ip', request.META.get('REMOTE_ADDR', ''))

        return response
        

class LogoutView(APIView):
    """_summary_
    Args:
        APIView (_type_): _description_
    Returns:
        _type_: _description_
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e: 
            return Response(
                {"message": "Invalid token or already logged out."}
                , status=status.HTTP_400_BAD_REQUEST
            )
            return
        
        logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)


class SecureTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        ip = request.META.get('REMOTE_ADDR', '')
        
        print("User Agent", user_agent)
        print("IP", ip)

        refresh_token = request.COOKIES.get('refresh')
        
        if not refresh_token:
            return Response({'detail': 'Refresh token missing.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except InvalidToken:
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

        print("Done")
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
        

class ListAllProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]  
    queryset = Product.objects.active().with_ratings()


class ListAllCartsView(generics.ListAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user) 


class AddToCartView(generics.GenericAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateCartItemView(generics.UpdateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = UpdateCartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        item = self.get_object()
        if item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        quantity = request.data.get('quantity')
        
        if quantity is None:
            return Response({'error': 'Quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
        except ValueError:
            return Response({'error': 'Invalid quantity.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity > 10:
            return Response({'error': 'Max 10 quantity allowed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        item.quantity = quantity
        item.save()
        return Response({'message': 'Quantity updated'}, status=status.HTTP_200_OK)


class RemoveCartItemView(generics.DestroyAPIView):
    queryset = CartItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        item = self.get_object()
        if item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        item.delete()
        return Response({'message': 'Item removed from cart.'}, status=status.HTTP_204_NO_CONTENT)
    
    
class AddressListCreateView(generics.ListCreateAPIView):
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
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Address.objects.all()

    def update(self, request, *args, **kwargs):
        address_id = kwargs.get('pk')

        try:
            address = Address.objects.get(pk=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

        Address.objects.filter(user=request.user, is_default=True).update(is_default=False)
        address.is_default = True
        address.save(update_fields=['is_default'])

        serializer = self.get_serializer(address)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class CheckoutView(APIView):
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
            return Response({
                'cart_items': [],
                'total_price': 0
            })


class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        address_id = request.data.get('address_id')

        if not address_id:
            return Response({'detail': 'Address ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({'detail': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            cart = Cart.objects.prefetch_related('items__product').get(user=request.user)
            cart_items = cart.get_cart_items()

            if not cart_items.exists():
                return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

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

            serialized_order = OrderSerializer(order)

            return Response({
                'detail': 'Order placed successfully.',
                'order': serialized_order.data
            }, status=status.HTTP_201_CREATED)

        except Cart.DoesNotExist:
            return Response({'detail': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class OrderListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        orders = Order.objects.filter(user=request.user) \
            .select_related('address') \
            .prefetch_related(
                'items__product',
            ) \
            .order_by('-created_at')

        serializer = OrderSerializer(orders, many=True, context={'user': request.user})
        return Response({"orders": serializer.data}, status=status.HTTP_200_OK)
    

class RatingSubmitView(APIView):
    def post(self, request, order_item_id):
        if not request.user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        order_item = OrderItem.objects.filter(id=order_item_id).first()
        if not order_item:
            return Response({"error": "Order item not found"}, status=status.HTTP_404_NOT_FOUND)

        if order_item.order.status != 'delivered':
            return Response({"error": "Order must be delivered to rate products"}, status=status.HTTP_400_BAD_REQUEST)

        if Rating.objects.filter(product=order_item.product, user=request.user).exists():
            return Response({"error": "You have already rated this product"}, status=status.HTTP_400_BAD_REQUEST)

        rating_score = request.data.get('rating')
        try:
            rating_score = int(rating_score)
            if rating_score < 1 or rating_score > 5:
                return Response({"error": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError):
            return Response({"error": "Invalid rating value"}, status=status.HTTP_400_BAD_REQUEST)

        Rating.objects.create(product=order_item.product, user=request.user, score=rating_score)

        return Response({"message": "Rating submitted successfully"}, status=status.HTTP_201_CREATED)

