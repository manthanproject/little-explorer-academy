import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import GuideCharacter from './GuideCharacter';

interface BiometricAnimationProps {
  onComplete: () => void;
  type: 'face' | 'fingerprint';
}

export default function BiometricAnimation({ onComplete, type }: BiometricAnimationProps) {
  const [phase, setPhase] = useState<'intro' | 'scanning' | 'done'>('intro');

  useEffect(() => {
    // Show intro for 1.5s, then scanning for 2s, then trigger actual biometric
    const t1 = setTimeout(() => setPhase('scanning'), 1500);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  const message = type === 'face'
    ? phase === 'scanning' ? 'Scanning... 🔍' : 'Show me your face! 😊'
    : phase === 'scanning' ? 'Scanning... 🔍' : 'Now press your thumb! 👍';

  const ringColor = type === 'face' ? 'border-sky-400' : 'border-emerald-400';
  const scanningRingColor = type === 'face' ? 'border-teal-400' : 'border-emerald-500';

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-secondary/20 via-background to-primary/10 flex flex-col items-center justify-center px-4">
      <GuideCharacter message={message} size="sm" />

      <motion.div
        className="mt-8 relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        {/* Outer pulse ring */}
        <AnimatePresence>
          {phase === 'scanning' && (
            <motion.div
              className={`absolute inset-0 rounded-full border-4 ${scanningRingColor}`}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ margin: -8 }}
            />
          )}
        </AnimatePresence>

        {/* Main circle */}
        <motion.div
          className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 ${
            phase === 'scanning' ? scanningRingColor : ringColor
          } flex items-center justify-center bg-card/50 backdrop-blur-sm shadow-xl`}
          animate={phase === 'scanning' ? {
            borderColor: ['hsl(174, 72%, 56%)', 'hsl(199, 89%, 48%)', 'hsl(174, 72%, 56%)'],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {type === 'face' ? (
            <motion.div className="relative">
              {/* Face icon */}
              <motion.svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                className="text-primary"
                animate={phase === 'scanning' ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {/* Face outline corners */}
                <motion.path
                  d="M8 24V12a4 4 0 014-4h12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={phase === 'scanning' ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.path
                  d="M56 8h12a4 4 0 014 4v12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={phase === 'scanning' ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                />
                <motion.path
                  d="M72 56v12a4 4 0 01-4 4H56"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={phase === 'scanning' ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                />
                <motion.path
                  d="M24 72H12a4 4 0 01-4-4V56"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={phase === 'scanning' ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.45 }}
                />
                {/* Smiley face */}
                <circle cx="30" cy="34" r="3" fill="currentColor" />
                <circle cx="50" cy="34" r="3" fill="currentColor" />
                <path d="M28 48c4 6 16 6 24 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </motion.svg>

              {/* Scanning line */}
              {phase === 'scanning' && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                  initial={{ top: 0 }}
                  animate={{ top: [0, 80, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div className="relative">
              {/* Fingerprint icon */}
              <motion.svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-primary"
                animate={phase === 'scanning' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
                <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                <path d="M12 10a2 2 0 0 0-2 2c0 4.5-1.2 7.2-2 8.5" />
                <path d="M9.58 16.5c.2 1 .3 2.5.42 3.5" />
                <path d="M14.08 20.01c.23-1.2.36-2.7.36-4.01 0-2.21-1.79-4-4-4-.62 0-1.2.14-1.72.38" />
                <path d="M12 6c2.21 0 4 1.79 4 4 0 1.1-.11 2.18-.32 3.22" />
                <path d="M20 12c0 .68-.06 1.34-.18 1.98" />
                <path d="M18 12c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 3 .5 5.5 1 7" />
              </motion.svg>

              {/* Pulse effect */}
              {phase === 'scanning' && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-400/20"
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Label */}
        <motion.p
          className="text-center mt-4 font-display text-sm text-foreground"
          animate={phase === 'scanning' ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {phase === 'intro' && type === 'face' && 'Tap to Scan Face'}
          {phase === 'intro' && type === 'fingerprint' && 'Tap for Fingerprint'}
          {phase === 'scanning' && 'Scanning... 🔍'}
          {phase === 'done' && 'Verified! ✅'}
        </motion.p>
      </motion.div>
    </div>
  );
}
