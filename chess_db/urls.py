from django.urls import path
from . import views

urlpatterns = [
    path('explorer/', views.ChessOpeningExplorerView.as_view(),  name='explorer'),
    path('game/', views.SingleChessGameView.as_view(), name='game'),
    path('autocomplete', views.SearchNameAutocompleteView.as_view(), name='autocomplete'),
]
