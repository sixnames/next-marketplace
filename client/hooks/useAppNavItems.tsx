import { useUserContext } from '../context/userContext';
import { ROUTE_CMS } from '../config';
import { NavItemInterface } from '../types';
import useWithFilterQuery from './useWithFilterQuery';

const useAppNavItems = (): NavItemInterface[] => {
  const { me } = useUserContext();
  const withFilterQuery = useWithFilterQuery();

  if (!me) return [];

  const { isAdmin } = me;

  const cmsRoute: NavItemInterface = {
    name: 'CMS',
    icon: 'Settings',
    children: [
      {
        name: 'Товары',
        path: {
          pathname: `${ROUTE_CMS}/products`,
          query: { ...withFilterQuery },
        },
      },
      {
        name: 'Рубрикатор',
        path: {
          pathname: `${ROUTE_CMS}/rubrics`,
          query: { ...withFilterQuery },
        },
      },
      {
        name: 'Типы рубрик',
        path: `${ROUTE_CMS}/rubric-variants`,
      },
      {
        name: 'Группы атрибутов',
        path: {
          pathname: `${ROUTE_CMS}/attributes-groups`,
          query: { ...withFilterQuery },
        },
      },
      {
        name: 'Группы опций',
        path: {
          pathname: `${ROUTE_CMS}/options-groups`,
          query: { ...withFilterQuery },
        },
      },
    ],
  };

  const constantRoutes: NavItemInterface[] = [];

  if (isAdmin) {
    return [cmsRoute, ...constantRoutes];
  }

  return [];
};

export default useAppNavItems;
