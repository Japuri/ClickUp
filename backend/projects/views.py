from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer
from tasks.models import Task


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_list(request):
    user = request.user
    
    if user.role == 'admin':
        projects = Project.objects.all()
    elif user.role == 'manager':
        projects = Project.objects.filter(user_assigned=user)
    else:
        task_projects = Task.objects.filter(user_assigned=user).values_list('project', flat=True)
        projects = Project.objects.filter(id__in=task_projects)
    
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user = request.user
    
    if user.role == 'admin':
        pass
    elif user.role == 'manager' and project.user_assigned != user:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    elif user.role == 'user':
        if not Task.objects.filter(project=project, user_assigned=user).exists():
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProjectSerializer(project)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def project_create(request):
    if request.user.role != 'admin':
        return Response(
            {'error': 'Only admins can create projects'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ProjectCreateSerializer(data=request.data)
    if serializer.is_valid():
        start_date = serializer.validated_data['start_date']
        today = timezone.now().date()
        
        if start_date == today:
            project_status = 'IN PROGRESS'
        else:
            project_status = 'CREATED'
        
        project = serializer.save(status=project_status)
        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

