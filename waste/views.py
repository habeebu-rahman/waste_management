from django.shortcuts import render
from rest_framework import viewsets
from .models import WASTE_CATEGORY,COLLECTION_SCHEDULE,WASTE_REQUEST
from .serializers import WasteCategorySerializer,CollectionScheduleSerializer,WasteRequestSerializer

# Create your views here.


class WasteCategoryViewSet(viewsets.ModelViewSet):
    queryset = WASTE_CATEGORY.objects.all()
    serializer_class = WasteCategorySerializer
    
class CollectionScheduleViewSet(viewsets.ModelViewSet):
    queryset = COLLECTION_SCHEDULE.objects.all()
    serializer_class = CollectionScheduleSerializer
    
class WasteRequestViewSet(viewsets.ModelViewSet):
    queryset = WASTE_REQUEST.objects.all()
    serializer_class = WasteRequestSerializer