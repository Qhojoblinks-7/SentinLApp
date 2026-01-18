from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.http import Http404
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import AdaptiveTask, DisciplineProfile, Achievement, Milestone
from .serializers import TaskSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer, MilestoneSerializer

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

    def get_queryset(self):
        return self.request.user.disciplineprofile.tasks.all()

    def create(self, request, *args, **kwargs):
        # Set the profile to the current user's profile
        request.data['profile'] = request.user.disciplineprofile.id

        # Extract milestones from request data
        milestones_data = request.data.pop('milestones', [])

        # Create the task first
        response = super().create(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            task = AdaptiveTask.objects.get(id=response.data['id'])
            # Create milestones for the task
            for milestone_data in milestones_data:
                Milestone.objects.create(
                    task=task,
                    title=milestone_data['title'],
                    completed=milestone_data.get('completed', False)
                )

        return response

    def list(self, request, *args, **kwargs):
        profile = request.user.disciplineprofile
        queryset = self.get_queryset()
        filtered = [task for task in queryset if task.required_level <= profile.level]
        serializer = self.get_serializer(filtered, many=True)
        return Response(serializer.data)

    def get_object(self):
        obj = super().get_object()
        profile = self.request.user.disciplineprofile
        if obj.required_level > profile.level:
            raise Http404
        return obj

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
                profile.discipline_score = min(100, profile.discipline_score + (instance.difficulty_weight * 10))
                profile.avatar_health = min(100, profile.avatar_health + 5)
            elif is_micro_completing:
                # Micro Task = Streak Saved, but less growth
                profile.discipline_score = min(100, profile.discipline_score + 5)
            
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
        # Create DisciplineProfile for the new user
        DisciplineProfile.objects.create(user=user)
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_push_token(request):
    try:
        profile = DisciplineProfile.objects.get(user=request.user)
        token = request.data.get('push_token')
        if token:
            profile.push_token = token
            profile.save()
            return Response({'message': 'Push token registered'})
        return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
    except DisciplineProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_sickness_mode(request):
    try:
        profile = DisciplineProfile.objects.get(user=request.user)
        profile.is_in_sickness_mode = not profile.is_in_sickness_mode
        profile.save()
        return Response({'is_in_sickness_mode': profile.is_in_sickness_mode})
    except DisciplineProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def voice_chat(request):
    from django.conf import settings
    import openai

    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Transcribe audio
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"
        )

        text = transcript.strip()
        if not text:
            return Response({'error': 'Transcription failed'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate AI response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI coach for a discipline app called SentinL. Help users with motivation, task completion, and habit building. Be encouraging and practical."},
                {"role": "user", "content": text}
            ],
            max_tokens=150
        )

        ai_response = response.choices[0].message.content.strip()

        return Response({'transcript': text, 'response': ai_response})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def text_chat(request):
    from django.conf import settings
    import openai

    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'No message provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Generate AI response
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI coach for a discipline app called SentinL. Help users with motivation, task completion, and habit building. Be encouraging and practical. Keep responses concise and actionable."},
                {"role": "user", "content": message}
            ],
            max_tokens=150
        )

        ai_response = response.choices[0].message.content.strip()

        return Response({'response': ai_response})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)