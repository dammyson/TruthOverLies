import {useEffect, useRef, useState} from 'react';

function useTransitionAction(delay = 250) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const runWithTransition = (action: () => void) => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    timeoutRef.current = setTimeout(() => {
      action();
      setIsTransitioning(false);
      timeoutRef.current = null;
    }, delay);
  };

  return {isTransitioning, runWithTransition};
}

export default useTransitionAction;