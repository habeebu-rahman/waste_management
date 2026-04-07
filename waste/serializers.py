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
    
    user_name = serializers.ReadOnlyField(source='user.username')
    collector_name = serializers.ReadOnlyField(source='collector.username')
    
    # This will return the 'name' from the WasteCategory model instead of the ID
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = WASTE_REQUEST
        fields = ['id', 'user_name', 'category', 'category_name', 'address', 'preferred_date', 'status','collector','collector_name']
        # We make 'user' and 'address' read-only so the frontend 
        # doesn't have to (and can't) send them.
        read_only_fields = ['user', 'address']
        

    def create(self, validated_data):
        # 1. Get the logged-in user from the request context
        request = self.context.get('request')
        user = request.user

        # 2. Assign the user to the waste request
        validated_data['user'] = user

        # 3. Automatically grab the address from the User model
        # This uses the 'address' field we set up in your USER model earlier
        if user.address:
            validated_data['address'] = user.address
        else:
            validated_data['address'] = "No address provided in profile"

        return super().create(validated_data)
        
class WasteComplaintSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    user_phone = serializers.ReadOnlyField(source='user.phone')
    collector_name = serializers.ReadOnlyField(source='collector.username')
    
    # This will return the 'name' from the WasteCategory model instead of the ID
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = WASTE_COMPLAINT
        fields = ['id', 'user_name', 'category', 'category_name', 'place', 'status','latitude','longitude','user_phone','image','collector','collector_name']
        read_only_fields = ['user']
        
        
    def get_queryset(self):
        user = self.request.user
        qs = WASTE_COMPLAINT.objects.filter(collector=user)
        print(f"DEBUG: User {user.username} is requesting complaints. Found: {qs.count()}")
        return qs
        
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['user'] = user

        # CRITICAL FIX: 
        # If your model uses 'place' instead of 'address', 
        # ensure you aren't trying to save to a field that doesn't exist.
        if not validated_data.get('place'):
            if hasattr(user, 'address') and user.address:
                validated_data['place'] = user.address
            else:
                validated_data['place'] = "Unknown Location"

        return super().create(validated_data)
