# Generated by Django 2.2.6 on 2019-10-31 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChemicalTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('created', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Chemical',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('smiles', models.TextField()),
                ('chem_name', models.TextField()),
                ('pubchem_compound_cid', models.TextField()),
                ('created', models.DateField(auto_now_add=True)),
                ('tags', models.ManyToManyField(to='cspace.ChemicalTag')),
            ],
        ),
    ]
