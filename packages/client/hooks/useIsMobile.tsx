import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function resizeHandler() {
      setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
    }

    const debouncedResizeHandler = debounce(resizeHandler, 250);
    debouncedResizeHandler();

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
