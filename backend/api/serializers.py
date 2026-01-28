from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo User."""
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'is_active', 'is_staff']
        read_only_fields = ['id', 'is_active', 'is_staff']


class LoginSerializer(serializers.Serializer):
    """Serializer para login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo User."""
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'is_active', 'is_staff']
        read_only_fields = ['id', 'is_active', 'is_staff']


class LoginSerializer(serializers.Serializer):
    """Serializer para login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo User."""
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'is_active', 'is_staff']
        read_only_fields = ['id', 'is_active', 'is_staff']


class LoginSerializer(serializers.Serializer):
    """Serializer para login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
