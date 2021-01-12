from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone


class Article(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'published', 'Published'
        DRAFT = 'draft', 'Draft'

    class Meta:
        ordering = ('-publish',)

    title = models.CharField(max_length=64)
    slug = models.SlugField(max_length=96, unique=True)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    publish = models.DateTimeField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.PUBLISHED)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title).lower()
        super().save(*args, **kwargs)
