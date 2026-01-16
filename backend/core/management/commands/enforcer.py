import requests
from django.core.management.base import BaseCommand
from core.models import DisciplineProfile, AdaptiveTask

class Command(BaseCommand):
    help = 'Midnight Enforcer: Resets streaks and damages avatar health for missed tasks'

    def send_push_notification(self, token, title, body):
        if not token:
            return
        url = 'https://exp.host/--/api/v2/push/send'
        data = {
            'to': token,
            'title': title,
            'body': body,
        }
        try:
            response = requests.post(url, json=data)
            self.stdout.write(f"Push sent to {token}: {response.status_code}")
        except Exception as e:
            self.stdout.write(f"Failed to send push: {e}")

    def handle(self, *args, **options):
        profiles = DisciplineProfile.objects.filter(is_in_sickness_mode=False)
        
        for profile in profiles:
            if AdaptiveTask.objects.filter(profile=profile, is_completed=False, is_micro_completed=False).exists():
                old_health = profile.avatar_health
                profile.current_streak = 0
                profile.avatar_health = max(0, profile.avatar_health - 20)
                profile.save()
                self.stdout.write(f"Penalized {profile.user.username}: health {old_health} -> {profile.avatar_health}")
                if profile.push_token:
                    self.send_push_notification(
                        profile.push_token,
                        'Avatar Damaged!',
                        f'Your avatar health dropped to {profile.avatar_health}% due to missed tasks.'
                    )