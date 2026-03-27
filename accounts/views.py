from django.shortcuts import render
from rest_framework import generics
from .models import USER
from .serializers import RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import responses
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset=USER.objects.all()
    serializer_class = RegisterSerializer
    
class MeView(APIView):
    permission_classes =[IsAuthenticated]
    
    def get(self,request):
        return Response({
            'username':request.user.username,
            'role':request.user.role,
        })