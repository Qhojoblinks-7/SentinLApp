# Database Architecture: SentinL

This document outlines the database schema for the SentinL application using Django models.

## Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ DISCIPLINE_PROFILE : "has one"
    DISCIPLINE_PROFILE ||--o{ ADAPTIVE_TASK : "manages"
    DISCIPLINE_PROFILE ||--o{ DISCIPLINE_LOG : "logs"

    USER {
        string username "Unique username"
        string email "User email"
        datetime date_joined "Registration date"
        boolean is_active "Account status"
    }

    DISCIPLINE_PROFILE {
        integer user_id "Foreign key to User"
        integer current_streak "Current streak count"
        integer avatar_health "Avatar health points (0-100)"
        decimal discipline_score "Overall discipline score"
        boolean is_in_sickness_mode "Sickness mode flag"
        datetime last_activity "Last user activity"
    }

    ADAPTIVE_TASK {
        integer profile_id "Foreign key to DisciplineProfile"
        string title "Task title"
        text description "Task description"
        string micro_version "Micro-task description"
        boolean is_completed "Completion status"
        datetime date "Task date"
        integer xp_value "XP points awarded"
        boolean is_micro "Whether task is in micro mode"
    }

    DISCIPLINE_LOG {
        integer profile_id "Foreign key to DisciplineProfile"
        datetime timestamp "Log timestamp"
        string event_type "Type of event (e.g., failure, completion)"
        text details "Additional details"
        integer xp_change "XP change amount"
    }
```

## Model Relationships

- **User**: Extends Django's default User model or uses it directly.
- **DisciplineProfile**: One-to-one with User, stores user's discipline state.
- **AdaptiveTask**: Many-to-one with DisciplineProfile, represents daily tasks.
- **DisciplineLog**: Many-to-one with DisciplineProfile, logs discipline events.

## Key Constraints

- DisciplineProfile must exist for each User.
- Tasks are date-specific and cannot be completed twice per day.
- Logs are append-only for audit purposes.
- Avatar health cannot go below 0 or above 100.</content>
</xai:function_call name="attempt_completion">
<parameter name="result">I have created a new file `DATABASE_ARCHITECTURE.md` with the database schema diagram. The ER diagram shows the relationships between the User, DisciplineProfile, AdaptiveTask, and DisciplineLog models, along with their key fields and constraints.