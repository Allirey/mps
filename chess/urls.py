from django.urls import path
from . import views

urlpatterns = [
    # path('', views.HomeView.as_view(), name='home'),
    path('games/', views.ChessGamesView.as_view(),  name='games'),
    path('game/', views.ChessGameView.as_view(),  name='game'),
    path('players/', views.ChessPlayersView.as_view(),  name='players'),
]
