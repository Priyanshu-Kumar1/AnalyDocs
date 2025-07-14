from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import RegisterSerializer, LoginSerializer

class RegisterView(APIView):
    """
    View to handle user registration.
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        print("Registering user with data:", request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.to_representation(user), status=status.HTTP_201_CREATED)
        print("Registration errors:", serializer.errors)
        # If the serializer is not valid, return the errors with JSON 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
            user = serializer.user
            return Response(serializer.to_representation(user), status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
