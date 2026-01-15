To build **SentinL**, we need to break the project into actionable "Sprints." This list is organized by dependency—ensuring you don't build a roof before the walls are up.

---

## 🛠 Phase 1: The "Brain" (Django Backend)

**Goal:** Establish the rules, data models, and API connectivity.

* [x] **Environment Setup:** Initialize Git, VirtualEnv, and install Django/DRF/CORS.
* [x] **Core Models:** Build `DisciplineProfile` and `AdaptiveTask` in `models.py`.
* [x] **The Scoring Engine:** Write the Python logic for `calculate_score` (handling XP, HP, and Streaks).
* [ ] **Admin Setup:** Register models in `admin.py` to allow manual data entry for testing.
* [x] **API Layer:** Create `serializers.py` and `views.py` (ViewSets) for Task and Profile.
* [x] **Routing:** Configure `urls.py` for both the app and the project.
* [x] **Security:** Implement Token Authentication (so only you can update your discipline stats).

---

## 📱 Phase 2: The "Body" (React Native Frontend)

**Goal:** Create the visual interface and connect it to the Brain.

* [x] **API Setup:** Configure the `GET` (Fetch Tasks) and `PATCH` (Update Task) API calls.
* [x] **Dashboard UI:** Create the **Discipline Progress Bar** (linked to Profile).
* [x] Create the **Avatar Widget** (changes image based on HP).


* [x] **Task List:** Build a `ListView` that pulls data from Django.
* [x] **Lazy Mode Toggle:** Add a local state variable that switches the displayed text from `title` to `micro_version`.
* [x] **Action Logic:** Set up the Checkbox to trigger the `UpdateTask` API call on tap.

---

## 🎙 Phase 3: The "Senses" (Voice & AI Integration)

**Goal:** Reduce friction and add conversational intelligence.

* [ ] **Audio Capture:** Implement the "Hold to Speak" button in FlutterFlow.
* [ ] **Voice Pipeline:** * [ ] Create a Django view that accepts an audio file.
* [ ] Integrate OpenAI Whisper to transcribe the audio.


* [ ] **Intent Parser:** Use an LLM to turn text like "I'm done with my run" into a database update.
* [ ] **AI Coach Chat:** Build the chat interface in FlutterFlow to allow "Habit Negotiation" with the AI.

---

## ⚖ Phase 4: The "Enforcer" (Automation)

**Goal:** Ensure consequences happen even when the app is closed.

* [ ] **Midnight Script:** Write a Django Management Command to check for missed tasks.
* [ ] **Streak Logic:** Implement the code that resets `streak` to 0 if tasks are incomplete.
* [ ] **Sickness Mode Logic:** Create a toggle that allows the Midnight Script to "skip" a user.
* [ ] **Push Notifications:** Set up Cloud Messaging to alert the user when their Avatar takes damage.

---

## 🧪 Phase 5: Testing & Deployment

* [ ] **Stress Test:** Try to "cheat" the system to see if the scoring logic holds up.
* [x] **Deployment:** Move Django to a live server (running locally).
* [ ] **Onboarding Test:** Run through the "Incremental Unlocking" flow to ensure Level 2 and 3 unlock correctly.

---

## 📚 Phase 6: Documentation
* [ ] **Code Comments:** Ensure all functions and classes have clear docstrings.
* [ ] **User Guide:** Create a simple guide on how to use SentinL effectively.
* [ ] **API Documentation:** Use tools like Swagger or Postman to document your API endpoints.
---
## 🎯 Phase 7: Future Enhancements (Post-MVP)
* [ ] **Social Features:** Add friend lists and accountability partners.
* [x] **Gamification:** Introduce badges and achievements for milestones.
* [ ] **Advanced AI Coaching:** Implement personalized habit suggestions based on user data trends.
