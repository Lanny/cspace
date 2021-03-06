# Generated by Django 2.2.6 on 2019-12-08 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspace', '0003_chemical_tpsa'),
    ]

    operations = [
        migrations.AddField(
            model_name='chemicalset',
            name='tags',
            field=models.ManyToManyField(to='cspace.ChemicalTag'),
        ),
        migrations.AlterField(
            model_name='chemicalsetfacet',
            name='embedding',
            field=models.TextField(choices=[('3/RDK/MDS', '3/RDKit/Multidimensional Scaling'), ('3/RDK/NM-MDS', '3/RDKit/Non-Metric Multidimensional Scaling'), ('3/RDK/SMACOF', '3/RDKit/SMACOF Multidimensional Scaling'), ('3/RDK/NM-SMACOF', '3/RDKit/Non-Metric SMACOF Multidimensional Scaling'), ('3/TSNE', '3/TNSE')]),
        ),
        migrations.AlterField(
            model_name='chemicalsetfacet',
            name='sim_measure',
            field=models.TextField(choices=[('RDK/T', 'RDKit/Tanimoto'), ('GOBI/T', 'Gobi-Poppinger/Tanimoto')]),
        ),
        migrations.AlterField(
            model_name='computefacetjob',
            name='embedding',
            field=models.TextField(choices=[('3/RDK/MDS', '3/RDKit/Multidimensional Scaling'), ('3/RDK/NM-MDS', '3/RDKit/Non-Metric Multidimensional Scaling'), ('3/RDK/SMACOF', '3/RDKit/SMACOF Multidimensional Scaling'), ('3/RDK/NM-SMACOF', '3/RDKit/Non-Metric SMACOF Multidimensional Scaling'), ('3/TSNE', '3/TNSE')]),
        ),
        migrations.AlterField(
            model_name='computefacetjob',
            name='sim_measure',
            field=models.TextField(choices=[('RDK/T', 'RDKit/Tanimoto'), ('GOBI/T', 'Gobi-Poppinger/Tanimoto')]),
        ),
    ]
