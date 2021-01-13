from rest_framework import viewsets,permissions,pagination

from .serializers import ArticleSerializer
from .models import Article


class ArticlePagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 200
    last_page_strings = ('the_end',)


class ArticleViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
