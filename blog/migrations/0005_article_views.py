# Generated by Django 3.1.4 on 2021-01-26 02:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20210112_2021'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='views',
            field=models.IntegerField(default=0),
        ),
    ]