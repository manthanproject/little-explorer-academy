import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pandaGuide from '@/assets/panda-guide.png';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-primary/20 flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Floating decorations */}
      {['⭐', '🎈', '🌈', '🦋', '🌟'].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-3xl"
          style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.img
        src={pandaGuide}
        alt="Panda"
        className="w-24 h-24 sm:w-36 sm:h-36 mb-4 sm:mb-6 drop-shadow-xl"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
      />

      <motion.h1
        className="text-3xl sm:text-4xl font-display text-foreground text-shadow-fun text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Play & Learn
      </motion.h1>
      <motion.h2
        className="text-xl sm:text-2xl font-display text-primary mt-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Adventure! 🎉
      </motion.h2>

      <motion.div
        className="mt-8 sm:mt-10 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
