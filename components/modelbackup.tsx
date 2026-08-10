import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * PremiumSoftGlassCube
 * A single, clean, rounded-edge glass cube — soft rounded corners, deep
 * black glassy interior, and a subtle rainbow (CD/holographic) glow
 * that only appears at the edges, like light catching a beveled crystal.
 *
 * This is deliberately a SINGLE mesh (not 27 overlapping pieces) —
 * that's what makes the transparency render clean and premium instead
 * of noisy. Matches the "soft glass, premium studio-render" reference.
 *
 * - True rounded geometry (RoundedBoxGeometry) → real soft edges,
 *   not a shader hack — this is what makes the fresnel glow look smooth
 * - Real glass: transmission + iridescence (thin-film rainbow) + clearcoat
 * - Self-rotates continuously, floats gently, tilts toward the cursor
 * - Slight hover "lift" for a bit of interactive UX polish
 *
 * Usage:
 *   <div style={{ width: 520, height: 520 }}>
 *     <PremiumSoftGlassCube />
 *   </div>
 *
 * Requires: npm install three   (RoundedBoxGeometry ships inside three/examples)
 */
export default function PremiumSoftGlassCube({ size = 520 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth || size;
    const height = mount.clientHeight || size;

    // ---------- Scene / Camera / Renderer ----------
    const scene = new THREE.Scene();
    scene.background = null; // transparent — sits on your page's own bg

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ---------- Lighting ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 6, 6);
    scene.add(key);

    const rim1 = new THREE.DirectionalLight(0x9b7bff, 1.6);
    rim1.position.set(-6, 2, -3);
    scene.add(rim1);

    const rim2 = new THREE.DirectionalLight(0xff7fd6, 1.2);
    rim2.position.set(3, -5, -4);
    scene.add(rim2);

    // ---------- Rainbow studio-style environment (for reflections) ----------
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext("2d");

    // base dark gradient
    const base = ctx.createLinearGradient(0, 0, 0, 256);
    base.addColorStop(0, "#0a0612");
    base.addColorStop(0.5, "#120a24");
    base.addColorStop(1, "#050308");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 256);

    // horizontal rainbow band (subtle, like light passing through a prism)
    const hue = ctx.createLinearGradient(0, 0, 512, 0);
    const bands = ["#7c3aed", "#3b82f6", "#22d3ee", "#4ade80", "#facc15", "#fb923c", "#ec4899", "#7c3aed"];
    bands.forEach((c, i) => hue.addColorStop(i / (bands.length - 1), c));
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = hue;
    ctx.fillRect(0, 90, 512, 45);
    ctx.globalAlpha = 1;

    // a couple of bright "studio softbox" highlight patches
    function glowSpot(x, y, r, color, alpha) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    }
    glowSpot(130, 60, 90, "#ffffff", 0.9);
    glowSpot(380, 190, 70, "#c4b5fd", 0.7);
    glowSpot(420, 40, 50, "#67e8f9", 0.6);

    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;
    envTex.dispose();

    // ---------- The cube: single rounded-edge glass mesh ----------
    const geometry = new RoundedBoxGeometry(2.3, 2.3, 2.3, 8, 0.32);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x050308,
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 2.2,
      ior: 1.5,
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 700],
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.8,
      attenuationColor: new THREE.Color(0x0a0512),
      attenuationDistance: 1.4,
      specularIntensity: 1,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // ---------- Interaction state ----------
    const clock = new THREE.Clock();
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
    function onEnter() {
      hovering = true;
      mount.style.cursor = "grab";
    }
    function onLeave() {
      hovering = false;
      mouse.x = 0;
      mouse.y = 0;
    }
    mount.addEventListener("mousemove", onPointerMove);
    mount.addEventListener("mouseenter", onEnter);
    mount.addEventListener("mouseleave", onLeave);
    mount.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches[0]) onPointerMove(e.touches[0]);
      },
      { passive: true }
    );

    let curRotX = 0.5;
    let curRotY = 0.7;
    let curScale = 1;

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const autoY = t * 0.2;
      const autoX = 0.45 + Math.sin(t * 0.35) * 0.1;
      const targetY = autoY + mouse.x * 0.55;
      const targetX = autoX + mouse.y * -0.4;

      curRotX += (targetX - curRotX) * 0.06;
      curRotY += (targetY - curRotY) * 0.06;
      cube.rotation.x = curRotX;
      cube.rotation.y = curRotY;

      cube.position.y = Math.sin(t * 0.55) * 0.14;

      // gentle "lift" on hover — small UX touch
      const targetScale = hovering ? 1.06 : 1;
      curScale += (targetScale - curScale) * 0.08;
      cube.scale.setScalar(curScale);

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
      mount.removeEventListener("mousemove", onPointerMove);
      mount.removeEventListener("mouseenter", onEnter);
      mount.removeEventListener("mouseleave", onLeave);
      geometry.dispose();
      material.dispose();
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
        cursor: "grab",
      }}
    />
  );
}