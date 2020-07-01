import { useUserContext } from '../context/userContext';
import { ROUTE_SIGN_OUT } from '../config';
import { NavItemInterface } from '../types';
import useWithFilterQuery from './useWithFilterQuery';

const useAppNavItems = (): NavItemInterface[] => {
  const { me } = useUserContext();
  const withFilterQuery = useWithFilterQuery();

  if (!me) return [];

  const { isAdmin } = me;

  const ordersCounter = 0;

  const ordersRoute: NavItemInterface = {
    name: `Заказы`,
    icon: `ShoppingCart`,
    counter: ordersCounter,
    path: `/orders`,
  };

  const cmsRoute: NavItemInterface = {
    name: 'CMS',
    icon: 'Settings',
    children: [
      {
        name: 'Товары',
        path: {
          pathname: '/products',
          query: { ...withFilterQuery },
        },
      },
      {
        name: 'Рубрикатор',
        path: {
          pathname: '/rubrics',
          query: { ...withFilterQuery },
        },
      },
      {
        name: 'Типы рубрик',
        path: '/rubric-types',
      },
      {
        name: 'Группы атрибутов',
        path: {
          pathname: '/attributes-groups',
          query: { ...withFilterQuery },
        },
      },
      {
        name: 'Группы опций',
        path: {
          pathname: '/options-groups',
          query: { ...withFilterQuery },
        },
      },
    ],
  };

  const userSettingsRoute: NavItemInterface = {
    icon: `Person`,
    name: `Профиль`,
    path: `/profile`,
  };

  const constantRoutes: NavItemInterface[] = [
    {
      icon: `ExitToApp`,
      name: `Выход`,
      path: ROUTE_SIGN_OUT,
    },
  ];

  if (isAdmin) {
    return [ordersRoute, userSettingsRoute, cmsRoute, ...constantRoutes];
  }

  return [];
};

export default useAppNavItems;
