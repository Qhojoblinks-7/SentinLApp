from rest_framework import serializers
from .models import DisciplineProfile, AdaptiveTask

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdaptiveTask
        fields = '__all__' # This gives FlutterFlow access to all fields

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisciplineProfile
        fields = '__all__'