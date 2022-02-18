import { useRouter } from 'next/router';

export const useBasePath = (breakpoint: string) => {
  const router = useRouter();
  const breakpointArg = router.query[breakpoint];
  const urlParts = router.asPath.split(`${breakpointArg}`);
  return `${urlParts[0]}${breakpointArg}`;
};
