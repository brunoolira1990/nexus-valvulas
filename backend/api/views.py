from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import LoginSerializer, UserSerializer
from .models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de login.
    Retorna token JWT e dados do usuário.
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Dados inválidos', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    # Autenticar usuário
    user = authenticate(request, username=email, password=password)
    
    if not user:
        return Response(
            {'error': 'Email ou senha incorretos'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'Usuário inativo'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Gerar tokens JWT
    refresh = RefreshToken.for_user(user)
    
    # Serializar dados do usuário
    user_data = UserSerializer(user).data
    
    return Response({
        'token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': user_data
    }, status=status.HTTP_200_OK)

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import LoginSerializer, UserSerializer
from .models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de login.
    Retorna token JWT e dados do usuário.
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Dados inválidos', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    # Autenticar usuário
    user = authenticate(request, username=email, password=password)
    
    if not user:
        return Response(
            {'error': 'Email ou senha incorretos'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'Usuário inativo'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Gerar tokens JWT
    refresh = RefreshToken.for_user(user)
    
    # Serializar dados do usuário
    user_data = UserSerializer(user).data
    
    return Response({
        'token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': user_data
    }, status=status.HTTP_200_OK)

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import LoginSerializer, UserSerializer
from .models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de login.
    Retorna token JWT e dados do usuário.
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Dados inválidos', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    # Autenticar usuário
    user = authenticate(request, username=email, password=password)
    
    if not user:
        return Response(
            {'error': 'Email ou senha incorretos'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'Usuário inativo'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Gerar tokens JWT
    refresh = RefreshToken.for_user(user)
    
    # Serializar dados do usuário
    user_data = UserSerializer(user).data
    
    return Response({
        'token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': user_data
    }, status=status.HTTP_200_OK)
