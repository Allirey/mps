# Generated by Django 3.0.7 on 2020-12-07 17:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChessGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('white', models.CharField(db_index=True, max_length=32)),
                ('black', models.CharField(db_index=True, max_length=32)),
                ('result', models.FloatField()),
                ('whiteelo', models.IntegerField()),
                ('blackelo', models.IntegerField()),
                ('pgn', models.TextField()),
                ('date', models.DateField()),
                ('url', models.CharField(db_index=True, max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='ChessMove',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fen', models.CharField(max_length=128)),
                ('move', models.CharField(max_length=8)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chess_db.ChessGame')),
            ],
        ),
    ]
