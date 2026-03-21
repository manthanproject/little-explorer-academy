export interface Reward {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  check: (completedStations: string[], stars: number) => boolean;
}

// Station IDs grouped by island — must stay in sync with learningContent.ts
const READING_STATIONS   = ['abc', 'def', 'ghi', 'jkl', 'alphabet-review'];
const LOGIC_STATIONS     = ['num-1-3', 'num-4-6', 'num-7-9', 'num-10', 'number-review'];
const DISCOVERY_STATIONS = ['farm', 'jungle', 'birds', 'sea', 'animal-sounds'];
const ALL_STATIONS       = [...READING_STATIONS, ...LOGIC_STATIONS, ...DISCOVERY_STATIONS];

export const REWARDS: Reward[] = [
  {
    id: 'bookworm',
    title: 'Reading Master',
    description: 'Completed all 5 stops in Reading Island.',
    emoji: '📚',
    color: '#8B5CF6',
    check: (s) => READING_STATIONS.every(id => s.includes(id)),
  },
  {
    id: 'math-wizard',
    title: 'Logic Master',
    description: 'Completed all 5 stops in Logic Island.',
    emoji: '🔢',
    color: '#F97316',
    check: (s) => LOGIC_STATIONS.every(id => s.includes(id)),
  },
  {
    id: 'discovery-explorer',
    title: 'Discovery Master',
    description: 'Completed all 5 stops in Discovery Island.',
    emoji: '🌍',
    color: '#10B981',
    check: (s) => DISCOVERY_STATIONS.every(id => s.includes(id)),
  },
];
