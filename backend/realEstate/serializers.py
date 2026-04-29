from django.shortcuts import get_object_or_404
from rest_framework import serializers
from .models import Property,PropertyImage, UserProfile, VisitRequests,Review
from django.contrib.auth import get_user_model 

User = get_user_model()

class PropertyImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyImage
        fields = ["id","image","is_primary"]

class PropertySerializer(serializers.ModelSerializer):
    likes_cout = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = "__all__"

    def get_likes_cout(self,obj):
        return obj.likes.count()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "role","email"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','email','role','password','password2']
        
    
    def validate(self,data):
        if(data['password']!=data['password2']):
            raise serializers.ValidationError("Passwords do not match.")
        return data
        
    def create(self,validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
        
class ProfileSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = UserProfile
        fields = "__all__"
    

class VisitReqSerializer(serializers.ModelSerializer):

    class Meta:
        model = VisitRequests
        fields = "__all__"
    

    def validate(self,data):
        user = self.context['request'].user

        exists =  VisitRequests.objects.filter(
            user = user,
            property = data['property']
        ).exclude(status__in=['completed', 'rejected']).exists()
        if exists:
            raise serializers.ValidationError("You already have an active visit request for this property.")
        return data

class ReviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["reviewer", "created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, data):
        reviewer = self.context['request'].user
        agent = data['agent']

        if reviewer == agent:
            raise serializers.ValidationError("You cannot review yourself.")

        return data