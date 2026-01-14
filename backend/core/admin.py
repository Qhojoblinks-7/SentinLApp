from django.contrib import admin
from .models import DisciplineProfile, AdaptiveTask

@admin.register(DisciplineProfile)
class ProfileAdmin(admin.ModelAdmin):
    # This shows your stats in a nice table view
    list_display = ('user', 'discipline_score', 'current_streak', 'avatar_health')
    # This lets you change scores directly from the list without clicking into the user
    list_editable = ('discipline_score', 'avatar_health') 

@admin.register(AdaptiveTask)
class TaskAdmin(admin.ModelAdmin):
    # This makes your task list easy to read at a glance
    list_display = ('title', 'profile', 'is_completed', 'is_micro_completed')
    # This adds a filter sidebar on the right to sort by completion or user
    list_filter = ('is_completed', 'profile')
    # Adds a search bar for task titles
    search_fields = ('title',)