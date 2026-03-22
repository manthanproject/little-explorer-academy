import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, CheckCircle, Gamepad2, Lock, Play, TrainFront } from 'lucide-react';

function ToyStationBadge({ active, locked }: { active: boolean; locked: boolean }) {
  const buildingColor = locked ? 'from-slate-300 to-slate-400' : active ? 'from-amber-300 via-orange-300 to-orange-400' : 'from-teal-300 via-cyan-300 to-sky-400';

  return (
    <div className={`relative h-14 w-14 ${active ? 'scale-110' : ''}`}>
      <div className="absolute bottom-0 left-1/2 h-4 w-12 -translate-x-1/2 rounded-full bg-black/20 blur-sm" />
      <div className="absolute bottom-1 left-1/2 h-8 w-12 -translate-x-1/2 rounded-full border-2 border-slate-500 bg-[radial-gradient(circle_at_50%_45%,#6e5a66_0%,#4c3d45_58%,#27212a_100%)]" />
      <div className={`absolute bottom-3 left-1/2 h-6 w-7 -translate-x-1/2 rounded-[0.7rem] border border-white/80 bg-gradient-to-b ${buildingColor} shadow-[0_8px_18px_rgba(0,0,0,0.18)]`} />
      <div className="absolute bottom-[30px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[9px] border-b-[8px] border-x-transparent border-b-amber-700/90" />
      <div className="absolute bottom-[16px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-sm bg-sky-100 shadow-inner" />
    </div>
  );
}

const islandTheme = {
  alphabet: {
    page: 'from-rose-100 via-sky-100 to-amber-50',
    accent: 'bg-rose-500',
    accentSoft: 'bg-rose-500/12 text-rose-700',
    button: 'from-rose-500 to-pink-500',
    track: 'from-rose-300/40 to-pink-300/10',
    ticket: 'border-rose-200/80',
  },
  numbers: {
    page: 'from-sky-100 via-cyan-50 to-amber-50',
    accent: 'bg-sky-500',
    accentSoft: 'bg-sky-500/12 text-sky-700',
    button: 'from-sky-500 to-cyan-500',
    track: 'from-sky-300/40 to-cyan-300/10',
    ticket: 'border-sky-200/80',
  },
  animals: {
    page: 'from-emerald-100 via-lime-50 to-amber-50',
    accent: 'bg-emerald-500',
    accentSoft: 'bg-emerald-500/12 text-emerald-700',
    button: 'from-emerald-500 to-lime-500',
    track: 'from-emerald-300/40 to-lime-300/10',
    ticket: 'border-emerald-200/80',
  },
} as const;

