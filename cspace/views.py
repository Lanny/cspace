import json
import tempfile

from django.db import transaction
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from rdkit.Chem.rdmolfiles import SDMolSupplier

from cspace.forms import UploadSDFForm
from cspace.utils import MethodSplitView, load_mol
from cspace.models import *

def tag_index(request):
    tags = ChemicalTag.objects.all()

    return render(request, 'cspace/tag-index.html', {
        'tags': tags
    })

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

class UploadSDF(MethodSplitView):
    def GET(self, request):
        return render(request, 'cspace/upload-sdf.html', {
            'form': UploadSDFForm()
        })

    @transaction.atomic
    def POST(self, request):
        form = UploadSDFForm(request.POST, request.FILES)

        if form.is_valid():
            upload = request.FILES['sdf_file']
            tf = tempfile.NamedTemporaryFile()
            for chunk in upload.chunks():
                tf.write(chunk)

            tf.flush()
            tf.seek(0)
            molecules = SDMolSupplier(tf.name)

            tag, created = ChemicalTag.objects.get_or_create(
                name=form.cleaned_data['tag'])

            loaded = 0
            skipped = 0
            for mol in molecules:
                result = load_mol(mol, tag)

                if result == -1:
                    skipped += 1
                else:
                    loaded += 1

            return HttpResponseRedirect(reverse('tag-index'))

        else:
            return render(request, 'cspace/upload-sdf.html', {
                'form': form
            })
