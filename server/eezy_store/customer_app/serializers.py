from django.contrib.auth.models import User, Group
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from core_app.models import Product, Rating, Order, OrderItem, Cart, CartItem, Address


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'password': {'required': True},
            'password_confirm': {'required': True},
        }
        
    def validate(self, attrs):
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'error': 'email-exists', "message": "Email already exists."})
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'error': 'password-not-confirm' ,"message": "Password fields did not match."})
        
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        
        customer_group,_ = Group.objects.get_or_create(name='Customer')
        user.groups.add(customer_group)
        return user
    
class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                raise serializers.ValidationError({'error': "password-mismatch", "message": "Incorrect password."})
            if not user.is_active:
                if not user.last_login:
                    raise serializers.ValidationError({"error": "account-not-activated", "message": "Your account is not activated yet. Please check your email."})
                raise serializers.ValidationError({"error": "account-blocked", "message": "Your account is blocked by admin. Please contact support."})
            attrs['user'] = user
            return attrs
        
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "not-exist", "message": "Please check your email and try again."})


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    image = serializers.ImageField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'average_rating', 'rating_count']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at', 'updated_at']
        
class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'quantity']

class RemoveCartItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
        

class CheckoutCartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_name', 'quantity', 'product_price', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price

