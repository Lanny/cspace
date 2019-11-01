import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from cspace.models import *

def get_fascet_data(request, fid):
    fascet = get_object_or_404(ChemicalSetFascet, id=fid)

    points = []

    echems = (EmbeddedChemical.objects
        .filter(fascet=fascet)
        .select_related('chemical'))

    for echem in echems:
        points.append({
            'name': echem.chemical.chem_name,
            'chem_id': echem.chemical.pk,
            'pos': json.loads(echem.position)
        })

    return JsonResponse({
        'fascet': {
            'id': fascet.pk,
            'name': fascet.name,
            'simMeasure': fascet.sim_measure,
            'embedding': fascet.embedding,
        },
        'points': points,
    })

def fascet_page(request, fid):
    fascet = get_object_or_404(ChemicalSetFascet, id=fid)

    return render(request, 'cspace/space-viewer.html', {
        'fascet_id': fascet.pk
    })
