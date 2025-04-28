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


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 
                  'created_at', 'updated_at', 'average_rating', 'rating_count']





    
    