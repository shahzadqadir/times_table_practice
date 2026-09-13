from django.shortcuts import render
from django.views.generic import TemplateView


class TablesHomeView(TemplateView):
    template_name = 'pages/tables_home.html'

