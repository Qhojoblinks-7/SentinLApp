For **SentinL**, the avatar isn't just a profile picture; it’s a **dynamic data visualization** of the user's current "Identity Integrity." In a discipline-focused app, the avatar should feel like a digital reflection of the user's willpower.

Here is a detailed breakdown of the avatar design, optimized for a **React Native** implementation using **Styled-Components** or **StyleSheet**.

---

### 1. The Core Concept: "The Synthetic Soul"

The avatar is a high-contrast, minimalist **silhouette or bust** of a humanoid figure. It should look like a "Digital Twin" encased in a glass-like shell.

* **The Inner Core:** Instead of facial features, the center of the head/chest contains a glowing "Core."
* **The Material:** Use a "Frosted Glass" (Glassmorphism) effect. This makes the avatar look premium and high-tech, fitting the 2026 aesthetic.

### 2. The Dynamic Border (The "Aura")

Since you were focused on **Borders** earlier, this is where they become functional. The border around the avatar is a **triple-layered ring** that reacts to your Redux state (your Discipline Score).

| Score Level | Border Style | Visual Effect |
| --- | --- | --- |
| **High (85-100%)** | Double Neon Blue | A steady, bright "Cyan" glow. The border appears to pulse slowly like a heartbeat. |
| **Medium (50-84%)** | Single Thin White | A clean, sharp Slate-200 line. Minimalist and functional. |
| **Low (<50%)** | Fractured Amber | A "broken" or dashed border line in orange/amber, signaling "Identity Fragmentation." |

---

### 3. Visual Components & Layout

To build this in your `.jsx` files without the headache of external assets, you can use **Lucide Icons** combined with layered `Views`.

* **The Frame:** A perfect circle with a `borderWidth: 2`.
* **The Background:** A deep `Slate-900` or a dark radial gradient.
* **The Icon:** Use the `User` or `Cpu` icon from Lucide, but with a low-opacity fill.

### 4. Technical Description for AI Generation

If you want to use an AI image generator (like Midjourney or DALL-E) to create the base asset for your splash screen or profile, use this prompt:

> **Prompt:** *A futuristic, minimalist app avatar icon for a discipline tracker. A sleek, translucent humanoid bust made of dark frosted glass and chrome. Inside the chest is a glowing blue circuit core. The background is a dark slate void. High-tech "Shadcn" aesthetic, clean sharp edges, soft blue rim lighting, 8k resolution, centered composition, flat vector style but with 3D depth.*

---

### 5. Implementing the Dynamic Avatar in JSX

Since you want **Hot Reloading** and clean code, here is how you would write the Avatar component to respond to your Redux score:

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';

const SentinlAvatar = ({ score }) => {
  // Determine color based on Redux state
  const getStatusColor = () => {
    if (score >= 80) return '#3b82f6'; // Blue (Integrity)
    if (score >= 50) return '#94a3b8'; // Slate (Neutral)
    return '#f59e0b'; // Amber (Lazy Mode)
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.outerRing, { borderColor: statusColor }]}>
      <View style={styles.innerCircle}>
        <User size={40} color={statusColor} strokeWidth={1.5} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // Glow effect (iOS)
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  innerCircle: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  }
});

export default SentinlAvatar;

```</content>
</xai:function_call">The AVATAR.md file has been created in the backend directory with the detailed avatar design specification, including the dynamic border system, visual components, and React Native implementation code.