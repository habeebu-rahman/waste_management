from django.urls import path
from .views import RegisterView,MeView,UserListView,SendOTPView,VerifyOTPView

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('me/',MeView.as_view()),
    path('users/collectors/', UserListView.as_view(), name='collector-list'),
    
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
]