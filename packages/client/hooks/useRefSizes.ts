import { RefObject, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { noNaN } from '../utils/noNaN';

interface UseRefSizesInterface {
  width: number;
  height: number;
  outsideWidth: number;
  outsideHalfWidth: number;
}

interface UseRefSizesPayloadInterface extends UseRefSizesInterface {
  ref: RefObject<HTMLDivElement>;
}

const useRefSizes = (): UseRefSizesPayloadInterface => {
  const [state, setState] = useState<UseRefSizesInterface>({
    width: 0,
    height: 0,
    outsideWidth: 0,
    outsideHalfWidth: 0,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function resizeHandler() {
      if (ref.current) {
        const refWidth = ref.current.clientWidth;
        const outsideWidth = window.innerWidth - refWidth;
        const outsideHalfWidth = outsideWidth / 2;

        setState({
          width: noNaN(ref.current.clientWidth),
          height: noNaN(refWidth),
          outsideWidth,
          outsideHalfWidth,
        });
      }
    }
    const debouncedResizeHandler = debounce(resizeHandler, 250);
    debouncedResizeHandler();

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  return {
    ...state,
    ref,
  };
};

export default useRefSizes;
