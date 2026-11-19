import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PORTFOLIO_DATA } from './portfolioData';
import SpaceCanvas from './components/SpaceCanvas';
import CursorCanvas from './components/CursorCanvas';
import HUD from './components/HUD';
import Stations from './components/Stations';
import ProjectModal from './components/ProjectModal';
import { audioEngine } from './utils/audio';

/**
 * Re-exporting PORTFOLIO_DATA at the very top for effortless user editing.
 */
export { PORTFOLIO_DATA };

export default function App() {
  // Virtual scroll physics state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);

  // Audio and Modal states
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mouse & Ripple interaction states
  const [cursorCoords, setCursorCoords] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [clickRipple, setClickRipple] = useState(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Physics refs
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Station Waypoint 2D Coordinates (in vw and vh)
  const stationCoords = [
    { x: 0, y: 0 },     // 00 ORIGIN
    { x: 0, y: 100 },   // 01 IDENTITY (Down)
    { x: 100, y: 100 }, // 02 WORKS I (Right)
    { x: 200, y: 100 }, // 03 WORKS II (Right)
    { x: 200, y: 200 }, // 04 ARSENAL (Down)
    { x: 300, y: 200 }, // 05 SIGNAL (Right)
  ];

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track global cursor coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Click on empty space creates a 3D gravity shockwave ripple
  const handleContainerClick = (e) => {
    // If clicking directly on a button, link, or modal, do not trigger space ripple
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('input') ||
      e.target.closest('textarea') ||
      e.target.closest('.glass-panel-glow') ||
      selectedProject
    ) {
      return;
    }

    audioEngine.playShockwave();
    setClickRipple({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
    });
  };

  // Wheel listener for Virtual Smooth Scroll (Exponential Damping Lerp)
  useEffect(() => {
    const handleWheel = (e) => {
      // Normalize wheel delta across platforms
      const delta = e.deltaY * 0.00045;
      targetScrollRef.current = Math.max(0, Math.min(1, targetScrollRef.current + delta));
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      touchStartYRef.current = touchY;
      const delta = deltaY * 0.0018;
      targetScrollRef.current = Math.max(0, Math.min(1, targetScrollRef.current + delta));
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        targetScrollRef.current = Math.max(0, Math.min(1, targetScrollRef.current + 0.2));
        audioEngine.playHover();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        targetScrollRef.current = Math.max(0, Math.min(1, targetScrollRef.current - 0.2));
        audioEngine.playHover();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Physics loop (60 FPS smooth momentum lerp)
  useEffect(() => {
    let animId;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // Smooth exponential damping
      const prev = currentScrollRef.current;
      const diff = targetScrollRef.current - prev;
      currentScrollRef.current += diff * 0.075;

      const vel = (currentScrollRef.current - prev) * 60;
      velocityRef.current = vel;
      setVelocity(vel);

      const p = currentScrollRef.current;
      setScrollProgress(p);

      // Current station calculation
      const stationIdx = Math.min(5, Math.max(0, Math.round(p * 5)));
      if (stationIdx !== currentStationIndex) {
        setCurrentStationIndex(stationIdx);
      }
    };

    tick();
    return () => cancelAnimationFrame(animId);
  }, [currentStationIndex]);

  // Jump smoothly to a specific station (0 to 5)
  const jumpToStation = useCallback((stationIndex) => {
    targetScrollRef.current = stationIndex / 5;
    audioEngine.playWarp(1.2);
  }, []);

  // Audio Toggle
  const handleToggleAudio = () => {
    const newState = audioEngine.toggle();
    setIsAudioOn(newState);
  };

  // Hover feedback
  const handleInteractiveHover = () => {
    setIsHoveringInteractive(true);
    audioEngine.playHover();
  };

  // Calculate current Multi-Axis World Translation (in vw and vh)
  const totalSegments = stationCoords.length - 1; // 5
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const rawIndex = clampedProgress * totalSegments;
  const seg = Math.min(Math.floor(rawIndex), totalSegments - 1);
  const segmentAlpha = rawIndex - seg;
  // Smoothstep easing for cinematic glide
  const easeAlpha = segmentAlpha * segmentAlpha * (3 - 2 * segmentAlpha);

  const curStation = stationCoords[seg];
  const nextStation = stationCoords[seg + 1] || curStation;

  const worldX = curStation.x + (nextStation.x - curStation.x) * easeAlpha;
  const worldY = curStation.y + (nextStation.y - curStation.y) * easeAlpha;

  // Warp tilt during rapid scroll
  const tiltX = Math.max(-5, Math.min(5, velocity * 0.4));
  const warpScale = 1 - Math.min(0.035, Math.abs(velocity) * 0.003);

  return (
    <div
      onClick={handleContainerClick}
      onMouseLeave={() => setIsHoveringInteractive(false)}
      className="relative w-screen h-screen overflow-hidden bg-[#030408] text-[#F4F6FA] select-none"
      style={{ cursor: isMobile ? 'auto' : 'none' }}
    >
      {/* 1. Three.js 3D Space Scene Canvas (Black Hole, Gravitational Starfield, Landmarks) */}
      <SpaceCanvas
        scrollProgress={scrollProgress}
        cursorCoords={cursorCoords}
        onClickRipple={clickRipple}
        velocity={velocity}
      />

      {/* 2. 2D Interactive Stardust Comet & Constellation Cursor Canvas */}
      <CursorCanvas
        cursorCoords={cursorCoords}
        isHoveringInteractive={isHoveringInteractive}
      />

      {/* 3. Ultra-Minimal HUD (Brand, Station Indicator, Audio Toggle, Bottom 2px Gold Progress Bar) */}
      <HUD
        currentStationIndex={currentStationIndex}
        scrollProgress={scrollProgress}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        onJumpToStation={jumpToStation}
        onInteractiveHover={handleInteractiveHover}
      />

      {/* 4. Multi-Axis Guided Station Viewport Canvas */}
      <main
        className="absolute top-0 left-0 w-full h-full will-change-transform pointer-events-auto"
        style={{
          transform: `translate3d(${-worldX}vw, ${-worldY}vh, 0px) scale(${warpScale}) rotateX(${tiltX * 0.2}deg)`,
          transformOrigin: '50% 50%',
          transition: 'transform 0.04s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
      >
        <Stations
          onSelectProject={(project) => {
            setSelectedProject(project);
          }}
          onInteractiveHover={handleInteractiveHover}
          onJumpToStation={jumpToStation}
          isMobile={isMobile}
        />
      </main>

      {/* 5. Project Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onInteractiveHover={handleInteractiveHover}
        />
      )}
    </div>
  );
}
