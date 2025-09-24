from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from authentication.customauthclass.authentication import CookieJWTAuthentication
from .serializers import CreateProjectSerializer
from .utils import format_drf_errors
from .scripts.file_manager import CloudinaryFileManager
from .models import Project


# generate a unique project ID
def unique_projectid_generator(projectname):
    """
    Generates a unique project ID based on the project name.
    This function can be customized to generate unique IDs based on specific requirements.
    """
    import uuid
    return f"{projectname}-{str(uuid.uuid4())[:8]}"
    

class CreateProjectView(APIView):
    """
    View to handle project creation.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def post(self, request):

        """Handle POST request to create a new project.
        Validates the request data and creates a new project if valid.
        """
        
        user_id = request.COOKIES.get('user_id')
        request.data['user_id'] = user_id
        project_id = unique_projectid_generator(request.data.get('name', 'default_project'))
        request.data['project_id'] = project_id
        filemanager = CloudinaryFileManager()
        # upload a file to Cloudinary
        if 'file' in request.FILES:
            file = request.FILES.get('file')
            upload_response = filemanager.upload_file(user_id, project_id, file)
            request.data['data_url'] = upload_response

        

        serializer = CreateProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save()
            project_data = serializer.to_representation(project)
            return Response(project_data, status=status.HTTP_201_CREATED)
        return Response(format_drf_errors(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
    
class ProjectListView(APIView):
    """
    View to handle listing all projects for the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        """Handle GET request to list all projects."""
        user_id = request.COOKIES.get('user_id')
        projects = Project.objects.filter(user_id=user_id).order_by('-date_from')
        serializer = CreateProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SelectProjectView(APIView):
    """
    View to handle selecting a project.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        """Handle GET request to select a project."""
        user_id = request.COOKIES.get('user_id')
        project_id = request.query_params.get('project_id')
        try:
            project = Project.objects.get(user_id=user_id, project_id=project_id)
            serializer = CreateProjectSerializer(project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found.", "project_id": project_id, "user_id": user_id}, status=status.HTTP_404_NOT_FOUND)