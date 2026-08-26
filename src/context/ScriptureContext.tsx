import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SavedScripture, ScriptureCategory} from '../types/app';
import * as scripturesApi from '../api/scriptures';
import {useAppContext} from './AppContext';

type ScriptureContextType = {
  scriptures: SavedScripture[];
  categories: ScriptureCategory[];
  isLoading: boolean;
  isSaving: boolean;
  reload: () => Promise<void>;
  saveVerse: (params: scripturesApi.SaveScriptureParams) => Promise<SavedScripture>;
  updateVerse: (id: number, params: scripturesApi.UpdateScriptureParams) => Promise<void>;
  deleteVerse: (id: number) => Promise<void>;
  createCategory: (params: scripturesApi.SaveCategoryParams) => Promise<ScriptureCategory>;
  updateCategory: (id: number, params: Partial<scripturesApi.SaveCategoryParams>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  isVerseSaved: (bookId: string, chapter: number, verseStart: number) => boolean;
};

const ScriptureContext = createContext<ScriptureContextType>({
  scriptures: [],
  categories: [],
  isLoading: false,
  isSaving: false,
  reload: async () => {},
  saveVerse: async () => { throw new Error('not ready'); },
  updateVerse: async () => {},
  deleteVerse: async () => {},
  createCategory: async () => { throw new Error('not ready'); },
  updateCategory: async () => {},
  deleteCategory: async () => {},
  isVerseSaved: () => false,
});

export function ScriptureProvider({children}: {children: React.ReactNode}) {
  const {authToken} = useAppContext();
  const [scriptures, setScriptures] = useState<SavedScripture[]>([]);
  const [categories, setCategories] = useState<ScriptureCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const loadedRef = useRef(false);

  const reload = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const [s, c] = await Promise.all([
        scripturesApi.listScriptures(authToken),
        scripturesApi.listCategories(authToken),
      ]);
      setScriptures(s);
      setCategories(c);
    } catch {
      // silent — user sees stale data
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  // Load once on mount / when user logs in
  useEffect(() => {
    if (!authToken || loadedRef.current) return;
    loadedRef.current = true;
    reload();
  }, [authToken, reload]);

  // Reset on logout
  useEffect(() => {
    if (!authToken) {
      setScriptures([]);
      setCategories([]);
      loadedRef.current = false;
    }
  }, [authToken]);

  const saveVerse = useCallback(
    async (params: scripturesApi.SaveScriptureParams): Promise<SavedScripture> => {
      if (!authToken) throw new Error('Not authenticated');
      setIsSaving(true);
      try {
        const saved = await scripturesApi.saveScripture(authToken, params);
        setScriptures(prev => [saved, ...prev]);
        return saved;
      } finally {
        setIsSaving(false);
      }
    },
    [authToken],
  );

  const updateVerse = useCallback(
    async (id: number, params: scripturesApi.UpdateScriptureParams) => {
      if (!authToken) return;
      const updated = await scripturesApi.updateScripture(authToken, id, params);
      setScriptures(prev => prev.map(s => (s.id === id ? updated : s)));
    },
    [authToken],
  );

  const deleteVerse = useCallback(
    async (id: number) => {
      if (!authToken) return;
      await scripturesApi.deleteScripture(authToken, id);
      setScriptures(prev => prev.filter(s => s.id !== id));
    },
    [authToken],
  );

  const createCategory = useCallback(
    async (params: scripturesApi.SaveCategoryParams): Promise<ScriptureCategory> => {
      if (!authToken) throw new Error('Not authenticated');
      const cat = await scripturesApi.createCategory(authToken, params);
      setCategories(prev => [...prev, cat]);
      return cat;
    },
    [authToken],
  );

  const updateCategory = useCallback(
    async (id: number, params: Partial<scripturesApi.SaveCategoryParams>) => {
      if (!authToken) return;
      const updated = await scripturesApi.updateCategory(authToken, id, params);
      setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
    },
    [authToken],
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      if (!authToken) return;
      await scripturesApi.deleteCategory(authToken, id);
      setCategories(prev => prev.filter(c => c.id !== id));
      // clear category reference on affected scriptures
      setScriptures(prev =>
        prev.map(s => (s.categoryId === id ? {...s, categoryId: null, categoryName: null, categoryColor: null} : s)),
      );
    },
    [authToken],
  );

  const isVerseSaved = useCallback(
    (bookId: string, chapter: number, verseStart: number): boolean =>
      scriptures.some(
        s => s.bookId === bookId && s.chapter === chapter && s.verseStart === verseStart,
      ),
    [scriptures],
  );

  return (
    <ScriptureContext.Provider
      value={{
        scriptures,
        categories,
        isLoading,
        isSaving,
        reload,
        saveVerse,
        updateVerse,
        deleteVerse,
        createCategory,
        updateCategory,
        deleteCategory,
        isVerseSaved,
      }}>
      {children}
    </ScriptureContext.Provider>
  );
}

export function useScriptures() {
  return useContext(ScriptureContext);
}
