import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { type LearningItem } from '@/data/learningContent';
import GuideCharacter from '@/components/GuideCharacter';
import { ArrowLeft } from 'lucide-react';

export default function GameScreen() {
  const navigate = useNavigate();
  const { progress, completeStation, addStars, currentIslands } = useGame();

  const island = currentIslands.find(i => i.id === progress.currentIsland);
  const station = island?.stations[progress.currentStation];
  const items = station?.items || [];
  const gameType = station?.gameType || 'tap';

  if (!station) return null;

  const onComplete = () => {
    completeStation(station.id);
    addStars(3);
    navigate('/reward');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-yellow/20 via-background to-accent/10 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6">
      {/* Back button */}
      <div className="self-start mb-2 sm:mb-3">
        <motion.button
          onClick={() => navigate('/stations')}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card shadow-lg flex items-center justify-center touch-target"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
      </div>

      <motion.h1
        className="text-xl sm:text-2xl font-display text-foreground mb-1 sm:mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🎮 Game Time!
      </motion.h1>
      <p className="text-xs sm:text-sm font-body text-muted-foreground mb-3 sm:mb-4">{station.name}</p>

      {gameType === 'tap' && <TapGame items={items} onComplete={onComplete} />}
      {gameType === 'match' && <MatchGame items={items} onComplete={onComplete} />}
      {gameType === 'count' && <CountGame items={items} onComplete={onComplete} />}
      {gameType === 'find' && <FindGame items={items} onComplete={onComplete} />}
      {gameType === 'pop' && <PopGame items={items} onComplete={onComplete} />}
    </div>
  );
}

