import React, {createContext, useCallback, useContext, useState} from 'react';

type BibleNavTarget = {
  bookId: string;
  bookName: string;
  chapter: number;
  chapterCount: number;
};

type BibleNavContextType = {
  pending: BibleNavTarget | null;
  navigateTo: (target: BibleNavTarget) => void;
  clearPending: () => void;
};

const BibleNavContext = createContext<BibleNavContextType>({
  pending: null,
  navigateTo: () => {},
  clearPending: () => {},
});

export function BibleNavProvider({children}: {children: React.ReactNode}) {
  const [pending, setPending] = useState<BibleNavTarget | null>(null);
  const navigateTo = useCallback((target: BibleNavTarget) => setPending(target), []);
  const clearPending = useCallback(() => setPending(null), []);
  return (
    <BibleNavContext.Provider value={{pending, navigateTo, clearPending}}>
      {children}
    </BibleNavContext.Provider>
  );
}

export function useBibleNav() {
  return useContext(BibleNavContext);
}
