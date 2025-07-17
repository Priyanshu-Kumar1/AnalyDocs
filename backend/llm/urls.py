from django.urls import path
from . import views




urlpatterns = [
    path("pause-space/", views.PauseSpace.as_view(), name="pause_space"),
    path("restart-space/", views.RestartSpace.as_view(), name="restart_space"),
]
