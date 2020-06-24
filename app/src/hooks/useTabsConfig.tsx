import useRouterQuery from './useRouterQuery';
import { NavItemInterface } from '../types';
import qs, { ParsedUrlQuery } from 'querystring';

interface UseTabsConfigInterface {
  config: Omit<NavItemInterface, 'to'>[];
}

interface UseTabsConfigReturnInterface {
  pathname: string;
  query: ParsedUrlQuery;
  generateTabsConfig: (args: UseTabsConfigInterface) => NavItemInterface[];
  generateTabSearch: (tab: number) => string;
}

const useTabsConfig = (): UseTabsConfigReturnInterface => {
  const { pathname, query } = useRouterQuery();

  function generateTabSearch(tab: number) {
    return `?${qs.stringify({ ...query, tab })}`;
  }

  function generateTabsConfig({ config }: UseTabsConfigInterface): NavItemInterface[] {
    return config.map((item, index) => ({
      name: item.name,
      to: {
        pathname,
        search: generateTabSearch(index),
      },
      testId: item.testId,
      hidden: item.hidden,
    }));
  }

  return {
    generateTabsConfig,
    generateTabSearch,
    pathname,
    query,
  };
};

export default useTabsConfig;
