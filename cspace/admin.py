from django.contrib import admin

from .models import *

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

