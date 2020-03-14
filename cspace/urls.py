from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from cspace import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path(
        '',
        TemplateView.as_view(template_name='cspace/index.html'),
        name='index'
    ),
    path('tag-index', views.tag_index, name='tag-index'),
    path('chem/<int:chem_id>/svg', views.draw_chemical, name='draw-chem'),
    path('chem/<int:chem_id>/editor',
         views.edit_stored_chemical,
         name='edit-chem'),
    path('chem-set/index', views.chemical_set_index, name='chemical-set-index'),
    path('chem-set/create', views.CreateChemicalSet.as_view(), name='create-chemical-set'),
    path('chem-set/<int:sid>', views.ChemicalSetDetail.as_view(), name='chemical-set'),
    path('facet/index', views.facet_index, name='facet-index'),
    path('facet/<int:fid>/data', views.get_facet_data, name='facet-data'),
    path('facet/<int:fid>', views.facet_page, name='facet-page'),
    path('facet/<int:fid>/search', views.sim_search, name='facet-search'),
    path('upload/sdf', views.UploadSDF.as_view(), name='upload-sdf'),
]
