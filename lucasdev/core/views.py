from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Technology, Project, Pessoal
from .serializers import PessoalSerializer


# Create your views here.

def home(request):

    technologies = Technology.objects.all()
    pessoal = Pessoal.objects.first()
    return render(request, 'core/home.html', {
        'technologies': technologies,
        'pessoal': pessoal,
    })


def projects(request):
    projects = Project.objects.all()
    return render(request, 'core/projects.html', {'projects':projects})



class PerfilDetail(generics.RetrieveUpdateAPIView):
    serializer_class = PessoalSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        perfil, created = Pessoal.objects.get_or_create(
            usuario=self.request.user,
            defaults={'nome': self.request.user.username},
        )
        return perfil