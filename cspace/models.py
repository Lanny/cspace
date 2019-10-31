from django.db import models

from rdkit.Chem.rdmolfiles import MolFromSmiles

class ChemicalTag(models.Model):
    name = models.TextField(unique=True)
    created = models.DateField(auto_now_add=True)

class Chemical(models.Model):
    smiles = models.TextField(unique=True)
    chem_name = models.TextField()
    pubchem_compound_cid = models.TextField()
    props_json = models.TextField()
    tags = models.ManyToManyField(ChemicalTag)
    created = models.DateField(auto_now_add=True)

    def get_mol(self):
        return MolFromSmiles(self.smiles)

