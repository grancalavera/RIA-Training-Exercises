#!/usr/bin/env python
from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context # Allow serving files from /static/
from django.shortcuts import render

def home(request):
	# t = get_template('home.html')
	# html = t.render(request, Context({}))
	html = render(request, 'home.html', Context({}))
	return HttpResponse(html)
