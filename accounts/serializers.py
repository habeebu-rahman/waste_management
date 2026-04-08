from rest_framework import serializers
from .models import USER


class RegisterSerializer(serializers.ModelSerializer):
    # Match these 'source' strings exactly to your Model field names
    district_name = serializers.CharField(source='district.name', read_only=True)
    panchayath_name = serializers.CharField(source='panchayath.name', read_only=True)
    ward_name = serializers.CharField(source='ward.number', read_only=True)
    
    # Ensure address is read_only so it doesn't interfere with your custom save() logic
    address = serializers.CharField(read_only=True)

    class Meta:
        model = USER
        fields = [
            'id', 'username', 'email', 'role', 'phone', 'address',
            'district', 'district_name', 
            'panchayath', 'panchayath_name', 
            'ward', 'ward_name', 
            'houseNo'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}, # Password not required for Profile Update
            'district': {'write_only': True},
            'panchayath': {'write_only': True},
            'ward': {'write_only': True},
        }

