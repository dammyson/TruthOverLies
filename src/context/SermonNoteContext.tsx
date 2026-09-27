import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

import {SermonNote} from '../types/app';
import {useAppContext} from './AppContext';
import * as sermonNotesApi from '../api/sermonNotes';

type SermonNoteContextType = {
  sermonNotes: SermonNote[];
  isLoading: boolean;
  isSaving: boolean;
  reload: () => Promise<void>;
  createSermonNote: (params: sermonNotesApi.CreateSermonNoteParams) => Promise<SermonNote>;
  updateSermonNote: (id: number, params: sermonNotesApi.UpdateSermonNoteParams) => Promise<SermonNote>;
  deleteSermonNote: (id: number) => Promise<void>;
};

const SermonNoteContext = createContext<SermonNoteContextType>({
  sermonNotes: [],
  isLoading: false,
  isSaving: false,
  reload: async () => {},
  createSermonNote: async () => {
    throw new Error('not ready');
  },
  updateSermonNote: async () => {
    throw new Error('not ready');
  },
  deleteSermonNote: async () => {},
});

export function SermonNoteProvider({children}: {children: React.ReactNode}) {
  const {authToken} = useAppContext();
  const [sermonNotes, setSermonNotes] = useState<SermonNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const loadedRef = useRef(false);

  const reload = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const items = await sermonNotesApi.listSermonNotes(authToken);
      setSermonNotes(items);
    } catch {
      // Keep stale notes if request fails.
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
      setSermonNotes([]);
      loadedRef.current = false;
    }
  }, [authToken]);

  const createSermonNote = useCallback(
    async (params: sermonNotesApi.CreateSermonNoteParams) => {
      if (!authToken) throw new Error('Not authenticated');
      setIsSaving(true);
      try {
        const created = await sermonNotesApi.createSermonNote(authToken, params);
        setSermonNotes(prev => [created, ...prev]);
        return created;
      } finally {
        setIsSaving(false);
      }
    },
    [authToken],
  );

  const updateSermonNote = useCallback(
    async (id: number, params: sermonNotesApi.UpdateSermonNoteParams) => {
      if (!authToken) throw new Error('Not authenticated');
      setIsSaving(true);
      try {
        const updated = await sermonNotesApi.updateSermonNote(authToken, id, params);
        setSermonNotes(prev => prev.map(item => (item.id === id ? updated : item)));
        return updated;
      } finally {
        setIsSaving(false);
      }
    },
    [authToken],
  );

  const deleteSermonNote = useCallback(
    async (id: number) => {
      if (!authToken) return;
      await sermonNotesApi.deleteSermonNote(authToken, id);
      setSermonNotes(prev => prev.filter(item => item.id !== id));
    },
    [authToken],
  );

  return (
    <SermonNoteContext.Provider
      value={{
        sermonNotes,
        isLoading,
        isSaving,
        reload,
        createSermonNote,
        updateSermonNote,
        deleteSermonNote,
      }}>
      {children}
    </SermonNoteContext.Provider>
  );
}

export function useSermonNotes() {
  return useContext(SermonNoteContext);
}
