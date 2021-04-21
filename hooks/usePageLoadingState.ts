import { useRouter } from 'next/router';
import * as React from 'react';

const usePageLoadingState = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleRouteStart = () => {
      setIsPageLoading(true);
    };
    const handleRouteComplete = () => {
      setIsPageLoading(false);
    };
    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
    // eslint-disable-next-line
  }, []);

  return isPageLoading;
};

export default usePageLoadingState;
