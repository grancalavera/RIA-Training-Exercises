#!/usr/bin/env python
from django.http import HttpResponse
from django.template import Context
from django.shortcuts import render
import os
import json

def get_doc_dict(infile):
    f = open(infile, 'r').read()
    return json.loads(f)

def home(request):
    html = render(request, 'home.html', Context({}))
    return HttpResponse(html)

def docs(request):

    path = '../docs'
    path = os.path.join(os.path.dirname(__file__), path).replace('\\', '/')
    listing = os.listdir(path)
    modules = []

    for infile in listing:
        modules.append(get_doc_dict(os.path.join(path, infile)))

    html = render(request, 'docs.html', Context({'modules': modules}))
    return HttpResponse(html);
