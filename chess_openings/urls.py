from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('openings', views.OpeningViewSet)
router.register('tags', views.TagViewSet)

urlpatterns = [
    path('openings/create/', views.CreateOpeningView.as_view(), name='opening-view'),
    path('openings/chapters/<url>', views.ChapterDetailView.as_view(), name='chapter-view'),
]
urlpatterns += router.urls
