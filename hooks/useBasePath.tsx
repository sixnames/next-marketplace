import { useRouter } from 'next/router';

export const useBasePath = (breakpoint: string) => {
  const router = useRouter();
  let breakpointArg = router.query[breakpoint];
  if (!breakpointArg) {
    breakpointArg = breakpoint;
  }
  const urlParts = router.asPath.split(`${breakpointArg}`);
  return `${urlParts[0]}${breakpointArg}`;
};
