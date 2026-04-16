from django.shortcuts import render
from rest_framework import viewsets
from .models import WASTE_CATEGORY,COLLECTION_SCHEDULE,WASTE_REQUEST,WASTE_COMPLAINT,Payment
from .serializers import WasteCategorySerializer,WasteRequestSerializer,WasteComplaintSerializer,ScheduleSerializer
from django.core.mail import send_mail
from twilio.rest import Client
from rest_framework.permissions import IsAuthenticated

import razorpay
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

# Create your views here.


class WasteCategoryViewSet(viewsets.ModelViewSet):
    queryset = WASTE_CATEGORY.objects.all()
    serializer_class = WasteCategorySerializer
    
class WasteRequestViewSet(viewsets.ModelViewSet):
    # We use select_related to optimize the database query for category/user names
    queryset = WASTE_REQUEST.objects.select_related('user', 'category').all()
    serializer_class = WasteRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Admins see EVERYTHING
        if user.role == 'admin' or user.is_staff:
            return reversed(WASTE_REQUEST.objects.all())

        # 2. Collectors see only what is assigned to them
        if user.role == 'collector':
            return reversed(WASTE_REQUEST.objects.filter(collector=user))

        # 3. Regular Users see only the requests THEY created
        return reversed(WASTE_REQUEST.objects.filter(user=user))

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
            return reversed(WASTE_COMPLAINT.objects.all())

        # 2. Collectors see only what is assigned to them
        if user.role == 'collector':
            return reversed(WASTE_COMPLAINT.objects.filter(collector=user))

        # 3. Regular Users see only the requests THEY created
        return reversed(WASTE_COMPLAINT.objects.filter(user=user))
    
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
        

    
class CollectionScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # 1. Admins and Collectors see all upcoming schedules
        if user.role in 'admin' or user.is_staff:
            return reversed(COLLECTION_SCHEDULE.objects.all().order_by('date'))
        
        if user.role == 'collector':
            return reversed(COLLECTION_SCHEDULE.objects.filter(collector=user))
        
        # 2. Citizens only see schedules matching their specific location
        return COLLECTION_SCHEDULE.objects.filter(
            district=user.district,
            panchayath=user.panchayath,
            ward=user.ward
        ).order_by('date')

    def perform_create(self, serializer):
        # 3. Validation: Only admins can actually post/create a new schedule
        if self.request.user.role == 'admin' or self.request.user.is_staff:
            serializer.save()
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can schedule waste collections.")
        
client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))
@api_view(['POST'])
def create_order(request):
    # Amount in paise (e.g., 500.00 INR = 50000 paise)
    amount = int(request.data.get('amount') * 100) 
    
    order_data = {
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1" # Automatically capture the payment
    }
    
    razorpay_order = client.order.create(data=order_data)
    
    # Save a pending payment in your DB
    Payment.objects.create(
        user=request.user,
        order_id=razorpay_order['id'],
        amount=request.data.get('amount'),
        request_item_id=request.data.get('request_id')
    )
    
    return Response(razorpay_order)

@api_view(['POST'])
def verify_payment(request):
    data = request.data # Contains razorpay_order_id, razorpay_payment_id, razorpay_signature
    
    try:
        # This checks if the payment was actually successful and not faked
        client.utility.verify_payment_signature(data)
        
        # Update your DB
        payment = Payment.objects.get(order_id=data['razorpay_order_id'])
        payment.payment_id = data['razorpay_payment_id']
        payment.status = 'Success'
        payment.save()
        
        return Response({"message": "Payment successful"})
    except:
        return Response({"message": "Signature verification failed"}, status=400)