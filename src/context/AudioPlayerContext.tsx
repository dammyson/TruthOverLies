import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import Tts from 'react-native-tts';
import {BibleVerse} from '../api/bible';

export type TtsVoice = {
  id: string;
  name: string;
  language: string;
};

export type AudioStatus = 'idle' | 'playing' | 'paused';

export type AudioTrack = {
  bookId: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
};

export const SPEED_STEPS = [
  {label: '0.5×', rate: 0.25},
  {label: '1×', rate: 0.5},
  {label: '1.5×', rate: 0.75},
  {label: '2×', rate: 1.0},
] as const;

type AudioPlayerContextType = {
  status: AudioStatus;
  track: AudioTrack | null;
  currentVerse: number | null;
  speedIndex: number;
  voices: TtsVoice[];
  activeVoiceId: string | null;
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipPrev: () => void;
  skipNext: () => void;
  cycleSpeed: () => void;
  setVoice: (voiceId: string) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({children}: {children: React.ReactNode}) {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);
  const [speedIndex, setSpeedIndex] = useState(1); // 1× default
  const [voices, setVoices] = useState<TtsVoice[]>([]);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);

  const queueRef = useRef<BibleVerse[]>([]);
  const queueIndexRef = useRef(0);
  const statusRef = useRef<AudioStatus>('idle');

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // speakAtRef lets the tts-finish closure always call the latest implementation
  const speakAtRef = useRef<(index: number) => void>(() => {});
  speakAtRef.current = (index: number) => {
    const verse = queueRef.current[index];
    if (!verse) return;
    queueIndexRef.current = index;
    setCurrentVerse(verse.verse);
    // Strip any OSIS/XML markup before speaking
    const plain = verse.text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    Tts.speak(plain);
  };

  useEffect(() => {
    Tts.getInitStatus()
      .then(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const all: any[] = await Tts.voices();
        const en: TtsVoice[] = all
          .filter(v => v.language?.startsWith('en') && !v.notInstalled)
          .map(v => ({id: v.id, name: v.name ?? v.id, language: v.language}));
        setVoices(en);
        if (en.length > 0) {
          setActiveVoiceId(en[0].id);
          await Tts.setDefaultVoice(en[0].id);
        }
        await Tts.setDefaultRate(SPEED_STEPS[1].rate);
      })
      .catch((err: unknown) => console.warn('[TTS] init:', err));

    // Listeners removed before TTS stopped in cleanup to prevent stale callbacks
    const finishSub = Tts.addEventListener('tts-finish', () => {
      if (statusRef.current !== 'playing') return;
      const next = queueIndexRef.current + 1;
      if (next < queueRef.current.length) {
        speakAtRef.current(next);
      } else {
        setStatus('idle');
        setCurrentVerse(null);
      }
    });

    const cancelSub = Tts.addEventListener('tts-cancel', () => {
      // fired when Tts.stop() is called — status already updated by pause/stop callers
    });

    return () => {
      finishSub.remove();
      cancelSub.remove();
      Tts.stop(false);
    };
  }, []);

  const play = useCallback((newTrack: AudioTrack) => {
    Tts.stop(false);
    setTrack(newTrack);
    setStatus('playing');
    queueRef.current = newTrack.verses;
    queueIndexRef.current = 0;
    speakAtRef.current(0);
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
    Tts.stop(false);
  }, []);

  const resume = useCallback(() => {
    setStatus('playing');
    speakAtRef.current(queueIndexRef.current);
  }, []);

  const stop = useCallback(() => {
    Tts.stop(false);
    setStatus('idle');
    setCurrentVerse(null);
    setTrack(null);
    queueRef.current = [];
    queueIndexRef.current = 0;
  }, []);

  const skipPrev = useCallback(() => {
    const prev = Math.max(0, queueIndexRef.current - 1);
    Tts.stop(false);
    if (statusRef.current === 'playing') {
      speakAtRef.current(prev);
    } else {
      queueIndexRef.current = prev;
      setCurrentVerse(queueRef.current[prev]?.verse ?? null);
    }
  }, []);

  const skipNext = useCallback(() => {
    const next = queueIndexRef.current + 1;
    if (next >= queueRef.current.length) return;
    Tts.stop(false);
    if (statusRef.current === 'playing') {
      speakAtRef.current(next);
    } else {
      queueIndexRef.current = next;
      setCurrentVerse(queueRef.current[next]?.verse ?? null);
    }
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedIndex(prev => {
      const next = (prev + 1) % SPEED_STEPS.length;
      Tts.setDefaultRate(SPEED_STEPS[next].rate);
      return next;
    });
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    setActiveVoiceId(voiceId);
    Tts.setDefaultVoice(voiceId);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        status,
        track,
        currentVerse,
        speedIndex,
        voices,
        activeVoiceId,
        play,
        pause,
        resume,
        stop,
        skipPrev,
        skipNext,
        cycleSpeed,
        setVoice,
      }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer(): AudioPlayerContextType {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
