import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from cspace.models import *

def facet_index(request):
    facets = ChemicalSetFacet.objects.all()

    return render(request, 'cspace/facet-index.html', {
        'facets': facets
    })

def get_facet_data(request, fid):
    facet = get_object_or_404(ChemicalSetFacet, id=fid)

    points = []

    echems = (EmbeddedChemical.objects
        .filter(facet=facet)
        .select_related('chemical'))

    for echem in echems:
        points.append({
            'name': echem.chemical.chem_name,
            'chem_id': echem.chemical.pk,
            'pos': json.loads(echem.position)
        })

    return JsonResponse({
        'facet': {
            'id': facet.pk,
            'name': facet.name,
            'simMeasure': facet.sim_measure,
            'embedding': facet.embedding,
        },
        'points': points,
    })

def facet_page(request, fid):
    facet = get_object_or_404(ChemicalSetFacet, id=fid)

    return render(request, 'cspace/space-viewer.html', {
        'facet_id': facet.pk
    })
