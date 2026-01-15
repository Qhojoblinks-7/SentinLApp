from django.db import models
from django.contrib.auth.models import User

class DisciplineProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    discipline_score = models.IntegerField(default=50)  # 0 to 100
    current_streak = models.IntegerField(default=0)
    avatar_health = models.IntegerField(default=100)
    is_in_sickness_mode = models.BooleanField(default=False)
    push_token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Identity"

class AdaptiveTask(models.Model):
    profile = models.ForeignKey(DisciplineProfile, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    micro_version = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    is_micro_completed = models.BooleanField(default=False)
    difficulty_weight = models.IntegerField(default=1) # 1-5 scale
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Achievement(models.Model):
    profile = models.ForeignKey(DisciplineProfile, on_delete=models.CASCADE, related_name="achievements")
    name = models.CharField(max_length=255)
    description = models.TextField()
    unlocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username}: {self.name}"