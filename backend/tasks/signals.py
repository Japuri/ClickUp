from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import datetime
from .models import Task


@receiver(pre_save, sender=Task)
def calculate_task_hours(sender, instance, **kwargs):
    if instance.status == 'COMPLETED' and instance.pk:
        try:
            old_instance = Task.objects.get(pk=instance.pk)
            if old_instance.status != 'COMPLETED':
                instance.completed_at = timezone.now()
                completed_date = instance.completed_at.date()
                start_date = instance.start_date
                hours_diff = (completed_date - start_date).days * 24
                instance.hours_consumed = hours_diff
        except Task.DoesNotExist:
            pass


@receiver(post_save, sender=Task)
def update_project_hours(sender, instance, **kwargs):
    project = instance.project
    total_hours = sum(task.hours_consumed for task in project.tasks.all())
    project.hours_consumed = total_hours
    project.save()
