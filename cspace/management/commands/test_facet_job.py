import json

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cspace.jobs.compute_facet import ComputeFacet
from cspace.models import *

class Command(BaseCommand):
    help = 'Test the compute_facet job'

    @transaction.atomic
    def handle(self, *args, **options):
        ChemicalSet.objects.filter(name='test_set').delete()
        chem_set = ChemicalSet.objects.create(name='test_set')
        chems = ChemicalTag.objects.get(name='cns_depressants').chemical_set.all()
        chem_set.chemical_set.add(*chems)

        job = ComputeFacetJob.objects.create(
            chemical_set=chem_set,
            sim_measure='RDK/T',
            embedding='3/RDK/MDS'
        )

        cf = ComputeFacet()
        cf.compute(job, reraise=True)
