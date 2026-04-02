from django.shortcuts import render
from rest_framework import viewsets
from .models import WASTE_CATEGORY,COLLECTION_SCHEDULE,WASTE_REQUEST,WASTE_COMPLAINT
from .serializers import WasteCategorySerializer,CollectionScheduleSerializer,WasteRequestSerializer,WasteComplaintSerializer
from django.core.mail import send_mail
from twilio.rest import Client
from rest_framework.permissions import IsAuthenticated

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
    
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'collector':
            return WASTE_REQUEST.objects.filter(collector=user)
        return WASTE_REQUEST.objects.all()
    
    def perform_create(self, serializer):
        instance = serializer.save()
        
        send_mail(
            'waste pickup request',
            f'request created for {instance.category}'
            'email@gmail.com',
            [instance.user.email],
            fail_silently=True,
        )
        def send_sms(message,phone):
            client = Client('ACCOUNT_SID','AUTH_TOKEN')
            
            client.messages.create(
                body=message,
                from_ = '+914553258528',
                to=phone,
            )
            
class WasteComplaintViewSet(viewsets.ModelViewSet):
    queryset = WASTE_COMPLAINT.objects.all()
    serializer_class = WasteComplaintSerializer
    
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'collector':
            return WASTE_COMPLAINT.objects.filter(collector=user)
        return WASTE_COMPLAINT.objects.all()
    
    def perform_create(self, serializer):
        instance = serializer.save()
        
        send_mail(
            'waste pickup request',
            f'request created for {instance.category}'
            'email@gmail.com',
            [instance.user.email],
            fail_silently=True,
        )
        def send_sms(message,phone):
            client = Client('ACCOUNT_SID','AUTH_TOKEN')
            
            client.messages.create(
                body=message,
                from_ = '+914553258528',
                to=phone,
            )