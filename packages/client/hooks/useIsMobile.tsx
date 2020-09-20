import { useEffect, useState } from 'react';

function useIsMobile(additional = 0) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function resizeWindow() {
      setIsMobile(window.matchMedia(`(max-width: ${1024 + additional}px)`).matches);
    }

    resizeWindow();

    window.addEventListener('resize', resizeWindow);

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  });

  return isMobile;
}

export default useIsMobile;
