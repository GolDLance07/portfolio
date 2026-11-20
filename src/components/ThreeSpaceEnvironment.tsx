import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motionController, MotionState } from '../services/motionController';

// Exact Experience 3.0 Midnight Astronomical Palette
const PALETTE = {
  voidBlack: 0x020611,
  midnight: 0x071225,
  deepNavy: 0x0B1B35,
  stellarBlue: 0x152D50,
  mutedBlue: 0x7996BA,
  starlight: 0xD8E4F4,
  pureWhite: 0xFFFFFF,
  accentViolet: 0x536399,
};

interface ForegroundParticle {
  x0: number;
  y0: number;
  z0: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: THREE.Color;
  size: number;
  trailPoints: [number, number, number][];
}

export const ThreeSpaceEnvironment: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.voidBlack);
    scene.fog = new THREE.FogExp2(PALETTE.voidBlack, 0.0011);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    camera.position.set(0, 0, 220);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. Texture Generator for Crisp Spherical Starlight
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.18, 'rgba(216, 228, 244, 0.9)');
      grad.addColorStop(0.45, 'rgba(121, 150, 186, 0.35)');
      grad.addColorStop(1, 'rgba(11, 27, 53, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createStarTexture();

    // ==============================================================
    // POPULATION 1: DISTANT STARS (2,500 particles)
    // Deep celestial sphere, minimal parallax, micro-twinkle
    // ==============================================================
    const DISTANT_COUNT = 2500;
    const distantGeo = new THREE.BufferGeometry();
    const distantPositions = new Float32Array(DISTANT_COUNT * 3);
    const distantColors = new Float32Array(DISTANT_COUNT * 3);

    const colorChoices = [
      new THREE.Color(PALETTE.starlight),
      new THREE.Color(PALETTE.mutedBlue),
      new THREE.Color(PALETTE.pureWhite),
      new THREE.Color(PALETTE.stellarBlue),
      new THREE.Color(PALETTE.accentViolet),
    ];

    for (let i = 0; i < DISTANT_COUNT; i++) {
      const radius = 800 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      distantPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      distantPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      distantPositions[i * 3 + 2] = radius * Math.cos(phi);

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      distantColors[i * 3] = c.r;
      distantColors[i * 3 + 1] = c.g;
      distantColors[i * 3 + 2] = c.b;
    }

    distantGeo.setAttribute('position', new THREE.BufferAttribute(distantPositions, 3));
    distantGeo.setAttribute('color', new THREE.BufferAttribute(distantColors, 3));

    const distantMat = new THREE.PointsMaterial({
      size: 1.8,
      map: starTexture,
      transparent: true,
      opacity: 0.75,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const distantPoints = new THREE.Points(distantGeo, distantMat);
    scene.add(distantPoints);

    // ==============================================================
    // POPULATION 2: MIDGROUND STARS (1,200 particles)
    // Volumetric corridor, gentle orbital drift, moderate parallax
    // ==============================================================
    const MID_COUNT = 1200;
    const midGeo = new THREE.BufferGeometry();
    const midPositions = new Float32Array(MID_COUNT * 3);
    const midColors = new Float32Array(MID_COUNT * 3);
    const midDriftPhases = new Float32Array(MID_COUNT);

    for (let i = 0; i < MID_COUNT; i++) {
      midPositions[i * 3] = (Math.random() - 0.5) * 800;
      midPositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      midPositions[i * 3 + 2] = -600 + Math.random() * 900; // Aligned along travel trajectory

      const c = Math.random() > 0.4 ? new THREE.Color(PALETTE.starlight) : new THREE.Color(PALETTE.mutedBlue);
      midColors[i * 3] = c.r;
      midColors[i * 3 + 1] = c.g;
      midColors[i * 3 + 2] = c.b;

      midDriftPhases[i] = Math.random() * Math.PI * 2;
    }

    midGeo.setAttribute('position', new THREE.BufferAttribute(midPositions, 3));
    midGeo.setAttribute('color', new THREE.BufferAttribute(midColors, 3));

    const midMat = new THREE.PointsMaterial({
      size: 3.2,
      map: starTexture,
      transparent: true,
      opacity: 0.88,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const midPoints = new THREE.Points(midGeo, midMat);
    scene.add(midPoints);

    // ==============================================================
    // POPULATION 3: FOREGROUND STARS WITH SPRING-DAMPER PHYSICS (300 particles)
    // Equation: F = -k*(x - x0) - c*v + F_pointer
    // ==============================================================
    const FORE_COUNT = 300;
    const foregroundParticles: ForegroundParticle[] = [];
    const foreGeo = new THREE.BufferGeometry();
    const forePositions = new Float32Array(FORE_COUNT * 3);
    const foreColors = new Float32Array(FORE_COUNT * 3);

    for (let i = 0; i < FORE_COUNT; i++) {
      const x0 = (Math.random() - 0.5) * 360;
      const y0 = (Math.random() - 0.5) * 220;
      const z0 = -40 + Math.random() * 120; // Natural depth separation without lens clipping

      const p: ForegroundParticle = {
        x0,
        y0,
        z0,
        x: x0,
        y: y0,
        z: z0,
        vx: 0,
        vy: 0,
        vz: 0,
        color: Math.random() > 0.35 ? new THREE.Color(PALETTE.starlight) : new THREE.Color(PALETTE.mutedBlue),
        size: 4.8 + Math.random() * 2.4,
        trailPoints: [
          [x0, y0, z0],
          [x0, y0, z0],
          [x0, y0, z0],
        ],
      };

      foregroundParticles.push(p);

      forePositions[i * 3] = x0;
      forePositions[i * 3 + 1] = y0;
      forePositions[i * 3 + 2] = z0;

      foreColors[i * 3] = p.color.r;
      foreColors[i * 3 + 1] = p.color.g;
      foreColors[i * 3 + 2] = p.color.b;
    }

    foreGeo.setAttribute('position', new THREE.BufferAttribute(forePositions, 3));
    foreGeo.setAttribute('color', new THREE.BufferAttribute(foreColors, 3));

    const foreMat = new THREE.PointsMaterial({
      size: 4.6,
      map: starTexture,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const forePoints = new THREE.Points(foreGeo, foreMat);
    scene.add(forePoints);

    // ==============================================================
    // LUMINOUS PARTICLE TRAILS (LineSegments)
    // Active particles with velocity momentum leave short-lived streaks
    // ==============================================================
    const trailPositions = new Float32Array(FORE_COUNT * 2 * 3); // 2 vertices per trail segment
    const trailColors = new Float32Array(FORE_COUNT * 2 * 3);

    for (let i = 0; i < FORE_COUNT; i++) {
      const p = foregroundParticles[i];
      trailColors[i * 6] = p.color.r * 0.9;
      trailColors[i * 6 + 1] = p.color.g * 0.9;
      trailColors[i * 6 + 2] = p.color.b * 0.9;
      trailColors[i * 6 + 3] = p.color.r * 0.1;
      trailColors[i * 6 + 4] = p.color.g * 0.1;
      trailColors[i * 6 + 5] = p.color.b * 0.1;
    }

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

    const trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const trailSegments = new THREE.LineSegments(trailGeo, trailMat);
    scene.add(trailSegments);

    // ==============================================================
    // RESTRAINED ASTRONOMICAL FORMATIONS (DEEP NEBULA HORIZON)
    // Non-liquid, visually stable distant celestial structures
    // ==============================================================
    const createNebulaPlane = (colorHex: number, scale: number, x: number, y: number, z: number) => {
      const nCanvas = document.createElement('canvas');
      nCanvas.width = 256;
      nCanvas.height = 256;
      const nCtx = nCanvas.getContext('2d');
      if (nCtx) {
        const c = new THREE.Color(colorHex);
        const grad = nCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
        grad.addColorStop(0, `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, 0.22)`);
        grad.addColorStop(0.5, `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, 0.08)`);
        grad.addColorStop(1, 'rgba(2, 6, 17, 0)');
        nCtx.fillStyle = grad;
        nCtx.fillRect(0, 0, 256, 256);
      }
      const nTex = new THREE.CanvasTexture(nCanvas);
      const nMat = new THREE.SpriteMaterial({
        map: nTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(nMat);
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(x, y, z);
      return sprite;
    };

    const nebula1 = createNebulaPlane(PALETTE.deepNavy, 650, 120, -40, -350);
    const nebula2 = createNebulaPlane(PALETTE.stellarBlue, 480, -140, 60, -500);
    scene.add(nebula1);
    scene.add(nebula2);

    // ==============================================================
    // TICK & INTEGRATION LOOP
    // Driven exclusively by motionController
    // ==============================================================
    const currentCamPos = new THREE.Vector3(0, 0, 220);
    const currentCamTarget = new THREE.Vector3(0, 0, 0);

    const unsubscribe = motionController.subscribe((state: MotionState, dt: number) => {
      const { camera: camTarget, pointer, prefersReducedMotion } = state;

      // 1. Camera Spatial Navigation Lerp with deliberate astronomical inertia
      const lerpSpeed = 0.045;
      currentCamPos.x += (camTarget.x - currentCamPos.x) * lerpSpeed;
      currentCamPos.y += (camTarget.y - currentCamPos.y) * lerpSpeed;
      currentCamPos.z += (camTarget.z - currentCamPos.z) * lerpSpeed;

      // Subtle lateral pointer sway (subtle depth feeling)
      if (!prefersReducedMotion && pointer.active) {
        currentCamPos.x += (pointer.x * 10 - (currentCamPos.x - camTarget.x)) * 0.02;
        currentCamPos.y += (pointer.y * 6 - (currentCamPos.y - camTarget.y)) * 0.02;
      }

      currentCamTarget.x += (camTarget.targetX - currentCamTarget.x) * lerpSpeed;
      currentCamTarget.y += (camTarget.targetY - currentCamTarget.y) * lerpSpeed;
      currentCamTarget.z += (camTarget.targetZ - currentCamTarget.z) * lerpSpeed;

      camera.position.copy(currentCamPos);
      camera.lookAt(currentCamTarget);
      if (camTarget.roll !== 0) {
        camera.rotation.z = camTarget.roll;
      }

      // 2. Midground Stars Organic Drift
      const timeSec = performance.now() * 0.0006;
      const midPosAttr = midGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < MID_COUNT; i++) {
        const baseIdx = i * 3;
        const phase = midDriftPhases[i];
        midPositions[baseIdx] += Math.sin(timeSec + phase) * 0.04;
        midPositions[baseIdx + 1] += Math.cos(timeSec * 0.8 + phase) * 0.03;
      }
      midPosAttr.needsUpdate = true;

      // 3. Foreground Particles: Subtle Gravitational Disturbance Spring-Damper System
      // F = -k*(x - x0) - c*v + F_pointer
      const k = 0.038; // Gentle spring pull
      const c = 0.94; // Stronger damping (eliminates aggressive oscillation)
      const influenceRadius = 38; // Concentrated, localized disturbance radius
      const influenceRadiusSq = influenceRadius * influenceRadius;
      const sigmaSq2 = 2 * 14 * 14;

      // Project pointer into 3D plane at foreground z ~ 100
      const pointerWorldX = pointer.x * (window.innerWidth / 5.2);
      const pointerWorldY = pointer.y * (window.innerHeight / 5.2);

      const forePosAttr = foreGeo.attributes.position as THREE.BufferAttribute;
      const trailPosAttr = trailGeo.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < FORE_COUNT; i++) {
        const p = foregroundParticles[i];

        let fx = -k * (p.x - p.x0);
        let fy = -k * (p.y - p.y0);
        let fz = -k * (p.z - p.z0);

        // Gentle Gravitational Displacement Force
        if (pointer.active && !state.isTouch && !prefersReducedMotion) {
          const dx = p.x - pointerWorldX;
          const dy = p.y - pointerWorldY;
          const distSq = dx * dx + dy * dy;

          if (distSq < influenceRadiusSq && distSq > 0.01) {
            const r = Math.sqrt(distSq);
            const influence = Math.exp(-distSq / sigmaSq2);
            const ux = dx / r;
            const uy = dy / r;
            const tx = -uy;
            const ty = ux;

            // Restrained displacement + minimal tangential drift
            const pushMagnitude = 2.4 * influence;
            const tangentMagnitude = pointer.speed * 0.03 * influence;

            fx += ux * pushMagnitude + tx * tangentMagnitude;
            fy += uy * pushMagnitude + ty * tangentMagnitude;
            fz += (Math.random() - 0.5) * 1.0 * influence;
          }
        }

        // Apply Damping
        fx -= c * p.vx;
        fy -= c * p.vy;
        fz -= c * p.vz;

        // Integration (Euler with smooth acceleration scale)
        p.vx += fx * dt * 15;
        p.vy += fy * dt * 15;
        p.vz += fz * dt * 15;

        p.x += p.vx * dt * 15;
        p.y += p.vy * dt * 15;
        p.z += p.vz * dt * 15;

        forePositions[i * 3] = p.x;
        forePositions[i * 3 + 1] = p.y;
        forePositions[i * 3 + 2] = p.z;

        // Update Momentum Trail Segment (delicate & localized)
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        const trailIdx = i * 6;
        if (speedSq > 0.08 && !prefersReducedMotion) {
          // Point A: Current particle
          trailPositions[trailIdx] = p.x;
          trailPositions[trailIdx + 1] = p.y;
          trailPositions[trailIdx + 2] = p.z;
          // Point B: Short lagging momentum streak
          trailPositions[trailIdx + 3] = p.x - p.vx * 1.4;
          trailPositions[trailIdx + 4] = p.y - p.vy * 1.4;
          trailPositions[trailIdx + 5] = p.z - p.vz * 1.4;
        } else {
          // Collapse trail when idle
          trailPositions[trailIdx] = p.x;
          trailPositions[trailIdx + 1] = p.y;
          trailPositions[trailIdx + 2] = p.z;
          trailPositions[trailIdx + 3] = p.x;
          trailPositions[trailIdx + 4] = p.y;
          trailPositions[trailIdx + 5] = p.z;
        }
      }

      forePosAttr.needsUpdate = true;
      trailPosAttr.needsUpdate = true;

      // 4. Render Scene
      renderer.render(scene, camera);
    });

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Resource Cleanup on Unmount
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      distantGeo.dispose();
      distantMat.dispose();
      midGeo.dispose();
      midMat.dispose();
      foreGeo.dispose();
      foreMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      starTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-space-environment-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--color-void-black)',
      }}
    />
  );
};
