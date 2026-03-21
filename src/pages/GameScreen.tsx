import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function GameScreen() {
  const navigate = useNavigate();
  const { progress, completeStation, addStars, currentIslands } = useGame();

  const island = currentIslands.find(i => i.id === progress.currentIsland);
  const station = island?.stations[progress.currentStation];

  if (!station) return null;

  const gameUrl = station.gameUrl;
  const isCompleted = progress.completedStations.includes(station.id);

  const onComplete = () => {
    completeStation(station.id);
    addStars(3);
    navigate('/reward');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-yellow/20 via-background to-accent/10 flex flex-col px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          onClick={() => navigate('/stations')}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card shadow-lg flex items-center justify-center touch-target"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
        <h1 className="text-lg sm:text-xl font-display text-foreground">🎮 {station.name}</h1>
        <div className="w-9" />
      </div>

      <GuideCharacter message="Play the game and have fun learning!" size="sm" />

      {/* Game iframe */}
      {gameUrl ? (
        <div className="flex-1 mt-3 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl bg-white">
          <iframe
            src={gameUrl}
            title={`${station.name} game`}
            className="w-full h-full min-h-[60vh]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body">No game available for this station.</p>
        </div>
      )}

      {/* Complete button */}
      {!isCompleted && (
        <motion.button
          onClick={onComplete}
          className="mt-4 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display text-lg shadow-lg flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ scale: { duration: 1.5, repeat: Infinity } }}
        >
          <CheckCircle className="w-5 h-5" />
          I'm Done! Collect Stars ⭐
        </motion.button>
      )}

      {isCompleted && (
        <motion.button
          onClick={() => navigate('/stations')}
          className="mt-4 w-full py-4 rounded-2xl bg-accent text-accent-foreground font-display text-lg shadow-lg"
          whileTap={{ scale: 0.97 }}
        >
          Back to Stations ✅
        </motion.button>
      )}
    </div>
  );
}
