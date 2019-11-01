import json

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cspace.models import *

class Command(BaseCommand):
    help = 'Drop a tag and any compounds that no longer have a tag after'

    def add_arguments(self, parser):
        parser.add_argument('tag_name', type=str)

    @classmethod
    def get_mol_props_dict(cls, mol):
        return dict(((n, mol.GetProp(n)) for n in mol.GetPropNames()))

    @transaction.atomic
    def handle(self, *args, **options):
        ChemicalTag.objects.get(name=options['tag_name']).delete()
        _, result = Chemical.objects.filter(tags=None).delete()

        self.stdout.write(self.style.SUCCESS(
                '%d chemicals deleted.' % result['cspace.Chemical']
            )
        )




