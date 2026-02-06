from rest_framework import serializers
from .models import Project
from tasks.models import Task
from users.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    user_assigned = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = ['id', 'task_name', 'task_description', 'status', 'hours_consumed', 
                  'user_assigned', 'start_date', 'end_date', 'completed_at']
    
    def get_user_assigned(self, obj):
        if obj.user_assigned:
            return f"{obj.user_assigned.first_name} {obj.user_assigned.last_name}"
        return None


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'project_name', 'project_description', 'status', 
                  'hours_consumed', 'start_date', 'end_date', 'tasks']
        read_only_fields = ['id', 'hours_consumed']


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'project_name', 'project_description', 'user_assigned', 
                  'start_date', 'end_date']
        read_only_fields = ['id']
