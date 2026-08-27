import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Journal} from '../types/app';
import * as journalsApi from '../api/journals';
import {useAppContext} from './AppContext';

type JournalContextType = {
  journals: Journal[];
  isLoading: boolean;
  isSaving: boolean;
  reload: () => Promise<void>;
  createJournal: (params: journalsApi.CreateJournalParams) => Promise<Journal>;
  updateJournal: (id: number, params: journalsApi.UpdateJournalParams) => Promise<void>;
  deleteJournal: (id: number) => Promise<void>;
};

const JournalContext = createContext<JournalContextType>({
  journals: [],
  isLoading: false,
  isSaving: false,
  reload: async () => {},
  createJournal: async () => { throw new Error('not ready'); },
  updateJournal: async () => {},
  deleteJournal: async () => {},
});

export function JournalProvider({children}: {children: React.ReactNode}) {
  const {authToken} = useAppContext();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const loadedRef = useRef(false);

  const reload = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const data = await journalsApi.listJournals(authToken);
      setJournals(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      // silent — user sees stale data
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (!authToken || loadedRef.current) return;
    loadedRef.current = true;
    reload();
  }, [authToken, reload]);

  useEffect(() => {
    if (!authToken) {
      setJournals([]);
      loadedRef.current = false;
    }
  }, [authToken]);

  const createJournal = useCallback(
    async (params: journalsApi.CreateJournalParams): Promise<Journal> => {
      if (!authToken) throw new Error('Not authenticated');
      setIsSaving(true);
      try {
        const entry = await journalsApi.createJournal(authToken, params);
        setJournals(prev => [entry, ...prev]);
        return entry;
      } finally {
        setIsSaving(false);
      }
    },
    [authToken],
  );

  const updateJournal = useCallback(
    async (id: number, params: journalsApi.UpdateJournalParams) => {
      if (!authToken) return;
      const updated = await journalsApi.updateJournal(authToken, id, params);
      setJournals(prev => prev.map(j => (j.id === id ? updated : j)));
    },
    [authToken],
  );

  const deleteJournal = useCallback(
    async (id: number) => {
      if (!authToken) return;
      await journalsApi.deleteJournal(authToken, id);
      setJournals(prev => prev.filter(j => j.id !== id));
    },
    [authToken],
  );

  return (
    <JournalContext.Provider
      value={{journals, isLoading, isSaving, reload, createJournal, updateJournal, deleteJournal}}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournals() {
  return useContext(JournalContext);
}
