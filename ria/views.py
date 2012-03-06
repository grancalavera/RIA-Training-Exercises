#!/usr/bin/env python
from django.http import HttpResponse
from django.template import Context
from django.shortcuts import render
import os

def home(request):
    html = render(request, 'home.html', Context({}))
    return HttpResponse(html)

