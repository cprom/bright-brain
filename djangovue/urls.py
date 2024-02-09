from django.urls import include, re_path
from catalog import views



urlpatterns = [
    re_path(r'^api/public/', views.public),
    re_path(r'^api/private/', views.private)
]