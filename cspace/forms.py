from django import forms

from cspace.models import *

class UploadSDFForm(forms.Form):
    tag = forms.CharField(max_length=64)
    sdf_file = forms.FileField(label='SDF File')

class CreateChemicalSetForm(forms.Form):
    name = forms.CharField(max_length=256)
    tags = forms.ModelMultipleChoiceField(
        queryset=ChemicalTag.objects.all(),
        required=True,
        widget=forms.CheckboxSelectMultiple
    )
    
class CreateFacetJobForm(forms.Form):
    chemical_set = forms.ModelChoiceField(
        queryset=ChemicalSet.objects.all(),
        widget=forms.HiddenInput
    )
    sim_measure = forms.ChoiceField(choices=SIM_MEASURES)
    embedding = forms.ChoiceField(choices=EMBEDDINGS)
