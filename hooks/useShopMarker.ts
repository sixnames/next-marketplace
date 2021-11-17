import { useThemeContext } from 'context/themeContext';
import { ShopInterface } from 'db/uiInterfaces';

export function useShopMarker(shop: ShopInterface | null | undefined) {
  const { isDark } = useThemeContext();
  const lightThemeMarker = shop?.mapMarker?.lightTheme;
  const darkThemeMarker = shop?.mapMarker?.darkTheme;
  return (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';
}
