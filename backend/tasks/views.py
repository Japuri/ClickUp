from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Task
from .serializers import TaskCreateSerializer
from projects.models import Project


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_create(request, project_id):
    user = request.user
    
    if user.role not in ['admin', 'manager']:
        return Response(
            {'error': 'Only admins and managers can create tasks'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if user.role == 'manager' and project.user_assigned != user:
        return Response(
            {'error': 'Managers can only create tasks for their assigned projects'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = TaskCreateSerializer(data=request.data)
    if serializer.is_valid():
        start_date = serializer.validated_data['start_date']
        today = timezone.now().date()
        
        if start_date == today:
            task_status = 'IN PROGRESS'
        else:
            task_status = 'CREATED'
        
        task = serializer.save(project=project, status=task_status)
        return Response(TaskCreateSerializer(task).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

