from django.contrib.auth.models import User, Group
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import Avg
from core_app.models import Address, Product, Rating, Order, OrderItem


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        try:
            user = User.objects.get(username=username)
            if not user.check_password(password):
                raise serializers.ValidationError({'error': "password-mismatch", "message": "Incorrect password."})
            if not user.is_superuser:
                raise serializers.ValidationError({'error': 'not-permitted', "message": "You do not have permission to access this."})
            
            attrs['user'] = user
            return attrs
        
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": 'not-exist',"message":"User with this username does not exist."})


class CustomerListSerializer(serializers.ModelSerializer):
    """Serializer for listing customer with detailed information"""
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    last_login = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False)
    groups = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'is_active', 'date_joined', 'last_login', 'groups')
    
    def get_groups(self, obj):
        """Get customer groups as a list of names"""
        return [group.name for group in obj.groups.all()]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data in admin views"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 
                  'created_at', 'updated_at', 'average_rating', 'rating_count']


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for address data in admin views"""
    class Meta:
        model = Address
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items in admin views"""
    product = ProductSerializer()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for order list in admin views"""
    user = UserSerializer()
    address = serializers.StringRelatedField()
    items_count = serializers.SerializerMethodField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='calculate_total')
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'address', 'status', 'total_amount', 
            'items_count', 'created_at', 'updated_at'
        ]
    
    def get_items_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for a single order in admin views"""
    user = UserSerializer()
    address = AddressSerializer()
    items = OrderItemSerializer(many=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='calculate_total')
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'address', 'status', 'total_amount',
            'items', 'created_at', 'updated_at'
        ]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating order status"""
    class Meta:
        model = Order
        fields = ['status']
        
    def validate_status(self, value):
        """Validate that the status is one of the allowed choices"""
        valid_statuses = [status[0] for status in Order.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value