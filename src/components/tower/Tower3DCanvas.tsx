import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { TowerUnit } from '../../types/accounting';
import { RotateCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface Tower3DCanvasProps {
  units: TowerUnit[];
  selectedUnit: TowerUnit | null;
  onSelectUnit: (unit: TowerUnit) => void;
  statusFilter: 'All' | 'Sold' | 'Partial' | 'Vacant';
}

export const Tower3DCanvas: React.FC<Tower3DCanvasProps> = ({
  units,
  selectedUnit,
  onSelectUnit,
  statusFilter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  // References for Three.js cleanup and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const unitMeshesRef = useRef<{ mesh: THREE.Mesh; unit: TowerUnit }[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 380;
    const height = 440;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      console.warn('WebGL is not available in this environment:', err);
      setHasWebGlError(true);
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FAF9F6'); // Matches app light theme

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(24, 28, 30);
    camera.lookAt(0, 12, 0);
    cameraRef.current = camera;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(30, 50, 40);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const softFillLight = new THREE.DirectionalLight(0xe0f2fe, 0.5);
    softFillLight.position.set(-30, 20, -30);
    scene.add(softFillLight);

    // 5. Tower Group
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);
    groupRef.current = towerGroup;

    // Base Ground Podium
    const baseGeo = new THREE.BoxGeometry(14, 1.2, 14);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.6;
    towerGroup.add(baseMesh);

    // Spire / Crown at Top
    const spireGeo = new THREE.ConeGeometry(1.5, 6, 4);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Gold architectural spire
      metalness: 0.8,
      roughness: 0.2,
    });
    const spireMesh = new THREE.Mesh(spireGeo, spireMat);
    spireMesh.position.y = 31;
    towerGroup.add(spireMesh);

    // 6. Build Floors & Units
    unitMeshesRef.current = [];

    // Group units by floor
    const floorsMap = new Map<number, TowerUnit[]>();
    units.forEach(u => {
      const arr = floorsMap.get(u.floor) || [];
      arr.push(u);
      floorsMap.set(u.floor, arr);
    });

    const sortedFloors = Array.from(floorsMap.keys()).sort((a, b) => a - b);

    sortedFloors.forEach((floorNum, fIdx) => {
      const floorUnits = floorsMap.get(floorNum) || [];
      const yPos = 1.6 + fIdx * 1.8;

      // Slab separator
      const slabGeo = new THREE.BoxGeometry(10.5, 0.15, 10.5);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.6,
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.y = yPos;
      towerGroup.add(slabMesh);

      // Floor Unit blocks
      floorUnits.forEach((unit, uIdx) => {
        let uColor = 0x94a3b8; // Default Vacant
        let opacity = 0.9;
        const isSold = unit.status === 'Sold' || unit.status === 'HandedOver';
        const isPartial = unit.status === 'Reserved';

        if (isSold) {
          uColor = 0x059669; // Emerald green
        } else if (isPartial) {
          uColor = 0xd97706; // Amber
        } else {
          uColor = 0x38bdf8; // Blue/Slate for Available
        }

        // Apply status filter transparency
        let isHighlighted = true;
        if (statusFilter === 'Sold' && !isSold) isHighlighted = false;
        if (statusFilter === 'Partial' && !isPartial) isHighlighted = false;
        if (statusFilter === 'Vacant' && (isSold || isPartial)) isHighlighted = false;

        if (!isHighlighted) {
          opacity = 0.15;
          uColor = 0xcccccc;
        }

        // Unit size & quadrant positioning
        const uWidth = floorUnits.length <= 2 ? 8.5 : 4.4;
        const uDepth = floorUnits.length <= 2 ? 4.4 : 4.4;
        const uGeo = new THREE.BoxGeometry(uWidth, 1.45, uDepth);
        const uMat = new THREE.MeshStandardMaterial({
          color: uColor,
          roughness: 0.3,
          metalness: isSold ? 0.2 : 0.1,
          transparent: opacity < 1,
          opacity: opacity,
        });

        const mesh = new THREE.Mesh(uGeo, uMat);

        // Position by quadrant
        let xOffset = 0;
        let zOffset = 0;
        if (floorUnits.length === 4) {
          xOffset = (uIdx % 2 === 0 ? -1 : 1) * 2.4;
          zOffset = (uIdx < 2 ? -1 : 1) * 2.4;
        } else if (floorUnits.length === 2) {
          zOffset = (uIdx === 0 ? -1 : 1) * 2.4;
        }

        mesh.position.set(xOffset, yPos + 0.8, zOffset);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        (mesh as any).unitData = unit;

        towerGroup.add(mesh);
        unitMeshesRef.current.push({ mesh, unit });
      });
    });

    // 7. Interaction: Drag to Rotate & Raycast Tap
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let hasMoved = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      hasMoved = false;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
      setIsAutoRotating(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) hasMoved = true;

      if (towerGroup) {
        towerGroup.rotation.y += deltaX * 0.008;
      }
      if (camera) {
        camera.position.y = Math.max(8, Math.min(45, camera.position.y + deltaY * 0.1));
        camera.lookAt(0, 14, 0);
      }
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
      if (!hasMoved) {
        // Handle Unit Tap Raycast
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const meshes = unitMeshesRef.current.map(item => item.mesh);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as any;
          if (clickedMesh.unitData) {
            onSelectUnit(clickedMesh.unitData);
          }
        }
      }
    };

    // Touch Support for Mobile Ergonomics
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        hasMoved = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        previousMouseX = touchStartX;
        previousMouseY = touchStartY;
        setIsAutoRotating(false);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) hasMoved = true;

      if (towerGroup) {
        towerGroup.rotation.y += deltaX * 0.01;
      }
      if (camera) {
        camera.position.y = Math.max(8, Math.min(45, camera.position.y + deltaY * 0.12));
        camera.lookAt(0, 14, 0);
      }
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      isDragging = false;
      if (!hasMoved && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((touch.clientX - rect.left) / rect.width) * 2 - 1,
          -((touch.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const meshes = unitMeshesRef.current.map(item => item.mesh);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as any;
          if (clickedMesh.unitData) {
            onSelectUnit(clickedMesh.unitData);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (camera) {
        camera.position.z = Math.max(16, Math.min(55, camera.position.z + e.deltaY * 0.03));
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    domElem.addEventListener('touchmove', onTouchMove, { passive: true });
    domElem.addEventListener('touchend', onTouchEnd);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isAutoRotating && towerGroup) {
        towerGroup.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      domElem.removeEventListener('touchmove', onTouchMove);
      domElem.removeEventListener('touchend', onTouchEnd);
      domElem.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [units, statusFilter, isAutoRotating]);

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    camera.position.z = Math.max(16, Math.min(50, camera.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !groupRef.current) return;
    cameraRef.current.position.set(24, 28, 30);
    cameraRef.current.lookAt(0, 12, 0);
    groupRef.current.rotation.y = 0;
    setIsAutoRotating(true);
  };

  if (hasWebGlError) {
    return (
      <div className="w-full h-72 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2 font-bold">
          3D
        </div>
        <p className="text-xs font-bold text-slate-800">3D View Not Supported On This Browser</p>
        <p className="text-[11px] text-slate-500 mt-1">Please use the 2D Facade or Unit Cards tab to inspect tower units.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#FAF9F6] border border-slate-200/80 shadow-card">
      {/* 3D Canvas mount container */}
      <div ref={containerRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => handleZoom(-4)}
          title="Zoom In"
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 pressable"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(4)}
          title="Zoom Out"
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 pressable"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}
          className={`w-8 h-8 rounded-full backdrop-blur-xs border shadow-sm flex items-center justify-center pressable ${
            isAutoRotating ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-white/90 text-slate-700 border-slate-200'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 pressable"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Gesture Hint Pill */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 shadow-xs pointer-events-none">
        👆 Drag to rotate 360° • Tap unit to inspect
      </div>
    </div>
  );
};
