import {useRef, useState} from 'react';

function useTransitionAction() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeRef = useRef(false);

  const runWithTransition = async (action: () => Promise<unknown> | void) => {
    if (activeRef.current) {
      return;
    }

    activeRef.current = true;
    setIsTransitioning(true);

    try {
      await action();
    } finally {
      activeRef.current = false;
      setIsTransitioning(false);
    }
  };

  return {isTransitioning, runWithTransition};
}

export default useTransitionAction;
