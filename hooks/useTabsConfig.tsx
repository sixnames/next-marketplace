import { useRouter } from 'next/router';
import * as React from 'react';
import qs from 'qs';
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
  const { asPath, query, pathname } = useRouter();

  const generateTabsConfig = React.useCallback(
    ({ config }: UseTabsConfigInterface): NavItemInterface[] => {
      return config.map((item, index) => {
        const newQuery = {
          ...query,
          tab: index,
        };

        return {
          name: item.name,
          path: `${asPath}?${qs.stringify(newQuery)}`,
          testId: item.testId,
          hidden: item.hidden,
        };
      });
    },
    [asPath, query],
  );

  return {
    generateTabsConfig,
    pathname,
    query,
  };
};

export default useTabsConfig;
