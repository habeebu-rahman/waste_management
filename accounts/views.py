import requests
from django.shortcuts import render
from rest_framework import generics
from .models import USER,OTPVerification
from .serializers import RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
import random
import os
from dotenv import load_dotenv

from django.core.mail import send_mail

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset=USER.objects.all()
    serializer_class = RegisterSerializer
    
class MeView(APIView):
    permission_classes =[IsAuthenticated]
    
    def get(self,request):
        return Response({
            'username':request.user.username,
            'role': request.user.role,
        })

class UserListView(generics.ListAPIView):
    serializer_class = RegisterSerializer # Or a simpler UserSerializer if you have one
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # We only want users where the role is 'collector'
        return USER.objects.filter(role='collector')

load_dotenv()
# def send_real_sms(phone_number, otp_code):
#     url = "https://www.fast2sms.com/dev/bulkV2"
#     payload = {
#         "variables_values": otp_code,
#         "route": "otp",
#         "numbers": phone_number,
#     }
#     headers = {
#         "authorization": os.getenv('SMS_API_KEY'), # Replace this with your key!
#         "Content-Type": "application/json"
#     }
#     try:
#         response = requests.post(url, json=payload, headers=headers)
#         return response.json()
#     except Exception as e:
#         return {"error": str(e)}

class SendOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        verify_type = request.data.get('type') # 'email' or 'phone'
        target = request.data.get('value')      # the email address or phone number
        
        if not target or not verify_type:
            return Response({"error": "Type and Value are required"}, status=400)

        # Create or Update OTP in DB
        otp_obj, created = OTPVerification.objects.get_or_create(identifier=target)
        code = str(random.randint(100000, 999999))
        otp_obj.otp_code = code
        otp_obj.save()
        
        # --- 2. Handle Email ---
        if verify_type == 'email':
            send_mail(
                'Your Verification Code',
                f'Your OTP code is {code}',
                'from@example.com', # Replace with your EMAIL_HOST_USER
                [target],
                fail_silently=False,
            )
        
        # --- 3. Handle Phone ---
        elif verify_type == 'phone':
            print("\n" + "="*30)
            print(f"DEBUG SMS: To {target}")
            print(f"CODE: {code}")
            print("="*30 + "\n")

        # 4. Success Response to React
        return Response({"message": f"OTP sent to {verify_type}"})
            # sms_status = send_real_sms(target, code)
            # print(f"SMS Gateway Response: {sms_status}")

        # --- 4. Final Response (One response for both types) ---
        # print(f"DEBUG: OTP for {target} is {code}") 
        # return Response({"message": f"OTP Sent to {verify_type}"})
        
    

class VerifyOTPView(APIView):
    permission_classes = []

    def post(self, request):
        target = request.data.get('value')
        otp = request.data.get('otp')
        try:
            OTPVerification.objects.get(identifier=target, otp_code=otp)
            return Response({"status": "verified"})
        except OTPVerification.DoesNotExist:
            return Response({"error": "Invalid"}, status=400)