export default function StationsList() {
  const navigate = useNavigate();
  const { progress, setCurrentStation, currentIslands } = useGame();

  const island = currentIslands.find(i => i.id === progress.currentIsland);
  if (!island) return null;
  const completedCount = island.stations.filter(station => progress.completedStations.includes(station.id)).length;
  const nextUnlockedIndex = Math.min(completedCount, island.stations.length - 1);
  const theme = islandTheme[island.id as keyof typeof islandTheme] || islandTheme.alphabet;

  const handleStation = (index: number, mode: 'watch' | 'play') => {
    const isUnlocked = index <= nextUnlockedIndex;
    if (!isUnlocked) return;

    setCurrentStation(index);
    if (mode === 'watch') {
      navigate('/station');
    } else {
      navigate('/game');
    }
  };

  const getStationPreview = (index: number) => {
    const station = island.stations[index];
    return station.items.map((item) => item.label).slice(0, 3).join(' • ');
  };

  const getStationState = (index: number, stationId: string) => {
    const isCompleted = progress.completedStations.includes(stationId);
    const isUnlocked = index <= nextUnlockedIndex;
    const isCurrent = index === nextUnlockedIndex && !isCompleted;

    if (isCompleted) return 'Completed';
    if (isCurrent) return 'Now Boarding';
    if (isUnlocked) return 'Ready';
    return 'Locked';
  };

  return (
    <div className={`min-h-screen overflow-hidden bg-gradient-to-b ${theme.page} relative px-3 sm:px-4 pt-10 sm:pt-12 pb-20 sm:pb-24`}>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amber-100/80 to-transparent" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-2 sm:gap-3">
        <motion.button
          onClick={() => navigate('/world')}
          className="h-10 w-10 flex-shrink-0 rounded-full bg-white/90 shadow-lg flex items-center justify-center sm:h-11 sm:w-11"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-body uppercase tracking-[0.22em] text-foreground/65">Platform Select</p>
            <h1 className="truncate text-xl font-display text-foreground sm:text-2xl">{island.name}</h1>
          </div>
        </div>

        <section className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <h2 className="text-sm font-display text-foreground sm:text-base">Platform Board</h2>
            <p className="text-xs font-body text-foreground/60">Tap any open stop</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {island.stations.map((station, index) => {
              const isUnlocked = index <= nextUnlockedIndex;
              const isSelected = progress.currentStation === index;

              return (
                <button
                  key={`tab-${station.id}`}
                  type="button"
                  onClick={() => isUnlocked && setCurrentStation(index)}
                  disabled={!isUnlocked}
                  className={`min-w-[140px] rounded-[1.4rem] border px-3 py-3 text-left shadow-md transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${theme.button} text-white border-white/40`
                      : isUnlocked
                        ? `bg-white/80 text-foreground ${theme.ticket}`
                        : 'border-white/50 bg-white/55 text-muted-foreground opacity-70'
                  }`}
                >
                  <span className="text-xs font-body uppercase tracking-[0.22em]">Platform {index + 1}</span>
                  <span className="mt-1 block truncate font-display text-sm">{station.name}</span>
                  <span className="mt-2 inline-flex rounded-full bg-black/10 px-2 py-0.5 text-xs font-body">
                    {getStationState(index, station.id)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className={`relative rounded-[2rem] bg-gradient-to-r ${theme.track} p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.08)]`}>
          <div className="rounded-[calc(2rem-1px)] bg-white/55 px-2 py-4 backdrop-blur-sm sm:px-4 sm:py-5">
            <div className="relative pl-7 sm:pl-10">
              <div className="absolute bottom-4 left-3 top-4 w-1 rounded-full bg-gradient-to-b from-amber-400 via-slate-500 to-amber-700 sm:left-4" />

              <div className="space-y-4">
                {island.stations.map((station, index) => {
                  const isCompleted = progress.completedStations.includes(station.id);
                  const isUnlocked = index <= nextUnlockedIndex;
                  const isCurrent = index === nextUnlockedIndex && !isCompleted;

                  return (
                    <motion.div
                      key={station.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, type: 'spring' }}
                      className={`relative overflow-hidden rounded-[1.7rem] border p-4 shadow-lg sm:p-5 ${
                        isUnlocked
                          ? isCurrent
                            ? `bg-white/95 ${theme.ticket} ring-2 ring-white/70`
                            : `bg-white/88 ${theme.ticket}`
                          : 'border-white/60 bg-white/55 opacity-80'
                      }`}
                    >
                      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white/40 to-transparent" />
                      <div className="relative flex items-start gap-3">
                        <div className="relative mt-1 flex flex-col items-center">
                          <ToyStationBadge active={isCurrent || isCompleted} locked={!isUnlocked} />
                          {index !== island.stations.length - 1 && <div className="mt-2 h-10 w-1 rounded-full bg-slate-200" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-body uppercase tracking-[0.22em] text-foreground/55">Stop {index + 1}</p>
                              <h3 className="truncate font-display text-lg text-foreground">{station.name}</h3>
                              <p className="mt-1 text-xs font-body text-foreground/65">{station.items.length} lesson items</p>
                            </div>
                            <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-body uppercase tracking-[0.18em] ${isCompleted ? 'bg-emerald-500/12 text-emerald-700' : isCurrent ? theme.accentSoft : isUnlocked ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/80 text-slate-500'}`}>
                              {getStationState(index, station.id)}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                            <motion.button
                              onClick={() => handleStation(index, 'watch')}
                              disabled={!isUnlocked}
                              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 font-display text-sm transition-colors ${
                                isUnlocked
                                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              }`}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Play className="h-4 w-4" />
                              <span>Watch</span>
                            </motion.button>
                            <motion.button
                              onClick={() => handleStation(index, 'play')}
                              disabled={!isUnlocked}
                              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 font-display text-sm transition-colors ${
                                isUnlocked
                                  ? `bg-gradient-to-r ${theme.button} text-white`
                                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              }`}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Gamepad2 className="h-4 w-4" />
                              <span>Play</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-md backdrop-blur-sm">
          <TrainFront className="h-4 w-4 text-foreground/70" />
          <p className="text-xs font-body text-foreground/65">Open stations continue the train route. Locked stations unlock as you finish each stop.</p>
        </div>
      </div>
    </div>
  );
}
