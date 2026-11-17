"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Canvas3DProps {
  colorHex: string;
  wheelStyle: string;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({ colorHex, wheelStyle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carPaintMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);
    scene.fog = new THREE.FogExp2(0x030712, 0.045);

    // 2. Camera Setup (Low dynamic 3/4 front angle)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 1.6, 5.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0a122c, 1.8);
    scene.add(ambientLight);

    // Key Light: Cyber Cyan
    const keyLight = new THREE.SpotLight(0x00f0ff, 9, 35, Math.PI / 4, 0.5, 1);
    keyLight.position.set(5.5, 6.5, 4.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim Light: Velvet Neon Purple
    const rimLight = new THREE.SpotLight(0x8b5cf6, 7, 35, Math.PI / 4, 0.5, 1);
    rimLight.position.set(-6, 5.5, -4.5);
    scene.add(rimLight);

    // Front Illuminator
    const frontHeadlightBeam = new THREE.PointLight(0x00f0ff, 4.5, 8);
    frontHeadlightBeam.position.set(0, 0.7, 3.2);
    scene.add(frontHeadlightBeam);

    // Top Overhead Fill
    const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topLight.position.set(0, 9, 0);
    scene.add(topLight);

    // 5. Wet Asphalt Reflective Floor
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x04060e,
      roughness: 0.16,
      metalness: 0.88,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Cyan Neon Grid
    const grid = new THREE.GridHelper(40, 40, 0x00f0ff, 0x0a122c);
    grid.position.y = 0.01;
    scene.add(grid);

    // 6. Procedural 3D Concept BMW Car
    const carGroup = new THREE.Group();

    // Metallic Car Paint Material
    const carPaintMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.22,
      metalness: 0.92,
    });
    carPaintMatRef.current = carPaintMat;

    // Tinted Aero Glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x001122,
      transparent: true,
      opacity: 0.78,
      roughness: 0.05,
      metalness: 0.15,
      transmission: 0.88,
      ior: 1.5,
    });

    // Glowing Cyan Grille & Headlight Shader
    const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const neonPurpleMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });

    // Main Sculpted Fuselage
    const bodyGeo = new THREE.BoxGeometry(2.1, 0.58, 4.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, carPaintMat);
    bodyMesh.position.y = 0.56;
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);

    // Cockpit Canopy
    const cabinGeo = new THREE.CylinderGeometry(0.85, 1.05, 0.65, 8);
    const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
    cabinMesh.position.set(0, 1.05, -0.2);
    cabinMesh.scale.set(1, 1, 1.8);
    carGroup.add(cabinMesh);

    // Slanted Aero Hood
    const hoodGeo = new THREE.BoxGeometry(1.95, 0.24, 1.8);
    const hoodMesh = new THREE.Mesh(hoodGeo, carPaintMat);
    hoodMesh.position.set(0, 0.68, 1.3);
    hoodMesh.rotation.x = 0.08;
    carGroup.add(hoodMesh);

    // Illuminated Kidney Grilles
    const grilleBorderGeo = new THREE.TorusGeometry(0.28, 0.024, 16, 32);

    const leftGrille = new THREE.Mesh(grilleBorderGeo, neonCyanMat);
    leftGrille.position.set(-0.35, 0.5, 2.41);
    leftGrille.scale.set(1.2, 1.8, 1);
    carGroup.add(leftGrille);

    const rightGrille = new THREE.Mesh(grilleBorderGeo, neonCyanMat);
    rightGrille.position.set(0.35, 0.5, 2.41);
    rightGrille.scale.set(1.2, 1.8, 1);
    carGroup.add(rightGrille);

    // Laser LED Headlights
    const headlightGeo = new THREE.BoxGeometry(0.44, 0.04, 0.1);
    const leftHeadlight = new THREE.Mesh(headlightGeo, neonCyanMat);
    leftHeadlight.position.set(-0.84, 0.62, 2.38);
    leftHeadlight.rotation.y = -0.2;
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, neonCyanMat);
    rightHeadlight.position.set(0.84, 0.62, 2.38);
    rightHeadlight.rotation.y = 0.2;
    carGroup.add(rightHeadlight);

    // Rear Neon Blade Tail-Light
    const tailLightGeo = new THREE.BoxGeometry(1.85, 0.05, 0.08);
    const tailLight = new THREE.Mesh(tailLightGeo, neonPurpleMat);
    tailLight.position.set(0, 0.65, -2.41);
    carGroup.add(tailLight);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 28);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.3, metalness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.9 });

    const wheelPositions: [number, number, number][] = [
      [-1.02, 0.42, 1.5],
      [1.02, 0.42, 1.5],
      [-1.02, 0.42, -1.5],
      [1.02, 0.42, -1.5],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(...pos);
      wheel.castShadow = true;

      const rim = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.35, 16), rimMat);
      rim.position.set(pos[0] > 0 ? 0.15 : -0.15, 0, 0);
      rim.rotation.y = pos[0] > 0 ? Math.PI / 2 : -Math.PI / 2;
      wheel.add(rim);

      carGroup.add(wheel);
    });

    scene.add(carGroup);

    // Mouse Interaction for 360 Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0.002; // Gentle auto-spin
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      carGroup.rotation.y += deltaX * 0.008;
      camera.position.y = Math.max(0.8, Math.min(3.5, camera.position.y - deltaY * 0.01));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support for mobile / touch screens
    let prevTouchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevTouchX;
      carGroup.rotation.y += deltaX * 0.01;
      prevTouchX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        carGroup.rotation.y += 0.003;
      }

      // Hover suspension floating effect
      const t = Date.now() * 0.0015;
      carGroup.position.y = Math.sin(t) * 0.015;

      camera.lookAt(0, 0.7, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update car paint color reactively
  useEffect(() => {
    if (carPaintMatRef.current) {
      carPaintMatRef.current.color.set(colorHex);
    }
  }, [colorHex]);

  return (
    <div ref={containerRef} className="relative w-full h-full cursor-grab active:cursor-grabbing select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* 360 Studio Hint */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 border border-cyan-400/30 text-cyan-300 text-[11px] tracking-widest uppercase font-mono shadow-glow-cyan backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Interactive 3D Stage • Drag To Rotate 360°
        </span>
      </div>
    </div>
  );
};
