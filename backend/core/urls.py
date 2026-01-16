from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, register, login, profile, history, register_push_token, toggle_sickness_mode, voice_chat

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('profile/', profile, name='profile'),
    path('history/', history, name='history'),
    path('register-push-token/', register_push_token, name='register_push_token'),
    path('toggle-sickness-mode/', toggle_sickness_mode, name='toggle_sickness_mode'),
    path('voice-chat/', voice_chat, name='voice_chat'),
]