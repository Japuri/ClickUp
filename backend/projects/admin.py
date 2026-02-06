from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['project_name', 'status', 'user_assigned', 'hours_consumed', 'start_date', 'end_date']
    list_filter = ['status', 'start_date']
    search_fields = ['project_name', 'project_description']
    readonly_fields = ['hours_consumed', 'created_at', 'updated_at']

