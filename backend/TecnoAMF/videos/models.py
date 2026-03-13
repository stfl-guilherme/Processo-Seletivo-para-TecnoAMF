from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Video(models.Model):

    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    url_video = models.URLField()

    data_criacao = models.DateTimeField(auto_now_add=True)
    data_expiracao = models.DateField(null=True, blank=True)

    def esta_expirado(self):

        if self.data_expiracao:
            return self.data_expiracao < timezone.now().date()

        return False

class Tema(models.Model):
    nome = models.CharField(max_length=100)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome
    
class Trecho(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    inicio = models.IntegerField()
    fim = models.IntegerField()
    descricao = models.TextField()

    def __str__(self):
        return f"{self.video.titulo} ({self.inicio}-{self.fim})"
    
class PermissaoAcesso(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    data_expiracao = models.DateTimeField()

    def __str__(self):
        return f"{self.usuario.username} - {self.video.titulo}"