function TapGame({ items, onComplete }: { items: LearningItem[]; onComplete: () => void }) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [correct, setCorrect] = useState<string[]>([]);
  const target = items[targetIdx];
  const shuffled = useMemo(() => [...items].sort(() => Math.random() - 0.5), [items]);

  const handleTap = (item: LearningItem) => {
    if (item.id === target.id) {
      setCorrect(prev => [...prev, item.id]);
      if (targetIdx < items.length - 1) {
        setTimeout(() => setTargetIdx(prev => prev + 1), 500);
      } else {
        setTimeout(onComplete, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
      <GuideCharacter message={`Find: ${target.emoji} ${target.label}`} size="sm" />
      <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xs">
        {shuffled.map(item => (
          <motion.button
            key={item.id}
            onClick={() => handleTap(item)}
            className={`aspect-square rounded-xl sm:rounded-2xl bg-card shadow-lg flex flex-col items-center justify-center gap-1 sm:gap-2 border-3 ${
              correct.includes(item.id) ? 'border-accent bg-accent/10' : 'border-transparent'
            } touch-target`}
            whileTap={{ scale: 0.9 }}
            animate={correct.includes(item.id) ? { scale: [1, 1.1, 1] } : {}}
          >
            <span className="text-3xl sm:text-5xl">{item.emoji}</span>
            <span className="font-display text-xs sm:text-base text-foreground">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MatchGame({ items, onComplete }: { items: LearningItem[]; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const cards = useMemo(() => {
    const pairs = items.flatMap(item => [
      { ...item, cardId: `${item.id}-emoji`, display: item.emoji, type: 'emoji' as const },
      { ...item, cardId: `${item.id}-label`, display: item.label, type: 'label' as const },
    ]);
    return pairs.sort(() => Math.random() - 0.5);
  }, [items]);

  const handleCardTap = (index: number) => {
    if (matched.includes(cards[index].id)) return;
    if (selected === null) {
      setSelected(index);
    } else {
      if (cards[selected].id === cards[index].id && selected !== index) {
        setMatched(prev => [...prev, cards[index].id]);
        if (matched.length + 1 === items.length) setTimeout(onComplete, 800);
      }
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
      <GuideCharacter message="Match the pairs! 🎯" size="sm" />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs">
        {cards.map((card, i) => (
          <motion.button
            key={card.cardId}
            onClick={() => handleCardTap(i)}
            className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center shadow-md text-lg sm:text-2xl font-display touch-target ${
              matched.includes(card.id) ? 'bg-accent/20 border-2 border-accent' :
              selected === i ? 'bg-secondary/30 border-2 border-secondary' :
              'bg-card border-2 border-transparent'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {card.type === 'emoji' ? card.display : <span className="text-sm sm:text-lg" style={{ color: card.color }}>{card.display}</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function CountGame({ items, onComplete }: { items: LearningItem[]; onComplete: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [tapped, setTapped] = useState(0);
  const item = items[currentIdx];
  const targetCount = parseInt(item.label) || 3;

  const handleTap = () => {
    const next = tapped + 1;
    setTapped(next);
    if (next >= targetCount) {
      if (currentIdx < items.length - 1) {
        setTimeout(() => { setCurrentIdx(prev => prev + 1); setTapped(0); }, 800);
      } else {
        setTimeout(onComplete, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
      <GuideCharacter message={`Tap ${targetCount} times! ${item.emoji}`} size="sm" />
      <motion.button onClick={handleTap} className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl bg-card shadow-xl flex flex-col items-center justify-center border-4 border-primary/20 touch-target" whileTap={{ scale: 0.85 }}>
        <span className="text-4xl sm:text-6xl">{item.emoji}</span>
        <span className="text-2xl sm:text-3xl font-display text-primary mt-2">{tapped}/{targetCount}</span>
      </motion.button>
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: targetCount }).map((_, i) => (
          <motion.span key={i} className="text-2xl sm:text-3xl" animate={i < tapped ? { scale: [1, 1.3, 1], opacity: 1 } : { opacity: 0.3 }}>
            {item.emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function FindGame({ items, onComplete }: { items: LearningItem[]; onComplete: () => void }) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const target = items[targetIdx];

  const handleFind = (item: LearningItem) => {
    if (item.id === target.id) {
      setFound(prev => [...prev, item.id]);
      if (targetIdx < items.length - 1) setTimeout(() => setTargetIdx(prev => prev + 1), 600);
      else setTimeout(onComplete, 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
      <GuideCharacter message={`Find the ${target.label}!`} size="sm" />
      <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xs">
        {items.map(item => (
          <motion.button key={item.id} onClick={() => handleFind(item)}
            className={`p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-card shadow-lg flex flex-col items-center gap-2 touch-target ${found.includes(item.id) ? 'ring-4 ring-accent' : ''}`}
            whileTap={{ scale: 0.9 }}
            animate={found.includes(item.id) ? { scale: [1, 1.1, 1] } : { y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl sm:text-5xl">{item.emoji}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PopGame({ items, onComplete }: { items: LearningItem[]; onComplete: () => void }) {
  const [popped, setPopped] = useState<string[]>([]);

  const handlePop = (id: string) => {
    if (popped.includes(id)) return;
    setPopped(prev => [...prev, id]);
    if (popped.length + 1 >= items.length) setTimeout(onComplete, 800);
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
      <GuideCharacter message="Pop all the balloons! 🎈" size="sm" />
      <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xs">
        <AnimatePresence>
          {items.map(item => (
            !popped.includes(item.id) ? (
              <motion.button key={item.id} onClick={() => handlePop(item.id)}
                className="aspect-square rounded-full flex flex-col items-center justify-center touch-target"
                style={{ backgroundColor: `${item.color}30` }}
                exit={{ scale: 1.5, opacity: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5 + Math.random(), repeat: Infinity }}
                whileTap={{ scale: 0.8 }}
              >
                <span className="text-4xl sm:text-5xl">🎈</span>
                <span className="text-sm sm:text-lg font-display" style={{ color: item.color }}>{item.label}</span>
              </motion.button>
            ) : (
              <motion.div key={item.id} initial={{ scale: 1.5, opacity: 1 }} animate={{ scale: 0, opacity: 0 }} className="aspect-square flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">💥</span>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
