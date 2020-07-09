import { useCallback, useEffect, useState } from 'react';

export interface UseCompactReturnInterface {
  toggleCompactHandler: () => void;
  setCompactOn: () => void;
  setCompactOff: () => void;
  isCompact: boolean;
}

function useCompact(initial = true): UseCompactReturnInterface {
  const [isCompact, setIsCompact] = useState(() => initial);

  useEffect(() => {
    setIsCompact(initial);
  }, [initial]);

  const toggleCompactHandler = useCallback(() => {
    setIsCompact((prevState) => !prevState);
  }, []);

  const setCompactOn = useCallback(() => {
    setIsCompact(true);
  }, []);

  const setCompactOff = useCallback(() => {
    setIsCompact(false);
  }, []);

  return {
    toggleCompactHandler,
    setCompactOn,
    setCompactOff,
    isCompact,
  };
}

export default useCompact;
