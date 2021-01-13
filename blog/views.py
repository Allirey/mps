from rest_framework import viewsets,pagination

from .serializers import ArticleSerializer
from .models import Article
from .permissions import IsAdminOrReadOnly


class ArticlePagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 200
    last_page_strings = ('the_end',)


class ArticleViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
