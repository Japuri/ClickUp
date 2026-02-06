from django.db import models
from django.conf import settings
from projects.models import Project


class Task(models.Model):
    STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('IN PROGRESS', 'In Progress'),
        ('OVERDUE', 'Overdue'),
        ('COMPLETED', 'Completed'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    task_name = models.CharField(max_length=255)
    task_description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CREATED')
    hours_consumed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    user_assigned = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.task_name} - {self.project.project_name}"

