import * as React from 'react';

export interface UseCompactReturnInterface {
  toggleCompactHandler: () => void;
  setCompactOn: () => void;
  setCompactOff: () => void;
  isCompact: boolean;
}

function useCompact(initial = true): UseCompactReturnInterface {
  const [isCompact, setIsCompact] = React.useState(() => initial);
  React.useEffect(() => {
    setIsCompact(initial);
  }, [initial]);

  const toggleCompactHandler = React.useCallback(() => {
    setIsCompact((prevState) => !prevState);
  }, []);

  const setCompactOn = React.useCallback(() => {
    setIsCompact(true);
  }, []);

  const setCompactOff = React.useCallback(() => {
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
