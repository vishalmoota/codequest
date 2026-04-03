import { useEffect, useRef, useState, useCallback } from 'react';

const ParticleEffect = ({ active = false, type = 'confetti', duration = 3000 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [show, setShow] = useState(false);

  const createParticles = useCallback((canvas) => {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = type === 'confetti'
      ? ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ffd700']
      : type === 'stars'
      ? ['#ffd700', '#ffed4a', '#fbbf24', '#f59e0b', '#ffffff']
      : ['#6366f1', '#818cf8', '#a5b4fc'];

    const count = type === 'confetti' ? 80 : type === 'stars' ? 40 : 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * canvas.height * 0.5,
        size: Math.random() * (type === 'stars' ? 6 : 8) + 2,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: type === 'confetti' ? ['rect', 'circle'][Math.floor(Math.random() * 2)] : 'star',
      });
    }

    const drawStar = (ctx, x, y, size) => {
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      let rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;
      
      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.lineTo(x, y - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.05; // gravity
        p.rotation += p.rotSpeed;
        p.opacity -= 0.005;
      });

      if (alive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  }, [type]);

  useEffect(() => {
    if (active) {
      setShow(true);
      const canvas = canvasRef.current;
      if (canvas) createParticles(canvas);

      const timer = setTimeout(() => {
        setShow(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }, duration);

      return () => {
        clearTimeout(timer);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [active, createParticles, duration]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ParticleEffect;
