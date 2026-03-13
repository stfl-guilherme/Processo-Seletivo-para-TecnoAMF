from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from videos.models import Video, Tema, Trecho
from .serializers import VideoSerializer, TemaSerializer, TrechoSerializer
from django.utils import timezone
from django.db.models import Q
from rest_framework import filters


class VideoViewSet(viewsets.ModelViewSet):

    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'descricao']

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Video.objects.none()

        if user.is_superuser:
            return Video.objects.all()

        return Video.objects.filter(
            Q(data_expiracao__isnull=True) |
            Q(data_expiracao__gte=timezone.now().date())
        )


class TemaViewSet(viewsets.ModelViewSet):
    queryset = Tema.objects.all()
    serializer_class = TemaSerializer
    permission_classes = [IsAuthenticated]


class TrechoViewSet(viewsets.ModelViewSet):
    queryset = Trecho.objects.all()
    serializer_class = TrechoSerializer
    permission_classes = [IsAuthenticated]