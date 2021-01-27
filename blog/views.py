from rest_framework import viewsets,pagination
from rest_framework.response import Response
import re

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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.views += 1
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            d = serializer.data

            for el in d:
                el['body'] = re.sub(r'<[^>]+>', ' ', el['body'])[:350]

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
