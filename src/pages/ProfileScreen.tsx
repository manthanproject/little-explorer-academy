import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { REWARDS } from '@/data/rewards';
import { ArrowLeft, Star, CheckCircle, Circle, LogOut } from 'lucide-react';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { student, progress, getIslandProgress, currentIslands, earnedRewards, logout } = useGame();

  const totalStations = currentIslands.reduce((a, i) => a + i.stations.length, 0);
  const completedCount = progress.completedStations.length;
  const overallProgress = Math.round((completedCount / totalStations) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-purple/10 via-background to-primary/10 px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <motion.button
          onClick={() => navigate('/world')}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card shadow-lg flex items-center justify-center flex-shrink-0 touch-target"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
        <h1 className="text-xl sm:text-2xl font-display text-foreground">My Profile</h1>
      </div>

      {/* Profile card */}
      <motion.div
        className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-primary/10 text-center mb-4 sm:mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.span
          className="text-5xl sm:text-6xl block mb-2 sm:mb-3"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {student?.avatar}
        </motion.span>
        <h2 className="text-xl sm:text-2xl font-display text-foreground">{student?.name}</h2>
        <p className="text-xs sm:text-sm font-body text-muted-foreground mt-1">
          {student?.class} • Division {student?.division} • Roll No. {student?.rollNo}
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-fun-gold fill-fun-gold" />
          <span className="text-xl sm:text-2xl font-display text-foreground">{progress.stars}</span>
          <span className="text-xs sm:text-sm font-body text-muted-foreground">stars</span>
        </div>

        {/* Overall progress */}
        <div className="mt-3 sm:mt-4">
          <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
            <span>Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <p className="text-xs font-body text-muted-foreground mt-1">{completedCount}/{totalStations} stations completed</p>
        </div>
      </motion.div>

      {/* Island breakdown */}
      {/* ── Badge Cabinet ── */}
      <motion.div
        className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border-2 border-fun-gold/30 mb-4 sm:mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏅</span>
          <h3 className="font-display text-foreground text-sm sm:text-base">My Badges</h3>
          <span className="ml-auto text-xs font-body text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {earnedRewards.length}/{REWARDS.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {REWARDS.map((reward, idx) => {
            const earned = earnedRewards.includes(reward.id);
            return (
              <motion.div
                key={reward.id}
                className={`rounded-xl p-2 flex flex-col items-center gap-1 border-2 text-center ${
                  earned
                    ? 'bg-card shadow-md'
                    : 'bg-muted/40 border-transparent'
                }`}
                style={earned ? { borderColor: `${reward.color}60` } : {}}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                whileTap={earned ? { scale: 0.95 } : {}}
              >
                <span className={`text-2xl sm:text-3xl ${!earned ? 'grayscale opacity-30' : ''}`}>
                  {earned ? reward.emoji : '🔒'}
                </span>
                <span
                  className={`font-display text-xs leading-tight ${
                    earned ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {earned ? reward.title : '???'}
                </span>
                {earned && (
                  <motion.div
                    className="w-4 h-1 rounded-full mt-0.5"
                    style={{ backgroundColor: reward.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        {earnedRewards.length === 0 && (
          <p className="text-center text-xs font-body text-muted-foreground mt-2">
            Complete stations to earn badges! 🌟
          </p>
        )}
      </motion.div>

      {/* Island breakdown */}
      {currentIslands.map((island, idx) => {
        const prog = getIslandProgress(island.id);
        return (
          <motion.div
            key={island.id}
            className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg mb-2 sm:mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <span className="text-xl sm:text-2xl flex-shrink-0">{island.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-foreground text-xs sm:text-sm truncate">{island.name}</h3>
                <div className="h-1.5 sm:h-2 bg-muted rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${prog}%` }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  />
                </div>
              </div>
              <span className="text-xs font-body text-muted-foreground flex-shrink-0">{prog}%</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {island.stations.map(station => {
                const done = progress.completedStations.includes(station.id);
                return (
                  <div key={station.id} className="flex items-center gap-1.5 text-xs">
                    {done ? (
                      <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`font-body truncate ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {station.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      <motion.button
        type="button"
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="mt-4 sm:mt-5 w-full rounded-2xl bg-destructive px-4 py-3 text-sm sm:text-base font-display text-destructive-foreground shadow-lg flex items-center justify-center gap-2"
        whileTap={{ scale: 0.97 }}
      >
        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        Logout
      </motion.button>
    </div>
  );
}
