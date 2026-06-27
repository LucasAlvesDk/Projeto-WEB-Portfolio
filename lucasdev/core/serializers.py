from rest_framework import serializers
from .models import Pessoal
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PessoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoal
        fields = [
            'id', 'nome', 'descricao', 'curso',
            'periodo', 'email', 'git', 'linked', 'url_imagem',
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id
        return data