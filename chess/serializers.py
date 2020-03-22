from rest_framework import serializers
from .models import ChessGame


class ChessGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChessGame
        fields = '__all__'
