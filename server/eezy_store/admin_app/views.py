from django.contrib.auth.models import User, Group
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken


class AdminLoginView(APIView):
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
        
        login(request, user)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        is_admin = user.is_staff or user.is_superuser
        
        response = Response({
            'user': UserSerializer(self.request.user).data,
            "access": access_token,
        }, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            # secure=True,  # Use only with HTTPS
            secure=False,  # Use only with HTTP
            samesite='Lax',
            max_age=86400,  # 1 day
        )
        
        response.set_cookie('ua', request.META.get('HTTP_USER_AGENT', ''))
        response.set_cookie('ip', request.META.get('REMOTE_ADDR', ''))

        return response