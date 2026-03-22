import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, CheckCircle, Maximize2, Minimize2 } from 'lucide-react';

export default function GameScreen() {
  const navigate = useNavigate();
  const { progress, completeStation, addStars, currentIslands } = useGame();
  const [fullscreen, setFullscreen] = useState(true);

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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Floating controls overlay */}
      <div className="absolute top-safe left-2 right-2 z-20 flex items-center justify-between pt-2">
        <motion.button
          onClick={() => navigate('/stations')}
          className="w-9 h-9 rounded-full bg-card/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </motion.button>

        <span className="text-xs font-display text-foreground bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          🎮 {station.name}
        </span>

        <motion.button
          onClick={() => setFullscreen(!fullscreen)}
          className="w-9 h-9 rounded-full bg-card/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
          whileTap={{ scale: 0.9 }}
        >
          {fullscreen ? <Minimize2 className="w-4 h-4 text-foreground" /> : <Maximize2 className="w-4 h-4 text-foreground" />}
        </motion.button>
      </div>

      {/* Game iframe — full screen */}
      {gameUrl ? (
        <iframe
          src={gameUrl}
          title={`${station.name} game`}
          className={fullscreen ? "w-full flex-1" : "w-full flex-1 mt-12 mb-16 rounded-xl mx-auto max-w-3xl"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ border: 'none' }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body">No game available for this station.</p>
        </div>
      )}

      {/* Bottom complete button */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-2 pb-safe">
        {!isCompleted && (
          <motion.button
            onClick={onComplete}
            className="w-full py-3 rounded-2xl bg-primary/90 text-primary-foreground font-display text-base shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm"
            whileTap={{ scale: 0.97 }}
          >
            <CheckCircle className="w-5 h-5" />
            I'm Done! Collect Stars ⭐
          </motion.button>
        )}

        {isCompleted && (
          <motion.button
            onClick={() => navigate('/stations')}
            className="w-full py-3 rounded-2xl bg-accent/90 text-accent-foreground font-display text-base shadow-lg backdrop-blur-sm"
            whileTap={{ scale: 0.97 }}
          >
            Back to Stations ✅
          </motion.button>
        )}
      </div>
    </div>
  );
}
