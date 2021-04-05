import { ROUTE_APP } from 'config/common';
import * as React from 'react';
import { NavItemInterface } from 'types/clientTypes';

interface UseShopAppNavInterface {
  shopId: string;
}
const useShopAppNav = ({ shopId }: UseShopAppNavInterface): NavItemInterface[] => {
  return React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: `${ROUTE_APP}/shops/${shopId}`,
      },
      {
        name: 'Товары',
        testId: 'products',
        path: `${ROUTE_APP}/shops/${shopId}/products`,
      },
      {
        name: 'Изображения',
        testId: 'assets',
        path: `${ROUTE_APP}/shops/${shopId}/assets`,
      },
    ];
  }, [shopId]);
};

export default useShopAppNav;
