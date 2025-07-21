from django.contrib import admin
from django.urls import path
from django.urls import include
from projectmanager import urls as projectmanager_urls
from authentication import urls as authentication_urls



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/projectmanager/', include(projectmanager_urls)),

    path('api/auth/', include(authentication_urls)),
    path('api/llm/', include('llm.urls')),
]
