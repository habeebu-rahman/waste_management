from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import WasteCategoryViewSet,CollectionScheduleViewSet,WasteRequestViewSet,WasteComplaintViewSet,create_order,verify_payment

router = DefaultRouter()
router.register('categories',WasteCategoryViewSet)
router.register('schedules',CollectionScheduleViewSet,basename='collectionschedule')
router.register('requests',WasteRequestViewSet)
router.register('complaint',WasteComplaintViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('create-order/', create_order, name='create-order'),
    path('verify-payment/', verify_payment, name='verify-payment'),
]