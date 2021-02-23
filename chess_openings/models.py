from django.db import models


class Opening(models.Model):
    class Color(models.TextChoices):
        WHITE = 'w', 'White'
        BLACK = 'b', 'Black'
        BOTH = 'wb', 'Both'

    class Meta:
        ordering = '-created',

    title = models.CharField(max_length=128)
    description = models.CharField(max_length=255, blank=True, default='')
    color = models.CharField(max_length=32, choices=Color.choices, default=Color.BOTH)
    created = models.DateTimeField(auto_now_add=True)
    image = models.TextField()
    slug = models.SlugField(max_length=96, unique=True)


class OpeningChapter(models.Model):
    title = models.CharField(max_length=128)
    chapter_number = models.IntegerField()
    description = models.CharField(max_length=255, blank=True, default='')
    opening = models.ForeignKey(Opening, on_delete=models.CASCADE, related_name='chapters')
    data = models.JSONField()

    class Meta:
        ordering = ('chapter_number',)


class Tag(models.Model):
    name = models.CharField(max_length=64)
    openings = models.ManyToManyField(Opening, related_name='tags')
