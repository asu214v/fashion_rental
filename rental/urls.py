from django.urls import path
from . import views

app_name = "rental"  # ← namespaceを登録

urlpatterns = [
    path("", views.index, name="index"),
]