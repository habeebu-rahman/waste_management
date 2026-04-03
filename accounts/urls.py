from django.urls import path
from .views import RegisterView,MeView,UserListView

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('me/',MeView.as_view()),
    path('users/collectors/', UserListView.as_view(), name='collector-list'),
]