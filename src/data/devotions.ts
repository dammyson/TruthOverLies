import {DevotionCard, FeelingOption} from '../types/app';

type VerseEntry = Omit<DevotionCard, 'id' | 'feelings'>;

export const feelingOptions: FeelingOption[] = [
  'Anxious',
  'Grateful',
  'Lonely',
  'Hopeful',
  'Tired',
  'Confused',
  'Joyful',
  'Heavy',
];

const devotionLibrary: Record<FeelingOption, VerseEntry[]> = {
  Anxious: [
    {
      title: 'Peace for today',
      encouragement:
        'God is not asking you to solve tomorrow tonight. Bring the pressure into prayer and let His peace meet you in the middle of it.',
      verse: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
      reference: 'Philippians 4:6',
    },
    {
      title: 'Held together',
      encouragement:
        'When your mind feels scattered, the Lord remains steady. He is close to your breath, your body, and your thoughts.',
      verse: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.',
      reference: 'Isaiah 26:3',
    },
  ],
  Grateful: [
    {
      title: 'A thankful heart',
      encouragement:
        'Gratitude keeps your attention on what grace is already doing. Let thanksgiving become part of your worship today.',
      verse: 'O give thanks unto the Lord; for he is good: for his mercy endureth for ever.',
      reference: 'Psalm 107:1',
    },
    {
      title: 'Remember His goodness',
      encouragement:
        'Pause long enough to name the good things God has done. Gratitude deepens trust for what is still ahead.',
      verse: 'Bless the Lord, O my soul, and forget not all his benefits.',
      reference: 'Psalm 103:2',
    },
  ],
  Lonely: [
    {
      title: 'Never abandoned',
      encouragement:
        'Even in quiet seasons, you are not unaccompanied. The presence of God is real even when the room feels empty.',
      verse: 'When my father and my mother forsake me, then the Lord will take me up.',
      reference: 'Psalm 27:10',
    },
    {
      title: 'Seen and known',
      encouragement:
        'The Lord notices what others miss. He stays with you in the private places where loneliness grows.',
      verse: 'I will not leave you comfortless: I will come to you.',
      reference: 'John 14:18',
    },
  ],
  Hopeful: [
    {
      title: 'Keep looking up',
      encouragement:
        'Hope is not wishful thinking. It is confidence that God can still write good chapters from unfinished places.',
      verse: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.',
      reference: 'Jeremiah 29:11',
    },
    {
      title: 'Strength to continue',
      encouragement:
        'What God starts, He sustains. Stay open to the quiet ways hope keeps returning.',
      verse: 'But they that wait upon the Lord shall renew their strength.',
      reference: 'Isaiah 40:31',
    },
  ],
  Tired: [
    {
      title: 'Rest for your soul',
      encouragement:
        'Weariness is not failure. Let Christ meet your exhaustion with rest that is both tender and strong.',
      verse: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      reference: 'Matthew 11:28',
    },
    {
      title: 'Quiet renewal',
      encouragement:
        'God restores more than energy. He renews the inner person when you feel spent and stretched thin.',
      verse: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.',
      reference: 'Psalm 23:3',
    },
  ],
  Confused: [
    {
      title: 'Guided step by step',
      encouragement:
        'You may not have the full map yet, but God is faithful with the next step. Clarity often comes while walking with Him.',
      verse: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.',
      reference: 'Proverbs 3:5',
    },
    {
      title: 'Light for the path',
      encouragement:
        'Confusion does not disqualify you from guidance. The Lord gives light in portions you can carry.',
      verse: 'Thy word is a lamp unto my feet, and a light unto my path.',
      reference: 'Psalm 119:105',
    },
  ],
  Joyful: [
    {
      title: 'Joy with purpose',
      encouragement:
        'Joy can become testimony. Let today’s gladness turn into praise and generosity toward someone else.',
      verse: 'The joy of the Lord is your strength.',
      reference: 'Nehemiah 8:10',
    },
    {
      title: 'Celebrate His faithfulness',
      encouragement:
        'Receive this bright moment as a gift. Joy is holy when it remembers the Giver.',
      verse: 'This is the day which the Lord hath made; we will rejoice and be glad in it.',
      reference: 'Psalm 118:24',
    },
  ],
  Heavy: [
    {
      title: 'Strength under the weight',
      encouragement:
        'God does not turn away from what feels heavy. He offers strength that meets you where the burden sits.',
      verse: 'Cast thy burden upon the Lord, and he shall sustain thee.',
      reference: 'Psalm 55:22',
    },
    {
      title: 'Lifted by grace',
      encouragement:
        'When your heart feels loaded down, grace is not absent. The Lord carries what you cannot hold alone.',
      verse: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee.',
      reference: 'Isaiah 41:10',
    },
  ],
};

export function buildDevotions(feelings: FeelingOption[]): DevotionCard[] {
  const limitedFeelings = feelings.slice(0, 4);
  const count = limitedFeelings.length <= 1 ? 1 : 2;

  return limitedFeelings.slice(0, count).map((feeling, index) => {
    const entries = devotionLibrary[feeling];
    const entry = entries[index % entries.length];

    return {
      id: `${feeling}-${index}`,
      feelings: limitedFeelings,
      ...entry,
    };
  });
}