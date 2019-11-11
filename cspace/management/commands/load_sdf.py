from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from rdkit.Chem.rdmolfiles import SDMolSupplier

from cspace.utils import load_mol
from cspace.models import *

class Command(BaseCommand):
    help = 'load a .sdf (expected to have PUBCHEM properties) into the DB'

    def add_arguments(self, parser):
        parser.add_argument('tag_name', type=str)
        parser.add_argument('path', type=str)

    @transaction.atomic
    def handle(self, *args, **options):
        loaded = 0
        skipped = 0

        tag, created = ChemicalTag.objects.get_or_create(
            name=options['tag_name'])

        molecules = SDMolSupplier(options['path'])

        for mol in molecules:
            result = utils.load_mol(mol)

            if result == -1:
                self.stderr.write(self.style.WARNING(
                    (
                        'Chemical with SMILES of "%s" already exist in '
                        'database. Only adding tag.'
                    ) % smiles)
                )
                skipped += 1
                continue

            else:
                loaded += 1

        self.stdout.write(self.style.SUCCESS(
                'Loaded %d chemicals and skipped %d' % (loaded, skipped)
            )
        )




