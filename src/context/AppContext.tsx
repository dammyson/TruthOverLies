import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as authApi from '../api/auth';
import {ApiError} from '../api/types';
import storage from '../cache/storage';
import CACHE_KEYS from '../cache/keys';
import {buildDevotions} from '../data/devotions';
import {AuthMessageTone, AuthUser, DevotionCard, FeelingOption} from '../types/app';

type AppContextValue = {
  currentUser: AuthUser | null;
  authToken: string | null;
  isInitialising: boolean;
  authMessage: string;
  authMessageTone: AuthMessageTone;
  selectedFeelings: FeelingOption[];
  devotionCards: DevotionCard[];
  savedCards: DevotionCard[];
  login: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthMessage: () => void;
  toggleFeeling: (feeling: FeelingOption) => void;
  generateDevotions: () => boolean;
  toggleSavedCard: (card: DevotionCard) => void;
  isSaved: (cardId: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function AppProvider({children}: {children: ReactNode}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isInitialising, setIsInitialising] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  const [authMessageTone, setAuthMessageTone] = useState<AuthMessageTone>('error');
  const [selectedFeelings, setSelectedFeelings] = useState<FeelingOption[]>(['Hopeful']);
  const [devotionCards, setDevotionCards] = useState<DevotionCard[]>(
    buildDevotions(['Hopeful']),
  );
  const [savedCards, setSavedCards] = useState<DevotionCard[]>([]);

  // Restore session from cache on startup
  useEffect(() => {
    async function restoreSession() {
      const [token, profile] = await Promise.all([
        storage.get<string>(CACHE_KEYS.AUTH_TOKEN),
        storage.get<AuthUser>(CACHE_KEYS.USER_PROFILE),
      ]);

      if (token && profile) {
        setAuthToken(token);
        setCurrentUser(profile);

        // Refresh profile in background; silent fail on network error
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

  const clearAuthMessage = () => setAuthMessage('');

  async function persistSession(token: string, user: AuthUser) {
    setAuthToken(token);
    setCurrentUser(user);
    await Promise.all([
      storage.set(CACHE_KEYS.AUTH_TOKEN, token),
      storage.set(CACHE_KEYS.USER_PROFILE, user),
    ]);
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    clearAuthMessage();

    if (!email.trim() || !password.trim()) {
      setAuthMessageTone('error');
      setAuthMessage('Enter your email and password.');
      return false;
    }

    try {
      const res = await authApi.login(email.trim().toLowerCase(), password);
      const user: AuthUser = {
        id: res.id,
        fullName: res.full_name,
        email: res.email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
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
      const user: AuthUser = {
        id: res.id,
        fullName: res.full_name || 'Guest User',
        email: res.email,
        role: 'guest',
        createdAt: new Date().toISOString(),
      };
      await persistSession(res.auth_token, user);
      setAuthMessageTone('success');
      setAuthMessage('Continuing as guest.');
    } catch (err) {
      setAuthMessageTone('error');
      setAuthMessage(err instanceof ApiError ? err.message : 'Could not start guest session.');
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    clearAuthMessage();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setAuthMessageTone('error');
      setAuthMessage('Complete all fields to create your account.');
      return false;
    }

    try {
      const res = await authApi.register(fullName.trim(), email.trim().toLowerCase(), password);
      const user: AuthUser = {
        id: res.id,
        fullName: res.full_name,
        email: res.email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
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
    clearAuthMessage();
    await storage.clearKeys([CACHE_KEYS.AUTH_TOKEN, CACHE_KEYS.USER_PROFILE]);
  };

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

  const generateDevotions = () => {
    if (selectedFeelings.length === 0) {
      setAuthMessageTone('error');
      setAuthMessage('Pick at least one feeling to continue.');
      return false;
    }

    clearAuthMessage();
    setDevotionCards(buildDevotions(selectedFeelings));
    return true;
  };

  const toggleSavedCard = (card: DevotionCard) => {
    setSavedCards(current => {
      const exists = current.some(c => c.id === card.id);
      return exists ? current.filter(c => c.id !== card.id) : [card, ...current];
    });
  };

  const isSaved = (cardId: string) => savedCards.some(c => c.id === cardId);

  const value = useMemo(
    () => ({
      currentUser,
      authToken,
      isInitialising,
      authMessage,
      authMessageTone,
      selectedFeelings,
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
    [authMessage, authMessageTone, authToken, currentUser, devotionCards, isInitialising, savedCards, selectedFeelings],
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
