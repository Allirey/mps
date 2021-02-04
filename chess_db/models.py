from django.db import models


class ChessGame(models.Model):
    white = models.CharField(max_length=32, db_index=True)
    black = models.CharField(max_length=32, db_index=True)
    result = models.FloatField()
    whiteelo = models.IntegerField()
    blackelo = models.IntegerField()
    pgn = models.TextField()
    date = models.DateField()
    url = models.CharField(max_length=32, db_index=True)


class ChessMove(models.Model):
    game = models.ForeignKey(ChessGame, on_delete=models.CASCADE, related_name='moves')
    fen = models.CharField(max_length=128, db_index=True)
    san = models.CharField(max_length=8)
