import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { darkMapStyles, lightMapStyles } from 'config/mapsConfig';
import { useThemeContext } from 'context/themeContext';
import { AddressInterface } from 'db/uiInterfaces';
import * as React from 'react';

// TODO get center of session city
// Moscow center
const defaultMapCenter = {
  lat: 55.751957,
  lng: 37.617575,
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

interface WpMapMarkerInterface {
  _id: any;
  icon?: string;
  address?: AddressInterface;
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
}

const WpMap: React.FC<WpMapInterface> = ({
  mapRef,
  testId,
  markers,
  onMarkerClick,
  center = defaultMapCenter,
}) => {
  const [selected, setSelected] = React.useState<WpMapMarkerInterface | null>(null);
  const { isDark } = useThemeContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_GOOGLE_MAPS_API_KEY}`,
  });

  const onLoad = React.useCallback(
    (map) => {
      mapRef.current = map;
      mapRef.current.setZoom(13);

      // Fit all markers in map window
      const bounds = new window.google.maps.LatLngBounds();
      (markers || []).forEach(({ address }) => {
        if (address && address.formattedCoordinates) {
          bounds.extend(address.formattedCoordinates);
        }
      });
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
    <div data-cy={testId}>
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
              position={address.formattedCoordinates}
              icon={{
                url: icon || '/marker.svg',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => {
                setSelected(marker);
                if (onMarkerClick) {
                  onMarkerClick(marker);
                }
              }}
            />
          );
        })}
        {selected && selected.address && selected.address.formattedCoordinates ? (
          <InfoWindow
            position={selected.address.formattedCoordinates}
            onCloseClick={() => setSelected(null)}
          >
            <div className='pb-2'>
              <div className='mb-3 font-bold text-xl text-black'>{selected.name}</div>
              <div className='text-[1rem] text-black'>{selected.address?.formattedAddress}</div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default WpMap;
