from rest_framework import serializers
from .models import Opening, OpeningChapter


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


class OpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opening
        fields = '__all__'
