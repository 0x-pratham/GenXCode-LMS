"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Premium GenXCode Rubik's Cube (Interactive Edition)
 * - Solves perfectly (colors align on each face)
 * - Glossy, iridescent luxury glass finish
 * - NEW: Drag to rotate, Raycast individual cube hover, Click to turbo-speed, Double-click to pause
 */
export default function PurpleRubiksCube({ size = 520 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    
    const width = mount.clientWidth || size;
    const height = mount.clientHeight || size;

    // ---------- Scene / Camera / Renderer ----------
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ---------- Lighting ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 6);
    scene.add(key);
    
    const rim1 = new THREE.DirectionalLight(0xb794f6, 1.6);
    rim1.position.set(-6, 2, -3);
    scene.add(rim1);
    
    const rim2 = new THREE.DirectionalLight(0xff9fe0, 1.2);
    rim2.position.set(3, -5, -4);
    scene.add(rim2);

    // ---------- Rainbow studio environment (for luxury reflections) ----------
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext("2d");
    if (ctx) {
      const base = ctx.createLinearGradient(0, 0, 0, 256);
      base.addColorStop(0, "#140a28");
      base.addColorStop(0.5, "#1c1038");
      base.addColorStop(1, "#0a0616");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, 512, 256);

      const hueGrad = ctx.createLinearGradient(0, 0, 512, 0);
      const bands = ["#7c3aed", "#3b82f6", "#22d3ee", "#4ade80", "#facc15", "#fb923c", "#ec4899", "#7c3aed"];
      bands.forEach((c, i) => hueGrad.addColorStop(i / (bands.length - 1), c));
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = hueGrad;
      ctx.fillRect(0, 95, 512, 40);
      ctx.globalAlpha = 1;

      // Type annotations removed here
      const glowSpot = (x, y, r, color, alpha) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
      };
      glowSpot(120, 55, 90, "#ffffff", 0.85);
      glowSpot(390, 185, 75, "#c4b5fd", 0.6);
      glowSpot(430, 45, 55, "#67e8f9", 0.5);
    }

    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;
    envTex.dispose();

    // ---------- Premium Glassy Materials ----------
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x110826, 
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1.0,
      envMapIntensity: 1.5,
    });

    const faceColors = [
      0x6d28d9, // Right (+x)
      0x7c3aed, // Left (-x)
      0x8b5cf6, // Top (+y)
      0xa78bfa, // Bottom (-y)
      0xc4b5fd, // Front (+z)
      0xd946ef  // Back (-z)
    ];

    const faceMats = faceColors.map(color => new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0, 
      clearcoatRoughness: 0.05,
      iridescence: 0.8, 
      iridescenceIOR: 1.4,
      envMapIntensity: 1.8, 
    }));

    // ---------- Build 26 Cubelets ----------
    const group = new THREE.Group();
    scene.add(group);

    const cubeletSize = 0.94;
    const gap = 1.0;
    const grid = [-1, 0, 1];
    
    // Type annotation removed
    const cubelets = [];

    const geo = new RoundedBoxGeometry(cubeletSize, cubeletSize, cubeletSize, 4, 0.08);

    for (const x of grid) {
      for (const y of grid) {
        for (const z of grid) {
          if (x === 0 && y === 0 && z === 0) continue; 

          const cubeMaterials = [
            x === 1 ? faceMats[0] : coreMat,
            x === -1 ? faceMats[1] : coreMat,
            y === 1 ? faceMats[2] : coreMat,
            y === -1 ? faceMats[3] : coreMat,
            z === 1 ? faceMats[4] : coreMat,
            z === -1 ? faceMats[5] : coreMat,
          ];

          const cubelet = new THREE.Mesh(geo, cubeMaterials);
          cubelet.position.set(x * gap, y * gap, z * gap);
          group.add(cubelet);
          cubelets.push(cubelet);
        }
      }
    }

    // ---------- Play engine: scramble -> pause -> solve -> pause -> loop ----------
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    const SCRAMBLE_MOVES = 15; 
    const PAUSE_SCRAMBLED = 2.0;
    const PAUSE_SOLVED = 3.0;

    // Type annotations removed
    const turnState = { 
        active: false, 
        axis: 'x', 
        direction: 1, 
        layer: 0, 
        turnGroup: new THREE.Group(), 
        layerCubelets: [], 
        startTime: 0, 
        duration: 0.5 
    };
    
    const history = [];
    let phase = "pauseSolved";
    let phaseStart = 0;
    let scrambleLeft = 0;

    function beginTurn(axis, layer, direction, t, record) {
      const turnGroup = new THREE.Group();
      group.add(turnGroup);
      
      const layerCubelets = cubelets.filter(
        (c) => Math.abs(c.position[axis] - layer) < 0.1
      );
      layerCubelets.forEach((c) => turnGroup.attach(c));

      turnState.active = true;
      turnState.axis = axis;
      turnState.direction = direction;
      turnState.layer = layer;
      turnState.turnGroup = turnGroup;
      turnState.layerCubelets = layerCubelets;
      turnState.startTime = t;
      turnState.duration = 0.45 + Math.random() * 0.15; 

      if (record) history.push({ axis, layer, direction });
    }

    function finishTurnIfDone(t) {
      const elapsed = t - turnState.startTime;
      const progress = Math.min(elapsed / turnState.duration, 1);
      const eased = easeInOutCubic(progress);
      turnState.turnGroup.rotation[turnState.axis] = turnState.direction * (Math.PI / 2) * eased;

      if (progress >= 1) {
        turnState.layerCubelets.forEach((c) => {
          group.attach(c);
          c.position.set(
            Math.round(c.position.x / gap) * gap,
            Math.round(c.position.y / gap) * gap,
            Math.round(c.position.z / gap) * gap
          );
        });
        group.remove(turnState.turnGroup);
        turnState.active = false;
        return true;
      }
      return false;
    }

    function updatePlay(t) {
      if (turnState.active) {
        finishTurnIfDone(t);
        return;
      }

      if (phase === "pauseSolved") {
        if (t - phaseStart > PAUSE_SOLVED) {
          phase = "scramble";
          scrambleLeft = SCRAMBLE_MOVES;
        }
      } else if (phase === "scramble") {
        if (scrambleLeft > 0) {
          const axes = ["x", "y", "z"];
          const axis = axes[Math.floor(Math.random() * 3)];
          const layer = grid[Math.floor(Math.random() * 3)] * gap;
          const direction = Math.random() < 0.5 ? 1 : -1;
          beginTurn(axis, layer, direction, t, true);
          scrambleLeft--;
        } else {
          phase = "pauseScrambled";
          phaseStart = t;
        }
      } else if (phase === "pauseScrambled") {
        if (t - phaseStart > PAUSE_SCRAMBLED) {
          phase = "solve";
        }
      } else if (phase === "solve") {
        if (history.length > 0) {
          const move = history.pop(); // Non-null assertion removed
          beginTurn(move.axis, move.layer, -move.direction, t, false);
        } else {
          phase = "pauseSolved";
          phaseStart = t;
        }
      }
    }

    // ---------- INTERACTIVE EVENTS LOGIC ----------
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-2, -2); // Out of view initially
    const mouse = { x: 0, y: 0 };
    
    let isDragging = false;
    let dragDistance = 0;
    let lastPointer = { x: 0, y: 0 };
    let manualRotX = 0.42;
    let manualRotY = 0.6;
    let timeSinceLastInteraction = 0;
    
    let hovering = false;
    let speedMultiplier = 1;
    let isAlgorithmPaused = false;

    // Pointer Events for Drag & Raycast
    function onPointerDown(e) {
      isDragging = true;
      dragDistance = 0;
      lastPointer = { x: e.clientX, y: e.clientY };
      mount.style.cursor = "grabbing";
      timeSinceLastInteraction = 0;
    }

    function onPointerUp() {
      isDragging = false;
      mount.style.cursor = hovering ? "grab" : "default";
      timeSinceLastInteraction = 0;
    }

    function onPointerMove(e) {
      const rect = mount.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      
      // Standard mouse for sway
      mouse.x = px * 2 - 1;
      mouse.y = py * 2 - 1;
      
      // NDC for Raycaster
      pointerNDC.x = px * 2 - 1;
      pointerNDC.y = -(py * 2 - 1);

      if (isDragging) {
        const dx = e.clientX - lastPointer.x;
        const dy = e.clientY - lastPointer.y;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        
        manualRotY += dx * 0.006;
        manualRotX += dy * 0.006;
        lastPointer = { x: e.clientX, y: e.clientY };
        timeSinceLastInteraction = 0;
      }
    }

    // Click for Speed Boost
    function onClick() {
      if (dragDistance < 5) { // Ensure it was a tap, not a drag
        speedMultiplier = 4.0; // 4x Turbo Mode!
        setTimeout(() => { speedMultiplier = 1.0; }, 800);
      }
    }

    // Double Click to Pause
    function onDblClick() {
      isAlgorithmPaused = !isAlgorithmPaused;
    }

    function onEnter() {
      hovering = true;
      mount.style.cursor = isDragging ? "grabbing" : "grab";
    }

    function onLeave() {
      hovering = false;
      isDragging = false;
      mouse.x = 0;
      mouse.y = 0;
      pointerNDC.set(-2, -2);
    }

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("click", onClick);
    mount.addEventListener("dblclick", onDblClick);
    mount.addEventListener("mouseenter", onEnter);
    mount.addEventListener("mouseleave", onLeave);

    // ---------- Animation Loop ----------
    let raf;
    let curRotX = manualRotX;
    let curRotY = manualRotY;
    let curScale = 1;
    
    let lastTime = performance.now();
    let gameTime = 0;

    function animate() {
      raf = requestAnimationFrame(animate);
      
      const now = performance.now();
      const dt = (now - lastTime) * 0.001;
      lastTime = now;

      // Only run Rubik logic if not paused
      if (!isAlgorithmPaused) {
        gameTime += dt * speedMultiplier;
        updatePlay(gameTime);
      }

      // Resume auto-rotation if idle for 3 seconds
      if (!isDragging) {
        timeSinceLastInteraction += dt;
      }
      if (timeSinceLastInteraction > 3) {
        manualRotY += dt * 0.15; // Slow ambient spin
      }

      // Blend manual drag rotation with subtle mouse follow sway
      const targetY = manualRotY + (!isDragging ? mouse.x * 0.2 : 0);
      const targetX = manualRotX + (!isDragging ? mouse.y * -0.2 : 0);

      curRotX += (targetX - curRotX) * 0.1;
      curRotY += (targetY - curRotY) * 0.1;
      
      group.rotation.x = curRotX;
      group.rotation.y = curRotY;
      group.position.y = Math.sin(now * 0.001 * 0.5) * 0.12; // Floating effect

      // Interactive Raycast: Make hovered cubelet pop out
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects(cubelets);
      let hoveredCubelet = null;
      
      if (intersects.length > 0 && !isDragging) {
        hoveredCubelet = intersects[0].object;
      }

      cubelets.forEach((c) => {
        const targetS = (c === hoveredCubelet) ? 1.15 : 1.0;
        const currentS = c.scale.x;
        c.scale.setScalar(currentS + (targetS - currentS) * 0.2);
      });

      // Overall group scale on container hover
      const targetScale = hovering ? 1.05 : 1;
      curScale += (targetScale - curScale) * 0.08;
      group.scale.setScalar(curScale);

      renderer.render(scene, camera);
    }
    animate();

    // ---------- Resize ----------
    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(mount);

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("click", onClick);
      mount.removeEventListener("dblclick", onDblClick);
      mount.removeEventListener("mouseenter", onEnter);
      mount.removeEventListener("mouseleave", onLeave);
      
      cubelets.forEach((c) => {
        c.geometry.dispose();
      });
      coreMat.dispose();
      faceMats.forEach(m => m.dispose());
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: size,
        touchAction: "none" // Prevents page scroll while rotating on mobile
      }}
    />
  );
}