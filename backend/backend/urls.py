from django.contrib import admin
from django.urls import path
from django.urls import include
from filesystem import urls as filesystem_urls
from authentication import urls as authentication_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/filesystem/', include(filesystem_urls)),

    path('api/auth/', include('authentication.urls')),
    path('api/llm/', include('llm.urls')),
]
