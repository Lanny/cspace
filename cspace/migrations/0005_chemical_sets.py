# Generated by Django 2.2.6 on 2019-11-01 06:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspace', '0004_auto_20191101_0609'),
    ]

    operations = [
        migrations.AddField(
            model_name='chemical',
            name='sets',
            field=models.ManyToManyField(to='cspace.ChemicalSet'),
        ),
    ]
