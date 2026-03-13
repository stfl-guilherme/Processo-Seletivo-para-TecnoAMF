from rest_framework import serializers
from videos.models import Video, Tema, Trecho

class VideoSerializer(serializers.ModelSerializer):

    expirado = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            "id",
            "titulo",
            "descricao",
            "url_video",
            "data_criacao",
            "data_expiracao",
            "expirado"
        ]

    def get_expirado(self, obj):
        return obj.esta_expirado()

class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = '__all__'

class TrechoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trecho
        fields = '__all__'