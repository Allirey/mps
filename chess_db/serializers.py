from rest_framework import serializers
from .models import ChessGame, ChessMove


class ChessGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChessGame
        fields = '__all__'


class ChessMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChessMove
        fields = '__all__'
