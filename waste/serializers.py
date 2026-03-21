from rest_framework import serializers
from .models import WASTE_CATEGORY,COLLECTION_SCHEDULE,WASTE_REQUEST

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
