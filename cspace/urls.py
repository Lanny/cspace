from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from cspace import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',
         TemplateView.as_view(template_name='cspace/index.html'),
         name='index'),
    path('tag-index', views.tag_index, name='tag-index'),
    path('facet-index', views.facet_index, name='facet-index'),
    path('facet/data/<int:fid>', views.get_facet_data, name='facet-data'),
    path('facet/<int:fid>', views.facet_page, name='facet-page'),
    path('upload/sdf', views.UploadSDF.as_view(), name='upload-sdf'),
]


