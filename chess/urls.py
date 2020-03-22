from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('api/games/', views.ChessGamesView.as_view(),  name='games'),
    path('api/game/', views.ChessGameView.as_view(),  name='game'),
]
