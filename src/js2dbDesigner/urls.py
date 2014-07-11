from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from settings import PPATH

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='index.html')),

    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^protoDiagram/', include('jsDesigner.urls')),
    
    #    Used for load json configuration files
    url(r'static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'resources/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
)
