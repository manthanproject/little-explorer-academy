import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';
import { Star, User } from 'lucide-react';
import homeBg from '@/assets/home-bg.avif';
import alphabetIslandImg from '@/assets/alphabet-island.png';
import numberIslandImg from '@/assets/number-island.png';
import animalIslandImg from '@/assets/animal-island.png';

const islandConfig: Record<string, { gradient: string; image: string }> = {
  alphabet: {
    gradient: 'from-island-alphabet via-fun-pink to-island-alphabet',
    image: alphabetIslandImg,
  },
  numbers: {
    gradient: 'from-island-number via-secondary to-island-number',
    image: numberIslandImg,
  },
  animals: {
    gradient: 'from-island-animal via-accent to-island-animal',
    image: animalIslandImg,
  },
};

export default function WorldMap() {
  const navigate = useNavigate();
  const { student, progress, setCurrentIsland, getIslandProgress, currentClassLevel, currentIslands } = useGame();

  const handleIslandClick = (islandId: string) => {
    setCurrentIsland(islandId);
    navigate('/train');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 via-background to-fun-purple/10 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={homeBg}
          alt="Learning world background"
          className="h-full w-full object-cover object-center sm:object-[center_30%] opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/65" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {['☁️', '☁️', '🌤️'].map((cloud, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl opacity-30"
            style={{ left: `${10 + i * 30}%`, top: `${5 + i * 3}%` }}
            animate={{ x: [0, 40, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
          >
            {cloud}
          </motion.span>
        ))}
        {['🌊', '🌊', '🌊'].map((wave, i) => (
          <motion.span
            key={`w${i}`}
            className="absolute text-2xl opacity-20"
            style={{ left: `${5 + i * 35}%`, bottom: '8%' }}
            animate={{ y: [0, -5, 0], x: [0, 10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity }}
          >
            {wave}
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col px-3 sm:px-4 pt-10 sm:pt-12 pb-20 sm:pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-1 sm:mb-3 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">{student?.avatar}</span>
            <span className="font-display text-xs sm:text-base text-foreground truncate">{student?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-md">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-fun-gold fill-fun-gold" />
              <span className="font-body font-bold text-xs sm:text-sm text-foreground">{progress.stars}</span>
            </div>
            <motion.button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-card/80 backdrop-blur shadow-md flex items-center justify-center flex-shrink-0"
              whileTap={{ scale: 0.9 }}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Title */}
        <motion.h1
          className="text-lg sm:text-2xl font-display text-center text-foreground text-shadow-fun mb-0.5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Class {currentClassLevel} Learning World 🌍
        </motion.h1>

        {/* Guide */}
        <div className="flex justify-center mb-0 sm:mb-1 max-[700px]:hidden">
          <GuideCharacter message="Tap an island to start!" size="sm" />
        </div>

        {/* 3D Islands */}
        <div className="flex-1 flex flex-col gap-0.5 sm:gap-2 justify-evenly px-1 pb-0.5 overflow-y-auto">
          {currentIslands.map((island, i) => {
            const config = islandConfig[island.id];
            const prog = getIslandProgress(island.id);
            const alignmentClass = i % 2 === 0 ? 'self-start ml-1 sm:ml-3' : 'self-end mr-1 sm:mr-3';

            return (
              <motion.button
                key={island.id}
                onClick={() => handleIslandClick(island.id)}
                className={`relative w-[78%] max-w-[320px] sm:max-w-[410px] max-[700px]:w-[74%] touch-target ${alignmentClass}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15, type: 'spring', damping: 12 }}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative flex flex-col items-center justify-center py-1 sm:py-2">
                  <motion.div
                    className="h-[20vh] w-[58vw] min-h-[110px] min-w-[160px] max-h-[240px] max-w-[320px] sm:h-64 sm:w-[360px]"
                    animate={{ y: [0, -6, 0], rotateZ: [0, 1.5, -1.5, 0] }}
                    transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.35 }}
                  >
                    <img
                      src={config.image}
                      alt={island.name}
                      className="h-full w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.32)]"
                    />
                  </motion.div>

                  <div className="mt-0.5 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                      <h3 className="font-display text-sm sm:text-lg text-foreground leading-none">{island.name}</h3>
                      <motion.span
                        className="text-base sm:text-lg leading-none"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      >
                        ▶️
                      </motion.span>
                    </div>
                    <p className="text-sm sm:text-base text-foreground/90 font-body mt-1">{island.stations.length} stations</p>
                    <div className="mt-1.5 mx-auto h-2 w-28 sm:w-36 bg-background/40 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${prog}%` }}
                        transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
