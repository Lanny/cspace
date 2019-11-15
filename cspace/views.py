import json
import tempfile

from django.db import transaction
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from rdkit.Chem.rdmolfiles import SDMolSupplier

from cspace.forms import UploadSDFForm, CreateChemicalSetForm, \
        CreateFacetJobForm
from cspace.utils import MethodSplitView, load_mol
from cspace.models import *

def tag_index(request):
    tags = ChemicalTag.objects.all()

    return render(request, 'cspace/tag-index.html', {
        'tags': tags
    })

def chemical_set_index(request):
    sets = ChemicalSet.objects.all()

    return render(request, 'cspace/chemical-set-index.html', {
        'sets': sets
    })

def facet_index(request):
    facets = ChemicalSetFacet.objects.all()

    return render(request, 'cspace/facet-index.html', {
        'facets': facets
    })

class ChemicalSetDetail(MethodSplitView):
    def GET(self, request, sid):
        chem_set = get_object_or_404(ChemicalSet, pk=sid)
        create_facet_form = CreateFacetJobForm(
            initial={'chemical_set': chem_set}
        )

        return render(request, 'cspace/chemical-set-details.html', {
            'chem_set': chem_set,
            'create_facet_form': create_facet_form,
        })

    def POST(self, request, sid):
        chem_set = get_object_or_404(ChemicalSet, pk=sid)
        create_facet_form = CreateFacetJobForm(request.POST)

        if create_facet_form.is_valid():
            job = ComputeFacetJob.objects.create(
                chemical_set=create_facet_form.cleaned_data['chemical_set'],
                sim_measure=create_facet_form.cleaned_data['sim_measure'],
                embedding=create_facet_form.cleaned_data['embedding'],
            )

            return HttpResponseRedirect(reverse('chemical-set', args=(sid,)))
        else:
            return render(request, 'cspace/chemical-set-details.html', {
                'chem_set': chem_set,
                'create_facet_form': create_facet_form,
            })

def get_facet_data(request, fid):
    facet = get_object_or_404(ChemicalSetFacet, id=fid)

    points = []
    all_tags = set([])

    echems = (EmbeddedChemical.objects
        .filter(facet=facet)
        .select_related('chemical'))

    for echem in echems:
        tags = [tag.name for tag in echem.chemical.tags.all()]
        all_tags.update(tags)
        points.append({
            'name': echem.chemical.chem_name,
            'chem_id': echem.chemical.pk,
            'pos': json.loads(echem.position),
            'tags': tags
        })

    return JsonResponse({
        'facet': {
            'id': facet.pk,
            'name': facet.name,
            'simMeasure': facet.sim_measure,
            'embedding': facet.embedding,
            'tags': list(all_tags)
        },
        'points': points,
    })

def facet_page(request, fid):
    facet = get_object_or_404(ChemicalSetFacet, id=fid)

    return render(request, 'cspace/space-viewer.html', {
        'facet_id': facet.pk
    })

class CreateChemicalSet(MethodSplitView):
    def GET(self, request):
        return render(request, 'cspace/create-chemical-set.html', {
            'form': CreateChemicalSetForm()
        })

    @transaction.atomic
    def POST(self, request):
        form = CreateChemicalSetForm(request.POST)

        if form.is_valid():
            tags = form.cleaned_data['tags']

            chem_set = ChemicalSet.objects.create(
                name=form.cleaned_data['name']
            )
            chem_set.save()

            chems = Chemical.objects.filter(tags__in=tags)
            chem_set.chemical_set.set(chems)

            return HttpResponseRedirect(reverse('chemical-set-index'))


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
