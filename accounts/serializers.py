from rest_framework import serializers
from .models import USER


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = USER
        fields = ['id','username','password','email','role']
        extra_kwargs = {'password':{'write_only':True}}
        
    def create(self, validated_data):
        user = USER.objects.create_user(**validated_data)
        return user