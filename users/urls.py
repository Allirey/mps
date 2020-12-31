from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from . import views

app_name = 'users'
urlpatterns = [
    path('users/create/', views.UserCreateView.as_view(), name='sign-up'),
    path('users/activate/<uidb64>/<token>/', views.ActivateView.as_view(), name='activate'),
    # path('users/forgot-password/<uidb64>/<token>/', '', name='forgot-password'),  #not exist yet
    # path('users/change-password/', '', name='change-password'),  #not exist yet

    path('token/obtain/', views.TokenObtainPairView.as_view(), name='token-create'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('token/refresh/remove/', views.TokenRemoveView.as_view(), name='token-remove'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token-verify'),
]
