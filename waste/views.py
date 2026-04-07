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
    # We use select_related to optimize the database query for category/user names
    queryset = WASTE_REQUEST.objects.select_related('user', 'category').all()
    serializer_class = WasteRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Admins see EVERYTHING
        if user.role == 'admin' or user.is_staff:
            return WASTE_REQUEST.objects.all()

        # 2. Collectors see only what is assigned to them
        if user.role == 'collector':
            return WASTE_REQUEST.objects.filter(collector=user)

        # 3. Regular Users see only the requests THEY created
        return WASTE_REQUEST.objects.filter(user=user)

    def perform_create(self, serializer):
        # Automatically link the request to the logged-in user
        serializer.save(user=self.request.user)
        
        # send_mail(
        #     'waste pickup request',
        #     f'request created for {instance.category}'
        #     'email@gmail.com',
        #     [instance.user.email],
        #     fail_silently=True,
        # )
        # def send_sms(message,phone):
        #     client = Client('ACCOUNT_SID','AUTH_TOKEN')
            
        #     client.messages.create(
        #         body=message,
        #         from_ = '+914553258528',
        #         to=phone,
        #     )
            
class WasteComplaintViewSet(viewsets.ModelViewSet):
    queryset = WASTE_COMPLAINT.objects.all()
    serializer_class = WasteComplaintSerializer
    
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user

        # 1. Admins see EVERYTHING
        if user.role == 'admin' or user.is_staff:
            return WASTE_COMPLAINT.objects.all()

        # 2. Collectors see only what is assigned to them
        if user.role == 'collector':
            return WASTE_COMPLAINT.objects.filter(collector=user)

        # 3. Regular Users see only the requests THEY created
        return WASTE_COMPLAINT.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        # send_mail(
        #     'waste pickup request',
        #     f'request created for {instance.category}'
        #     'email@gmail.com',
        #     [instance.user.email],
        #     fail_silently=True,
        # )
        # def send_sms(message,phone):
        #     client = Client('ACCOUNT_SID','AUTH_TOKEN')
            
        #     client.messages.create(
        #         body=message,
        #         from_ = '+914553258528',
        #         to=phone,
        #     )