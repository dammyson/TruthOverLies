import React, {createContext, useCallback, useContext, useRef} from 'react';

type TabNavContextType = {
  jumpTo: (index: number) => void;
  registerJump: (fn: (index: number) => void) => void;
};

const TabNavContext = createContext<TabNavContextType>({
  jumpTo: () => {},
  registerJump: () => {},
});

export function TabNavProvider({children}: {children: React.ReactNode}) {
  const jumpFnRef = useRef<((index: number) => void) | null>(null);

  const registerJump = useCallback((fn: (index: number) => void) => {
    jumpFnRef.current = fn;
  }, []);

  const jumpTo = useCallback((index: number) => {
    jumpFnRef.current?.(index);
  }, []);

  return (
    <TabNavContext.Provider value={{jumpTo, registerJump}}>
      {children}
    </TabNavContext.Provider>
  );
}

export function useTabNav() {
  return useContext(TabNavContext);
}
