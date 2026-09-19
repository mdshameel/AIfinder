import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SearchGlass3DProps {
  onEnterApp: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const SearchGlass3D: React.FC<SearchGlass3DProps> = ({
  onEnterApp,
  onSelectPrompt,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onEnterAppRef = useRef(onEnterApp);
  const onSelectPromptRef = useRef(onSelectPrompt);

  onEnterAppRef.current = onEnterApp;
  onSelectPromptRef.current = onSelectPrompt;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0x2563eb, 2.0);
    dirLight1.position.set(12, 14, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.2);
    dirLight2.position.set(-14, -10, 8);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0x1d4ed8, 0.8);
    dirLight3.position.set(0, 15, -10);
    scene.add(dirLight3);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. CENTERPIECE: PERFECT 3D MAGNIFYING SEARCH GLASS ---
    const glassGroup = new THREE.Group();
    mainGroup.add(glassGroup);

    // Lens outer radius is 2.3
    const lensRadius = 2.3;

    // Outer rim of the magnifying glass
    const rimGeo = new THREE.TorusGeometry(lensRadius, 0.14, 32, 100);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.2,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    glassGroup.add(rimMesh);

    // Thin outer neon/accent bezel ring
    const accentRingGeo = new THREE.TorusGeometry(lensRadius + 0.24, 0.035, 16, 100);
    const accentRingMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.4,
      roughness: 0.2,
      transparent: true,
      opacity: 0.75,
    });
    const accentRing = new THREE.Mesh(accentRingGeo, accentRingMat);
    glassGroup.add(accentRing);

    // Magnifying Glass Convex Lens disc
    const lensGeo = new THREE.CylinderGeometry(lensRadius - 0.05, lensRadius - 0.05, 0.1, 48);
    const lensMat = new THREE.MeshPhongMaterial({
      color: 0xdbeafe,
      emissive: 0x2563eb,
      emissiveIntensity: 0.18,
      shininess: 100,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.rotation.x = Math.PI / 2;
    glassGroup.add(lensMesh);

    // Internal glowing faceted blue 8-point compass star inside the lens
    const starGeo = new THREE.OctahedronGeometry(0.85, 0);
    const starMat = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.5,
      shininess: 100,
      flatShading: true,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    glassGroup.add(starMesh);

    const starWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(starGeo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    starMesh.add(starWire);

    // Reticle crosshair inside search glass
    const reticleMat = new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.55 });
    const reticleGeoX = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.3, 0, 0),
      new THREE.Vector3(1.3, 0, 0),
    ]);
    const reticleGeoY = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.3, 0),
      new THREE.Vector3(0, 1.3, 0),
    ]);
    glassGroup.add(new THREE.LineSegments(reticleGeoX, reticleMat));
    glassGroup.add(new THREE.LineSegments(reticleGeoY, reticleMat));

    // --- ROBUST, SEAMLESS HANDLE CONSTRUCTION ---
    const handleGroup = new THREE.Group();
    handleGroup.rotation.z = -Math.PI / 4;

    const bracketGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.35, 24);
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.2,
    });
    const bracketMesh = new THREE.Mesh(bracketGeo, bracketMat);
    bracketMesh.position.y = -(lensRadius + 0.12);
    handleGroup.add(bracketMesh);

    const ferruleGeo = new THREE.CylinderGeometry(0.2, 0.23, 0.5, 24);
    const ferruleMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.75,
      roughness: 0.2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
    });
    const ferruleMesh = new THREE.Mesh(ferruleGeo, ferruleMat);
    ferruleMesh.position.y = -(lensRadius + 0.5);
    handleGroup.add(ferruleMesh);

    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.21, 2.0, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.45,
      roughness: 0.35,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = -(lensRadius + 1.7);
    handleGroup.add(bodyMesh);

    for (let i = 0; i < 3; i++) {
      const ringGripGeo = new THREE.TorusGeometry(0.255, 0.02, 16, 32);
      const ringGripMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.5,
        roughness: 0.2,
      });
      const ringGrip = new THREE.Mesh(ringGripGeo, ringGripMat);
      ringGrip.rotation.x = Math.PI / 2;
      ringGrip.position.y = -(lensRadius + 1.3 + i * 0.35);
      handleGroup.add(ringGrip);
    }

    const capGeo = new THREE.SphereGeometry(0.24, 24, 16);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.2,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = -(lensRadius + 2.75);
    handleGroup.add(capMesh);

    glassGroup.add(handleGroup);

    // --- 2. ORBITING AI MODEL NODES (BALANCED CONSTELLATION) ---
    const modelsData = [
      {
        name: 'Lovable',
        color: 0x3b82f6,
        radius: 5.4,
        angle: 0.1,
        y: 1.6,
        speed: 0.007,
        prompt: 'I want to build a full-stack web app with authentication and a database',
      },
      {
        name: 'Cursor',
        color: 0x2563eb,
        radius: 5.0,
        angle: 0.9,
        y: -1.8,
        speed: 0.006,
        prompt: 'AI code editor with multi-file edits and terminal assistance',
      },
      {
        name: 'Claude 3.5',
        color: 0x475569,
        radius: 6.2,
        angle: 1.8,
        y: 1.9,
        speed: 0.0055,
        prompt: 'Frontier AI model for long-form synthesis and code reasoning',
      },
      {
        name: 'ElevenLabs',
        color: 0x0284c7,
        radius: 5.6,
        angle: 2.7,
        y: -1.7,
        speed: 0.008,
        prompt: 'Voice synthesis, emotional voice cloning, and audio localization',
      },
      {
        name: 'Midjourney',
        color: 0x6366f1,
        radius: 6.4,
        angle: 3.5,
        y: 1.2,
        speed: 0.0065,
        prompt: 'Photorealistic cinematic video and high-detail images',
      },
      {
        name: 'Perplexity',
        color: 0x0ea5e9,
        radius: 5.2,
        angle: 4.3,
        y: -1.4,
        speed: 0.0075,
        prompt: 'Real-time research search engine with cited web sources',
      },
      {
        name: 'v0 / Vercel',
        color: 0x0f172a,
        radius: 5.8,
        angle: 5.0,
        y: 2.2,
        speed: 0.006,
        prompt: 'Generate React and Next.js frontend UI components',
      },
      {
        name: 'Runway Gen-3',
        color: 0x8b5cf6,
        radius: 6.5,
        angle: 5.8,
        y: -2.1,
        speed: 0.005,
        prompt: 'AI video generation and motion graphics tool',
      },
    ];

    // Helper to create crisp labels for 3D boxes
    function createLabelTexture(text: string) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 104;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 104);
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#18181b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 140, 52);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    const nodeMeshes: {
      group: THREE.Group;
      boxMesh: THREE.Mesh;
      data: (typeof modelsData)[0];
    }[] = [];

    modelsData.forEach((m) => {
      const nodeGroup = new THREE.Group();

      // 3D Glass capsule module with text label on the front face
      const boxGeo = new THREE.BoxGeometry(1.35, 0.54, 0.15);
      const labelTexture = createLabelTexture(m.name);

      const frontMat = new THREE.MeshPhongMaterial({
        map: labelTexture,
        shininess: 80,
        transparent: true,
        opacity: 0.95,
      });

      const bodyMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: m.color,
        emissiveIntensity: 0.22,
        shininess: 90,
        transparent: true,
        opacity: 0.9,
      });

      // Materials array for BoxGeometry: [right, left, top, bottom, front, back]
      const boxMaterials = [bodyMat, bodyMat, bodyMat, bodyMat, frontMat, bodyMat];

      const box = new THREE.Mesh(boxGeo, boxMaterials);
      box.userData = { isNode: true, prompt: m.prompt, name: m.name };
      nodeGroup.add(box);

      // Border outline
      const edges = new THREE.EdgesGeometry(boxGeo);
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: m.color, transparent: true, opacity: 0.85 })
      );
      nodeGroup.add(edgeLine);

      // Status sphere node pip
      const pipGeo = new THREE.SphereGeometry(0.09, 14, 14);
      const pipMat = new THREE.MeshBasicMaterial({ color: m.color });
      const pip = new THREE.Mesh(pipGeo, pipMat);
      pip.position.set(-0.46, 0, 0.1);
      nodeGroup.add(pip);

      mainGroup.add(nodeGroup);
      nodeMeshes.push({ group: nodeGroup, boxMesh: box, data: m });
    });

    // Tag the center glass for raycasting clicks
    lensMesh.userData = { isCenterGlass: true };
    rimMesh.userData = { isCenterGlass: true };

    // --- 3. DYNAMIC INTERCONNECTING LINES ---
    const MAX_LINES = 40;
    const linePositions = new Float32Array(MAX_LINES * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.42,
      })
    );
    mainGroup.add(lineMat);

    // Secondary model-to-model interconnect lattice lines
    const latticePositions = new Float32Array(modelsData.length * 6);
    const latticeGeo = new THREE.BufferGeometry();
    latticeGeo.setAttribute('position', new THREE.BufferAttribute(latticePositions, 3));
    const latticeMat = new THREE.LineSegments(
      latticeGeo,
      new THREE.LineBasicMaterial({
        color: 0xc7d2fe,
        transparent: true,
        opacity: 0.3,
      })
    );
    mainGroup.add(latticeMat);

    // --- 4. AMBIENT DATA PARTICLES ---
    const pCount = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPos: number[] = [];
    for (let i = 0; i < pCount; i++) {
      const r = 3.5 + Math.random() * 5.5;
      const th = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6.5;
      pPos.push(Math.cos(th) * r, y, Math.sin(th) * r);
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.11,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(pGeo, pMat);
    mainGroup.add(particles);

    // Parallax Pointer Tracking & Raycasting
    let targetRotY = 0;
    let targetRotX = 0;
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2(-999, -999);

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.42;
      targetRotX = -y * 0.32;
      mousePos.set(x, y);

      // Check cursor hovering
      raycaster.setFromCamera(mousePos, camera);
      const interactables = [lensMesh, rimMesh, ...nodeMeshes.map((n) => n.boxMesh)];
      const hits = raycaster.intersectObjects(interactables);
      if (hits.length > 0) {
        container!.style.cursor = 'pointer';
      } else {
        container!.style.cursor = 'default';
      }
    }

    function onClick(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const interactables = [lensMesh, rimMesh, ...nodeMeshes.map((n) => n.boxMesh)];
      const hits = raycaster.intersectObjects(interactables);
      if (hits.length > 0) {
        const hit = hits[0].object;
        if (hit.userData?.isCenterGlass) {
          onEnterAppRef.current();
        } else if (hit.userData?.isNode && hit.userData?.prompt) {
          onSelectPromptRef.current(hit.userData.prompt);
        }
      }
    }

    function onResize() {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera / mainGroup inertia
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

      // Search glass gentle float, subtle hover tilt, and star rotation
      glassGroup.position.y = Math.sin(elapsed * 1.6) * 0.15;
      glassGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
      glassGroup.rotation.y = Math.cos(elapsed * 0.7) * 0.08;

      starMesh.rotation.y = elapsed * 0.5;
      starMesh.rotation.x = Math.sin(elapsed * 0.6) * 0.25;
      const pulse = 1.0 + Math.sin(elapsed * 3.0) * 0.08;
      starMesh.scale.set(pulse, pulse, pulse);

      // Position orbiting models
      const centerPos = glassGroup.position;
      const posArr = lineMat.geometry.attributes.position.array as Float32Array;
      let lineIdx = 0;

      for (let i = 0; i < nodeMeshes.length; i++) {
        const item = nodeMeshes[i];
        const m = item.data;
        const curAngle = m.angle + elapsed * m.speed * 20.0;
        const cx = Math.cos(curAngle) * m.radius;
        const cz = Math.sin(curAngle) * m.radius;
        const cy = m.y + Math.sin(elapsed * 1.8 + i) * 0.35;

        item.group.position.set(cx, cy, cz);
        item.group.lookAt(camera.position);

        // Line from center search glass to each AI model
        posArr[lineIdx++] = centerPos.x;
        posArr[lineIdx++] = centerPos.y;
        posArr[lineIdx++] = centerPos.z;
        posArr[lineIdx++] = cx;
        posArr[lineIdx++] = cy;
        posArr[lineIdx++] = cz;
      }

      // Ring connections between adjacent models
      const latArr = latticeMat.geometry.attributes.position.array as Float32Array;
      let latIdx = 0;
      for (let i = 0; i < nodeMeshes.length; i++) {
        const nextIdx = (i + 1) % nodeMeshes.length;
        const p1 = nodeMeshes[i].group.position;
        const p2 = nodeMeshes[nextIdx].group.position;

        latArr[latIdx++] = p1.x;
        latArr[latIdx++] = p1.y;
        latArr[latIdx++] = p1.z;
        latArr[latIdx++] = p2.x;
        latArr[latIdx++] = p2.y;
        latArr[latIdx++] = p2.z;
      }

      lineMat.geometry.attributes.position.needsUpdate = true;
      latticeMat.geometry.attributes.position.needsUpdate = true;

      // Particle drift
      particles.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="threejs-container-ANIMATION_25"
      className="w-full h-[520px] sm:h-[580px] relative select-none"
      style={{ display: 'block' }}
    />
  );
};
