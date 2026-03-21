import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { REWARDS } from '@/data/rewards';
import GuideCharacter from '@/components/GuideCharacter';
import ConfettiEffect from '@/components/ConfettiEffect';
import { Star } from 'lucide-react';

export default function RewardScreen() {
  const navigate = useNavigate();
  const { progress, newlyEarnedRewards, clearNewRewards, currentIslands } = useGame();
  const [showConfetti, setShowConfetti] = useState(true);
  const island = currentIslands.find((item) => item.id === progress.currentIsland);
  const activeStation = island?.stations[progress.currentStation];
  const hasUpcomingUnlockedStation = Boolean(
    activeStation && !progress.completedStations.includes(activeStation.id)
  );

  // Resolve full reward objects for any newly earned rewards
  const newBadges = REWARDS.filter(r => newlyEarnedRewards.includes(r.id));

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Clear new rewards when leaving this screen
  useEffect(() => {
    return () => clearNewRewards();
  }, [clearNewRewards]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-yellow/30 via-background to-fun-pink/20 flex flex-col items-center justify-center px-4 sm:px-6">
      {showConfetti && <ConfettiEffect />}

      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[0, 1, 2].map(i => (
          <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.3, type: 'spring', damping: 8 }}>
            <Star className="w-10 h-10 sm:w-14 sm:h-14 text-fun-gold fill-fun-gold drop-shadow-lg" />
          </motion.div>
        ))}
      </div>

      <motion.h1 className="text-3xl sm:text-4xl font-display text-foreground text-shadow-fun" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        Great Job! 🎉
      </motion.h1>

      <motion.div className="flex gap-1.5 sm:gap-2 my-3 sm:my-4 flex-wrap justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        {['🎈', '🎊', '🌟', '🎈', '🎊'].map((e, i) => (
          <motion.span key={i} className="text-2xl sm:text-3xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}>{e}</motion.span>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
        <GuideCharacter message="You're amazing! ⭐" size="md" />
      </motion.div>

      {/* New badge(s) unlocked */}
      {newBadges.length > 0 && (
        <motion.div
          className="w-full max-w-sm mt-4 sm:mt-6 flex flex-col gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <p className="text-center font-display text-base sm:text-lg text-foreground">
            🎖️ New Badge{newBadges.length > 1 ? 's' : ''} Unlocked!
          </p>
          {newBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              className="flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 shadow-xl"
              style={{ borderColor: badge.color }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.9 + i * 0.2, type: 'spring', damping: 10 }}
            >
              <motion.span
                className="text-4xl sm:text-5xl flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              >
                {badge.emoji}
              </motion.span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm sm:text-base text-foreground">{badge.title}</p>
                <p className="font-body text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.button
        onClick={() => navigate(hasUpcomingUnlockedStation ? '/train' : '/stations')}
        className="mt-6 sm:mt-8 px-6 sm:px-10 py-3 sm:py-4 bg-primary text-primary-foreground rounded-2xl font-display text-lg sm:text-xl shadow-xl touch-target"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1, 1.03, 1] }}
        transition={{ delay: 2, scale: { duration: 1.5, repeat: Infinity } }}
        whileTap={{ scale: 0.95 }}
      >
        Continue! 🚀
      </motion.button>
    </div>
  );
}
