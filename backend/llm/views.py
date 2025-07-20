from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .scripts.hf_space_control import HuggingFaceSpaceManager

import os

if os.getenv("ENV") != "RENDER":
    # Load environment variables from .env file in production
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Just provide your Space ID here
manager = HuggingFaceSpaceManager(space_id="Priyanshukr-1/openhermes_mistral_API")


class PauseSpace(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        # if the user is authenticated, pause the space
        if request.user.is_authenticated:
            return Response({"message": manager.pause()}, status=status.HTTP_200_OK)
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    
class RestartSpace(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        # if the user is authenticated, restart the space
        if request.user.is_authenticated:
            return Response({"message": manager.restart()}, status=status.HTTP_200_OK)
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
