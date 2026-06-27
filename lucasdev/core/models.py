from django.db import models
from django.conf import settings

# Create your models here.





class Technology(models.Model):
    name = models.CharField(max_length=90)
    icon = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=90)
    description = models.TextField()
    link = models.URLField(blank=True, null=True)
    
    technologies = models.ManyToManyField(Technology, blank=True)

    def __str__(self):
        return self.title
    

class Pessoal(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='perfil',
        null=True,
        blank=True,
    )
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    curso = models.CharField(max_length=200)
    periodo = models.CharField(max_length=50)
    email = models.EmailField()
    git = models.URLField(blank=True)
    linked = models.URLField(blank=True)
    url_imagem = models.URLField(blank=True)

    class Meta:
        verbose_name = 'Perfil Pessoal'
        verbose_name_plural = 'Perfis Pessoais'

    def __str__(self):
        return self.nome