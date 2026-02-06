from rest_framework import serializers
from .models import Task


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'task_name', 'task_description', 'user_assigned', 
                  'start_date', 'end_date']
        read_only_fields = ['id']
