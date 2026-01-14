from django.core.management.base import BaseCommand
from core.models import DisciplineProfile, AdaptiveTask

class Command(BaseCommand):
    help = 'Midnight Enforcer: Resets streaks and damages avatar health for missed tasks'

    def handle(self, *args, **options):
        profiles = DisciplineProfile.objects.filter(is_in_sickness_mode=False)
        
        for profile in profiles:
            incomplete_tasks = profile.tasks.filter(is_completed=False, is_micro_completed=False)
            
            if incomplete_tasks.exists():
                profile.current_streak = 0
                profile.avatar_health = max(0, profile.avatar_health - 20)
                profile.save()
                self.stdout.write(f"Penalized {profile.user.username}")