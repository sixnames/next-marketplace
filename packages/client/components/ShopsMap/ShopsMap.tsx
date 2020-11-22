import React, { useCallback, useMemo, useRef, useState } from 'react';
import classes from './ShopsMap.module.css';
import { Coordinates, ProductCardShopFragment } from '../../generated/apolloComponents';
import { ASSETS_URL } from '../../config';
import { useConfigContext } from '../../context/configContext';
import { useLoadScript, Marker, GoogleMap, InfoWindow } from '@react-google-maps/api';
import RequestError from '../RequestError/RequestError';
import Spinner from '../Spinner/Spinner';
import { useThemeContext } from '../../context/themeContext';
import { darkMapStyles, lightMapStyles } from '../../config/mapsConfig';
import Image from '../Image/Image';
import RatingStars from '../RatingStars/RatingStars';

interface ShopsMapInterface {
  shops: ProductCardShopFragment[];
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
  const [selected, setSelected] = useState<ProductCardShopFragment | null>(null);
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
  });
  const siteIcon = getSiteConfigSingleValue('siteLogoIcon');
  const siteIconSrc = `${ASSETS_URL}${siteIcon}?format=svg`;
  const mapRef = useRef<any>(null);

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;

      // Fit all markers in map window
      const bounds = new window.google.maps.LatLngBounds();
      shops.forEach(({ node }) => {
        bounds.extend(node.address.formattedCoordinates);
      });
      mapRef.current.fitBounds(bounds);
    },
    [shops],
  );

  const panTo = useCallback((coords: Coordinates) => {
    mapRef.current.panTo(coords);
    mapRef.current.setZoom(14);
  }, []);

  const options = useMemo(() => {
    return { styles: isDark ? darkMapStyles : lightMapStyles, disableDefaultUI: true };
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
          {shops.map(({ id, node }) => {
            const { assets, nameString, address, productsCount } = node;
            const mainImage = assets[0].url;
            return (
              <div
                key={id}
                className={classes.listItem}
                onClick={() => panTo(address.formattedCoordinates)}
              >
                <div className={classes.listItemImage}>
                  <Image url={mainImage} alt={nameString} title={nameString} width={120} />
                </div>

                <div className={classes.listItemContent}>
                  <div className={classes.listItemName}>{nameString}</div>
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
            const { id, node } = shop;
            const {
              address: { formattedCoordinates },
            } = node;
            return (
              <Marker
                key={id}
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
              position={selected.node.address.formattedCoordinates}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <div className={classes.infoName}>{selected.node.nameString}</div>
                <div className={classes.infoAddress}>{selected.node.address.formattedAddress}</div>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </div>
    </div>
  );
};

export default ShopsMap;
