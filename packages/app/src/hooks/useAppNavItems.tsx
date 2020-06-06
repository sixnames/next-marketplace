import { useUserContext } from '../context/userContext';
import { ROUTE_SIGN_OUT } from '@rg/config';
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
    to: `orders`,
  };

  const cmsRoute: NavItemInterface = {
    name: 'CMS',
    icon: 'Settings',
    to: '',
    children: [
      {
        name: 'Рубрикатор',
        to: {
          pathname: 'rubrics',
          search: withFilterQuery,
        },
      },
      {
        name: 'Товары',
        to: {
          pathname: 'products',
          search: withFilterQuery,
        },
      },
      {
        name: 'Типы рубрик',
        to: 'rubric-types',
      },
      {
        name: 'Группы атрибутов',
        to: {
          pathname: 'attributes-groups',
          search: withFilterQuery,
        },
      },
      {
        name: 'Группы опций',
        to: {
          pathname: 'options-groups',
          search: withFilterQuery,
        },
      },
    ],
  };

  const userSettingsRoute: NavItemInterface = {
    icon: `Person`,
    name: `Профиль`,
    to: `profile`,
  };

  const constantRoutes: NavItemInterface[] = [
    {
      icon: `ExitToApp`,
      name: `Выход`,
      to: ROUTE_SIGN_OUT,
    },
  ];

  if (isAdmin) {
    return [ordersRoute, userSettingsRoute, cmsRoute, ...constantRoutes];
  }

  return [];
};

export default useAppNavItems;
