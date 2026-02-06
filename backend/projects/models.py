from django.db import models
from django.conf import settings


class Project(models.Model):
    STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('IN PROGRESS', 'In Progress'),
        ('OVERDUE', 'Overdue'),
        ('COMPLETED', 'Completed'),
    ]
    
    project_name = models.CharField(max_length=255)
    project_description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CREATED')
    hours_consumed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    user_assigned = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.project_name

