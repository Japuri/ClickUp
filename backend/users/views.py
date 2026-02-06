from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import UserSerializer, UserCreateSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    if request.user.role != 'admin':
        return Response(
            {'error': 'Only admins can access user list'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    role_filter = request.query_params.get('role', None)
    users = CustomUser.objects.all()
    
    if role_filter:
        users = users.filter(role=role_filter)
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_create(request):
    if request.user.role != 'admin':
        return Response(
            {'error': 'Only admins can create users'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

