from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['task_name', 'project', 'status', 'user_assigned', 'hours_consumed', 'start_date', 'end_date']
    list_filter = ['status', 'start_date', 'project']
    search_fields = ['task_name', 'task_description']
    readonly_fields = ['hours_consumed', 'completed_at', 'created_at', 'updated_at']

