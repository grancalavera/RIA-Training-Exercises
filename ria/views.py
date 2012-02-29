#!/usr/bin/env python
from django.http import HttpResponse
from django.template import Context
from django.shortcuts import render

def home(request):
	html = render(request, 'require.html', Context({}))
	return HttpResponse(html)
