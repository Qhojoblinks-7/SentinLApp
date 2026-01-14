
---

# Software Requirements Specification: SentinL

## 1. Functional Requirements (FR)

### 1.1 Onboarding & Goal Setting

* **FR 1.1:** The system shall provide a "Standard Disciplined Day" template for new users.
* **FR 1.2:** Users shall be able to manually create "Blank Canvas" tasks.
* **FR 1.3:** The system shall implement **Incremental Unlocking**, restricting users to one habit initially and unlocking more based on consistency.

### 1.2 Adaptive Task Management

* **FR 1.4:** Every task must support two states: **Standard** (Full) and **Micro** (Minimum Viable).
* **FR 1.5:** The system shall allow users to toggle "Lazy Mode," which switches active tasks to their Micro versions to maintain streak continuity.

### 1.3 Discipline Scoring & Accountability

* **FR 1.6:** The system shall maintain a **Discipline Score (0-100)** calculated based on task completion and timeliness.
* **FR 1.7:** The system shall implement a **Streak Counter**. Missing a non-frozen day resets the counter to zero.
* **FR 1.8:** The system shall support a **Sickness/Emergency Mode** that pauses all streaks and scoring penalties.

### 1.4 Interaction & UI

* **FR 1.9:** The system shall support **Voice-to-Action** commands to log task completion.
* **FR 1.10:** The system shall include an **AI Chat Interface** for daily check-ins and habit negotiation.
* **FR 1.11:** The UI shall display a **Digital Avatar** whose visual state (Health/Energy) reflects the user’s Discipline Score.

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Performance & Latency

* **NFR 2.1:** API response time for task updates shall be less than **200ms**.
* **NFR 2.2:** Voice-to-text processing should be near real-time (under 2 seconds) to minimize friction.

### 2.2 Scalability & Architecture

* **NFR 2.3:** The backend must use a **Decoupled Architecture (REST API)** to allow the frontend to evolve independently.
* **NFR 2.4:** The database must be normalized to handle relational data between Users, Profiles, and Adaptive Tasks.

### 2.3 Psychological Integrity (Safety)

* **NFR 2.5:** The "Hard Stop" or "Penalty" triggers must be clearly communicated to prevent user burnout or extreme discouragement.

---

## 3. Data Requirements

| Data Entity | Key Attributes |
| --- | --- |
| **User Profile** | Identity Score, Streak count, Level, Avatar Health. |
| **Adaptive Task** | Title, Micro-version text, Frequency, Last Completed Date. |
| **Discipline Log** | Timestamp, Action (Complete/Fail/Scale), Narrative Reason. |

---

## 4. System Constraints

* **Platform:** Must be accessible via Mobile (iOS/Android) through FlutterFlow.
* **Connectivity:** Requires an internet connection for AI processing and streak validation.
* **Hardware:** Must have microphone access for Voice-to-Action features.

---
## 5. Future Considerations
* **AI Personalization:** Future versions may include machine learning to adapt task difficulty based on user performance trends.
* **Social Features:** Potential integration of social accountability groups or challenges.
---