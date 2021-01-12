from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('blog', views.ArticleViewSet)

urlpatterns = []
urlpatterns += router.urls
