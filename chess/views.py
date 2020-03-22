from django.shortcuts import render, reverse, redirect
from django.views.generic import View
from .models import ChessGame
from .forms import SearchForm
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ChessGameSerializer
from rest_framework import status

class ChessGamesView(APIView):
    def post(self, request):
        white = request.data.get('white', '')
        black = request.data.get('black', '')
        ignore_color = request.data.get('ignore', '')
        games = _process_search(white, black, ignore_color)

        serializer = ChessGameSerializer(games, many=True)
        return Response({"games": serializer.data})


class ChessGameView(APIView):
    def post(self, request):
        url = request.data.get('url')

        try:
            game = ChessGame.objects.get(url=url)
            return Response({"game": ChessGameSerializer(game).data})
        except:
            return Response({"game": "Not found."}, status.HTTP_404_NOT_FOUND)


class HomeView(View):
    def get(self, request):
        form = SearchForm()
        return render(request, 'chess/index.html', {'games': [], 'form': form})

    def post(self, request):
        form = SearchForm(data=request.POST)

        if form.is_valid():
            cd = form.cleaned_data
            white = cd.get('white')
            black = cd.get('black')
            ignore_color = cd.get('ignore_color')
            games = _process_search(white, black, ignore_color)

            return render(request, 'chess/index.html', {'games': games, 'form': form})
        return redirect(reverse('home'))


def _process_search(white, black, ignore_color):
    games = []
    if (black and not white and len(black) < 3) \
            or (white and not black and len(white) < 3) \
            or (white and black and len(black) + len(white) < 4) \
            or (not white and not black):
        return games

    if ignore_color:
        games = ChessGame.objects.filter(Q(white__icontains=white)
                                         & Q(black__icontains=black)
                                         | Q(white__icontains=black)
                                         & Q(black__icontains=white)) \
                    .order_by('-date', 'white', 'black')[:1000]
    elif white and black:
        games = ChessGame.objects.filter(white__icontains=white, black__icontains=black) \
                    .order_by('-date', 'white', 'black')[:1000]
    elif white and not black:
        games = ChessGame.objects.filter(white__icontains=white).order_by('-date', 'white', 'black')[:1000]
    elif not white and black:
        games = ChessGame.objects.filter(black__icontains=black).order_by('-date', 'white', 'black')[:1000]
    return games
