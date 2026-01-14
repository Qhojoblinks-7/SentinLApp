# Entity-Relationship Diagram (ERD)

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
```</content>
</xai:function_call name="attempt_completion">
<parameter name="result">I have created a new file `ERD.md` containing the Entity-Relationship Diagram for the database schema.