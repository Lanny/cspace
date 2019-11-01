import json

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from rdkit.Chem.rdmolfiles import SDMolSupplier
from rdkit.Chem.rdmolfiles import MolToSmiles

from cspace.models import *

class Command(BaseCommand):
    help = 'load a .sdf (expected to have PUBCHEM properties) into the DB'

    def add_arguments(self, parser):
        parser.add_argument('tag_name', type=str)
        parser.add_argument('path', type=str)

    @classmethod
    def get_mol_props_dict(cls, mol):
        return dict(((n, mol.GetProp(n)) for n in mol.GetPropNames()))

    @transaction.atomic
    def handle(self, *args, **options):
        loaded = 0
        skipped = 0

        tag, created = ChemicalTag.objects.get_or_create(
            name=options['tag_name'])

        molecules = SDMolSupplier(options['path'])

        for mol in molecules:
            smiles = MolToSmiles(mol)
            if Chemical.objects.filter(smiles=smiles).count():
                self.stderr.write(self.style.WARNING(
                    (
                        'Chemical with SMILES of "%s" already exist in '
                        'database, doing nothing.'
                    ) % smiles)
                )
                skipped += 1
                continue

            chem = Chemical(
                smiles=smiles,
                chem_name=mol.GetProp('PUBCHEM_IUPAC_NAME'),
                pubchem_compound_cid=mol.GetProp('PUBCHEM_COMPOUND_CID'),
                props_json=json.dumps(self.get_mol_props_dict(mol))
            )
            chem.save()
            chem.tags.add(tag)
            loaded += 1

        self.stdout.write(self.style.SUCCESS(
                'Loaded %d chemicals and skipped %d' % (loaded, skipped)
            )
        )




