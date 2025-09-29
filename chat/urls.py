# chat/urls.py
from django.urls import path
from . import views

app_name = "chat"  # ← namespaceを登録

urlpatterns = [
    path("", views.index, name="index"),
]