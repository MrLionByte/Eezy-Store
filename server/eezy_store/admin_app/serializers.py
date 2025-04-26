from django.contrib.auth.models import User, Group
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


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
                raise serializers.ValidationError({"password": "Incorrect password."})
            if not user.is_superuser:
                raise serializers.ValidationError({"email": "You do not have permission to access this."})
            
            attrs['user'] = user
            return attrs
        
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User with this email does not exist."})