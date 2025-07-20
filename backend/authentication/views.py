from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import RegisterSerializer, LoginSerializer

from .utils import format_drf_errors

class RegisterView(APIView):
    """
    View to handle user registration.
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = serializer.to_representation(user)
            response = Response(user_data, status=status.HTTP_201_CREATED)
            response.set_cookie(
                key='refresh_token',
                value=user_data['refresh'],
                httponly=True,
                secure=False,
                samesite='None',
                path="/",
                max_age=60 * 60 * 24
            )
            response.set_cookie(
                key='access_token',
                value=user_data['access'],
                httponly=True,
                secure=True,
                samesite='None',
                path="/",
                max_age=60 * 30
            )
            response.set_cookie(
                key='user_id',
                value=user_data['id'],
                httponly=True,
                secure=True,
                samesite='None',
                path="/",
                max_age=60 * 60 * 24
            )
            return response
        # If the serializer is not valid, return the errors with JSON
        return Response(format_drf_errors(serializer.errors), status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    View to handle user login.
    """
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        print("Logging in user with data:", request.data)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Don't access serializer.data - just use the user directly
            user = serializer.user
            user_data = serializer.to_representation(user)
            response = Response(user_data, status=status.HTTP_200_OK)
            response.set_cookie(
                key='refresh_token',
                value=user_data['refresh'],
                httponly=True,
                secure=True,
                samesite='None',
                path="/",
                max_age=60 * 60 * 24
            )
            response.set_cookie(
                key='access_token',
                value=user_data['access'],
                httponly=True,
                secure=True,
                samesite='None',
                path="/",
                max_age=60 * 30
            )
            response.set_cookie(
                key='user_id',
                value=user_data['id'],
                httponly=True,
                secure=True,
                samesite='None',
                path="/",  
                max_age=60 * 60 * 24
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClearAllUsers(APIView):
    """
    View to clear all users.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        from django.contrib.auth.models import User
        # Clear all users in the database
        User.objects.all().delete()
        return Response({"message": "All users have been cleared."}, status=status.HTTP_200_OK)