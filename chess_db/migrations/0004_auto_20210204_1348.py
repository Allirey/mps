# Generated by Django 3.1.4 on 2021-02-04 13:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chess_db', '0003_auto_20201208_2008'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chessmove',
            old_name='move',
            new_name='san',
        ),
    ]
