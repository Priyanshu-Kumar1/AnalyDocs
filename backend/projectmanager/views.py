from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CreateProjectSerializer
from .utils import format_drf_errors
from .scripts.file_manager import CloudinaryFileManager


class CreateProjectView(APIView):
    """
    View to handle project creation.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):

        """Handle POST request to create a new project.
        Validates the request data and creates a new project if valid.
        """
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Project creation endpoint is under construction."}, status=status.HTTP_501_NOT_IMPLEMENTED)
        
        # filemanager = CloudinaryFileManager()
        # # upload a file to Cloudinary
        # if 'file' in request.FILES:
        #     file = request.FILES['file']
        #     upload_response = filemanager.upload_file(user_id, file)
        #     print("Upload Response:", upload_response)

        # serializer = CreateProjectSerializer(data=request.data)
        # if serializer.is_valid():
        #     project = serializer.save()
        #     project_data = serializer.to_representation(project)
        #     return Response(project_data, status=status.HTTP_201_CREATED)
        # return Response(format_drf_errors(serializer.errors), status=status.HTTP_400_BAD_REQUEST)