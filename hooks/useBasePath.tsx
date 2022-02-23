import { getBasePath } from 'lib/links/linkUtils';
import { useRouter } from 'next/router';

export const useBasePath = (breakpoint: string) => {
  const router = useRouter();
  return getBasePath({
    asPath: router.asPath,
    query: router.query,
    breakpoint,
  });
};
