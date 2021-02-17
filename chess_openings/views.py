from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Opening, OpeningChapter, Tag
from .utils import pgn_to_json
from .serializers import OpeningSerializer, ChapterSerializer, OpeningDetailSerializer, TagSerializer
from .permissions import IsAdminOrReadOnly
from django.utils.text import slugify


class CreateOpeningView(APIView):
    permission_classes = (IsAdminOrReadOnly,)
    def post(self, request):
        data = request.data

        jsoned_games = pgn_to_json(data['pgn'], False, True)

        opening = Opening(title=data['title'],
                          description=data['description'],
                          color=data['color'],
                          slug=slugify(data['title']))
        opening.save()

        for i, game in enumerate(jsoned_games, start=1):
            title = f"{game['headers'].get('White')}. " \
                    f"{(game['headers'].get('Black')) if game['headers'].get('Black') else ''}"
            description = f"{game['headers'].get('Event')}"
            OpeningChapter(title=title, description=description, chapter_number=i, opening=opening, data=game).save()

        for tag in data.get('tags', []):
            try:
                tag = Tag.objects.get(name=tag)
                opening.tags.add(tag)

            except:
                pass

        opening.save()

        return Response({"message": 'ok'})


class OpeningViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = OpeningSerializer
    queryset = Opening.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = OpeningDetailSerializer(instance)
        return Response(serializer.data)


class ChapterDetailView(generics.RetrieveAPIView):
    # todo retrieve by generated unpredictable ID
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = ChapterSerializer
    queryset = OpeningChapter.objects.all()


class TagViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
