from django.contrib.auth.models import User, Group
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken


from .serializers import UserSerializer, LoginSerializer

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
            # secure=True,  # Use only with HTTPS
            secure=False,  # Use only with HTTP
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
        print("User Agent" ,user_agent)
        ip = request.META.get('REMOTE_ADDR', '')
        print("IP" ,ip)
        # stored_ua = request.COOKIES.get('ua')
        # stored_ip = request.COOKIES.get('ip')
        # print("Stored" ,stored_ua, stored_ip)
        # if stored_ua != user_agent or stored_ip != ip:
        #     return Response({'detail': 'Invalid environment.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            print("Done")
            return super().post(request, *args, **kwargs)
        except InvalidToken as e:
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)