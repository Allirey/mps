# Generated by Django 3.0.4 on 2020-03-13 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChessGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('white', models.CharField(max_length=32)),
                ('black', models.CharField(max_length=32)),
                ('result', models.CharField(max_length=16)),
                ('movescount', models.CharField(max_length=8)),
                ('whiteelo', models.CharField(max_length=8)),
                ('blackelo', models.CharField(max_length=8)),
                ('event', models.CharField(max_length=64)),
                ('date', models.CharField(max_length=16)),
                ('moves', models.TextField()),
                ('fen', models.CharField(max_length=128)),
            ],
        ),
    ]