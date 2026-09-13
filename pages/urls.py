from django.urls import path

from .views import TablesHomeView

urlpatterns = [
    path('', TablesHomeView.as_view(), name='tables_home'),
]