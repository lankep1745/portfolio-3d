import React, { useEffect, useRef, useState } from 'react';

/**
 * 2D Canvas Cursor & Sky Effects:
 * - Magnetic golden cursor ring
 * - Volumetric golden sky glow
 * - Stardust comet tail trail
 * - Constellation filaments connecting cursor to nearby celestial nodes
 */
export default function CursorCanvas({ cursorCoords, isHoveringInteractive }) {
  const canvasRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // --- Floating Celestial Nodes for Constellation Filaments ---
    const nodeCount = 55;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // --- Stardust Comet Trail Particles ---
    const stardust = [];
    const maxStardust = 35;

    let targetX = cursorCoords.x;
    let targetY = cursorCoords.y;
    let smoothX = targetX;
    let smoothY = targetY;

    // Custom cursor lerp scale
    let cursorScale = 1.0;
    let targetScale = 1.0;

    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      targetX = cursorCoords.x;
      targetY = cursorCoords.y;

      // Smooth cursor lerp
      smoothX += (targetX - smoothX) * 0.25;
      smoothY += (targetY - smoothY) * 0.25;

      targetScale = isHoveringInteractive ? 2.4 : 1.0;
      cursorScale += (targetScale - cursorScale) * 0.2;

      // Spawn stardust when cursor moves
      const distMoved = Math.hypot(targetX - smoothX, targetY - smoothY);
      if (distMoved > 0.5 && stardust.length < maxStardust) {
        stardust.push({
          x: targetX + (Math.random() - 0.5) * 6,
          y: targetY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 2.2 + 0.8,
          alpha: 0.85,
          decay: Math.random() * 0.035 + 0.02,
        });
      }

      // 1. Draw Volumetric Cursor Sky-Glow
      const glowGrad = ctx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, 180);
      glowGrad.addColorStop(0, 'rgba(245, 176, 65, 0.08)');
      glowGrad.addColorStop(0.5, 'rgba(245, 176, 65, 0.02)');
      glowGrad.addColorStop(1, 'rgba(3, 4, 8, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(smoothX, smoothY, 180, 0, Math.PI * 2);
      ctx.fill();

      // 2. Update and Draw Celestial Nodes + Constellation Filaments to Cursor
      const filamentRadius = 140;
      ctx.lineWidth = 0.75;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Draw faint celestial node
        ctx.fillStyle = `rgba(244, 246, 250, ${node.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Check distance to cursor
        const dx = smoothX - node.x;
        const dy = smoothY - node.y;
        const dist = Math.hypot(dx, dy);

        if (dist < filamentRadius) {
          const strength = 1 - dist / filamentRadius;
          ctx.strokeStyle = `rgba(245, 176, 65, ${strength * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(smoothX, smoothY);
          ctx.stroke();
        }
      }

      // 3. Update & Draw Stardust Comet Trail
      for (let i = stardust.length - 1; i >= 0; i--) {
        const p = stardust[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          stardust.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 210, 125, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Magnetic Golden Cursor Ring & Center Core
      if (smoothX > 0 && smoothY > 0) {
        // Outer Ring
        ctx.strokeStyle = isHoveringInteractive
          ? 'rgba(255, 210, 125, 0.95)'
          : 'rgba(245, 176, 65, 0.75)';
        ctx.lineWidth = isHoveringInteractive ? 1.5 : 1.2;
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, 14 * cursorScale, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Core Dot
        ctx.fillStyle = isHoveringInteractive
          ? 'rgba(255, 210, 125, 0.9)'
          : 'rgba(245, 176, 65, 0.95)';
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, isHoveringInteractive ? 2.5 : 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [cursorCoords, isHoveringInteractive, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
}
