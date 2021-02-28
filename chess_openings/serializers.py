from rest_framework import serializers
from .models import Opening, OpeningChapter, Tag


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningChapter
        exclude = 'id', 'opening'


class ChapterWithoutDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningChapter
        exclude = 'data', 'id', 'opening'


class OpeningDetailSerializer(serializers.ModelSerializer):
    chapters = ChapterWithoutDataSerializer(many=True, read_only=True)

    class Meta:
        model = Opening
        exclude = 'id', 'created'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        exclude = 'openings',


class OpeningSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Opening
        exclude = 'id', 'created'



