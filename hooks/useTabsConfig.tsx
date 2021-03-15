import { useRouter } from 'next/router';
import * as React from 'react';
import { ParsedUrlQuery } from 'querystring';
import { NavItemInterface } from 'types/clientTypes';
import qs from 'qs';

interface UseTabsConfigInterface {
  config: Omit<NavItemInterface, 'to'>[];
}

interface UseTabsConfigReturnInterface {
  pathname: string;
  query: ParsedUrlQuery;
  generateTabsConfig: (args: UseTabsConfigInterface) => NavItemInterface[];
}

const useTabsConfig = (): UseTabsConfigReturnInterface => {
  const { asPath, query, pathname } = useRouter();
  const asPathArray = asPath.split('?');
  const cleanAasPath = asPathArray[0];
  const parsedQuery = asPathArray[1] ? qs.parse(`${asPathArray[1]}`) : {};

  const generateTabsConfig = React.useCallback(
    ({ config }: UseTabsConfigInterface): NavItemInterface[] => {
      return config.map((item, index) => {
        return {
          name: item.name,
          path: `${cleanAasPath}?${qs.stringify({
            ...parsedQuery,
            tab: index,
          })}`,
          testId: item.testId,
          hidden: item.hidden,
        };
      });
    },
    [asPath],
  );

  return {
    generateTabsConfig,
    pathname,
    query,
  };
};

export default useTabsConfig;
