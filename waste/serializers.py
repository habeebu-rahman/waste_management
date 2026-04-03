from rest_framework import serializers
from .models import WASTE_CATEGORY,COLLECTION_SCHEDULE,WASTE_REQUEST,WASTE_COMPLAINT

class WasteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WASTE_CATEGORY
        fields = '__all__'
        
class CollectionScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = COLLECTION_SCHEDULE
        fields = '__all__'
        
class WasteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WASTE_REQUEST
        fields = '__all__'
        read_only_fields = ['user']
        
class WasteComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = WASTE_COMPLAINT
        fields = '__all__'
        read_only_fields = ['user']
