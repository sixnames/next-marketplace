import { ShopInterface } from 'db/uiInterfaces';
import LayoutCard from 'layout/LayoutCard';
import * as React from 'react';
import { Coordinates } from 'generated/apolloComponents';
import { useLoadScript, Marker, GoogleMap, InfoWindow } from '@react-google-maps/api';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { useThemeContext } from 'context/themeContext';
import Image from 'next/image';
import RatingStars from 'components/RatingStars';
import { darkMapStyles, lightMapStyles } from 'config/mapsConfig';

interface ShopsMapInterface {
  shops: ShopInterface[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// TODO get center of session city
const center = {
  lat: 55.751957,
  lng: 37.617575,
};

const shopImageSize = 120;

const ShopsMap: React.FC<ShopsMapInterface> = ({ shops }) => {
  const [selected, setSelected] = React.useState<ShopInterface | null>(null);
  const { isDark } = useThemeContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_GOOGLE_MAPS_API_KEY}`,
  });
  const mapRef = React.useRef<any>(null);

  const onLoad = React.useCallback(
    (map) => {
      mapRef.current = map;
      mapRef.current.setZoom(13);

      // Fit all markers in map window
      const bounds = new window.google.maps.LatLngBounds();
      shops.forEach(({ address }) => {
        bounds.extend(address.formattedCoordinates);
      });
    },
    [shops],
  );

  const panTo = React.useCallback((coords?: Coordinates) => {
    if (!coords) {
      return;
    }
    mapRef.current.panTo(coords);
    mapRef.current.setZoom(14);
  }, []);

  const options = React.useMemo(() => {
    return {
      styles: isDark ? darkMapStyles : lightMapStyles,
    };
  }, [isDark]);

  if (loadError) {
    return <RequestError message={'Ошибка загрузки карты'} />;
  }

  if (!isLoaded) {
    return <Spinner isNested />;
  }

  return (
    <div className='grid lg:grid-cols-7 lg:h-[500px] gap-8'>
      <div className='lg:col-span-2 overflow-y-hidden overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden'>
        <div className='flex gap-6 lg:grid'>
          {shops.map(({ _id, name, address, mainImage, contacts }) => {
            return (
              <LayoutCard
                key={`${_id}`}
                className='grid grid-cols-3 min-w-[310px] lg:min-w-0 overflow-hidden'
                onClick={() => panTo(address.formattedCoordinates)}
              >
                <div className='col-span-1 relative shops-map-snippet'>
                  <Image
                    src={mainImage}
                    alt={name}
                    title={name}
                    width={shopImageSize}
                    height={shopImageSize}
                    objectFit={'cover'}
                  />
                </div>

                <div className='col-span-2 py-[var(--lineGap-75)] px-[var(--lineGap-100)] lg:py-[var(--lineGap-100)] lg:px-[var(--lineGap-150)]'>
                  <div className='font-bold mb-3'>{name}</div>
                  <div className='mb-3'>{address.formattedAddress}</div>
                  <div className='whitespace-nowrap flex flex-wrap gap-2 mb-3'>
                    {contacts.formattedPhones.map((phone) => {
                      return (
                        <div key={phone.raw}>
                          <a
                            className='text-secondary-text hover:text-theme hover:no-underline'
                            href={`tel:${phone.raw}`}
                          >
                            {phone.readable}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                  <div className='flex items-center justify-between'>
                    <RatingStars rating={4.5} showRatingNumber={false} smallStars={true} />
                  </div>
                </div>
              </LayoutCard>
            );
          })}
        </div>
      </div>
      <div className='lg:col-span-5 relative h-[330px] lg:h-auto'>
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={mapContainerStyle}
          mapContainerClassName='absolute inset-0 block w-full h-full'
          zoom={12}
          center={center}
          options={options}
        >
          {shops.map((shop) => {
            const {
              _id,
              logo,
              address: { formattedCoordinates },
            } = shop;

            return (
              <Marker
                key={`${_id}`}
                position={formattedCoordinates}
                icon={{
                  url: logo.url,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onClick={() => {
                  setSelected(shop);
                }}
              />
            );
          })}
          {selected ? (
            <InfoWindow
              position={selected.address.formattedCoordinates}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <div className='mb-3 font-bold text-xl text-black'>{selected.name}</div>
                <div className='text-[1rem] text-black'>{selected.address.formattedAddress}</div>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </div>
    </div>
  );
};

export default ShopsMap;
