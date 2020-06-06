import { useCallback, useState } from 'react';

function useCompact(initial = true) {
  const [isCompact, setIsCompact] = useState(() => initial);

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
