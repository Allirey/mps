from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('openings', views.OpeningViewSet)
router.register('openings/tags', views.TagViewSet)

urlpatterns = [
    path('openings/create/', views.CreateOpeningView.as_view(), name='opening-view'),
    path('openings/chapters/<int:pk>', views.ChapterDetailView.as_view(), name='chapter-view'),
]
urlpatterns += router.urls
