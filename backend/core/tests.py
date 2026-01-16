from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import DisciplineProfile, AdaptiveTask

class ScoringLogicTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.profile = DisciplineProfile.objects.create(user=self.user, discipline_score=50)
        self.task = AdaptiveTask.objects.create(
            profile=self.profile,
            title='Test Task',
            micro_version='v1.0',
            difficulty_weight=1
        )
        self.client.force_authenticate(user=self.user)

    def test_stress_test_scoring_logic(self):
        # Try to complete the same task multiple times
        initial_score = self.profile.discipline_score
        for _ in range(5):
            response = self.client.patch('/api/tasks/%d/' % self.task.id, {'is_completed': True})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        # Score should only increase once
        self.assertEqual(self.profile.discipline_score, min(100, initial_score + 10))

    def test_invalid_data_does_not_affect_score(self):
        initial_score = self.profile.discipline_score
        # Send invalid data
        response = self.client.patch('/api/tasks/%d/' % self.task.id, {'discipline_score': 100})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        # Score should not change from invalid data
        self.assertEqual(self.profile.discipline_score, initial_score)

class OnboardingUnlockingTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser2', email='test2@example.com', password='password')
        self.profile = DisciplineProfile.objects.create(user=self.user, discipline_score=0)  # Start at level 1
        # Create tasks with different levels
        self.task1 = AdaptiveTask.objects.create(profile=self.profile, title='Task 1', micro_version='v1.0', difficulty_weight=1)  # level 1
        self.task2 = AdaptiveTask.objects.create(profile=self.profile, title='Task 2', micro_version='v1.1', difficulty_weight=1)  # level 2
        self.task3 = AdaptiveTask.objects.create(profile=self.profile, title='Task 3', micro_version='v1.2', difficulty_weight=1)  # level 3
        self.client.force_authenticate(user=self.user)

    def test_incremental_unlocking(self):
        # At level 1, only task1 should be visible
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tasks = response.data
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['id'], self.task1.id)

        # Complete task1 to reach level 2
        response = self.client.patch('/api/tasks/%d/' % self.task1.id, {'is_completed': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.level, 2)

        # Now task2 should be visible
        response = self.client.get('/api/tasks/')
        tasks = response.data
        self.assertEqual(len(tasks), 2)
        task_ids = [t['id'] for t in tasks]
        self.assertIn(self.task1.id, task_ids)
        self.assertIn(self.task2.id, task_ids)

        # Complete task2 to reach level 3
        response = self.client.patch('/api/tasks/%d/' % self.task2.id, {'is_completed': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.level, 3)

        # Now task3 should be visible
        response = self.client.get('/api/tasks/')
        tasks = response.data
        self.assertEqual(len(tasks), 3)
        task_ids = [t['id'] for t in tasks]
        self.assertIn(self.task1.id, task_ids)
        self.assertIn(self.task2.id, task_ids)
        self.assertIn(self.task3.id, task_ids)
