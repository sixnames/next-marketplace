import { ShopInterface } from 'db/uiInterfaces';
import * as React from 'react';
import classes from './ShopsMap.module.css';
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
    <div className={classes.frame}>
      <div className={classes.scroller}>
        <div className={classes.list}>
          {shops.map(({ _id, name, address, mainImage }) => {
            return (
              <div
                key={`${_id}`}
                className={classes.listItem}
                onClick={() => panTo(address.formattedCoordinates)}
              >
                <div className={classes.listItemImage}>
                  <Image
                    src={mainImage}
                    alt={name}
                    title={name}
                    width={shopImageSize}
                    height={shopImageSize}
                    objectFit={'cover'}
                  />
                </div>

                <div className={classes.listItemContent}>
                  <div className={classes.listItemName}>{name}</div>
                  <div className={classes.listItemAddress}>{address.formattedAddress}</div>
                  <div className={classes.listItemBottom}>
                    <RatingStars rating={4.5} showRatingNumber={false} smallStars={true} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={classes.map}>
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={mapContainerStyle}
          mapContainerClassName={classes.mapContainer}
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
                <div className={classes.infoName}>{selected.name}</div>
                <div className={classes.infoAddress}>{selected.address.formattedAddress}</div>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </div>
    </div>
  );
};

export default ShopsMap;
