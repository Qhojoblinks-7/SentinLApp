
---

# SentinL: Detailed Feature Functional Specifications

## 1. Identity-Based Onboarding

**Goal:** To move the user from "Guest" to "Committed Participant" using a tiered logic system.

* **Standard Template (Requirement A):** Upon first login, the app presents a "Software Engineer Peak Performance" routine (e.g., Deep Work, Exercise, Reading).
* **The Blank Canvas (Requirement B):** Users can delete any template task and add a custom one, but they must assign a `Micro_Version` description to it before saving.
* **Incremental Unlocking (Requirement C):**
* **Level 1:** Only 1 task is visible/active.
* **Level 2:** (Unlocked after a 3-day streak) 3 tasks become active.
* **Level 3:** Full routine access.
* *Logic:* If a user fails a streak, the system "locks" the most recent task until they prove consistency again.



---

## 2. The Adaptive Task Engine

**Goal:** To eliminate the "All-or-Nothing" failure trap.

* **Standard Mode:** The default view. Completing a task at this level grants **100% XP** and **+1 Discipline Point**.
* **Micro Mode (The Pivot):** * If the user toggles "Lazy Mode," the task title changes to the `micro_version`.
* Completing a Micro task grants **10% XP** and **0 Discipline Points**, but it **saves the streak**.


* **Validation:** A task cannot be marked "Complete" twice in one day.

---

## 3. The Accountability Trinity

**Goal:** To provide objective feedback and real consequences.

### 3.1 The Analyst (Data Mirror)

* **Function:** Every Sunday at 8 PM, the app generates a "Truth Report."
* **Logic:** It compares "Time intended" vs. "Time logged." If the user logged 5 hours of "Micro" tasks, the Analyst flags: *"Warning: You are maintaining a streak, but you are not growing."*

### 3.2 The Guardian (Avatar System)

* **Health Logic:** The Avatar starts at 100 HP.
* **Damage:** Every missed task (not scaled to Micro) results in **-20 HP**.
* **Death State:** If HP reaches 0, the Avatar "dies." The user must perform a "Resurrection Task" (30 minutes of meditation or exercise) to unlock the app again.

### 3.3 The Enforcer (The Contract)

* **The Reset:** If a task is not marked Complete or Micro-Complete by 11:59 PM, the `current_streak` integer in Django is set to `0`.
* **Lock-out:** On a 0-day streak, the "Fun" features of the app (customization/social) are greyed out.

---

## 4. Low-Friction Input (Interaction)

**Goal:** To make logging a task easier than making an excuse.

### 4.1 Voice-to-Action

* **Trigger:** User holds the "Comm" button in FlutterFlow.
* **Processing:** Audio is sent to Django  AI identifies keywords ("Finished," "Done," "Micro").
* **Response:** If "Done" is detected, the checkbox is automatically ticked, and a "Success" sound plays.

### 4.2 AI Chat Interaction

* **The Check-in:** If no activity is detected by 10 AM, the AI sends a message: *"SentinL here. We haven't started. Are we winning today or just watching?"*
* **Natural Language Logging:** User can type: *"I did the reading while on the bus."* The AI parses this and marks the reading task as complete.

---

## 5. Life-Proofing (The Pivot)

**Goal:** To handle the unpredictable nature of reality.

* **Sickness Mode:** * **Trigger:** User selects "Emergency" in settings.
* **Action:** Django sets `is_frozen = True`.
* **Effect:** The "Midnight Enforcer" script skips this user. The Avatar appears in a "Sleeping" animation.


* **The Comeback Protocol:** * After an absence of 3+ days, the app asks: *"Ready to re-enter?"* * It offers a **"Half-Speed Day"** where all tasks are automatically set to Micro to ease the user back into discipline.

---
