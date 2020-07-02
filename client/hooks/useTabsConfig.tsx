import useRouterQuery from './useRouterQuery';
import { NavItemInterface } from '../types';
import { ParsedUrlQuery } from 'querystring';

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

  function generateTabsConfig({ config }: UseTabsConfigInterface): NavItemInterface[] {
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
  }

  return {
    generateTabsConfig,
    pathname,
    query,
  };
};

export default useTabsConfig;
