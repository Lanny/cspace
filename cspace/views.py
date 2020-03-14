import json
import tempfile

from django.db import transaction
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from rdkit import Chem
from rdkit.Chem.rdmolfiles import SDMolSupplier
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.rdmolfiles import MolToMolBlock

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
            'jobs': chem_set.computefacetjob_set.filter(status__lt=2)
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
                'jobs': chem_set.computefacetjob_set.filter(status__lt=2)
            })

def get_facet_data(request, fid):
    facet = get_object_or_404(ChemicalSetFacet, id=fid)

    points = []
    all_tags = set(facet.chemical_set.tags.all())
    max_dist_from_origin = 0

    echems = (EmbeddedChemical.objects
        .filter(facet=facet)
        .select_related('chemical'))

    for echem in echems:
        tags = all_tags & set(echem.chemical.tags.all())
        chem = echem.chemical
        position = json.loads(echem.position)

        dist_from_origin = sum([c*c for c in position])
        max_dist_from_origin = max(dist_from_origin, max_dist_from_origin)

        points.append({
            'name': chem.chem_name,
            'chem_id': chem.pk,
            'mol_weight': chem.mol_weight,
            'tpsa': chem.tpsa,
            'smiles': chem.smiles,
            'pos': position,
            'tags': [tag.name for tag in tags],
            'pubchem_cid': chem.props.get('PUBCHEM_COMPOUND_CID', None),
            'formula': chem.props.get('PUBCHEM_MOLECULAR_FORMULA', None),
            'svg_url': reverse('draw-chem', args=(chem.pk,))
        })

    return JsonResponse({
        'facet': {
            'id': facet.pk,
            'name': facet.name,
            'simMeasure': facet.sim_measure,
            'embedding': facet.embedding,
            'maxDistFromOrigin': max_dist_from_origin ** 0.5,
            'tags': sorted([tag.name for tag in all_tags])
        },
        'points': points,
    })

def draw_chemical(request, chem_id):
    chem = get_object_or_404(Chemical, id=chem_id)
    mol = chem.get_mol()
    mc = Chem.Mol(mol.ToBinary())

    try:
        Chem.Kekulize(mc)
    except:
        mc = Chem.Mol(mol.ToBinary())

    if not mc.GetNumConformers():
        Chem.rdDepictor.Compute2DCoords(mc)

    drawer = rdMolDraw2D.MolDraw2DSVG(300,200)
    drawer.DrawMolecule(mc)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText().replace('svg:','')

    return JsonResponse({'data' : svg})

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
                name=form.cleaned_data['name'],
                description=form.cleaned_data['description']
            )
            chem_set.save()

            chems = Chemical.objects.filter(tags__in=tags)
            chem_set.chemical_set.set(chems)
            chem_set.tags.set(tags)

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

def edit_stored_chemical(request, chem_id):
    chem = get_object_or_404(Chemical, pk=chem_id)
    mol = chem.get_mol()

    return render(request, 'cspace/chemical-editor.html', {
        'molblock': MolToMolBlock(mol)
    })
