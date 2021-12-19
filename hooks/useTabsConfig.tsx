import { useRouter } from 'next/router';
import * as React from 'react';
import { ParsedUrlQuery } from 'querystring';
import qs from 'qs';
import { ClientNavItemInterface } from '../types/clientTypes';

interface UseTabsConfigInterface {
  config: Omit<ClientNavItemInterface, 'to'>[];
}

interface UseTabsConfigReturnInterface {
  pathname: string;
  query: ParsedUrlQuery;
  generateTabsConfig: (args: UseTabsConfigInterface) => ClientNavItemInterface[];
}

const useTabsConfig = (): UseTabsConfigReturnInterface => {
  const { asPath, query, pathname } = useRouter();
  const asPathArray = asPath.split('?');
  const cleanAasPath = asPathArray[0];
  const parsedQuery = React.useMemo(() => {
    return asPathArray[1] ? qs.parse(`${asPathArray[1]}`) : {};
  }, [asPathArray]);

  const generateTabsConfig = React.useCallback(
    ({ config }: UseTabsConfigInterface): ClientNavItemInterface[] => {
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
    [cleanAasPath, parsedQuery],
  );

  return {
    generateTabsConfig,
    pathname,
    query,
  };
};

export default useTabsConfig;
