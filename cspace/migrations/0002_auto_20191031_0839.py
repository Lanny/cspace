# Generated by Django 2.2.6 on 2019-10-31 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspace', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chemical',
            name='props_json',
            field=models.TextField(default='{}'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='chemical',
            name='smiles',
            field=models.TextField(unique=True),
        ),
    ]
