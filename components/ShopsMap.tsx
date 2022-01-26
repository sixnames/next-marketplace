import * as React from 'react';
import { useThemeContext } from '../context/themeContext';
import { ShopInterface } from '../db/uiInterfaces';
import { Coordinates } from '../generated/apolloComponents';
import LayoutCard from '../layout/LayoutCard';
import LinkPhone from './Link/LinkPhone';
import WpImage from './WpImage';
import WpMap from './WpMap';

interface ShopsMapInterface {
  shops: ShopInterface[];
}

const ShopsMap: React.FC<ShopsMapInterface> = ({ shops }) => {
  const { isDark } = useThemeContext();
  const mapRef = React.useRef<any>(null);
  const panTo = React.useCallback((coords?: Coordinates) => {
    if (!coords) {
      return;
    }
    mapRef.current.panTo(coords);
    mapRef.current.setZoom(14);
  }, []);

  return (
    <div className='grid gap-8 lg:h-[500px] lg:grid-cols-7'>
      {/* Shops list */}
      <div className='overflow-x-auto overflow-y-hidden lg:col-span-2 lg:overflow-y-auto lg:overflow-x-hidden'>
        <div className='flex gap-6 lg:grid'>
          {shops.map(({ _id, name, address, mainImage, contacts, license }) => {
            return (
              <LayoutCard
                key={`${_id}`}
                className='grid min-w-[310px] grid-cols-3 overflow-hidden lg:min-w-0'
                onClick={() => panTo(address.mapCoordinates)}
              >
                <div className='shops-map-snippet relative col-span-1'>
                  <WpImage
                    url={mainImage}
                    alt={name}
                    title={name}
                    width={150}
                    className='absolute inset-0 h-full w-full object-cover'
                  />
                </div>

                <div className='col-span-2 py-[var(--lineGap-75)] px-[var(--lineGap-100)] lg:py-[var(--lineGap-100)] lg:px-[var(--lineGap-150)]'>
                  <div className='mb-3 font-bold'>{name}</div>
                  <div className='mb-3'>{address.readableAddress}</div>
                  <div className='mb-3 flex flex-wrap gap-2 whitespace-nowrap'>
                    {(contacts.formattedPhones || []).map((phone) => {
                      return (
                        <LinkPhone
                          key={phone.raw}
                          className='text-secondary-text hover:text-theme hover:no-underline'
                          value={phone}
                        />
                      );
                    })}
                  </div>
                  {/*<div className='flex items-center justify-between'>
                    <RatingStars rating={rating} showRatingNumber={false} smallStars />
                  </div>*/}
                  {license ? (
                    <div className='mt-3 text-sm text-secondary-text'>
                      Лицензия:
                      {` ${license}`}
                    </div>
                  ) : null}
                </div>
              </LayoutCard>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className='relative h-[330px] lg:col-span-5 lg:h-auto'>
        <WpMap
          className='absolute inset-0'
          mapRef={mapRef}
          markers={shops.map((shop) => {
            const lightThemeMarker = shop.mapMarker?.lightTheme;
            const darkThemeMarker = shop.mapMarker?.darkTheme;
            const marker = (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';

            return {
              _id: shop._id,
              icon: marker,
              name: shop.name,
              address: shop.address,
            };
          })}
        />
      </div>
    </div>
  );
};

export default ShopsMap;
