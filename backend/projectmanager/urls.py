from django.urls import path
from .views import *




urlpatterns = [
    path('create/', CreateProjectView.as_view(), name='create_project'),
    path('list/', ProjectListView.as_view(), name='list_projects'),
]
