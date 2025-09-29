from django.urls import path
from . import views

app_name = "users"  # ← namespaceを登録

urlpatterns = [
    path("", views.index, name="mypage"),
]