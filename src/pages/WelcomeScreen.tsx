import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { student } = useGame();

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 via-background to-primary/10 flex flex-col items-center justify-center px-4 sm:px-6">
      <GuideCharacter message={`Welcome back, ${student.name}! 🎉`} size="sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 0.2 }}
        className="mt-6 w-full max-w-sm"
      >
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-primary/20 text-center">
          <motion.span
            className="text-6xl sm:text-7xl block mb-3"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {student.avatar}
          </motion.span>

          <h2 className="text-2xl sm:text-3xl font-display text-foreground">{student.name}</h2>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <span>📚</span>
              <span>Class: {student.class}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <span>🏠</span>
              <span>Division: {student.division}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <span>🔢</span>
              <span>Roll No: {student.rollNo}</span>
            </div>
          </div>

          <motion.button
            onClick={() => navigate('/world')}
            className="mt-6 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display text-lg shadow-lg"
            whileTap={{ scale: 0.97 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ scale: { duration: 1.5, repeat: Infinity } }}
          >
            Let's Go! 🚀
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
