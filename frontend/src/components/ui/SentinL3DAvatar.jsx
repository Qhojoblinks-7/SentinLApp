import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber/native';
import * as THREE from 'three';
import { View } from 'react-native';

// Custom Skin Shader for Subsurface Scattering approximation
const SkinMaterial = ({ time = 0, color = "#e2e8f0" }) => (
  <shaderMaterial
    uniforms={{
      time: { value: time },
      color: { value: new THREE.Color(color) },
    }}
    vertexShader={`
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `}
    fragmentShader={`
      uniform vec3 color;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 diffuse = color * diff;

        // Simple SSS approximation: add subsurface glow
        float sss = pow(max(dot(vNormal, -lightDir), 0.0), 2.0) * 0.3;
        vec3 subsurface = vec3(1.0, 0.8, 0.6) * sss;

        gl_FragColor = vec4(diffuse + subsurface, 1.0);
      }
    `}
  />
);

const SentinLFace = ({ score }) => {
  const meshRef = useRef();
  const eyeLeft = useRef();
  const eyeRight = useRef();
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);

  // Facial state logic ported from Python
  const getFacialState = (score) => {
    if (score >= 90) {
      return {
        eyeSquint: 0.2,
        mouthWidth: 0.4,
        pulseRate: 0.5,
        status: "GOD_MODE"
      };
    } else if (score <= 25) {
      return {
        eyeSquint: 0.9,
        mouthWidth: 0.8,
        pulseRate: 2.5,
        status: "CRITICAL"
      };
    }
    return {
      eyeSquint: 0,
      mouthWidth: 0.5,
      pulseRate: 1.0,
      status: "NOMINAL"
    };
  };

  const facialState = useMemo(() => getFacialState(score), [score]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Idle "Breathing" for the head
    meshRef.current.position.y = Math.sin(t * facialState.pulseRate) * 0.02;

    // Eye Tracking: Make him look slightly toward the "cursor/focus"
    const lookTarget = new THREE.Vector3(Math.sin(t * 0.2) * 0.1, 0, 1);
    eyeLeft.current.lookAt(lookTarget);
    eyeRight.current.lookAt(lookTarget);

    // Blinking logic
    blinkTimer.current += state.clock.getDelta();
    if (blinkTimer.current > 3 + Math.random() * 2) { // Random blink every 3-5 seconds
      isBlinking.current = true;
      blinkTimer.current = 0;
    }
    if (isBlinking.current) {
      // Blink animation: scale eyes vertically
      const blinkProgress = Math.sin(t * 20) * 0.5 + 0.5; // Fast oscillation
      eyeLeft.current.scale.y = THREE.MathUtils.lerp(eyeLeft.current.scale.y, blinkProgress > 0.8 ? 0.1 : 1, 0.3);
      eyeRight.current.scale.y = THREE.MathUtils.lerp(eyeRight.current.scale.y, blinkProgress > 0.8 ? 0.1 : 1, 0.3);
      if (blinkProgress < 0.1) isBlinking.current = false;
    } else {
      // Expression Morph: Squinting eyes if score is low
      const targetSquint = 1 - facialState.eyeSquint;
      eyeLeft.current.scale.y = THREE.MathUtils.lerp(eyeLeft.current.scale.y, targetSquint, 0.1);
      eyeRight.current.scale.y = THREE.MathUtils.lerp(eyeRight.current.scale.y, targetSquint, 0.1);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* TORSO */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.8, 1, 2, 16]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* ARMS */}
      <mesh position={[-1.2, -1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <SkinMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[1.2, -1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <SkinMaterial color="#e2e8f0" />
      </mesh>

      {/* LEGS */}
      <mesh position={[-0.4, -3.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
      <mesh position={[0.4, -3.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>

      {/* HAIR */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* MAIN HEAD STRUCTURE - Oval shape for face */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <SkinMaterial
          color="#e2e8f0"
          time={0}
        />
      </mesh>

      {/* NOSE */}
      <mesh position={[0, 0, 0.95]}>
        <coneGeometry args={[0.05, 0.2, 8]} />
        <SkinMaterial color="#d4d4d4" />
      </mesh>

      {/* EYEBROWS */}
      <mesh position={[-0.35, 0.35, 0.85]}>
        <boxGeometry args={[0.2, 0.03, 0.01]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.35, 0.35, 0.85]}>
        <boxGeometry args={[0.2, 0.03, 0.01]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* EYES (The "Human" part) */}
      <group position={[0, 0.2, 0.8]}>
        <group ref={eyeLeft} position={[-0.3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#000" />
          </mesh>
          <mesh position={[0.02, 0.02, 0.09]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={score > 80 ? "#3b82f6" : "#fff"} />
          </mesh>
        </group>
        <group ref={eyeRight} position={[0.3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#000" />
          </mesh>
          <mesh position={[0.02, 0.02, 0.09]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={score > 80 ? "#3b82f6" : "#fff"} />
          </mesh>
        </group>
      </group>

      {/* CHEEKS - Subtle blush */}
      <mesh position={[-0.4, -0.1, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffcccc" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.4, -0.1, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffcccc" transparent opacity={0.3} />
      </mesh>

      {/* MOUTH / LIPS */}
      <group position={[0, -0.4, 0.9]}>
        <mesh position={[0, 0.01, 0]}>
          <torusGeometry args={[facialState.mouthWidth / 2, 0.01, 8, 16]} />
          <meshBasicMaterial color="#8b4513" />
        </mesh>
        <mesh position={[0, -0.01, 0]}>
          <torusGeometry args={[facialState.mouthWidth / 2, 0.01, 8, 16]} />
          <meshBasicMaterial color="#8b4513" />
        </mesh>
      </group>
    </group>
  );
};

export const SentinL3DAvatar = ({ score = 75, size = 200 }) => {
  return (
    <View style={{ height: size, width: size, backgroundColor: '#020617' }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        {/* AAA THREE-POINT LIGHTING */}
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 5, 5]} intensity={2} color="#fff" penumbra={1} />
        <pointLight position={[-5, 2, 2]} intensity={1} color="#3b82f6" />
        <pointLight position={[0, -2, 5]} intensity={0.5} color="#ef4444" />

        <SentinLFace score={score} />
      </Canvas>
    </View>
  );
};