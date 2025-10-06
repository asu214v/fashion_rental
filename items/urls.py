from django.urls import path
from . import views

app_name = "items"

urlpatterns = [
    path("", views.all_items, name="all_items"),
    path("<int:rental_id>/", views.item_detail, name="item_detail"),
    path('<int:rental_id>/reviews/', views.review_detail, name='review_detail'), 
]
