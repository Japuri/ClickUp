from django.urls import path
from . import views

urlpatterns = [
    path('<int:project_id>/task/create/', views.task_create, name='task-create'),
]
