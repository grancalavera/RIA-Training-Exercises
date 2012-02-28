#!/usr/bin/env python
from django.http import HttpResponse

def home(request):
	return HttpResponse('RIA Training Exercises')
