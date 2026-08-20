import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as authApi from '../api/auth';
import * as devotionsApi from '../api/devotions';
import * as feelingsApi from '../api/feelings';
import {ApiError} from '../api/types';
import storage from '../cache/storage';
import CACHE_KEYS from '../cache/keys';
import {ensureKjvDownloaded} from '../bible/bibleRepo';
import {buildDevotions} from '../data/devotions';
import {
  AuthMessageTone,
  AuthUser,
  DevotionCard,
  FeelingItem,
  FeelingOption,
} from '../types/app';

type AppContextValue = {
  currentUser: AuthUser | null;
  authToken: string | null;
  isInitialising: boolean;
  isCatalogLoading: boolean;
  isSavedLoading: boolean;
  authMessage: string;
  authMessageTone: AuthMessageTone;
  selectedFeelings: FeelingOption[];
  feelingsCatalog: FeelingItem[];
  devotionCards: DevotionCard[];
  savedCards: DevotionCard[];
  login: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthMessage: () => void;
  toggleFeeling: (feeling: FeelingOption) => void;
  generateDevotions: () => Promise<boolean>;
  toggleSavedCard: (card: DevotionCard) => Promise<void>;
  isSaved: (cardId: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function AppProvider({children}: {children: ReactNode}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isInitialising, setIsInitialising] = useState(true);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [authMessageTone, setAuthMessageTone] = useState<AuthMessageTone>('error');
  const [selectedFeelings, setSelectedFeelings] = useState<FeelingOption[]>(['Hopeful']);
  const [feelingsCatalog, setFeelingsCatalog] = useState<FeelingItem[]>([]);
  const [lastCheckId, setLastCheckId] = useState<number | null>(null);
  const [devotionCards, setDevotionCards] = useState<DevotionCard[]>(
    buildDevotions(['Hopeful']),
  );
  const [savedCards, setSavedCards] = useState<DevotionCard[]>([]);

  // ── Session restore ──────────────────────────────────────────────────────

  useEffect(() => {
    async function restoreSession() {
      const [token, profile, cachedCatalog] = await Promise.all([
        storage.get<string>(CACHE_KEYS.AUTH_TOKEN),
        storage.get<AuthUser>(CACHE_KEYS.USER_PROFILE),
        storage.get<FeelingItem[]>(CACHE_KEYS.FEELINGS_CATALOG),
      ]);

      if (cachedCatalog) {
        setFeelingsCatalog(cachedCatalog);
      }

      if (token && profile) {
        setAuthToken(token);
        setCurrentUser(profile);
        loadUserData(token);
        ensureKjvDownloaded(); // ensure KJV is present on every app start

        // Refresh profile silently
        authApi.getMe(token).then(me => {
          const refreshed: AuthUser = {
            id: me.id,
            fullName: me.full_name,
            email: me.email,
            role: me.role,
            createdAt: me.created_at,
          };
          setCurrentUser(refreshed);
          storage.set(CACHE_KEYS.USER_PROFILE, refreshed);
        }).catch(() => {});
      }

      setIsInitialising(false);
    }

    restoreSession();
  }, []);

  async function loadUserData(token: string) {
    setIsCatalogLoading(true);
    setIsSavedLoading(true);

    const [catalogResult, savedResult] = await Promise.allSettled([
      feelingsApi.getFeelingsCatalog(token),
      devotionsApi.getSavedDevotions(token),
    ]);

    if (catalogResult.status === 'fulfilled') {
      const catalog: FeelingItem[] = catalogResult.value.map(f => ({
        id: f.id,
        name: f.name,
        category: f.category,
        subcategory: f.subcategory,
      }));
      setFeelingsCatalog(catalog);
      storage.set(CACHE_KEYS.FEELINGS_CATALOG, catalog);
    }
    setIsCatalogLoading(false);

    if (savedResult.status === 'fulfilled') {
      const cards: DevotionCard[] = savedResult.value.flatMap(saved =>
        saved.cards.map(c => ({
          id: `saved-${saved.id}-${c.id ?? c.title}`,
          title: c.title,
          encouragement: c.encouragement,
          verse: c.verse,
          reference: c.reference,
          feelings: [],
        })),
      );
      setSavedCards(cards);
    }
    setIsSavedLoading(false);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  const clearAuthMessage = () => setAuthMessage('');

  async function persistSession(token: string, user: AuthUser) {
    setAuthToken(token);
    setCurrentUser(user);
    await Promise.all([
      storage.set(CACHE_KEYS.AUTH_TOKEN, token),
      storage.set(CACHE_KEYS.USER_PROFILE, user),
    ]);
    loadUserData(token);
    ensureKjvDownloaded(); // fire-and-forget — downloads KJV offline on first login
  }

  // ── Auth ─────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<boolean> => {
    clearAuthMessage();
    if (!email.trim() || !password.trim()) {
      setAuthMessageTone('error');
      setAuthMessage('Enter your email and password.');
      return false;
    }
    try {
      const res = await authApi.login(email.trim().toLowerCase(), password);
      const user: AuthUser = {id: res.id, fullName: res.full_name, email: res.email, role: 'user', createdAt: new Date().toISOString()};
      await persistSession(res.auth_token, user);
      setAuthMessageTone('success');
      setAuthMessage('Welcome back.');
      return true;
    } catch (err) {
      setAuthMessageTone('error');
      setAuthMessage(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
      return false;
    }
  };

  const loginAsGuest = async (): Promise<void> => {
    clearAuthMessage();
    try {
      const res = await authApi.guestLogin();
      const user: AuthUser = {id: res.id, fullName: res.full_name || 'Guest User', email: res.email, role: 'guest', createdAt: new Date().toISOString()};
      await persistSession(res.auth_token, user);
      setAuthMessageTone('success');
      setAuthMessage('Continuing as guest.');
    } catch (err) {
      setAuthMessageTone('error');
      setAuthMessage(err instanceof ApiError ? err.message : 'Could not start guest session.');
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    clearAuthMessage();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setAuthMessageTone('error');
      setAuthMessage('Complete all fields to create your account.');
      return false;
    }
    try {
      const res = await authApi.register(fullName.trim(), email.trim().toLowerCase(), password);
      const user: AuthUser = {id: res.id, fullName: res.full_name, email: res.email, role: 'user', createdAt: new Date().toISOString()};
      await persistSession(res.auth_token, user);
      setAuthMessageTone('success');
      setAuthMessage('Account created successfully.');
      return true;
    } catch (err) {
      setAuthMessageTone('error');
      setAuthMessage(err instanceof ApiError ? err.message : 'Could not create account. Try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setCurrentUser(null);
    setAuthToken(null);
    setFeelingsCatalog([]);
    setSavedCards([]);
    setLastCheckId(null);
    clearAuthMessage();
    await storage.clearKeys([
      CACHE_KEYS.AUTH_TOKEN,
      CACHE_KEYS.USER_PROFILE,
      CACHE_KEYS.FEELINGS_CATALOG,
      CACHE_KEYS.SAVED_DEVOTIONS,
    ]);
  };

  // ── Feelings ─────────────────────────────────────────────────────────────

  const toggleFeeling = (feeling: FeelingOption) => {
    setSelectedFeelings(current => {
      if (current.includes(feeling)) {
        return current.filter(f => f !== feeling);
      }
      if (current.length >= 4) {
        setAuthMessageTone('error');
        setAuthMessage('You can select up to 4 feelings.');
        return current;
      }
      return [...current, feeling];
    });
  };

  // ── Devotions ─────────────────────────────────────────────────────────────

  const generateDevotions = async (): Promise<boolean> => {
    if (selectedFeelings.length === 0) {
      setAuthMessageTone('error');
      setAuthMessage('Pick at least one feeling to continue.');
      return false;
    }

    clearAuthMessage();

    if (!authToken) {
      setDevotionCards(buildDevotions(selectedFeelings));
      return true;
    }

    try {
      // Map feeling names → IDs from catalog; fall back to index if not found
      const feelingIds = selectedFeelings
        .map(name => feelingsCatalog.find(f => f.name.toLowerCase() === name.toLowerCase())?.id)
        .filter((id): id is number => id !== undefined);

      const idsToSend = feelingIds.length > 0
        ? feelingIds
        : selectedFeelings.map((_, i) => i + 1);

      const res = await devotionsApi.getRecommendations(idsToSend, authToken);
      setLastCheckId(res.check_id);

      const cards: DevotionCard[] = res.cards.map(c => ({
        id: String(c.id),
        title: c.title,
        encouragement: c.encouragement,
        verse: c.verse,
        reference: c.reference,
        feelings: selectedFeelings,
      }));

      setDevotionCards(cards.length > 0 ? cards : buildDevotions(selectedFeelings));

      // Log each selected feeling (fire-and-forget)
      selectedFeelings.forEach(name => {
        const item = feelingsCatalog.find(f => f.name.toLowerCase() === name.toLowerCase());
        if (item) {
          feelingsApi.logUserFeeling(item.id, authToken).catch(() => {});
        }
      });

      return true;
    } catch {
      // Network/server error — fall back to local devotions
      setDevotionCards(buildDevotions(selectedFeelings));
      return true;
    }
  };

  const toggleSavedCard = async (card: DevotionCard): Promise<void> => {
    const exists = savedCards.some(c => c.id === card.id);

    if (exists) {
      setSavedCards(current => current.filter(c => c.id !== card.id));
      return;
    }

    // Optimistic add
    setSavedCards(current => [card, ...current]);

    if (authToken && lastCheckId) {
      try {
        await devotionsApi.saveDevotionCheck(lastCheckId, authToken);
      } catch {
        // fail silently — card stays saved locally
      }
    }
  };

  const isSaved = (cardId: string) => savedCards.some(c => c.id === cardId);

  // ── Context value ─────────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      currentUser,
      authToken,
      isInitialising,
      isCatalogLoading,
      isSavedLoading,
      authMessage,
      authMessageTone,
      selectedFeelings,
      feelingsCatalog,
      devotionCards,
      savedCards,
      login,
      loginAsGuest,
      signup,
      logout,
      clearAuthMessage,
      toggleFeeling,
      generateDevotions,
      toggleSavedCard,
      isSaved,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authMessage, authMessageTone, authToken, currentUser, devotionCards, feelingsCatalog, isCatalogLoading, isInitialising, isSavedLoading, savedCards, selectedFeelings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export {AppProvider, useAppContext};
