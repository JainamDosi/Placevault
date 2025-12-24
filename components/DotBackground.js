"use client";
import { useEffect, useRef } from "react";

export default function DotBackground() {
  const canvasRef = useRef(null);
  // Store mouse position in a ref so mutable updates don't trigger re-renders
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const companies = [
      { name: "GOOGLE", px: 0.2, py: 0.3 },
      { name: "AMAZON", px: 0.8, py: 0.2 },
      { name: "META", px: 0.5, py: 0.7 },
      { name: "MICROSOFT", px: 0.15, py: 0.8 },
      { name: "APPLE", px: 0.85, py: 0.75 },
      { name: "NETFLIX", px: 0.3, py: 0.5 },
      { name: "ADOBE", px: 0.7, py: 0.45 },
    ];

    const handleResize = () => {
      // Set actual canvas size to match display size for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      // Store logical size for calculations
      canvas.logicalWidth = rect.width;
      canvas.logicalHeight = rect.height;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);
    // Attach to window so we track mouse even if it leaves the hero area slightly
    window.addEventListener("mousemove", handleMouseMove);

    // Configuration
    const dotSize = 1.5; 
    const spacing = 30; // Grid spacing
    const interactionRadius = 200; // Range of mouse effect
    const revealRadius = 150; // Range for logo reveal
    const maxDisplacement = 12; // Force of the movement

    const render = () => {
      const width = canvas.logicalWidth || canvas.width;
      const height = canvas.logicalHeight || canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw Revealed Logos First (Background layer)
      companies.forEach(company => {
        const cx = company.px * width;
        const cy = company.py * height;
        
        const dx = mouse.current.x - cx;
        const dy = mouse.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < revealRadius) {
          const alpha = 1 - (dist / revealRadius);
          ctx.save();
          ctx.globalAlpha = alpha * 0.4;
          ctx.fillStyle = "#F9CC18";
          ctx.font = "italic 900 40px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // Add a slight displacement to logos too
          const force = alpha;
          const lx = cx - (dx / dist) * (force * 20);
          const ly = cy - (dy / dist) * (force * 20);
          ctx.fillText(company.name, lx, ly);
          ctx.restore();
        }
      });

      // Draw Dots
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          // Calculate distance to mouse
          const dx = mouse.current.x - x;
          const dy = mouse.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let drawX = x;
          let drawY = y;
          let size = dotSize;
          let color = "#cbd5e1"; // slate-300 default

          if (distance < interactionRadius) {
            // Calculate force factor (0 to 1)
            const force = (interactionRadius - distance) / interactionRadius;
            
            // Interaction: Move dots slightly AWAY from cursor
            const angle = Math.atan2(dy, dx);
            const move = force * maxDisplacement;
            
            drawX -= Math.cos(angle) * move;
            drawY -= Math.sin(angle) * move;
            
            // Pattern Interaction: Scale up slightly and darken
            size = dotSize + (force * 1); 
            color = "#94a3b8"; // slate-400 darker
          }

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0 opacity-60 pointer-events-none"
    />
  );
}
