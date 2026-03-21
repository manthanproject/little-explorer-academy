export interface Station {
  id: string;
  name: string;
  items: LearningItem[];
  gameType: GameType;
  gameUrl?: string;
  videoUrl?: string;
}

export interface LearningItem {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export type GameType = 'tap' | 'match' | 'count' | 'find' | 'pop';

export interface Island {
  id: string;
  name: string;
  emoji: string;
  colorClass: string;
  stations: Station[];
}

export const islands: Island[] = [
  {
    id: 'alphabet',
    name: 'Reading Island',
    emoji: '📖',
    colorClass: 'island-alphabet',
    stations: [
      {
        id: 'abc',
        name: 'Alphabets (A-Z)',
        gameType: 'tap',
        gameUrl: 'https://www.madkidgames.com/full/word-search-word-puzzle',
        videoUrl: 'https://youtu.be/krpkQhdkyKw',
        items: [
          { id: 'a', label: 'A', emoji: '🔤', description: 'Learn alphabet letter A', color: 'hsl(0, 80%, 60%)' },
          { id: 'b', label: 'M', emoji: '🔤', description: 'Learn alphabet letter M', color: 'hsl(200, 80%, 60%)' },
          { id: 'c', label: 'Z', emoji: '🔤', description: 'Learn alphabet letter Z', color: 'hsl(30, 80%, 60%)' },
        ],
      },
      {
        id: 'def',
        name: 'Phonics & Sounds',
        gameType: 'match',
        gameUrl: 'https://www.madkidgames.com/full/sunny-school-stories',
        videoUrl: 'https://youtu.be/6kRMSkYzBMk',
        items: [
          { id: 'd', label: 'b', emoji: '🔊', description: 'Phonics sound for letter B', color: 'hsl(25, 70%, 50%)' },
          { id: 'e', label: 'm', emoji: '🔊', description: 'Phonics sound for letter M', color: 'hsl(210, 30%, 60%)' },
          { id: 'f', label: 's', emoji: '🔊', description: 'Phonics sound for letter S', color: 'hsl(190, 80%, 50%)' },
        ],
      },
      {
        id: 'ghi',
        name: 'Simple Words',
        gameType: 'tap',
        gameUrl: 'https://www.madkidgames.com/full/wolfoo-a-day-at-school',
        videoUrl: 'https://youtu.be/oQP3hMwJ8o0',
        items: [
          { id: 'g', label: 'cat', emoji: '🐱', description: 'Read the word cat', color: 'hsl(280, 60%, 50%)' },
          { id: 'h', label: 'dog', emoji: '🐶', description: 'Read the word dog', color: 'hsl(15, 70%, 50%)' },
          { id: 'i', label: 'sun', emoji: '☀️', description: 'Read the word sun', color: 'hsl(340, 70%, 70%)' },
        ],
      },
      {
        id: 'jkl',
        name: 'Short Sentences',
        gameType: 'match',
        gameUrl: 'https://www.madkidgames.com/full/word-search-word-puzzle',
        videoUrl: 'https://youtu.be/IY2t2blR5RE',
        items: [
          { id: 'j', label: 'I am Sam', emoji: '📝', description: 'Read a short sentence', color: 'hsl(40, 90%, 55%)' },
          { id: 'k', label: 'This is a cat', emoji: '📝', description: 'Read a short sentence', color: 'hsl(160, 70%, 50%)' },
          { id: 'l', label: 'The sun is hot', emoji: '📝', description: 'Read a short sentence', color: 'hsl(35, 80%, 55%)' },
        ],
      },
      {
        id: 'alphabet-review',
        name: 'Story Reading',
        gameType: 'pop',
        gameUrl: 'https://www.madkidgames.com/full/sunny-school-stories',
        videoUrl: 'https://youtu.be/gDCJ6wSpNoU',
        items: [
          { id: 'a2', label: 'Story 1', emoji: '📘', description: 'Read a short story', color: 'hsl(0, 80%, 60%)' },
          { id: 'b2', label: 'Story 2', emoji: '📗', description: 'Read a short story', color: 'hsl(200, 80%, 60%)' },
          { id: 'c2', label: 'Story 3', emoji: '📕', description: 'Read a short story', color: 'hsl(30, 80%, 60%)' },
          { id: 'd2', label: 'Story 4', emoji: '📙', description: 'Read a short story', color: 'hsl(25, 70%, 50%)' },
        ],
      },
    ],
  },
  {
    id: 'numbers',
    name: 'Logic Island',
    emoji: '🔢',
    colorClass: 'island-number',
    stations: [
      {
        id: 'num-1-3',
        name: 'Numbers (1-100)',
        gameType: 'count',
        gameUrl: 'https://www.madkidgames.com/full/domino-hexa-puzzle',
        videoUrl: 'https://youtu.be/bGetqbqDVaA',
        items: [
          { id: 'n1', label: '1-20', emoji: '🔢', description: 'Practice number sequence 1 to 20', color: 'hsl(45, 100%, 55%)' },
          { id: 'n2', label: '21-50', emoji: '🔢', description: 'Practice number sequence 21 to 50', color: 'hsl(300, 70%, 60%)' },
          { id: 'n3', label: '51-100', emoji: '🔢', description: 'Practice number sequence 51 to 100', color: 'hsl(0, 80%, 60%)' },
        ],
      },
      {
        id: 'num-4-6',
        name: 'Counting Objects',
        gameType: 'count',
        gameUrl: 'https://www.madkidgames.com/full/wolfoo-learns-numbers-and-shapes',
        videoUrl: 'https://youtu.be/P8S09KZrHt0',
        items: [
          { id: 'n4', label: 'Count Apples', emoji: '🍎', description: 'Count objects carefully', color: 'hsl(330, 70%, 60%)' },
          { id: 'n5', label: 'Count Stars', emoji: '⭐', description: 'Count objects carefully', color: 'hsl(280, 60%, 60%)' },
          { id: 'n6', label: 'Count Balls', emoji: '⚽', description: 'Count objects carefully', color: 'hsl(200, 80%, 55%)' },
        ],
      },
      {
        id: 'num-7-9',
        name: 'Addition',
        gameType: 'count',
        gameUrl: 'https://www.madkidgames.com/full/domino-hexa-puzzle',
        videoUrl: 'https://youtu.be/gf97tXwTDe0',
        items: [
          { id: 'n7', label: '1 + 2', emoji: '➕', description: 'Learn basic addition', color: 'hsl(50, 100%, 55%)' },
          { id: 'n8', label: '3 + 4', emoji: '➕', description: 'Learn basic addition', color: 'hsl(180, 70%, 50%)' },
          { id: 'n9', label: '5 + 2', emoji: '➕', description: 'Learn basic addition', color: 'hsl(0, 70%, 55%)' },
        ],
      },
      {
        id: 'num-10',
        name: 'Subtraction',
        gameType: 'tap',
        gameUrl: 'https://www.madkidgames.com/full/wolfoo-learns-numbers-and-shapes',
        videoUrl: 'https://youtu.be/jsoAuqfnhnA',
        items: [
          { id: 'n10', label: '5 - 2', emoji: '➖', description: 'Learn basic subtraction', color: 'hsl(25, 90%, 55%)' },
        ],
      },
      {
        id: 'number-review',
        name: 'Shapes',
        gameType: 'count',
        gameUrl: 'https://www.madkidgames.com/full/domino-hexa-puzzle',
        videoUrl: 'https://youtu.be/lcl8uB2AWM0',
        items: [
          { id: 'nc1', label: 'Circle', emoji: '⚪', description: 'Identify circle shape', color: 'hsl(0, 70%, 55%)' },
          { id: 'nc2', label: 'Square', emoji: '🟦', description: 'Identify square shape', color: 'hsl(45, 100%, 55%)' },
          { id: 'nc3', label: 'Triangle', emoji: '🔺', description: 'Identify triangle shape', color: 'hsl(200, 70%, 55%)' },
        ],
      },
    ],
  },
  {
    id: 'animals',
    name: 'Discovery Island',
    emoji: '🌍',
    colorClass: 'island-animal',
    stations: [
      {
        id: 'farm',
        name: 'My Family',
        gameType: 'find',
        gameUrl: 'https://www.madkidgames.com/full/my-town-school',
        videoUrl: 'https://www.youtube.com/watch?v=B7qmfsEYe-4',
        items: [
          { id: 'cow', label: 'Father', emoji: '👨', description: 'Learn about family member Father', color: 'hsl(30, 20%, 60%)' },
          { id: 'chicken', label: 'Mother', emoji: '👩', description: 'Learn about family member Mother', color: 'hsl(40, 80%, 55%)' },
          { id: 'pig', label: 'Sibling', emoji: '🧒', description: 'Learn about brother and sister', color: 'hsl(340, 60%, 70%)' },
        ],
      },
      {
        id: 'jungle',
        name: 'My School',
        gameType: 'find',
        gameUrl: 'https://www.madkidgames.com/full/wolfoo-a-day-at-school',
        videoUrl: 'https://www.youtube.com/watch?v=8tWmUhCfcvU',
        items: [
          { id: 'lion', label: 'Classroom', emoji: '🏫', description: 'Identify the classroom', color: 'hsl(35, 80%, 55%)' },
          { id: 'monkey', label: 'Teacher', emoji: '🧑‍🏫', description: 'Identify the teacher', color: 'hsl(25, 50%, 45%)' },
          { id: 'elephant', label: 'Friends', emoji: '🧑‍🤝‍🧑', description: 'Identify school friends', color: 'hsl(210, 20%, 60%)' },
        ],
      },
      {
        id: 'birds',
        name: 'Animals & Birds',
        gameType: 'tap',
        gameUrl: 'https://www.madkidgames.com/full/wolfoo-learns-numbers-and-shapes',
        videoUrl: 'https://youtu.be/39G0wYrE2Vc',
        items: [
          { id: 'parrot', label: 'Pet Animals', emoji: '🐶', description: 'Learn pet animals', color: 'hsl(120, 70%, 45%)' },
          { id: 'owl', label: 'Wild Animals', emoji: '🦁', description: 'Learn wild animals', color: 'hsl(25, 40%, 45%)' },
          { id: 'penguin', label: 'Birds', emoji: '🦜', description: 'Learn basic birds', color: 'hsl(210, 10%, 30%)' },
        ],
      },
      {
        id: 'sea',
        name: 'Plants & Trees',
        gameType: 'find',
        gameUrl: 'https://www.madkidgames.com/full/my-town-school',
        videoUrl: 'https://youtu.be/oTEsrsjXrmQ',
        items: [
          { id: 'fish', label: 'Roots', emoji: '🌱', description: 'Identify root part of plant', color: 'hsl(190, 80%, 50%)' },
          { id: 'whale', label: 'Stem', emoji: '🌿', description: 'Identify stem part of plant', color: 'hsl(200, 70%, 55%)' },
          { id: 'octopus', label: 'Leaves', emoji: '🍃', description: 'Identify leaf part of plant', color: 'hsl(330, 60%, 55%)' },
        ],
      },
      {
        id: 'animal-sounds',
        name: 'Good Habits',
        gameType: 'match',
        gameUrl: 'https://www.madkidgames.com/full/sunny-school-stories',
        videoUrl: 'https://youtu.be/cnzPAznVW5w',
        items: [
          { id: 's-cow', label: 'Brushing Teeth', emoji: '🪥', description: 'Practice brushing teeth habit', color: 'hsl(30, 20%, 60%)' },
          { id: 's-lion', label: 'Cleanliness', emoji: '🧼', description: 'Practice cleanliness habit', color: 'hsl(35, 80%, 55%)' },
          { id: 's-cat', label: 'Helping Others', emoji: '🤝', description: 'Practice helping others', color: 'hsl(30, 60%, 55%)' },
        ],
      },
    ],
  },
];

export const studentProfiles = [
  { id: '1', name: 'Aarav', class: 'Nursery', division: 'A', rollNo: 12, avatar: '👦' },
  { id: '2', name: 'Priya', class: 'Nursery', division: 'B', rollNo: 5, avatar: '👧' },
  { id: '3', name: 'Rahi', class: 'Nursery', division: 'A', rollNo: 8, avatar: '🧒' },
];

type CurriculumOverrides = Record<string, {
  name?: string;
  emoji?: string;
  stations: Array<{
    name?: string;
    items?: Array<Partial<LearningItem>>;
  }>;
}>;

function buildCurriculum(overrides: CurriculumOverrides): Island[] {
  return islands.map((island) => {
    const islandOverride = overrides[island.id];
    return {
      ...island,
      name: islandOverride?.name ?? island.name,
      emoji: islandOverride?.emoji ?? island.emoji,
      stations: island.stations.map((station, stationIndex) => {
        const stationOverride = islandOverride?.stations?.[stationIndex];
        return {
          ...station,
          name: stationOverride?.name ?? station.name,
          items: station.items.map((item, itemIndex) => ({
            ...item,
            ...(stationOverride?.items?.[itemIndex] ?? {}),
          })),
        };
      }),
    };
  });
}

const class2Curriculum = buildCurriculum({
  alphabet: {
    stations: [
      {
        name: 'Vowels & Consonants',
        items: [
          { label: 'A E I O U', description: 'Identify vowels' },
          { label: 'B C D', description: 'Identify consonants' },
          { label: 'K L M', description: 'Group letters correctly' },
        ],
      },
      {
        name: 'Blends & Sounds',
        items: [
          { label: 'sh', description: 'Learn the sh sound' },
          { label: 'ch', description: 'Learn the ch sound' },
          { label: 'th', description: 'Learn the th sound' },
        ],
      },
      {
        name: 'Word Families',
        items: [
          { label: 'cat', description: 'Read the -at family word' },
          { label: 'sun', description: 'Read the -un family word' },
          { label: 'hen', description: 'Read the -en family word' },
        ],
      },
      {
        name: 'Sentence Making',
        items: [
          { label: 'This is my bag', description: 'Read and form a simple sentence' },
          { label: 'The bird can fly', description: 'Read and form a simple sentence' },
          { label: 'I like red apples', description: 'Read and form a simple sentence' },
        ],
      },
      {
        name: 'Reading Practice',
        items: [
          { label: 'Story A', description: 'Read a short class 2 story' },
          { label: 'Story B', description: 'Read a short class 2 story' },
          { label: 'Story C', description: 'Read a short class 2 story' },
          { label: 'Story D', description: 'Read a short class 2 story' },
        ],
      },
    ],
  },
  numbers: {
    stations: [
      {
        name: 'Place Value',
        items: [
          { label: 'Tens', description: 'Understand tens place' },
          { label: 'Ones', description: 'Understand ones place' },
          { label: '42', description: 'Read a two-digit number' },
        ],
      },
      {
        name: 'Count & Compare',
        items: [
          { label: 'More', description: 'Compare which group has more' },
          { label: 'Less', description: 'Compare which group has less' },
          { label: 'Equal', description: 'Find equal groups' },
        ],
      },
      {
        name: 'Addition Facts',
        items: [
          { label: '8 + 2', description: 'Practice addition facts' },
          { label: '7 + 5', description: 'Practice addition facts' },
          { label: '9 + 4', description: 'Practice addition facts' },
        ],
      },
      {
        name: 'Subtraction Facts',
        items: [
          { label: '9 - 3', description: 'Practice subtraction facts' },
        ],
      },
      {
        name: 'Shapes & Patterns',
        items: [
          { label: 'Rectangle', description: 'Identify rectangle shape' },
          { label: 'Oval', description: 'Identify oval shape' },
          { label: 'Pattern', description: 'Continue a simple pattern' },
        ],
      },
    ],
  },
  animals: {
    stations: [
      {
        name: 'My Body',
        items: [
          { label: 'Eyes', emoji: '👀', description: 'Identify the eyes' },
          { label: 'Hands', emoji: '✋', description: 'Identify the hands' },
          { label: 'Legs', emoji: '🦵', description: 'Identify the legs' },
        ],
      },
      {
        name: 'Community Helpers',
        items: [
          { label: 'Doctor', emoji: '🧑‍⚕️', description: 'Identify the doctor' },
          { label: 'Teacher', emoji: '🧑‍🏫', description: 'Identify the teacher' },
          { label: 'Farmer', emoji: '🧑‍🌾', description: 'Identify the farmer' },
        ],
      },
      {
        name: 'Animals Around Us',
        items: [
          { label: 'Domestic Animals', emoji: '🐄', description: 'Learn domestic animals' },
          { label: 'Wild Animals', emoji: '🐯', description: 'Learn wild animals' },
          { label: 'Birds', emoji: '🦚', description: 'Learn common birds' },
        ],
      },
      {
        name: 'Plants Around Us',
        items: [
          { label: 'Roots', emoji: '🌱', description: 'Identify root part' },
          { label: 'Flowers', emoji: '🌸', description: 'Identify flower part' },
          { label: 'Fruits', emoji: '🍎', description: 'Identify plant fruits' },
        ],
      },
      {
        name: 'Healthy Habits',
        items: [
          { label: 'Exercise', emoji: '🏃', description: 'Practice exercise habit' },
          { label: 'Bathing', emoji: '🛁', description: 'Practice bathing habit' },
          { label: 'Sharing', emoji: '🤝', description: 'Practice sharing habit' },
        ],
      },
    ],
  },
});

const class3Curriculum = buildCurriculum({
  alphabet: {
    stations: [
      {
        name: 'Grammar Basics',
        items: [
          { label: 'Noun', description: 'Identify nouns' },
          { label: 'Verb', description: 'Identify verbs' },
          { label: 'Adjective', description: 'Identify adjectives' },
        ],
      },
      {
        name: 'Spellings & Sounds',
        items: [
          { label: 'school', description: 'Practice spelling school' },
          { label: 'garden', description: 'Practice spelling garden' },
          { label: 'yellow', description: 'Practice spelling yellow' },
        ],
      },
      {
        name: 'Vocabulary Building',
        items: [
          { label: 'happy', description: 'Learn new vocabulary word' },
          { label: 'river', description: 'Learn new vocabulary word' },
          { label: 'forest', description: 'Learn new vocabulary word' },
        ],
      },
      {
        name: 'Punctuation & Sentences',
        items: [
          { label: 'Use full stop', description: 'Identify punctuation correctly' },
          { label: 'Use question mark', description: 'Identify punctuation correctly' },
          { label: 'Use comma', description: 'Identify punctuation correctly' },
        ],
      },
      {
        name: 'Reading Comprehension',
        items: [
          { label: 'Passage 1', description: 'Read and answer from passage 1' },
          { label: 'Passage 2', description: 'Read and answer from passage 2' },
          { label: 'Passage 3', description: 'Read and answer from passage 3' },
          { label: 'Passage 4', description: 'Read and answer from passage 4' },
        ],
      },
    ],
  },
  numbers: {
    stations: [
      {
        name: '3-Digit Numbers',
        items: [
          { label: '145', description: 'Read three-digit numbers' },
          { label: '268', description: 'Read three-digit numbers' },
          { label: '390', description: 'Read three-digit numbers' },
        ],
      },
      {
        name: 'Measurement',
        items: [
          { label: 'Length', description: 'Measure long and short objects' },
          { label: 'Weight', description: 'Compare heavy and light' },
          { label: 'Capacity', description: 'Compare full and empty containers' },
        ],
      },
      {
        name: 'Addition & Carrying',
        items: [
          { label: '28 + 17', description: 'Practice carrying in addition' },
          { label: '45 + 29', description: 'Practice carrying in addition' },
          { label: '66 + 18', description: 'Practice carrying in addition' },
        ],
      },
      {
        name: 'Subtraction & Borrowing',
        items: [
          { label: '54 - 19', description: 'Practice borrowing in subtraction' },
        ],
      },
      {
        name: 'Multiplication & Division',
        items: [
          { label: '2 x 4', description: 'Learn multiplication fact' },
          { label: '3 x 5', description: 'Learn multiplication fact' },
          { label: '12 ÷ 3', description: 'Learn division fact' },
        ],
      },
    ],
  },
  animals: {
    stations: [
      {
        name: 'Food & Nutrition',
        items: [
          { label: 'Healthy Food', emoji: '🥗', description: 'Identify healthy food' },
          { label: 'Junk Food', emoji: '🍟', description: 'Identify junk food' },
          { label: 'Water', emoji: '💧', description: 'Identify healthy drink choice' },
        ],
      },
      {
        name: 'Transport',
        items: [
          { label: 'Land', emoji: '🚌', description: 'Identify land transport' },
          { label: 'Water', emoji: '⛵', description: 'Identify water transport' },
          { label: 'Air', emoji: '✈️', description: 'Identify air transport' },
        ],
      },
      {
        name: 'Animals & Habitats',
        items: [
          { label: 'Forest Animals', emoji: '🐘', description: 'Match animals to forest habitat' },
          { label: 'Water Animals', emoji: '🐬', description: 'Match animals to water habitat' },
          { label: 'Birds', emoji: '🦅', description: 'Match birds to sky habitat' },
        ],
      },
      {
        name: 'Plants & Environment',
        items: [
          { label: 'Seed', emoji: '🌰', description: 'Identify seed stage of plant' },
          { label: 'Sapling', emoji: '🌿', description: 'Identify sapling stage of plant' },
          { label: 'Tree', emoji: '🌳', description: 'Identify tree stage of plant' },
        ],
      },
      {
        name: 'Safety & Responsibility',
        items: [
          { label: 'Traffic Rules', emoji: '🚦', description: 'Learn simple traffic rules' },
          { label: 'Keep Clean', emoji: '🧹', description: 'Practice cleanliness' },
          { label: 'Help Others', emoji: '🤝', description: 'Practice responsibility' },
        ],
      },
    ],
  },
});

export const classCurricula: Record<string, Island[]> = {
  '1': islands,
  '2': class2Curriculum,
  '3': class3Curriculum,
};

export function normalizeClassLevel(className?: string | null): '1' | '2' | '3' {
  const match = className?.match(/[123]/)?.[0];
  if (match === '2' || match === '3') return match;
  return '1';
}

export function getCurriculumForClass(className?: string | null): Island[] {
  return classCurricula[normalizeClassLevel(className)] ?? islands;
}
