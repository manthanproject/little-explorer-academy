import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const subjectByIsland: Record<string, string> = {
  alphabet: 'English / Language',
  numbers: 'Mathematics',
  animals: 'EVS / Environmental Studies',
};

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function StationView() {
  const navigate = useNavigate();
  const { progress, currentIslands, currentClassLevel } = useGame();

  const island = currentIslands.find(i => i.id === progress.currentIsland);
  const station = island?.stations[progress.currentStation];
  const item = station?.items[0];

  if (!station || !item) return null;

  const subject = subjectByIsland[island?.id || ''] || 'General Learning';

  // Use the specific video URL if available, otherwise fallback to search
  const videoId = station.videoUrl ? getYouTubeVideoId(station.videoUrl) : null;
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(`${station.name} ${subject} class ${currentClassLevel} kids`)}`;

  const youtubeUrl = station.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${station.name} ${subject} class ${currentClassLevel} kids`)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 via-background to-primary/10 px-4 sm:px-6 py-5 sm:py-7">
      {/* Back button */}
      <div className="fixed top-4 sm:top-6 left-3 sm:left-4 z-20">
        <motion.button
          onClick={() => navigate('/stations')}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card shadow-lg flex items-center justify-center touch-target"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
      </div>

      {/* Station header */}
      <motion.div
        className="mx-auto mt-12 max-w-3xl text-center mb-3 sm:mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xs sm:text-sm font-body uppercase tracking-[0.2em] text-muted-foreground">{island?.name} • {subject}</h2>
        <h1 className="text-lg sm:text-2xl font-display text-foreground">{station.name}</h1>
        <p className="text-xs sm:text-sm font-body text-muted-foreground mt-1">Class {currentClassLevel} Learning Video</p>
      </motion.div>

      {/* Video player */}
      <motion.div
        key={`video-${station.id}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 14 }}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-card/70 bg-card shadow-xl"
      >
        <div className="p-3 sm:p-4 border-b border-border/60 bg-muted/20">
          <h3 className="font-display text-base sm:text-lg text-foreground">Topic: {station.name}</h3>
          <p className="text-xs sm:text-sm font-body text-muted-foreground mt-1">{item.description}</p>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            title={`${station.name} learning video`}
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* Guide */}
      <div className="mt-4 sm:mt-5 flex justify-center">
        <GuideCharacter message={`Let us watch and learn: ${station.name}`} size="sm" />
      </div>

      <div className="mt-5 sm:mt-6 mx-auto flex w-full max-w-3xl gap-3">
        <motion.button
          onClick={() => window.open(youtubeUrl, '_blank', 'noopener,noreferrer')}
          className="flex-1 px-4 py-3 bg-secondary/20 text-foreground rounded-2xl font-display text-sm sm:text-base shadow-md flex items-center justify-center gap-2 touch-target"
          whileTap={{ scale: 0.97 }}
        >
          <ExternalLink className="w-4 h-4" />
          Open on YouTube
        </motion.button>

        <motion.button
          onClick={() => navigate('/stations')}
          className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-display text-sm sm:text-base shadow-md touch-target"
          whileTap={{ scale: 0.97 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ scale: { duration: 1.5, repeat: Infinity } }}
        >
          Done
        </motion.button>
      </div>
    </div>
  );
}
