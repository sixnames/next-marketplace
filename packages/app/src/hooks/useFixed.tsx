import { useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';

function useFixed(top = 0) {
  const [fixPosition, setFixPosition] = useState(0);
  const [gap, setGap] = useState(0);
  const parentRef = useRef<HTMLElement | null>(null);

  function setNewPosition() {
    if (parentRef && parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      const isBottomed = rect.top + rect.height - 300 <= 0;

      const currentPosition = rect.top * -1 + gap + top;
      if (isBottomed) {
        setFixPosition(0);
      } else {
        if (currentPosition > 0) {
          setFixPosition(currentPosition);
        } else {
          setFixPosition(0);
        }
      }
    }
  }

  function setNewGap() {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      setGap(36);
    } else {
      setGap(0);
    }
  }

  useEffect(() => {
    setNewGap();
    setNewPosition();

    window.addEventListener(
      'resize',
      throttle(() => {
        setNewPosition();
        setNewGap();
      }, 1),
    );

    window.addEventListener(
      'scroll',
      throttle(() => {
        setNewPosition();
        setNewGap();
      }, 1),
    );

    return () => {
      window.removeEventListener('resize', setNewGap);
      window.removeEventListener('scroll', setNewPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixPosition, gap]);

  return { parentRef, fixPosition, gap };
}

export default useFixed;
