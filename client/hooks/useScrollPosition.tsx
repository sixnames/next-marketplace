import { MutableRefObject, useEffect, useState } from 'react';

const useScrollPosition = (
  ref: MutableRefObject<HTMLElement | null>,
  gap = 0,
  bottomed?: boolean,
) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  function scrollEvent() {
    if (ref && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const currentGap = bottomed ? rect.height - window.innerHeight - gap : gap;

      if (Math.abs(rect.top) >= currentGap) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
  }

  useEffect(() => {
    scrollEvent();
    window.addEventListener('scroll', scrollEvent);
    window.addEventListener('resize', scrollEvent);

    return () => {
      window.removeEventListener('scroll', scrollEvent);
      window.removeEventListener('resize', scrollEvent);
    };
  });

  return {
    isScrolled,
  };
};

export default useScrollPosition;
