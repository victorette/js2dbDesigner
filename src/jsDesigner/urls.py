from django.conf.urls import patterns, url

from jsDesigner.protoDiagram import getEntitiesJSONDiagram, synchDBFromDiagram, getElementsDiagramFromSelectedTables, synchDiagramFromDB, getDefaultDiagram
from jsDesigner.protoDiagramEntity import saveDiagram, listDiagrams, createDiagram, deleteDiagram, openDiagram

urlpatterns = patterns('',
    url('getEntitiesJSONDiagram/$', getEntitiesJSONDiagram),
    url('synchDBFromDiagram/$', synchDBFromDiagram),
    url('synchDiagramFromDB/$', synchDiagramFromDB),
    url('getElementsDiagramFromSelectedTables/$', getElementsDiagramFromSelectedTables),
    url('getDefaultDiagram/$',getDefaultDiagram),
    url('saveDiagram/$',saveDiagram),
    url('listDiagrams/$', listDiagrams),
    url('createDiagram/$', createDiagram),
    url('deleteDiagram/$', deleteDiagram),
    url('openDiagram/$',openDiagram),
)