import LinkPhone from 'components/Link/LinkPhone';
import WpImage from 'components/WpImage';
import WpMap from 'components/WpMap';
import { useThemeContext } from 'context/themeContext';
import { ShopInterface } from 'db/uiInterfaces';
import LayoutCard from 'layout/LayoutCard';
import * as React from 'react';
import { Coordinates } from 'generated/apolloComponents';

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
    <div className='grid lg:grid-cols-7 lg:h-[500px] gap-8'>
      {/* Shops list */}
      <div className='lg:col-span-2 overflow-y-hidden overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden'>
        <div className='flex gap-6 lg:grid'>
          {shops.map(({ _id, name, address, mainImage, contacts, license }) => {
            return (
              <LayoutCard
                key={`${_id}`}
                className='grid grid-cols-3 min-w-[310px] lg:min-w-0 overflow-hidden'
                onClick={() => panTo(address.mapCoordinates)}
              >
                <div className='col-span-1 relative shops-map-snippet'>
                  <WpImage
                    url={mainImage}
                    alt={name}
                    title={name}
                    width={150}
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                </div>

                <div className='col-span-2 py-[var(--lineGap-75)] px-[var(--lineGap-100)] lg:py-[var(--lineGap-100)] lg:px-[var(--lineGap-150)]'>
                  <div className='font-bold mb-3'>{name}</div>
                  <div className='mb-3'>{address.readableAddress}</div>
                  <div className='whitespace-nowrap flex flex-wrap gap-2 mb-3'>
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
      <div className='lg:col-span-5 relative h-[330px] lg:h-auto'>
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
