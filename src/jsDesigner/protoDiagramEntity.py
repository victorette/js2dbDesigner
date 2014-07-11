# -*- coding: utf-8 -*-

from django.http import HttpResponse
from jsDesigner.models import Diagram
from jsDesigner.service.diagramJSONAssembler import JSONEncoder
from jsDesigner.service.diagramJSONAssembler  import JSONError

import json, ast

def listDiagrams(request):
    projectID = request.GET['projectID']
    
    resultset = Diagram.objects.all()
        
    diagrams = [ob.as_json() for ob in resultset]
    
    jsondict = {
        'success':True,
        'message': 'Diagrams list',
        'diagrams': diagrams,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")


def createDiagram(request):
    attributes = ast.literal_eval(request.POST['diagrams'])
    code = attributes['code']
    try:
        diagram = Diagram.objects.create(code=code)
    except Exception as e:
        return JSONError(e)
    
    jsondict = {
        'success':True,
        'message': 'Diagram created',
        'diagramID': diagram.id,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")


def saveDiagram(request):
    diagramID = request.GET['diagramID']
    
    jsonFile = json.loads(request.body)
    jsonString = JSONEncoder().encode(jsonFile)
    jsonString = '{"objects":'+jsonString+'}'
    
    try:
        diagram = Diagram.objects.get(id=diagramID)
        diagram.info = jsonString
        diagram.save()
        
    except Exception as e:
        return JSONError(e)
    
    jsondict = {
        'success':True,
        'message': 'Diagram saved',
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def deleteDiagram(request):
    attributes = ast.literal_eval(request.POST['diagrams'])
    try:
        diagram = Diagram.objects.get(id=attributes['id'])
        diagram.delete()
    except Exception as e:
        return JSONError(e)
    
    jsondict = {
        'success':True,
        'message': 'Diagram deleted',
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def openDiagram(request):
    diagramID = request.GET['diagramID']
    try:
        diagram = Diagram.objects.get(id=diagramID)
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