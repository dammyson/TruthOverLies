import React, {createContext, ReactNode, useContext, useMemo, useState} from 'react';

import {buildDevotions} from '../data/devotions';
import {AuthMessageTone, AuthUser, DevotionCard, FeelingOption} from '../types/app';

type AppContextValue = {
  currentUser: AuthUser | null;
  authMessage: string;
  authMessageTone: AuthMessageTone;
  selectedFeelings: FeelingOption[];
  devotionCards: DevotionCard[];
  savedCards: DevotionCard[];
  login: (email: string, password: string) => boolean;
  loginAsGuest: () => void;
  signup: (fullName: string, email: string, password: string) => boolean;
  logout: () => void;
  clearAuthMessage: () => void;
  toggleFeeling: (feeling: FeelingOption) => void;
  generateDevotions: () => boolean;
  toggleSavedCard: (card: DevotionCard) => void;
  isSaved: (cardId: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function AppProvider({children}: {children: ReactNode}) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMessage, setAuthMessage] = useState('');
  const [authMessageTone, setAuthMessageTone] = useState<AuthMessageTone>('error');
  const [selectedFeelings, setSelectedFeelings] = useState<FeelingOption[]>(['Hopeful']);
  const [devotionCards, setDevotionCards] = useState<DevotionCard[]>(
    buildDevotions(['Hopeful']),
  );
  const [savedCards, setSavedCards] = useState<DevotionCard[]>([]);

  const clearAuthMessage = () => {
    setAuthMessage('');
  };

  const login = (email: string, password: string) => {
    clearAuthMessage();

    if (!email.trim() || !password.trim()) {
      setAuthMessageTone('error');
      setAuthMessage('Enter your email and password.');
      return false;
    }

    const matchedUser = users.find(
      user => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
    );

    if (!matchedUser) {
      setAuthMessageTone('error');
      setAuthMessage('Incorrect email or password.');
      return false;
    }

    setCurrentUser(matchedUser);
    setAuthMessageTone('success');
    setAuthMessage('Welcome back.');
    return true;
  };

  const loginAsGuest = () => {
    clearAuthMessage();

    setCurrentUser({
      fullName: 'Guest User',
      email: 'guest@godsplace.app',
      password: '',
    });
    setAuthMessageTone('success');
    setAuthMessage('Continuing as guest.');
  };

  const signup = (fullName: string, email: string, password: string) => {
    clearAuthMessage();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setAuthMessageTone('error');
      setAuthMessage('Complete all fields to create your account.');
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const alreadyExists = users.some(user => user.email.toLowerCase() === normalizedEmail);

    if (alreadyExists) {
      setAuthMessageTone('error');
      setAuthMessage('That email is already registered.');
      return false;
    }

    const newUser: AuthUser = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    };

    setUsers(currentUsers => [...currentUsers, newUser]);
    setCurrentUser(newUser);
    setAuthMessageTone('success');
    setAuthMessage('Account created successfully.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthMessageTone('success');
    setAuthMessage('Signed out.');
  };

  const toggleFeeling = (feeling: FeelingOption) => {
    setSelectedFeelings(currentFeelings => {
      if (currentFeelings.includes(feeling)) {
        return currentFeelings.filter(item => item !== feeling);
      }

      if (currentFeelings.length >= 4) {
        setAuthMessageTone('error');
        setAuthMessage('You can select up to 4 feelings.');
        return currentFeelings;
      }

      return [...currentFeelings, feeling];
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
    setSavedCards(currentCards => {
      const exists = currentCards.some(item => item.id === card.id);

      if (exists) {
        return currentCards.filter(item => item.id !== card.id);
      }

      return [card, ...currentCards];
    });
  };

  const isSaved = (cardId: string) => savedCards.some(card => card.id === cardId);

  const value = useMemo(
    () => ({
      currentUser,
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
    [authMessage, authMessageTone, currentUser, devotionCards, savedCards, selectedFeelings],
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