# -*- coding: utf-8 -*-

from django.http import HttpResponse
from jsDesigner.models import Diagram

from jsDesigner.service.diagramJSONAssembler import JSONAssembler, JSONEncoder, JSONError

import json

def getEntitiesJSONDiagram(request):
    """ return all tables from project
    """
    selectedTables = []
    
    try:
        tableEnterprise = {
            'id':'63c0f27a-716e-804c-6873-cd99b945b63f', 
            'tableName':'Enterprise'}
        tableUsage = {
            'id':'3253ff2a-a920-09d5-f033-ca759a778e19', 
            'tableName':'UsageLogiciel'}
        tableLogiciel = {
            'id':'2810494b-931f-da59-fd9d-6deba4385fe0', 
            'tableName':'Logiciel'}
        
        selectedTables.append(tableEnterprise)
        selectedTables.append(tableUsage)
        selectedTables.append(tableLogiciel)
                
    except Exception as e:
        print(e)
        return JSONError("Entity non trouvé")  
    
    jsondict = {
        'success':True,
        'message': '',
        'tables': selectedTables,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def getElementsDiagramFromSelectedTables(request):
    """ Creates diagram objects from selected tables in LiveSearchGrid
    """
    selectedTables = []
    connectors = []
    jsondict = {}
    
    objects = json.loads(request.body)
        
    try:
        assembler = JSONAssembler()
        selectedTables, connectors = assembler.getJSONElements(objects)
                
        jsondict = {
            'success':True,
            'message': '',
            'tables': selectedTables,
            'connectors': connectors,
        }
    except Exception as e:
        print(e)
        jsondict = {
            'success':False,
            'message': 'Error on creating JSON file',
        }
        context = json.dumps(jsondict)
        return HttpResponse(context, content_type="application/json", status=500)
    
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

    
def synchDiagramFromDB(request):
    """ Updates diagram objects from database
    """
    assembler = JSONAssembler()
    selectedTables, connectors = assembler.getJSONElements(objects='')
    
    jsondict = {
        'success':True,
        'message': '',
        'tables': selectedTables,
        'connectors': connectors,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")
    

def synchDBFromDiagram(request):
    """ Create and synchronize elements in database
    """
    try:
        projectID = request.GET['projectID']
    except Exception as e:
        return JSONError(e)
    
    objects = json.loads(request.body)
    selectedTables = []
    connectors = []
    
    assembler = JSONAssembler()
    selectedTables, connectors = assembler.getJSONElements(objects)
    jsondict = {
        'success':True,
        'message': '',
        'tables': selectedTables,
        'connectors': connectors,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")


def getDefaultDiagram(request):
    projectID = request.GET['projectID']
    user = request.user
    try:
        diagrams = Diagram.objects.filter(id=1)
        if not diagrams:
            diagram,created = Diagram.objects.get_or_create(code='default')
            diagram.smOwningUser = user
            diagram.smCreatedBy = user
            diagram.save()
        else:
            diagram = diagrams[0]
    except Exception as e:
        return JSONError(e)
    
    jsonDiagram = diagram.info
    if isinstance(jsonDiagram, dict):
            jsonDiagram = json.dumps(jsonDiagram , cls=JSONEncoder)
            
    jsondict = {
        'success':True,
        'message': '',
        'diagramID': diagram.id,
        'diagramCode': diagram.code,
        'diagram': jsonDiagram,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

