import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import alphabetIslandImg from '@/assets/alphabet-island.png';
import animalIslandImg from '@/assets/animal-island.png';
import numberIslandImg from '@/assets/number-island.png';
import trainJourneyVideo from '@/assets/train-journey-alt.mp4';

const islandArt: Record<string, string> = {
  alphabet: alphabetIslandImg,
  numbers: numberIslandImg,
  animals: animalIslandImg,
};

const overlayTone: Record<string, string> = {
  alphabet: 'from-rose-100/10 via-fuchsia-100/5 to-slate-950/28',
  numbers: 'from-sky-100/10 via-cyan-100/5 to-slate-950/28',
  animals: 'from-emerald-100/10 via-lime-100/5 to-slate-950/28',
};

export default function TrainJourney() {
  const navigate = useNavigate();
  const { progress, currentIslands } = useGame();
  const [phase, setPhase] = useState<'moving' | 'arriving'>('moving');
  const [videoReady, setVideoReady] = useState(false);
  const [arrivalTriggerSec, setArrivalTriggerSec] = useState(2.4);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const island = currentIslands.find((entry) => entry.id === progress.currentIsland);
  const completedCount = island
    ? island.stations.filter((station) => progress.completedStations.includes(station.id)).length
    : 0;
  const nextUnlockedIndex = island ? Math.min(completedCount, island.stations.length - 1) : 0;
  const stationIndex = island ? Math.min(progress.currentStation, nextUnlockedIndex) : 0;
  const targetStation = island?.stations[stationIndex] ?? island?.stations[0];

  useEffect(() => {
    if (phase !== 'arriving') return;

    const navigateTimer = setTimeout(() => navigate('/stations'), 2200);
    return () => clearTimeout(navigateTimer);
  }, [phase, navigate]);

  useEffect(() => {
    if (phase !== 'moving' || typeof window === 'undefined') return;

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    let cancelled = false;
    let loopTimer: ReturnType<typeof setInterval> | null = null;
    let clackOffsetTimer: ReturnType<typeof setTimeout> | null = null;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);

    let steamSource: AudioBufferSourceNode | null = null;
    let rumbleOsc: OscillatorNode | null = null;

    const createNoiseBuffer = (durationSec: number) => {
      const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * durationSec)), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.75;
      }
      return buffer;
    };

    const playTone = (
      frequency: number,
      start: number,
      duration: number,
      type: OscillatorType,
      volume: number,
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.04);
    };

    const playTrackClack = () => {
      if (cancelled) return;

      const clackSource = ctx.createBufferSource();
      clackSource.buffer = createNoiseBuffer(0.06);

      const bandPass = ctx.createBiquadFilter();
      bandPass.type = 'bandpass';
      bandPass.frequency.value = 920;
      bandPass.Q.value = 0.9;

      const clackGain = ctx.createGain();
      const now = ctx.currentTime;
      clackGain.gain.setValueAtTime(0.0001, now);
      clackGain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
      clackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      clackSource.connect(bandPass);
      bandPass.connect(clackGain);
      clackGain.connect(master);
      clackSource.start(now);
      clackSource.stop(now + 0.07);
    };

    const startMovingAudio = async () => {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        if (cancelled) return;

        // Soft whistle once at start.
        playTone(760, 0.0, 0.22, 'triangle', 0.042);
        playTone(640, 0.14, 0.18, 'triangle', 0.035);

        // Continuous steam hiss.
        steamSource = ctx.createBufferSource();
        steamSource.buffer = createNoiseBuffer(1.8);
        steamSource.loop = true;
        const steamFilter = ctx.createBiquadFilter();
        steamFilter.type = 'lowpass';
        steamFilter.frequency.value = 1200;
        const steamGain = ctx.createGain();
        steamGain.gain.value = 0.028;
        steamSource.connect(steamFilter);
        steamFilter.connect(steamGain);
        steamGain.connect(master);
        steamSource.start();

        // Low engine rumble.
        rumbleOsc = ctx.createOscillator();
        rumbleOsc.type = 'sawtooth';
        rumbleOsc.frequency.value = 62;
        const rumbleFilter = ctx.createBiquadFilter();
        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.value = 180;
        const rumbleGain = ctx.createGain();
        rumbleGain.gain.value = 0.022;
        rumbleOsc.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(master);
        rumbleOsc.start();

        // Rail clacks: main beat + offset beat.
        playTrackClack();
        clackOffsetTimer = setTimeout(() => playTrackClack(), 180);
        loopTimer = setInterval(() => {
          playTrackClack();
          clackOffsetTimer = setTimeout(() => playTrackClack(), 180);
        }, 520);
      } catch {
        // Ignore autoplay-restricted environments.
      }
    };

    startMovingAudio();

    return () => {
      cancelled = true;
      if (loopTimer) {
        clearInterval(loopTimer);
      }
      if (clackOffsetTimer) {
        clearTimeout(clackOffsetTimer);
      }
      if (steamSource) {
        try {
          steamSource.stop();
        } catch {
          // No-op cleanup fallback.
        }
      }
      if (rumbleOsc) {
        try {
          rumbleOsc.stop();
        } catch {
          // No-op cleanup fallback.
        }
      }
      ctx.close().catch(() => {
        // No-op cleanup fallback.
      });
    };
  }, [phase]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        src={trainJourneyVideo}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoReady(true)}
        onLoadedMetadata={(event) => {
          const duration = event.currentTarget.duration;
          if (!Number.isFinite(duration) || duration <= 0) {
            setArrivalTriggerSec(2.4);
            return;
          }

          // Show the station card earlier so it appears before the train reaches the station.
          const trigger = Math.max(1.5, Math.min(duration - 1.4, duration * 0.55));
          setArrivalTriggerSec(trigger);
        }}
        onTimeUpdate={(event) => {
          if (phase !== 'moving') return;
          const current = event.currentTarget.currentTime;
          if (current >= arrivalTriggerSec) {
            setPhase('arriving');
          }
        }}
      />

      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: videoReady ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      />

      <div className={`absolute inset-0 bg-gradient-to-b ${overlayTone[island?.id || ''] || 'from-slate-100/5 via-transparent to-slate-950/30'}`} />
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-900/35 to-transparent" />

      {phase === 'moving' && island && targetStation && (
        <motion.div
          className="absolute inset-x-0 top-safe z-10 flex justify-center px-4 pt-4"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 rounded-full border border-white/45 bg-white/55 px-4 py-2 text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <img
              src={islandArt[island.id]}
              alt={island.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
            />
            <div className="min-w-0">
              <p className="text-xs font-body uppercase tracking-[0.24em] text-slate-700/70">Now Traveling</p>
              <p className="truncate font-display text-sm sm:text-base">{island.name} • {targetStation.name}</p>
            </div>
            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-body uppercase tracking-[0.14em] text-slate-700">Arriving Soon</span>
          </div>
        </motion.div>
      )}

      {phase === 'arriving' && island && targetStation && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center px-6"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14 }}
        >
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center text-slate-900 shadow-[0_24px_50px_rgba(0,0,0,0.2)] sm:p-8">
            <div className="mx-auto inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-body uppercase tracking-[0.2em] text-white">
              Station Arrival
            </div>
            <img
              src={islandArt[island.id]}
              alt={island.name}
              className="mx-auto mt-3 h-20 w-20 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)]"
            />
            <p className="mt-4 text-xs font-body uppercase tracking-[0.28em] text-slate-600">Arriving At</p>
            <h1 className="mt-2 font-display text-3xl text-slate-900 sm:text-4xl">{targetStation.name}</h1>
            <p className="mt-2 text-sm font-body text-slate-700 sm:text-base">Welcome to {island.name}. Your next learning stop is ready.</p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300" />
            <div className="mt-5 flex justify-center gap-2">
              {targetStation.items.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-display text-slate-800 shadow-sm"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.15 }}
                >
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
