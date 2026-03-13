from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, TemaViewSet, TrechoViewSet
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.decorators import api_view
from rest_framework.response import Response

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='videos')
router.register(r'temas', TemaViewSet)
router.register(r'trechos', TrechoViewSet)

@api_view(['POST'])
def teste_login(request):
    return Response({"status": "login funcionando"})

urlpatterns = [
    path('teste-login/', teste_login),
    path('login/', obtain_auth_token),
    path('', include(router.urls)),
]