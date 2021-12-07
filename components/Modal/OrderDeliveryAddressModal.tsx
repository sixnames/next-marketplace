import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import ControlButton from 'components/button/ControlButton';
import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import { MAP_DEFAULT_CENTER } from 'config/common';
import { useAppContext } from 'context/appContext';
import { useLocaleContext } from 'context/localeContext';
import { CoordinatesModel } from 'db/dbModels';
import { Form, Formik } from 'formik';
import { ReverseGeocodePayload } from 'lib/geocode';
import fetch from 'node-fetch';
import * as React from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export interface OrderDeliveryAddressModalInterface {
  confirm: (values: any) => void;
}

const OrderDeliveryAddressModal: React.FC<OrderDeliveryAddressModalInterface> = ({ confirm }) => {
  const { locale } = useLocaleContext();
  const { hideModal, ipInfo } = useAppContext();
  const [marker, setMarker] = React.useState<CoordinatesModel | null>(null);
  const [zoom, setZoom] = React.useState<number>(12);
  const [center, setCenter] = React.useState<CoordinatesModel>(MAP_DEFAULT_CENTER);
  const mapRef = React.useRef<any>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_GOOGLE_MAPS_API_KEY}`,
  });
  const onLoad = React.useCallback(
    (map) => {
      mapRef.current = map;
    },
    [mapRef],
  );

  React.useEffect(() => {
    if (ipInfo && ipInfo.location && ipInfo.location.latitude && ipInfo.location.longitude) {
      setCenter({
        lat: ipInfo.location.latitude,
        lng: ipInfo.location.longitude,
      });
    }
  }, [ipInfo]);

  React.useEffect(() => {}, [mapRef, marker]);

  if (loadError) {
    return <RequestError message={'Ошибка загрузки карты'} />;
  }

  if (!isLoaded) {
    return (
      <div className='relative fixed inset-0 bg-primary'>
        <Spinner />
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        address: null,
      }}
      onSubmit={(values) => {
        confirm(values);
      }}
    >
      {({ setFieldValue }) => {
        return (
          <Form>
            <div className='fixed inset-0 bg-primary flex flex-col'>
              <div className='relative z-20 bg-primary wp-shadow-200'>
                <Inner wide>
                  <div className='flex items-center justify-between'>
                    <Title tag={'div'} low>
                      Укажите адрес доставки
                    </Title>
                    <ControlButton icon={'cross'} onClick={hideModal} />
                  </div>
                </Inner>
              </div>

              <div className='relative z-10 flex-grow grid grid-cols-6'>
                <div className='relative z-20 col-span-2 bg-primary wp-shadow-200'>
                  <Inner wide>
                    <FormikAddressInput
                      name={'address'}
                      label={'Поиск по адресу'}
                      onAddressSelect={(result) => {
                        setCenter(result.point);
                        setZoom(19);
                        setMarker(result.point);
                      }}
                    />
                  </Inner>
                </div>
                <div className='relative z-10 col-span-4'>
                  <GoogleMap
                    onLoad={onLoad}
                    mapContainerStyle={mapContainerStyle}
                    mapContainerClassName='absolute inset-0 block w-full h-full'
                    zoom={zoom}
                    center={center}
                    onClick={(e) => {
                      const lat = e.latLng.lat();
                      const lng = e.latLng.lng();
                      const marker = {
                        lat,
                        lng,
                      };
                      setMarker(marker);
                      setCenter(marker);
                      setZoom(19);
                      const coordinates = `latlng=${lat},${lng}`;
                      const settings = `language=${locale}&location_type=ROOFTOP&result_type=street_address`;
                      const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
                      const url = `https://maps.googleapis.com/maps/api/geocode/json?${coordinates}&${settings}&${apiKey}`;
                      fetch(url)
                        .then<ReverseGeocodePayload>((res) => res.json())
                        .then((geocode) => {
                          if (geocode && geocode.results && geocode.results.length > 0) {
                            const geocodeResult = geocode.results[0];
                            if (geocodeResult) {
                              const { formatted_address, geometry, address_components } =
                                geocodeResult;
                              const selectedAddress = {
                                formattedAddress: formatted_address,
                                point: {
                                  lat: geometry.location.lat,
                                  lng: geometry.location.lng,
                                },
                                addressComponents: address_components.map((component) => {
                                  return {
                                    shortName: component.short_name,
                                    longName: component.long_name,
                                    types: component.types,
                                  };
                                }),
                              };
                              setFieldValue('address', selectedAddress);
                            }
                          }
                        })
                        .catch(console.log);
                    }}
                  >
                    {marker ? (
                      <Marker
                        position={marker}
                        icon={{
                          url: '/marker.svg',
                          scaledSize: new window.google.maps.Size(40, 40),
                        }}
                      />
                    ) : null}
                  </GoogleMap>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderDeliveryAddressModal;
