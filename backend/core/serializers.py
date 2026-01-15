from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DisciplineProfile, AdaptiveTask, Achievement

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdaptiveTask
        fields = '__all__' # This gives FlutterFlow access to all fields

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    achievements = AchievementSerializer(many=True, read_only=True)

    class Meta:
        model = DisciplineProfile
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            password=validated_data['password']
        )
        DisciplineProfile.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()