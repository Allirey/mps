from rest_framework import serializers
from .models import Opening, OpeningChapter, Tag


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningChapter
        fields = '__all__'


class ChapterWithoutDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningChapter
        exclude = 'data',


class OpeningDetailSerializer(serializers.ModelSerializer):
    chapters = ChapterWithoutDataSerializer(many=True, read_only=True)

    class Meta:
        model = Opening
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        exclude = 'openings',


class OpeningSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Opening
        fields = '__all__'



