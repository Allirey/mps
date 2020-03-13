from django.shortcuts import render, reverse, redirect
from django.views.generic import View
from .models import ChessGame
from .forms import SearchForm
from django.db.models import Q


class HomeView(View):
    def get(self, request):
        form = SearchForm()
        return render(request, 'chess/index.html', {'games': [], 'form': form})

    def post(self, request):
        form = SearchForm(data=request.POST)

        if form.is_valid():
            cd = form.cleaned_data
            print(cd)
            white = cd.get('white')
            black = cd.get('black')

            if black and not white and len(black) < 3 \
                    or white and not black and len(white) < 3 \
                    or white and black and len(black) + len(white) < 4:
                return render(request, 'chess/index.html', {'games': [], 'form': SearchForm()})

            ignore_color = cd.get('ignore_color')
            if ignore_color:
                games = ChessGame.objects.filter(Q(white__icontains=white)
                                                 & Q(black__icontains=black)
                                                 | Q(white__icontains=black)
                                                 & Q(black__icontains=white)).order_by('-date')[:1000]
            elif white and black:
                games = ChessGame.objects.filter(white__icontains=white, black__icontains=black).order_by('-date')[:1000]
            elif white and not black:
                games = ChessGame.objects.filter(white__icontains=white).order_by('-date')[:1000]
            elif not white and black:
                games = ChessGame.objects.filter(black__icontains=black).order_by('-date')[:1000]
            else:
                return redirect(reverse('home'))
            return render(request, 'chess/index.html', {'games': games, 'form': form})
        return redirect(reverse('home'))
