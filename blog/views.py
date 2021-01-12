from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from .serializers import ArticleSerializer
from .models import Article


class MyPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 200
    last_page_strings = ('the_end',)


class ArticleViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = MyPagination
