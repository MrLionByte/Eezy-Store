from django.contrib.auth.models import User, Group
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

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
                raise serializers.ValidationError({"error": "account-inactive", "message": "Your account is inactive. Please contact support."})
            attrs['user'] = user
            return attrs
        
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "not-exist", "message": "Please check your email and try again."})

