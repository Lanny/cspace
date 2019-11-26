from django.contrib import admin

from .models import *

@admin.register(Chemical)
class ChemicalAdmin(admin.ModelAdmin):
    list_display = ('chem_name', 'created')

@admin.register(ChemicalSet)
class ChemicalSetAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'members')

    def members(self, obj):
        return obj.chemical_set.count()

@admin.register(ChemicalTag)
class ChemicalTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'members')

    def members(self, obj):
        return obj.chemical_set.count()

@admin.register(ComputeFacetJob)
class ComputeFacetJobAdmin(admin.ModelAdmin):
    list_display = ('chemical_set', 'sim_measure', 'embedding', 'status')
