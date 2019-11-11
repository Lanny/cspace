from django.db import models

from rdkit.Chem.rdmolfiles import MolFromSmiles

SIM_MEASURES = (
    ('RDK/T', 'RDKit/Tanimoto'),
)

EMBEDDINGS = (
    ('3/RDK/MDS', '3/RDKit/Multidimensional Scaling'),
    ('3/RDK/NM-MDS', '3/RDKit/Non-Metric Multidimensional Scaling'),
    ('3/RDK/SMACOF', '3/RDKit/SMACOF Multidimensional Scaling'),
    ('3/RDK/NM-SMACOF', '3/RDKit/Non-Metric SMACOF Multidimensional Scaling'),
)

class ChemicalTag(models.Model):
    name = models.TextField(unique=True)
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.__unicode__()

    def __unicode__(self):
        return 'tag: %s (%d compounds)' % (self.name, self.chemical_set.count())

class ChemicalSet(models.Model):
    name = models.TextField(unique=True)
    created = models.DateField(auto_now_add=True)

class Chemical(models.Model):
    smiles = models.TextField(unique=True)
    chem_name = models.TextField()
    pubchem_compound_cid = models.TextField()
    props_json = models.TextField()
    tags = models.ManyToManyField(ChemicalTag)
    sets = models.ManyToManyField(ChemicalSet)
    created = models.DateField(auto_now_add=True)

    def get_mol(self):
        return MolFromSmiles(self.smiles)

class ChemicalSetFacet(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['embedding', 'sim_measure', 'chemical_set'],
                name='facet_identity'
            )
        ]

    name = models.TextField(unique=True)
    sim_measure = models.TextField(choices=SIM_MEASURES)
    embedding = models.TextField(choices=EMBEDDINGS)
    created = models.DateField(auto_now_add=True)
    chemical_set = models.ForeignKey(ChemicalSet, on_delete=models.CASCADE)
    dist_json = models.TextField()
    chem_ids_json = models.TextField()

class EmbeddedChemical(models.Model):
    chemical = models.ForeignKey(Chemical, on_delete=models.CASCADE)
    facet = models.ForeignKey(ChemicalSetFacet, on_delete=models.CASCADE)
    position = models.TextField()

class ComputeFacetJob(models.Model):
    chemical_set = models.ForeignKey(ChemicalSet, on_delete=models.CASCADE)
    sim_measure = models.TextField(choices=SIM_MEASURES)
    embedding = models.TextField(choices=EMBEDDINGS)
    facet = models.ForeignKey(
        ChemicalSetFacet,
        on_delete=models.CASCADE,
        null=True
    )
    status = models.IntegerField(choices=(
        (-1, 'Failed'),
        (0, 'Pending'),
        (1, 'Running'),
        (2, 'Done'),
    ), default=0)
