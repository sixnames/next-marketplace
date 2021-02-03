import * as React from 'react';
import useRouterQuery from './useRouterQuery';
import { ParsedUrlQuery } from 'querystring';
import { NavItemInterface } from 'types/clientTypes';

interface UseTabsConfigInterface {
  config: Omit<NavItemInterface, 'to'>[];
}

interface UseTabsConfigReturnInterface {
  pathname: string;
  query: ParsedUrlQuery;
  generateTabsConfig: (args: UseTabsConfigInterface) => NavItemInterface[];
}

const useTabsConfig = (): UseTabsConfigReturnInterface => {
  const { pathname, query } = useRouterQuery();

  const generateTabsConfig = React.useCallback(
    ({ config }: UseTabsConfigInterface): NavItemInterface[] => {
      return config.map((item, index) => ({
        name: item.name,
        path: {
          pathname,
          query: {
            ...query,
            tab: `${index}`,
          },
        },
        testId: item.testId,
        hidden: item.hidden,
      }));
    },
    [pathname, query],
  );

  return {
    generateTabsConfig,
    pathname,
    query,
  };
};

export default useTabsConfig;
