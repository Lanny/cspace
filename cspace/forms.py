from django import forms

class UploadSDFForm(forms.Form):
    tag = forms.CharField(max_length=64)
    sdf_file = forms.FileField(label='SDF File')
