# Generated by Django 2.2.6 on 2020-02-12 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspace', '0004_auto_20191208_1956'),
    ]

    operations = [
        migrations.AddField(
            model_name='chemicalset',
            name='description',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='chemicalsetfacet',
            name='embedding',
            field=models.TextField(choices=[('3/RDK/MDS', '3/RDKit/Multidimensional Scaling'), ('3/RDK/NM-MDS', '3/RDKit/Non-Metric Multidimensional Scaling'), ('3/RDK/SMACOF', '3/RDKit/SMACOF MDS'), ('3/RDK/NM-SMACOF', '3/RDKit/Non-Metric SMACOF MDS'), ('3/TSNE', '3/TSNE'), ('3/ISOMAP', '3/ISOMAP')]),
        ),
        migrations.AlterField(
            model_name='computefacetjob',
            name='embedding',
            field=models.TextField(choices=[('3/RDK/MDS', '3/RDKit/Multidimensional Scaling'), ('3/RDK/NM-MDS', '3/RDKit/Non-Metric Multidimensional Scaling'), ('3/RDK/SMACOF', '3/RDKit/SMACOF MDS'), ('3/RDK/NM-SMACOF', '3/RDKit/Non-Metric SMACOF MDS'), ('3/TSNE', '3/TSNE'), ('3/ISOMAP', '3/ISOMAP')]),
        ),
    ]