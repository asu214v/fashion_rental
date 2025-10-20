from django.urls import path
from . import views

app_name = "rental"

urlpatterns = [
    path("", views.index, name="index"),
    path("reg/", views.rental_reg, name="reg"),
    path("my_items/", views.my_items, name="my_items"),
]
