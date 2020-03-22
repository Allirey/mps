from django.db import models


class ChessGame(models.Model):
    white = models.CharField(max_length=32, db_index=True)
    black = models.CharField(max_length=32, db_index=True)
    result = models.CharField(max_length=16)
    movescount = models.CharField(max_length=8)
    whiteelo = models.CharField(max_length=8)
    blackelo = models.CharField(max_length=8)
    event = models.CharField(max_length=64)
    date = models.CharField(max_length=16)
    moves = models.TextField()
    fen = models.CharField(max_length=128)
    url = models.CharField(max_length=32, db_index=True)
