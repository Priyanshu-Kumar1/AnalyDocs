from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=255)
    data_context = models.CharField(max_length=1000)
    data_path = models.CharField(max_length=1000)
    date_from = models.DateField()
    date_to = models.DateField()

    def __str__(self):
        return self.name
