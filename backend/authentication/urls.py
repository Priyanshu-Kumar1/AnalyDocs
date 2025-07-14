from django.urls import include
from django.urls import path
# Import views from the authentication app
from authentication import views


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    # path('logout/', views.LogoutView.as_view(), name='logout'),
    # path('profile/', views.ProfileView.as_view(), name='profile'),
    # path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
]