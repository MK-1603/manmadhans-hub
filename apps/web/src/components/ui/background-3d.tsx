'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Keep theme value in ref for animation tick access
  const themeRef = useRef(resolvedTheme);
  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // --- RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const getHexColor = (varName: string, fallback: number): number => {
      if (typeof window === 'undefined') return fallback;
      let val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (!val) return fallback;
      if (val.startsWith('#')) {
        val = val.substring(1);
        if (val.length === 3) {
          val = val.split('').map(c => c + c).join('');
        }
        return parseInt(val, 16);
      }
      return fallback;
    };

    const isDark = themeRef.current === 'dark';
    const initBg = getHexColor('--bg', isDark ? 0x0b0c10 : 0xfdf7ff);
    const initAccent = getHexColor('--neon', isDark ? 0x10b981 : 0x7c3aed);
    const initBg2 = getHexColor('--bg2', isDark ? 0x14161d : 0xffffff);

    renderer.setClearColor(initBg, 1);

    // --- SCENE & FOG ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(initBg, 0.013);

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 400);
    camera.position.set(0, 0, 60);

    // --- GLOW SPRITE ---
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    const ctx = glowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const spriteMat = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      color: initAccent,
      transparent: true,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(spriteMat);
    glowSprite.scale.set(72, 72, 1);
    scene.add(glowSprite);

    // --- CENTRAL WIREFRAME ICOSAHEDRON ---
    const icoGeo = new THREE.IcosahedronGeometry(13, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: initAccent,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icoMesh);

    // --- INNER MASKING DARK CORE ---
    const coreGeo = new THREE.IcosahedronGeometry(12.5, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: initBg,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // --- ORBITAL TORUS RINGS ---
    const r1Mat = new THREE.MeshBasicMaterial({ color: initAccent, transparent: true, opacity: 0.18 });
    const r2Mat = new THREE.MeshBasicMaterial({ color: initAccent, transparent: true, opacity: 0.09 });
    const r3Mat = new THREE.MeshBasicMaterial({ color: initAccent, transparent: true, opacity: 0.06 });

    const ringCreator = (radius: number, tube: number, rx: number, ry: number, mat: THREE.MeshBasicMaterial) => {
      const geom = new THREE.TorusGeometry(radius, tube, 10, 90);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = rx;
      mesh.rotation.y = ry;
      scene.add(mesh);
      return mesh;
    };

    const r1 = ringCreator(18, 0.45, Math.PI / 3, 0, r1Mat);
    const r2 = ringCreator(22, 0.28, Math.PI / 1.4, Math.PI / 5, r2Mat);
    const r3 = ringCreator(26, 0.18, Math.PI / 5, Math.PI / 3, r3Mat);

    // --- ORBITING DUST PARTICLES ---
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 35 + Math.random() * 65;
      positions[i * 3] = r * Math.sin(v) * Math.cos(u);
      positions[i * 3 + 1] = r * Math.sin(v) * Math.sin(u);
      positions[i * 3 + 2] = r * Math.cos(v);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: initAccent,
      size: 0.75,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // --- CONNECTION LINES ---
    const lineVertices: number[] = [];
    for (let i = 0; i < 200; i++) {
      const a = Math.floor(Math.random() * particleCount) * 3;
      const b = Math.floor(Math.random() * particleCount) * 3;
      const dx = positions[a] - positions[b];
      const dy = positions[a + 1] - positions[b + 1];
      const dz = positions[a + 2] - positions[b + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 45) {
        lineVertices.push(
          positions[a], positions[a + 1], positions[a + 2],
          positions[b], positions[b + 1], positions[b + 2]
        );
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVertices), 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: initAccent,
      transparent: true,
      opacity: 0.07,
    });
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(connectionLines);

    // --- FLOATING CARD PLANES ---
    const cardDefinitions = [
      [-36, 14, -18, 0.1, 0.35],
      [33, -9, -14, -0.2, -0.4],
      [-30, -18, -28, 0.3, 0.2],
      [37, 18, -22, -0.1, 0.5],
      [5, 28, -20, 0.4, 0.1],
      [-12, -28, -17, -0.25, 0.3],
      [-42, 5, -35, 0.2, -0.25],
      [28, -22, -30, -0.3, 0.15],
      [-8, 32, -32, 0.15, 0.45],
    ];
    const floaters: Array<{ mesh: THREE.Mesh; line: THREE.LineSegments; baseHeight: number; speed: number; phase: number }> = [];

    cardDefinitions.forEach(([x, y, z, rx, ry]) => {
      const planeGeo = new THREE.PlaneGeometry(11, 7);
      const planeMat = new THREE.MeshBasicMaterial({
        color: initBg2,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.set(x, y, z);
      planeMesh.rotation.x = rx;
      planeMesh.rotation.y = ry;

      const edges = new THREE.EdgesGeometry(planeGeo);
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: initAccent, transparent: true, opacity: 0.28 })
      );
      planeMesh.add(edgeLine);
      scene.add(planeMesh);

      floaters.push({
        mesh: planeMesh,
        line: edgeLine,
        baseHeight: y,
        speed: 0.25 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    });

    // --- GRID HELPER ---
    const gridHelper = new THREE.GridHelper(220, 28, initAccent, isDark ? 0x1c1e28 : 0xede0f7);
    gridHelper.position.y = -36;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.1;
    scene.add(gridHelper);

    // --- MOUSE TRACKING ---
    let mx = 0, my = 0, cx = 0, cy = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- SCROLL TRACKING ---
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    // --- THEME MONITOR EFFECT ---
    const checkThemeUpdates = setInterval(() => {
      const isDarkActive = themeRef.current === 'dark';
      const targetColor = getHexColor('--bg', isDarkActive ? 0x0b0c10 : 0xfdf7ff);
      const targetAccent = getHexColor('--neon', isDarkActive ? 0x10b981 : 0x7c3aed);
      const targetBg2 = getHexColor('--bg2', isDarkActive ? 0x14161d : 0xffffff);
      
      // Update background and core colors dynamically
      renderer.setClearColor(targetColor, 1);
      if (scene.fog) {
        (scene.fog as THREE.FogExp2).color.setHex(targetColor);
      }
      coreMat.color.setHex(targetColor);

      // Dynamic accent colors based on theme
      icoMat.color.setHex(targetAccent);
      r1Mat.color.setHex(targetAccent);
      r2Mat.color.setHex(targetAccent);
      r3Mat.color.setHex(targetAccent);
      particleMat.color.setHex(targetAccent);
      lineMat.color.setHex(targetAccent);
      
      // Update glow sprite color & visibility
      spriteMat.color.setHex(targetAccent);
      glowSprite.visible = isDarkActive;

      // Adapt Grid helper colors slightly
      const gridMat = gridHelper.material as THREE.LineBasicMaterial;
      gridMat.color.setHex(targetAccent);
      
      // Update floater card background and border colors slightly based on theme
      floaters.forEach(f => {
        const floaterMat = f.mesh.material as THREE.MeshBasicMaterial;
        floaterMat.color.setHex(targetBg2);
        floaterMat.opacity = isDarkActive ? 0.55 : 0.8;

        const edgeMat = f.line.material as THREE.LineBasicMaterial;
        edgeMat.color.setHex(targetAccent);
      });
    }, 100);

    // --- ANIMATE TICK ---
    let frameId: number;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const time = Date.now() * 0.001;

      // Keep the world centered perfectly in the background
      const offsetX = 0;
      icoMesh.position.x = offsetX;
      coreMesh.position.x = offsetX;
      glowSprite.position.x = offsetX;
      r1.position.x = offsetX;
      r2.position.x = offsetX;
      r3.position.x = offsetX;

      // Spin central components
      icoMesh.rotation.x = time * 0.07;
      icoMesh.rotation.y = time * 0.11;
      coreMesh.rotation.copy(icoMesh.rotation);

      r1.rotation.z = time * 0.04;
      r2.rotation.y = time * 0.06;
      r2.rotation.z = time * 0.03;
      r3.rotation.x = time * 0.05;
      r3.rotation.z = -time * 0.04;

      particlePoints.rotation.y = time * 0.015;
      connectionLines.rotation.y = time * 0.015;

      // Float planes
      floaters.forEach((f) => {
        f.mesh.position.y = f.baseHeight + Math.sin(time * f.speed + f.phase) * 2.2;
        f.mesh.rotation.z = Math.sin(time * 0.25 + f.phase) * 0.06;
      });

      // Smooth camera interpolation
      cx += (mx * 9 - cx) * 0.045;
      cy += (my * 5 - cy) * 0.045;
      camera.position.x = cx;
      camera.position.y = cy - scrollY * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      clearInterval(checkThemeUpdates);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);

      // Dispose resources
      icoGeo.dispose();
      icoMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      spriteMat.dispose();
      r1Mat.dispose();
      r2Mat.dispose();
      r3Mat.dispose();
      
      floaters.forEach(f => {
        f.mesh.geometry.dispose();
        (f.mesh.material as THREE.Material).dispose();
        f.line.geometry.dispose();
        (f.line.material as THREE.Material).dispose();
      });
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 block pointer-events-none" 
    />
  );
}
