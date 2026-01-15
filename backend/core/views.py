from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import AdaptiveTask, DisciplineProfile, Achievement
from .serializers import TaskSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer

def check_achievements(profile):
    print(f"Checking achievements for {profile.user.username}: health={profile.avatar_health}, score={profile.discipline_score}, streak={profile.current_streak}")
    achievements = [
        {'name': '7-Day Streak Master', 'description': 'Maintained a 7-day streak', 'condition': profile.current_streak >= 7},
        {'name': 'Task Completion Hero', 'description': 'Achieved 80% discipline score', 'condition': profile.discipline_score >= 80},
        {'name': 'Health Guardian', 'description': 'Maintained 100% avatar health', 'condition': profile.avatar_health >= 100},
    ]
    for ach in achievements:
        if ach['condition'] and not Achievement.objects.filter(profile=profile, name=ach['name']).exists():
            print(f"Creating achievement: {ach['name']}")
            Achievement.objects.create(profile=profile, name=ach['name'], description=ach['description'])

class TaskViewSet(viewsets.ModelViewSet):
    queryset = AdaptiveTask.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

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
            check_achievements(profile)

        return super().update(request, *args, **kwargs)

@api_view(['POST'])
@authentication_classes([])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        if User.objects.filter(email__iexact=email).exists():
            return Response({'email': ['A user with this email already exists.']}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.filter(email__iexact=serializer.validated_data['email']).first()
        if user and user.check_password(serializer.validated_data['password']):
            token, created = Token.objects.get_or_create(user=user)
            print('Login token for', user.email, ':', token.key)
            return Response({'token': token.key, 'user': {'id': user.id, 'username': user.username, 'email': user.email}})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    print("Profile request headers:", request.headers)
    print("User:", request.user)
    print("Is authenticated:", request.user.is_authenticated)
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=status.HTTP_403_FORBIDDEN)
    try:
        profile = DisciplineProfile.objects.get(user=request.user)
        check_achievements(profile)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except DisciplineProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    try:
        profile = DisciplineProfile.objects.get(user=request.user)
        tasks = profile.tasks.all().order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    except DisciplineProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)