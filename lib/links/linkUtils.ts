import { ParsedUrlQuery } from 'querystring';

export interface GetBasePathInterface {
  query: ParsedUrlQuery;
  asPath: string;
  breakpoint: string;
}
export function getBasePath({ query, asPath, breakpoint }: GetBasePathInterface): string {
  let breakpointArg = query[breakpoint];
  if (!breakpointArg) {
    breakpointArg = breakpoint;
  }
  const urlParts = asPath.split(`${breakpointArg}`);
  return `${urlParts[0]}${breakpointArg}`;
}
