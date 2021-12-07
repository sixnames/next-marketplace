import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { MAP_DEFAULT_CENTER } from 'config/common';
import { darkMapStyles, lightMapStyles } from 'config/mapsConfig';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import { AddressModel } from 'db/dbModels';
import * as React from 'react';

/*const fallbackMarker = {
  path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
  fillColor: '#FF0000',
  fillOpacity: 0.6,
  anchor: new google.maps.Point(0, 0),
  strokeWeight: 0,
  scale: 1,
};*/

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export interface WpMapMarkerInterface {
  _id: any;
  icon?: string | null;
  address?: AddressModel;
  name: string;
}

interface WpMapCenterInterface {
  lat: number;
  lng: number;
}

export interface WpMapInterface {
  markers?: WpMapMarkerInterface[];
  testId?: string;
  center?: WpMapCenterInterface;
  onMarkerClick?: (marker: WpMapMarkerInterface) => void;
  mapRef: React.MutableRefObject<any>;
  className?: string;
}

const WpMap: React.FC<WpMapInterface> = ({
  mapRef,
  testId,
  markers,
  onMarkerClick,
  center = MAP_DEFAULT_CENTER,
  className,
}) => {
  const { configs } = useConfigContext();
  const [selected, setSelected] = React.useState<WpMapMarkerInterface | null>(null);
  const { isDark } = useThemeContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_GOOGLE_MAPS_API_KEY}`,
  });
  const siteThemeColor = configs.siteThemeColor;

  const onLoad = React.useCallback(
    (map) => {
      mapRef.current = map;

      if (markers && markers.length > 1) {
        // Fit all markers in map window
        const bounds = new window.google.maps.LatLngBounds();
        (markers || []).forEach(({ address }) => {
          if (address) {
            bounds.extend(address.mapCoordinates);
          }
        });

        map.fitBounds(bounds);
      }

      if (markers && markers.length === 1) {
        const marker = markers[0];
        map.setCenter({
          lat: marker.address?.mapCoordinates.lat,
          lng: marker.address?.mapCoordinates.lng,
        });
      }
    },
    [mapRef, markers],
  );

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
    <div className={`${className ? className : 'relative h-[400px]'}`} data-cy={testId}>
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={mapContainerStyle}
        mapContainerClassName='absolute inset-0 block w-full h-full'
        zoom={12}
        center={center}
        options={options}
      >
        {(markers || []).map((marker) => {
          const { _id, icon, address } = marker;

          if (!address) {
            return null;
          }

          return (
            <Marker
              key={`${_id}`}
              position={address.mapCoordinates}
              icon={
                icon
                  ? {
                      url: icon || '/marker.svg',
                      scaledSize: new window.google.maps.Size(40, 40),
                    }
                  : {
                      path: 'M25.4324 4.87366C24.8395 3.44814 23.8844 1.45583 23.8553 1.39331C23.7857 1.22905 23.6616 1.09396 23.5041 1.01092C23.3465 0.927884 23.1651 0.902 22.9907 0.937658C22.8163 0.973315 22.6595 1.06832 22.547 1.20658C22.4344 1.34484 22.373 1.51785 22.3731 1.6963C22.3875 1.8361 22.4227 1.97294 22.4778 2.1022C22.6702 2.53639 23.5802 4.70277 24.3958 7.11882C24.7474 8.1301 24.9992 9.17351 25.1476 10.2341C25.69 14.3107 24.516 17.9018 20.1083 20.0148C17.8763 21.083 15.2879 21.0656 13.1877 19.7604C10.4307 18.0494 7.88882 15.3692 5.46119 15.0235C4.29873 14.8565 3.53344 15.0565 2.68097 15.3692C1.94667 13.3746 2.89021 9.59509 3.96161 6.43129C4.32392 5.38059 5.51932 2.45567 5.67432 2.1022C5.73122 1.97234 5.76593 1.83381 5.777 1.69241C5.77669 1.48698 5.69514 1.29006 5.55024 1.1448C5.40533 0.99954 5.20889 0.917795 5.00397 0.91748C4.84989 0.920114 4.69994 0.967847 4.57257 1.05481C4.44521 1.14176 4.34598 1.26415 4.28711 1.40691C4.2658 1.45158 3.31064 3.44814 2.71778 4.87366C2.57054 5.22715 1.28989 8.60848 0.88108 10.0127C0.0460425 12.8851 -0.256198 15.8703 0.239789 18.1756C0.367667 18.766 0.642784 19.4328 1.06514 20.176L1.06708 20.178C2.17336 22.1221 4.29099 24.5789 7.39284 27.5116C9.73133 29.7238 12.3081 31.8485 13.459 32.7807C13.6327 32.9208 13.8493 32.9967 14.0722 32.9956C14.2952 32.9945 14.511 32.9166 14.6834 32.7749C15.9505 31.7281 18.9167 29.2557 20.7593 27.5116C22.6463 25.7287 24.1666 24.1238 25.32 22.697L25.3219 22.695C26.7866 20.8869 27.6527 19.3739 27.9104 18.1756C28.7241 14.402 27.0714 8.80656 25.4324 4.87366Z M14.0441 12.3623C14.7813 12.3512 15.4846 12.0499 16.0019 11.5233C16.5192 10.9968 16.8091 10.2873 16.8088 9.54829C16.8767 8.35006 15.3558 5.62927 14.542 4.26595C14.4907 4.1794 14.4179 4.1077 14.3306 4.05791C14.2433 4.00812 14.1446 3.98193 14.0441 3.98193C13.9437 3.98193 13.845 4.00812 13.7577 4.05791C13.6704 4.1077 13.5975 4.1794 13.5462 4.26595C12.7325 5.62927 11.2116 8.35007 11.2794 9.54829C11.2792 10.2873 11.569 10.9968 12.0864 11.5233C12.6037 12.0499 13.3069 12.3512 14.0441 12.3623Z',
                      fillColor: `rgb(${siteThemeColor})`,
                      fillOpacity: 1,
                      strokeWeight: 0,
                      scaledSize: new window.google.maps.Size(40, 40),
                      anchor: new google.maps.Point(20, 40),
                      scale: 1,
                    }
              }
              onClick={() => {
                setSelected(marker);
                if (onMarkerClick) {
                  onMarkerClick(marker);
                }
              }}
            />
          );
        })}
        {selected && selected.address && selected.address.mapCoordinates ? (
          <InfoWindow
            position={selected.address.mapCoordinates}
            onCloseClick={() => setSelected(null)}
          >
            <div className='pb-2'>
              <div className='mb-3 font-bold text-xl text-black'>{selected.name}</div>
              <div className='text-[1rem] text-black'>{selected.address?.readableAddress}</div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default WpMap;
