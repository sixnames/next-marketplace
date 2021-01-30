import * as React from 'react';
import classes from './ShopsMap.module.css';
import { Coordinates, ShopSnippetFragment } from 'generated/apolloComponents';
import { useConfigContext } from 'context/configContext';
import { useLoadScript, Marker, GoogleMap, InfoWindow } from '@react-google-maps/api';
import RequestError from '../RequestError/RequestError';
import Spinner from '../Spinner/Spinner';
import { useThemeContext } from 'context/themeContext';
import Image from 'next/image';
import RatingStars from '../RatingStars/RatingStars';
import { darkMapStyles, lightMapStyles } from 'config/mapsConfig';

interface ShopsMapInterface {
  shops: ShopSnippetFragment[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 55.751957,
  lng: 37.617575,
};

const ShopsMap: React.FC<ShopsMapInterface> = ({ shops }) => {
  const [selected, setSelected] = React.useState<ShopSnippetFragment | null>(null);
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
  });
  const siteIconSrc = getSiteConfigSingleValue('siteLogoIcon');
  const mapRef = React.useRef<any>(null);

  const onLoad = React.useCallback(
    (map) => {
      mapRef.current = map;

      // Fit all markers in map window
      const bounds = new window.google.maps.LatLngBounds();
      shops.forEach(({ address }) => {
        bounds.extend(address.formattedCoordinates);
      });
      mapRef.current.fitBounds(bounds);
    },
    [shops],
  );

  const panTo = React.useCallback((coords: Coordinates) => {
    mapRef.current.panTo(coords);
    mapRef.current.setZoom(14);
  }, []);

  const options = React.useMemo(() => {
    return { styles: isDark ? darkMapStyles : lightMapStyles, disableDefaultUI: true };
  }, [isDark]);

  if (loadError) {
    return <RequestError message={'Ошибка загрузки карты'} />;
  }

  if (!isLoaded) {
    return <Spinner isNested />;
  }

  const shopImageSize = 120;

  return (
    <div className={classes.frame}>
      <div className={classes.scroller}>
        <div className={classes.list}>
          {shops.map(({ _id, assets, name, address, productsCount }) => {
            const mainImage = assets[0].url;
            return (
              <div
                key={_id}
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
                  />
                </div>

                <div className={classes.listItemContent}>
                  <div className={classes.listItemName}>{name}</div>
                  <div className={classes.listItemAddress}>{address.formattedAddress}</div>
                  <div className={classes.listItemBottom}>
                    <div className={classes.listItemCounter}>{`${productsCount} товаров`}</div>
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
          zoom={11}
          center={center}
          options={options}
        >
          {shops.map((shop) => {
            const {
              _id,
              address: { formattedCoordinates },
            } = shop;
            return (
              <Marker
                key={_id}
                position={formattedCoordinates}
                icon={{
                  url: siteIconSrc,
                  scaledSize: new window.google.maps.Size(28, 32),
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
