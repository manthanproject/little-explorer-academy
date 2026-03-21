import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = [
  'hsl(0, 80%, 60%)', 'hsl(45, 100%, 55%)', 'hsl(120, 60%, 50%)',
  'hsl(200, 80%, 55%)', 'hsl(280, 70%, 60%)', 'hsl(340, 80%, 65%)',
  'hsl(25, 95%, 60%)',
];

export default function ConfettiEffect({ count = 30 }: { count?: number }) {
  const pieces = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    })), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
