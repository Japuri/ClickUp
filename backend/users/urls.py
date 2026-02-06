from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_list, name='user-list'),
    path('create/', views.user_create, name='user-create'),
]
