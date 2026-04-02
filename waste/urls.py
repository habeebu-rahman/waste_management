from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import WasteCategoryViewSet,CollectionScheduleViewSet,WasteRequestViewSet,WasteComplaintViewSet

router = DefaultRouter()
router.register('categories',WasteCategoryViewSet)
router.register('schedules',CollectionScheduleViewSet)
router.register('requests',WasteRequestViewSet)
router.register('complaint',WasteComplaintViewSet)

urlpatterns = [
    path('',include(router.urls)),
]