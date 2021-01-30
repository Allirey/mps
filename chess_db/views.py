from django.db.models import Q, Count, Sum, Max, Value, IntegerField, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import ChessGame, ChessMove


class SingleChessGameView(APIView):
    def get(self, request):
        game_id = request.query_params.get('id')

        try:
            game = ChessGame.objects.values('pgn').get(url=game_id)['pgn']
        except ChessGame.DoesNotExist:
            return Response({"game": None}, status=status.HTTP_404_NOT_FOUND)

        return Response({"game": game})


class ChessOpeningExplorerView(APIView):
    def get(self, request):
        name = request.query_params.get('name', '')
        color = 'b' if request.query_params.get('color') == 'b' else 'w'
        fen = request.query_params.get('fen', '')

        if fen:
            fen = ' '.join(fen.split()[:-3])

        if len(name) < 3:
            return Response({'moves': [], 'games': []}, status=status.HTTP_404_NOT_FOUND)

        name = ', '.join(name.split()[:2]) if ',' not in name else name

        moves = ChessMove.objects.filter(Q(fen__startswith=fen) & {'w': Q(game__white__istartswith=name),
                                                                   'b': Q(game__black__istartswith=name)}[color]) \
            .values('move') \
            .annotate(date=Max('game__date')) \
            .annotate(games=Count('move')) \
            .annotate(score=ExpressionWrapper(Sum('game__result') / Count('move') * Value(100),
                                              output_field=IntegerField())) \
            .order_by('-games')

        games = ChessGame.objects.filter({'w': Q(white__istartswith=name),
                                          'b': Q(black__istartswith=name)}[color]
                                         & Q(moves__fen__startswith=fen)) \
            .values('white', 'black', 'result', 'date', 'url', 'whiteelo', 'blackelo').order_by('-date')

        return Response({'moves': moves, 'games': games})


class SearchNameAutocompleteView(APIView):
    def get(self, request):
        name = request.query_params.get('name')

        if len(name) < 3:
            return Response({"names": []}, status=status.HTTP_404_NOT_FOUND)

        with_name = ' ' in name or ',' in name

        name = ', '.join(name.split()[:2]) if with_name else name

        names = ChessGame.objects.filter(Q(white__istartswith=name)) \
            .values('white').annotate(Count('id'))

        res = []
        for name in names:
            if with_name:
                res.append(name['white'])
            elif ',' not in name['white']:
                res.append(name['white'].split()[0])
            else:
                res.append(name['white'].split(',')[0])

        names = res if with_name else list(set(res))

        return Response({"names": sorted(names)})
