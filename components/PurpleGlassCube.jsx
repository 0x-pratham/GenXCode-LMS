"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Premium GenXCode Rubik's Cube
 * - Themed exactly to the brand logo (Deep Violet, Accent Purple, Lilac, Silver)
 * - Highly polished "Crystal / Liquid Metal" glossy finish
 * - Extended, mesmerizing solve logic
 */
export default function PurpleRubiksCube({ size = 520 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth || size;
    const height = mount.clientHeight || size;

    // ---------- Scene / Camera / Renderer ----------
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 10); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Slightly brighter for glassy reflections
    mount.appendChild(renderer.domElement);

    // ---------- Cinematic Brand Lighting ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    
    // Main bright highlight
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);
    
    // Deep purple fill to match logo base
    const fillLight = new THREE.DirectionalLight(0x5F2295, 1.5);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);
    
    // Soft Lilac rim light for glowing edges
    const rimLight = new THREE.DirectionalLight(0xE2D1FE, 2.0);
    rimLight.position.set(2, 5, -6);
    scene.add(rimLight);

    // ---------- Premium Studio Environment (For Glassy Reflections) ----------
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext("2d");
    
    const base = ctx.createLinearGradient(0, 0, 0, 256);
    base.addColorStop(0, "#0C0224");
    base.addColorStop(1, "#22044B");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 256);

    // Draw glowing neon spots for the clearcoat to catch
    function drawGlow(x, y, r, color) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    drawGlow(128, 64, 120, "rgba(226, 209, 254, 0.8)"); // Lilac glow
    drawGlow(384, 192, 120, "rgba(134, 56, 205, 0.6)"); // Accent purple glow
    drawGlow(256, 128, 150, "rgba(255, 255, 255, 0.4)"); // Bright center

    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromEquirectangular(envTex).texture;
    scene.environment = envMap;
    envTex.dispose();

    // ---------- GenXCode Brand Materials ----------
    
    // Core Plastic (Inner skeleton - Deep glossy midnight)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0C0224, 
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
    });

    // Outer Face Materials (The Logo Palette)
    const faceColors = [
      0x8638CD, // Right (+x): Accent Purple
      0xE2D1FE, // Left (-x): Soft Lilac
      0xFEFFFE, // Top (+y): Bright Silver/White
      0x5F2295, // Bottom (-y): Primary Purple
      0x22044B, // Front (+z): Dark Surface Violet
      0x0C0224, // Back (-z): Midnight Background
    ];

    // High-end Polished Crystal Finish
    const faceMats = faceColors.map(color => new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0, // Maximum gloss
      clearcoatRoughness: 0.05,
      iridescence: 0.9, // Gives that holographic/premium glass feel
      iridescenceIOR: 1.5,
      envMapIntensity: 2.0, // High reflection
    }));

    // ---------- Build 26 Cubelets ----------
    const group = new THREE.Group();
    scene.add(group);

    // Slightly softer rounded edges for premium feel
    const geo = new RoundedBoxGeometry(0.95, 0.95, 0.95, 5, 0.08);
    const gap = 1.0; 
    const grid = [-1, 0, 1];
    const cubelets = [];

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

    // ---------- Play Engine: Longer Scramble -> Solve -> Loop ----------
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    const SCRAMBLE_MOVES = 24; // Extended scramble length
    const PAUSE_SCRAMBLED = 3.0; // Longer pause to admire the mixed state
    const PAUSE_SOLVED = 4.0; // Longer pause on the perfectly solved logo state

    const turnState = { active: false };
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
      // Slightly slower, smoother turns
      turnState.duration = 0.45 + Math.random() * 0.2; 

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
          const move = history.pop();
          beginTurn(move.axis, move.layer, -move.direction, t, false);
        } else {
          phase = "pauseSolved";
          phaseStart = t;
        }
      }
    }

    // ---------- Mouse Interaction & Animation Loop ----------
    const startTime = performance.now();
    const mouse = { x: 0, y: 0 };
    let hovering = false;
    let raf;

    function onPointerMove(e) {
      const rect = mount.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      mouse.x = px * 2 - 1;
      mouse.y = py * 2 - 1;
    }
    
    mount.addEventListener("mousemove", onPointerMove);
    mount.addEventListener("mouseenter", () => (hovering = true));
    mount.addEventListener("mouseleave", () => {
      hovering = false;
      mouse.x = 0;
      mouse.y = 0;
    });

    let curRotX = 0.45;
    let curRotY = -0.5; 
    let curScale = 1;

    function animate() {
      raf = requestAnimationFrame(animate);
      
      const t = (performance.now() - startTime) * 0.001;

      updatePlay(t);

      // Slower, heavier ambient floating for a premium feel
      const autoY = t * 0.1;
      const autoX = 0.4 + Math.sin(t * 0.2) * 0.1;
      
      const targetY = autoY + mouse.x * 0.6;
      const targetX = autoX + mouse.y * -0.4;

      curRotX += (targetX - curRotX) * 0.04;
      curRotY += (targetY - curRotY) * 0.04;
      
      group.rotation.x = curRotX;
      group.rotation.y = curRotY;
      group.position.y = Math.sin(t * 1.0) * 0.12; 

      const targetScale = hovering ? 1.06 : 1;
      curScale += (targetScale - curScale) * 0.06;
      group.scale.setScalar(curScale);

      renderer.render(scene, camera);
    }
    animate();

    // ---------- Resize Handler ----------
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
      mount.removeEventListener("mousemove", onPointerMove);
      
      geo.dispose();
      coreMat.dispose();
      faceMats.forEach(m => m.dispose());
      envMap.dispose();
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
        cursor: "grab",
      }}
    />
  );
}