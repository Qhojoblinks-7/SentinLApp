from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, register, login, profile, history

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('profile/', profile, name='profile'),
    path('history/', history, name='history'),
]