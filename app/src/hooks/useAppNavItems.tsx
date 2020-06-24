import { useUserContext } from '../context/userContext';
import { NavItemInterface } from '../types';
import useWithFilterQuery from './useWithFilterQuery';
import { ROUTE_SIGN_OUT } from '../config';

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
          pathname: 'cms/rubrics',
          search: withFilterQuery.string,
        },
      },
      {
        name: 'Товары',
        to: {
          pathname: 'cms/products',
          search: withFilterQuery.string,
        },
      },
      {
        name: 'Типы рубрик',
        to: 'cms/rubric-variants',
      },
      {
        name: 'Группы атрибутов',
        to: {
          pathname: 'cms/attributes-groups',
          search: withFilterQuery.string,
        },
      },
      {
        name: 'Группы опций',
        to: {
          pathname: 'cms/options-groups',
          search: withFilterQuery.string,
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
