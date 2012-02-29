#!/usr/bin/env python
from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context # Allow serving files from /static/

def home(request):
	t = get_template('home.html')
	html = t.render(Context({}))
	return HttpResponse(html)
