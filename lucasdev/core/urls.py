from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.projects, name='projects'),
    path('api/perfil/', views.PerfilDetail.as_view(), name='perfil-api'),
]