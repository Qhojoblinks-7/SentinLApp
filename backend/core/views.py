from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import AdaptiveTask, DisciplineProfile
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = AdaptiveTask.objects.all()
    serializer_class = TaskSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        profile = instance.profile
        
        # Check if we are completing the task
        was_already_completed = instance.is_completed or instance.is_micro_completed
        is_completing = request.data.get('is_completed', False)
        is_micro_completing = request.data.get('is_micro_completed', False)

        if not was_already_completed:
            if is_completing:
                # Full Task = More XP
                profile.discipline_score = min(100, profile.discipline_score + (instance.difficulty_weight * 2))
                profile.avatar_health = min(100, profile.avatar_health + 5)
            elif is_micro_completing:
                # Micro Task = Streak Saved, but less growth
                profile.discipline_score = min(100, profile.discipline_score + 1)
            
            profile.save()

        return super().update(request, *args, **kwargs)