from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    """
    Custom User model that extends the default Django User model.
    This allows for future extensibility if needed.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
     
    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'auth_user'
    