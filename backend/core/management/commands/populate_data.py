from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import DisciplineProfile, AdaptiveTask, Achievement

class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **options):
        # Create or get user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(f"Created user: {user.username}")

        # Create profile
        profile, created = DisciplineProfile.objects.get_or_create(
            user=user,
            defaults={
                'discipline_score': 85,
                'avatar_health': 90,
                'current_streak': 7,
                'is_in_sickness_mode': False,
            }
        )
        if created:
            self.stdout.write(f"Created profile for {user.username}")

        # Create tasks
        tasks_data = [
            {
                'title': 'Morning Workout',
                'micro_version': 'v1.0',
                'difficulty_weight': 3,
                'is_completed': True,
                'is_micro_completed': True,
            },
            {
                'title': 'Read Technical Book',
                'micro_version': 'v1.1',
                'difficulty_weight': 4,
                'is_completed': False,
                'is_micro_completed': True,
            },
            {
                'title': 'Meditate',
                'micro_version': 'v1.2',
                'difficulty_weight': 2,
                'is_completed': True,
                'is_micro_completed': True,
            },
            {
                'title': 'Code Review',
                'micro_version': 'v1.3',
                'difficulty_weight': 4,
                'is_completed': False,
                'is_micro_completed': False,
            },
            {
                'title': 'Healthy Meal Prep',
                'micro_version': 'v1.4',
                'difficulty_weight': 3,
                'is_completed': True,
                'is_micro_completed': True,
            },
        ]

        for task_data in tasks_data:
            task, created = AdaptiveTask.objects.get_or_create(
                profile=profile,
                title=task_data['title'],
                defaults=task_data
            )
            if created:
                self.stdout.write(f"Created task: {task.title}")

        # Create achievements
        achievements_data = [
            {
                'name': 'First Steps',
                'description': 'Complete your first task',
            },
            {
                'name': 'Streak Master',
                'description': 'Maintain a 7-day streak',
            },
            {
                'name': 'Discipline Warrior',
                'description': 'Achieve 85% discipline score',
            },
            {
                'name': 'Task Conqueror',
                'description': 'Complete 25 tasks',
            },
        ]

        for ach_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                profile=profile,
                name=ach_data['name'],
                defaults=ach_data
            )
            if created:
                self.stdout.write(f"Created achievement: {achievement.name}")

        self.stdout.write(self.style.SUCCESS('Sample data populated successfully!'))
        self.stdout.write(f"Login with: {user.username} / password123")