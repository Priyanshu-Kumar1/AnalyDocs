from django.urls import include
from django.urls import path
# Import views from the authentication app
from authentication import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    # path('logout/', views.LogoutView.as_view(), name='logout'),
    # path('profile/', views.ProfileView.as_view(), name='profile'),
    # path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
]