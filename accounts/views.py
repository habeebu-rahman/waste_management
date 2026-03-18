from django.shortcuts import render
from rest_framework import generics
from .models import USER
from .serializers import RegisterSerializer

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset=USER.objects.all()
    serializer_class = RegisterSerializer