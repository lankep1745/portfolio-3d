import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Cinematic Interstellar Gargantua Space Scene
 * - Procedural Plasma Accretion Disk (GLSL Simplex/FBM Noise in Molten Gold/Burnt Orange)
 * - 5,000 Keplerian Vortex Particles in real-time differential orbit
 * - Pitch-black Event Horizon, Photon Ring, and Gravitational Lensing Arc
 * - Continuously drifting 3,800+ starfield with forward warp drift & twinkle
 * - Floating golden bokeh space dust / embers in foreground & midground
 * - Atmospheric deep-space volumetric nebula backdrop (#070B18 midnight blue & dark amber)
 * - 60 FPS active continuous animation loop with silky smooth mouse parallax
 * - Station cosmic landmarks & 3D gravity shockwave ripples on click
 */
export default function SpaceCanvas({ scrollProgress, cursorCoords, onClickRipple, velocity = 0 }) {
  const mountRef = useRef(null);
  const sceneStateRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  const velocityRef = useRef(velocity);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Keep refs synchronized without recreating the scene
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    // Convert screen coordinates to Normalized Device Coordinates [-1, 1]
    const ndcX = (cursorCoords.x / window.innerWidth) * 2 - 1;
    const ndcY = -(cursorCoords.y / window.innerHeight) * 2 + 1;
    mouseRef.current = { x: ndcX, y: ndcY };
  }, [cursorCoords]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030408, 0.0035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1200);
    camera.position.set(0, 0, 48);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- 2. Lights ---
    const ambientLight = new THREE.AmbientLight(0x0e1220, 1.5);
    scene.add(ambientLight);

    const cursorPointLight = new THREE.PointLight(0xF5B041, 3.0, 75, 1.2);
    cursorPointLight.position.set(0, 0, 35);
    scene.add(cursorPointLight);

    // --- 3. VOLUMETRIC DEEP-SPACE NEBULA BACKDROP ---
    // Large background dome plane to create atmospheric depth instead of flat black
    const nebulaGeo = new THREE.PlaneGeometry(360, 240, 1, 1);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        // Fast 2D hash & noise for nebula gas
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 3; i++) {
            v += a * noise(p);
            p *= 2.02;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          float dist = length(uv);

          // Deep space midnight blue and faint warm dark amber glow
          vec3 colVoid = vec3(0.012, 0.015, 0.032);     // #030408 base
          vec3 colMidnight = vec3(0.028, 0.045, 0.095); // Deep midnight blue #070B18
          vec3 colAmber = vec3(0.12, 0.065, 0.015);     // Faint warm dark amber

          float n1 = fbm(uv * 1.4 + vec2(uTime * 0.015, -uTime * 0.01));
          float n2 = fbm(uv * 2.2 - vec2(uTime * 0.012, uTime * 0.015));

          vec3 finalColor = mix(colVoid, colMidnight, n1 * 0.85);
          finalColor = mix(finalColor, colAmber, pow(n2, 2.2) * 0.65);

          // Darken edges to keep contrast focused
          float vignette = smoothstep(1.5, 0.2, dist);
          gl_FragColor = vec4(finalColor * vignette, 0.75);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.position.set(0, 0, -110);
    scene.add(nebulaMesh);

    // --- 4. DRIFTING & TWINKLING STARFIELD (3,800+ Stars) ---
    const starCount = 3800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starAlphas = new Float32Array(starCount);
    const starRand = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Cylindrical/spherical volume surrounding the camera path
      starPositions[i3] = (Math.random() - 0.5) * 320;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 240;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 400; // Multi-depth Z spread

      starSizes[i] = Math.random() * 2.6 + 1.2;
      starAlphas[i] = Math.random() * 0.65 + 0.35;
      starRand[i] = Math.random();
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(starAlphas, 1));
    starGeometry.setAttribute('aRand', new THREE.BufferAttribute(starRand, 1));

    const starfieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorGold: { value: new THREE.Color(0xF5B041) },
        uColorStarlight: { value: new THREE.Color(0xF4F6FA) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        attribute float aRand;
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vAlpha;
        varying float vGoldFactor;

        void main() {
          vec3 pos = position;

          // Continuous gentle forward interstellar drift toward the camera
          // Loops seamlessly along the 400-unit Z depth
          float zOffset = mod(pos.z + uTime * 4.5, 400.0) - 200.0;
          pos.z = zOffset;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Project to Normalized Device Coordinates for cursor gravitational lensing
          vec4 proj = projectionMatrix * mvPosition;
          vec2 screenPos = proj.xy / proj.w;
          float mouseDist = length(screenPos - uMouse);
          
          // Subtle gravitational attraction toward mouse cursor
          float lensStrength = smoothstep(0.65, 0.0, mouseDist);
          pos.xy += normalize(pos.xy + 0.0001) * (lensStrength * 2.2);

          mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Subtle twinkle per star
          float twinkle = sin(uTime * 2.8 + aRand * 6.28) * 0.35 + 0.65;
          float size = aSize * (1.0 + lensStrength * 1.5) * (180.0 / -mvPosition.z) * twinkle;
          gl_PointSize = clamp(size, 1.2, 7.0);

          vAlpha = aAlpha * (0.8 + lensStrength * 0.5);
          vGoldFactor = lensStrength;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorGold;
        uniform vec3 uColorStarlight;
        varying float vAlpha;
        varying float vGoldFactor;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float intensity = pow(1.0 - dist * 2.0, 2.0);
          vec3 finalColor = mix(uColorStarlight, uColorGold, clamp(vGoldFactor * 1.5, 0.0, 1.0));

          gl_FragColor = vec4(finalColor, vAlpha * intensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starfield = new THREE.Points(starGeometry, starfieldMaterial);
    scene.add(starfield);

    // --- 5. FLOATING GOLDEN EMBERS / SPACE DUST (3D Foreground & Midground Parallax) ---
    const emberCount = 380;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberSizes = new Float32Array(emberCount);
    const emberOffsets = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      const i3 = i * 3;
      // Close to camera for rich floating bokeh depth
      emberPositions[i3] = (Math.random() - 0.5) * 160;
      emberPositions[i3 + 1] = (Math.random() - 0.5) * 120;
      emberPositions[i3 + 2] = -40 + Math.random() * 85;

      emberSizes[i] = Math.random() * 3.5 + 2.0;
      emberOffsets[i3] = Math.random() * 10;
      emberOffsets[i3 + 1] = Math.random() * 10;
      emberOffsets[i3 + 2] = Math.random() * 10;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    emberGeo.setAttribute('aSize', new THREE.BufferAttribute(emberSizes, 1));
    emberGeo.setAttribute('aOffset', new THREE.BufferAttribute(emberOffsets, 3));

    const emberMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aOffset;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          // Organic Brownian floating motion
          pos.x += sin(uTime * 0.35 + aOffset.x) * 2.2;
          pos.y += cos(uTime * 0.45 + aOffset.y) * 1.8;
          pos.z += sin(uTime * 0.25 + aOffset.z) * 2.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float pulse = sin(uTime * 1.8 + aOffset.x) * 0.3 + 0.7;
          gl_PointSize = clamp(aSize * pulse * (160.0 / -mvPosition.z), 1.5, 9.0);
          vAlpha = 0.45 * pulse;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float intensity = pow(1.0 - d * 2.0, 2.2);
          vec3 color = vec3(0.98, 0.75, 0.32); // Warm golden ember
          gl_FragColor = vec4(color, vAlpha * intensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const embers = new THREE.Points(emberGeo, emberMat);
    scene.add(embers);

    // --- 6. CINEMATIC SWIRLING GARGANTUA BLACK HOLE (HERO LANDMARK) ---
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.position.set(0, 2.5, -14);
    // Iconic 22-degree tilt framing
    blackHoleGroup.rotation.x = 0.38;
    blackHoleGroup.rotation.z = -0.16;

    // 6a. Pitch-Black Event Horizon
    const horizonGeo = new THREE.SphereGeometry(6.2, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    blackHoleGroup.add(horizonMesh);

    // 6b. Bright Golden Photon Ring (Crisp razor-thin rim around horizon)
    const photonRingGeo = new THREE.TorusGeometry(6.32, 0.045, 16, 128);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xFFE4A0,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    photonRing.rotation.x = Math.PI / 2;
    blackHoleGroup.add(photonRing);

    // 6c. Fresnel Gravitational Lensing Corona Halo
    const haloGeo = new THREE.SphereGeometry(6.42, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xF5B041) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
          float glow = pow(rim, 3.8);
          gl_FragColor = vec4(uColor * 1.2, glow * 0.55);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    blackHoleGroup.add(haloMesh);

    // 6d. LAYER A: PROCEDURAL VOLUMETRIC PLASMA ACCRETION DISK (Animated Simplex FBM Noise Mesh)
    // Wide continuous glowing plasma disk
    const diskMeshGeo = new THREE.RingGeometry(6.4, 25.0, 160, 64);
    const diskMeshMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPos;

        // GLSL Simplex Noise 2D
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float fbm(vec2 p) {
          float total = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 3; i++) {
            total += snoise(p) * amp;
            p *= 2.05;
            amp *= 0.5;
          }
          return total;
        }

        void main() {
          // Polar coordinates around the black hole center
          float r = length(vPos.xy);
          float theta = atan(vPos.y, vPos.x);

          // Keplerian differential swirl: inner plasma rotates much faster than outer
          float angularSpeed = 16.0 / (sqrt(r) + 0.5);
          float swirlAngle = theta + uTime * angularSpeed * 0.14;

          // Multi-frequency noise sampling in swirling polar space
          vec2 noiseCoord1 = vec2(swirlAngle * 2.8, r * 0.7);
          vec2 noiseCoord2 = vec2(swirlAngle * 4.5, r * 1.3 - uTime * 0.2);
          float n1 = fbm(noiseCoord1);
          float n2 = snoise(noiseCoord2);
          float combinedNoise = clamp(n1 * 0.7 + n2 * 0.3 + 0.25, 0.0, 1.0);

          // Rich Molten Gold, Burnt Orange, and Amber Palette
          vec3 colDarkAmber  = vec3(0.55, 0.22, 0.02); // #8C3805
          vec3 colBurntOrange = vec3(1.00, 0.45, 0.00); // #FF7300
          vec3 colMoltenGold  = vec3(0.96, 0.72, 0.22); // #F5B838
          vec3 colHotWhiteGold = vec3(1.00, 0.92, 0.65); // #FFEBB0

          // Smooth radial boundaries
          float innerEdge = smoothstep(6.4, 7.8, r);
          float outerEdge = smoothstep(25.0, 14.0, r);
          float radialMask = innerEdge * outerEdge;

          // Relativistic Doppler beaming effect (approaching plasma is brighter)
          float doppler = 1.0 + (-sin(theta) * 0.35);

          // Color blending based on radial depth and noise
          vec3 plasmaCol = mix(colDarkAmber, colBurntOrange, combinedNoise);
          plasmaCol = mix(plasmaCol, colMoltenGold, clamp(combinedNoise * 1.4 - 0.2, 0.0, 1.0));
          // Hot inner photon boundary
          float innerHotZone = smoothstep(11.0, 6.8, r) * innerEdge;
          plasmaCol = mix(plasmaCol, colHotWhiteGold, innerHotZone * (combinedNoise * 0.8 + 0.2));

          plasmaCol *= doppler;

          // Opacity carefully calibrated so it glows richly without washing out Hero typography
          float alpha = radialMask * (combinedNoise * 0.55 + 0.25) * 0.55;

          gl_FragColor = vec4(plasmaCol, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const diskMesh = new THREE.Mesh(diskMeshGeo, diskMeshMat);
    blackHoleGroup.add(diskMesh);

    // 6e. LAYER B: 5,000 KEPLERIAN VORTEX PARTICLES (Differential real-time orbit)
    const vortexParticleCount = 5000;
    const vortexGeo = new THREE.BufferGeometry();
    const vortexPositions = new Float32Array(vortexParticleCount * 3);
    const vortexColors = new Float32Array(vortexParticleCount * 3);
    const vortexRadii = new Float32Array(vortexParticleCount);
    const vortexAngles = new Float32Array(vortexParticleCount);
    const vortexSpeeds = new Float32Array(vortexParticleCount);

    const cP1 = new THREE.Color(0xFFE4A0); // Hot gold
    const cP2 = new THREE.Color(0xF5B041); // Event horizon gold
    const cP3 = new THREE.Color(0xFF7300); // Burnt orange

    for (let i = 0; i < vortexParticleCount; i++) {
      const r = 6.8 + Math.pow(Math.random(), 1.4) * 16.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = (18.0 / Math.sqrt(r)) * (0.85 + Math.random() * 0.3);

      vortexRadii[i] = r;
      vortexAngles[i] = angle;
      vortexSpeeds[i] = speed;

      const t = (r - 6.8) / 16.5;
      const col = new THREE.Color();
      if (t < 0.35) {
        col.lerpColors(cP1, cP2, t / 0.35);
      } else {
        col.lerpColors(cP2, cP3, (t - 0.35) / 0.65);
      }

      const zOffset = (Math.random() - 0.5) * (0.3 + t * 0.8);

      vortexPositions[i * 3] = r * Math.cos(angle);
      vortexPositions[i * 3 + 1] = r * Math.sin(angle);
      vortexPositions[i * 3 + 2] = zOffset;

      vortexColors[i * 3] = col.r;
      vortexColors[i * 3 + 1] = col.g;
      vortexColors[i * 3 + 2] = col.b;
    }

    vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
    vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));
    vortexGeo.setAttribute('aRadius', new THREE.BufferAttribute(vortexRadii, 1));
    vortexGeo.setAttribute('aAngle', new THREE.BufferAttribute(vortexAngles, 1));
    vortexGeo.setAttribute('aSpeed', new THREE.BufferAttribute(vortexSpeeds, 1));

    const vortexMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float aRadius;
        attribute float aAngle;
        attribute float aSpeed;
        attribute vec3 color;
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Keplerian differential orbit in real-time
          float currentAngle = aAngle + uTime * aSpeed * 0.16;
          vec3 pos = vec3(
            aRadius * cos(currentAngle),
            aRadius * sin(currentAngle),
            position.z + sin(currentAngle * 2.0 + uTime) * 0.15
          );

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float doppler = 1.0 + (-sin(currentAngle) * 0.28);
          float ptSize = (90.0 / -mvPosition.z) * doppler;
          gl_PointSize = clamp(ptSize, 2.0, 5.0);

          vColor = color * doppler;
          vAlpha = (smoothstep(23.0, 9.0, aRadius) * 0.25 + 0.15);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = pow(1.0 - d * 2.0, 2.2);
          gl_FragColor = vec4(vColor, vAlpha * alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const vortexPoints = new THREE.Points(vortexGeo, vortexMat);
    blackHoleGroup.add(vortexPoints);

    // 6f. LAYER C: VERTICAL GRAVITATIONAL LENSING CROSS-ARC (Iconic Interstellar polar light bend)
    const lensArcMeshGeo = new THREE.RingGeometry(6.6, 17.5, 96, 24);
    const lensArcMeshMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPos;

        void main() {
          float r = length(vPos.xy);
          float theta = atan(vPos.y, vPos.x);

          // Focus glowing arc predominantly on upper & lower poles (cos(theta * 2))
          float polarWeight = pow(abs(sin(theta)), 1.8);

          float innerEdge = smoothstep(6.6, 7.8, r);
          float outerEdge = smoothstep(17.5, 11.0, r);
          float radialMask = innerEdge * outerEdge;

          vec3 arcColor = mix(vec3(0.96, 0.69, 0.25), vec3(1.0, 0.45, 0.0), smoothstep(7.0, 16.0, r));
          float alpha = radialMask * polarWeight * 0.28;

          gl_FragColor = vec4(arcColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const lensArcMesh = new THREE.Mesh(lensArcMeshGeo, lensArcMeshMat);
    // Positioned vertically across the black hole
    lensArcMesh.rotation.y = Math.PI / 2;
    lensArcMesh.rotation.z = Math.PI / 2;
    blackHoleGroup.add(lensArcMesh);

    scene.add(blackHoleGroup);

    // --- 7. STATION COSMIC LANDMARKS ---
    // Station 01: IDENTITY - Planetary Orbital Rings & Gyroscopic Coordinate Gimbal
    const identityLandmark = new THREE.Group();
    identityLandmark.position.set(0, -60, -10);

    const ring1Geo = new THREE.TorusGeometry(8.5, 0.08, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xF5B041, transparent: true, opacity: 0.75 });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;

    const ring2Geo = new THREE.TorusGeometry(12.0, 0.06, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xFFD27D, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 4;

    const coreGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050810,
      emissive: 0xF5B041,
      emissiveIntensity: 0.4,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);

    identityLandmark.add(ring1);
    identityLandmark.add(ring2);
    identityLandmark.add(coreMesh);
    scene.add(identityLandmark);

    // Station 02: WORKS I - Pulsating Singularity Crystal & Torus Node
    const works1Landmark = new THREE.Group();
    works1Landmark.position.set(65, -60, -15);

    const crystalGeo = new THREE.OctahedronGeometry(6.0, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xF5B041,
      wireframe: true,
      emissive: 0xF5B041,
      emissiveIntensity: 0.8,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);

    const torusGeo = new THREE.TorusGeometry(10.5, 0.12, 16, 90);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0xFFD27D, wireframe: true, transparent: true, opacity: 0.6 });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = 1.1;

    works1Landmark.add(crystalMesh);
    works1Landmark.add(torusMesh);
    scene.add(works1Landmark);

    // Station 03: WORKS II - Dimensional Warp Gateway
    const works2Landmark = new THREE.Group();
    works2Landmark.position.set(130, -60, -20);

    const gateGeo = new THREE.TorusGeometry(14.0, 0.25, 24, 120);
    const gateMat = new THREE.MeshStandardMaterial({
      color: 0x111624,
      emissive: 0xF5B041,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const gateMesh = new THREE.Mesh(gateGeo, gateMat);
    gateMesh.rotation.y = 0.8;

    const innerVortexGeo = new THREE.RingGeometry(2.0, 13.5, 32);
    const innerVortexMat = new THREE.MeshBasicMaterial({
      color: 0xF5B041,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const innerVortex = new THREE.Mesh(innerVortexGeo, innerVortexMat);
    innerVortex.rotation.y = 0.8;

    works2Landmark.add(gateMesh);
    works2Landmark.add(innerVortex);
    scene.add(works2Landmark);

    // Station 04: ARSENAL - Rotating 3D Neural Lattice Polyhedron Matrix
    const arsenalLandmark = new THREE.Group();
    arsenalLandmark.position.set(130, -125, -15);

    const latticeGeo = new THREE.DodecahedronGeometry(8.5, 1);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x05070e,
      wireframe: true,
      emissive: 0xF5B041,
      emissiveIntensity: 0.6,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);

    const innerSphereGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: 0xFFD27D,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);

    arsenalLandmark.add(latticeMesh);
    arsenalLandmark.add(innerSphere);
    scene.add(arsenalLandmark);

    // Station 05: SIGNAL - Pulsar Array Beacon
    const signalLandmark = new THREE.Group();
    signalLandmark.position.set(195, -125, -10);

    const beaconGeo = new THREE.ConeGeometry(5.0, 18.0, 4);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xF5B041,
      wireframe: true,
      emissive: 0xF5B041,
      emissiveIntensity: 0.85,
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);

    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(8 + r * 4.5, 8.2 + r * 4.5, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xFFD27D,
        transparent: true,
        opacity: 0.4 - r * 0.1,
        side: THREE.DoubleSide,
      });
      const rMesh = new THREE.Mesh(ringGeo, ringMat);
      rMesh.rotation.x = Math.PI / 2;
      signalLandmark.add(rMesh);
    }
    signalLandmark.add(beaconMesh);
    scene.add(signalLandmark);

    // --- 8. GRAVITY SHOCKWAVE SYSTEM (Click Spawns) ---
    const shockwaves = [];
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.45, 64);

    const spawnShockwave = (x, y, z) => {
      const shockMat = new THREE.MeshBasicMaterial({
        color: 0xF5B041,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(shockwaveGeo, shockMat);
      mesh.position.set(x, y, z);
      mesh.rotation.x = Math.PI / 2;
      scene.add(mesh);
      shockwaves.push({ mesh, scale: 1.0, opacity: 0.95, speed: 2.2 });
    };

    // --- 9. Camera Waypoints along 6-Station Multi-Axis Trajectory ---
    const waypoints = [
      { x: 0, y: 0, z: 48, lookX: 0, lookY: 2.0, lookZ: -14 },     // 00 ORIGIN
      { x: 0, y: -60, z: 42, lookX: 0, lookY: -60, lookZ: -10 },   // 01 IDENTITY
      { x: 65, y: -60, z: 42, lookX: 65, lookY: -60, lookZ: -15 }, // 02 WORKS I
      { x: 130, y: -60, z: 42, lookX: 130, lookY: -60, lookZ: -20 },// 03 WORKS II
      { x: 130, y: -125, z: 42, lookX: 130, lookY: -125, lookZ: -15 },// 04 ARSENAL
      { x: 195, y: -125, z: 44, lookX: 195, lookY: -125, lookZ: -10 },// 05 SIGNAL
    ];

    // Smooth lerp mouse tracking values for 60fps parallax
    const smoothMouse = { x: 0, y: 0 };
    let currentFov = 50;

    // Ref to hold live state for interaction handlers
    sceneStateRef.current = {
      scene,
      camera,
      renderer,
      spawnShockwave,
      cursorPointLight,
    };

    // --- Resize Handler ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 10. ANIMATION LOOP (LOCKED 60 FPS, CONSTANT LIVING MOTION) ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update shader uniforms continuously
      nebulaMat.uniforms.uTime.value = elapsedTime;
      starfieldMaterial.uniforms.uTime.value = elapsedTime;
      emberMat.uniforms.uTime.value = elapsedTime;
      diskMeshMat.uniforms.uTime.value = elapsedTime;
      vortexMat.uniforms.uTime.value = elapsedTime;
      lensArcMeshMat.uniforms.uTime.value = elapsedTime;

      // Silky smooth mouse lerp for parallax
      smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.05;

      // Update starfield mouse uniform
      starfieldMaterial.uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);

      // --- Multi-Axis Camera Interpolation with Smooth Parallax ---
      const totalSegments = waypoints.length - 1;
      const clampedProgress = Math.max(0, Math.min(1, scrollRef.current));
      const rawIndex = clampedProgress * totalSegments;
      const segmentIndex = Math.min(Math.floor(rawIndex), totalSegments - 1);
      const segmentAlpha = rawIndex - segmentIndex;
      const easeAlpha = segmentAlpha * segmentAlpha * (3 - 2 * segmentAlpha);

      const p0 = waypoints[segmentIndex];
      const p1 = waypoints[segmentIndex + 1];

      if (p0 && p1) {
        const baseCamX = p0.x + (p1.x - p0.x) * easeAlpha;
        const baseCamY = p0.y + (p1.y - p0.y) * easeAlpha;
        const baseCamZ = p0.z + (p1.z - p0.z) * easeAlpha;

        const baseLookX = p0.lookX + (p1.lookX - p0.lookX) * easeAlpha;
        const baseLookY = p0.lookY + (p1.lookY - p0.lookY) * easeAlpha;
        const baseLookZ = p0.lookZ + (p1.lookZ - p0.lookZ) * easeAlpha;

        // Apply real-time mouse parallax shift to camera position
        const parallaxX = smoothMouse.x * 3.8;
        const parallaxY = smoothMouse.y * 2.6;

        camera.position.set(baseCamX + parallaxX, baseCamY + parallaxY, baseCamZ);
        camera.lookAt(baseLookX + parallaxX * 0.45, baseLookY + parallaxY * 0.45, baseLookZ);

        // Position dynamic point light tracking cursor
        cursorPointLight.position.set(
          camera.position.x + smoothMouse.x * 22,
          camera.position.y + smoothMouse.y * 15,
          camera.position.z - 8
        );
      }

      // Smooth velocity-based FOV warp
      const targetFov = 50 + Math.min(12, Math.abs(velocityRef.current) * 0.35);
      currentFov += (targetFov - currentFov) * 0.2;
      if (Math.abs(camera.fov - currentFov) > 0.01) {
        camera.fov = currentFov;
        camera.updateProjectionMatrix();
      }

      // --- Subtle Interactive Landmark Rotations & Black Hole Parallax Tilt ---
      blackHoleGroup.rotation.x = 0.38 + smoothMouse.y * 0.12;
      blackHoleGroup.rotation.y = elapsedTime * 0.04 + smoothMouse.x * 0.18;

      identityLandmark.rotation.y = elapsedTime * 0.12;
      identityLandmark.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
      works1Landmark.rotation.y = -elapsedTime * 0.15;
      works1Landmark.rotation.z = Math.cos(elapsedTime * 0.4) * 0.1;
      works2Landmark.rotation.y = elapsedTime * 0.08;
      arsenalLandmark.rotation.x = elapsedTime * 0.1;
      arsenalLandmark.rotation.y = elapsedTime * 0.14;
      signalLandmark.rotation.y = elapsedTime * 0.2;

      // Nebula subtle drift
      nebulaMesh.position.x = camera.position.x * 0.85;
      nebulaMesh.position.y = camera.position.y * 0.85;

      // Animate shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.scale += sw.speed;
        sw.opacity -= 0.025;
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
        sw.mesh.material.opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          shockwaves.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Trigger shockwave pulse on click
  useEffect(() => {
    if (!onClickRipple || !sceneStateRef.current) return;
    const { spawnShockwave, camera } = sceneStateRef.current;
    const ndcX = (onClickRipple.x / window.innerWidth) * 2 - 1;
    const ndcY = -(onClickRipple.y / window.innerHeight) * 2 + 1;
    spawnShockwave(
      camera.position.x + ndcX * 16,
      camera.position.y + ndcY * 12,
      camera.position.z - 15
    );
  }, [onClickRipple]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
