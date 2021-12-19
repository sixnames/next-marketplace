import { useThemeContext } from '../context/themeContext';
import { ShopInterface } from '../db/uiInterfaces';

interface UseShopMarkerShopInterface extends Omit<ShopInterface, '_id'> {
  _id: any;
}

export function useShopMarker(shop: UseShopMarkerShopInterface | null | undefined) {
  const { isDark } = useThemeContext();
  const lightThemeMarker = shop?.mapMarker?.lightTheme;
  const darkThemeMarker = shop?.mapMarker?.darkTheme;
  return (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';
}
