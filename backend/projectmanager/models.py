from django.db import models



class Project(models.Model):
    # primary key is project_id, which is auto-generated if not provided
    project_id = models.CharField(max_length=255, primary_key=True)
    user_id = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255)
    data_context = models.CharField(max_length=10000)
    data_url = models.CharField(max_length=10000)
    date_from = models.DateField()
    date_to = models.DateField()

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['-date_from']
