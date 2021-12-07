import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Button from 'components/button/Button';
import ControlButton from 'components/button/ControlButton';
import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { DATE_FORMAT_FULL, GEO_POINT_TYPE, MAP_DEFAULT_CENTER } from 'config/common';
import { useAppContext } from 'context/appContext';
import { useLocaleContext } from 'context/localeContext';
import { AddressModel, CoordinatesModel, OrderDeliveryInfoModel } from 'db/dbModels';
import { Form, Formik } from 'formik';
import { getReadableAddress } from 'lib/addressUtils';
import { GeocodeResultInterface, ReverseGeocodePayload } from 'lib/geocode';
import fetch from 'node-fetch';
import * as React from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

interface OrderDeliveryAddressModalValuesInterface extends Omit<OrderDeliveryInfoModel, 'address'> {
  address: GeocodeResultInterface | null;
}

export interface OrderDeliveryAddressModalInterface {
  confirm: (values: OrderDeliveryInfoModel) => void;
  deliveryInfo?: OrderDeliveryInfoModel | null;
}

const OrderDeliveryAddressModal: React.FC<OrderDeliveryAddressModalInterface> = ({
  confirm,
  deliveryInfo,
}) => {
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
    <Formik<OrderDeliveryAddressModalValuesInterface>
      initialValues={{
        address: deliveryInfo?.address
          ? {
              formattedAddress: deliveryInfo.address.formattedAddress,
              addressComponents: deliveryInfo.address.addressComponents,
              point: deliveryInfo.address.mapCoordinates,
            }
          : null,
        entrance: deliveryInfo?.entrance,
        intercom: deliveryInfo?.intercom,
        floor: deliveryInfo?.floor,
        apartment: deliveryInfo?.apartment,
        commentForCourier: deliveryInfo?.commentForCourier,
        recipientName: deliveryInfo?.recipientName,
        recipientPhone: deliveryInfo?.recipientPhone,
        desiredDeliveryDate: deliveryInfo?.desiredDeliveryDate,
      }}
      onSubmit={(values, { setFieldError }) => {
        if (!values.address) {
          setFieldError('address', 'Укажите адрес');
          return;
        }
        const { point, addressComponents, formattedAddress } = values.address;
        const selectedAddress: AddressModel = {
          formattedAddress,
          addressComponents,
          readableAddress: getReadableAddress(addressComponents),
          mapCoordinates: {
            lat: point.lat,
            lng: point.lng,
          },
          point: {
            type: GEO_POINT_TYPE,
            coordinates: [point.lng, point.lat],
          },
        };
        confirm({
          ...values,
          address: selectedAddress,
        });
      }}
    >
      {({ setFieldValue }) => {
        return (
          <Form>
            <div className='fixed inset-0 bg-primary flex flex-col min-w-[320px]'>
              {/*title*/}
              <div className='relative z-20 bg-primary wp-shadow-200'>
                <Inner wide>
                  <div className='flex items-center justify-between'>
                    <div className='font-bold text-2xl md:text-3xl lg:text-4xl'>
                      Укажите адрес доставки
                    </div>
                    <ControlButton icon={'cross'} onClick={hideModal} />
                  </div>
                </Inner>
              </div>

              <div className='relative z-10 flex-grow grid grid-cols-6'>
                {/*form fields*/}
                <div className='relative z-20 col-span-6 md:col-span-3 lg:col-span-2 bg-primary wp-shadow-200'>
                  <div className='absolute inset-0 overflow-x-hidden overflow-y-auto'>
                    <Inner wide>
                      {/*address fields*/}
                      <div className='mb-16'>
                        <div className='font-medium text-xl lg:text-2xl mb-4'>Адрес доставки</div>
                        <FormikAddressInput
                          name={'address'}
                          label={'Адрес'}
                          isRequired
                          showInlineError
                          onAddressSelect={(result) => {
                            setCenter(result.point);
                            setZoom(19);
                            setMarker(result.point);
                          }}
                        />

                        <div className='grid grid-cols-2 gap-x-6'>
                          <FormikInput name={'entrance'} label={'Подъезд'} type={'number'} />
                          <FormikInput name={'intercom'} label={'Домофон'} />
                          <FormikInput name={'floor'} label={'Этаж'} type={'number'} />
                          <FormikInput name={'apartment'} label={'Квартира / офис'} />
                        </div>

                        <FormikDatePicker
                          showTimeSelect
                          dateFormat={DATE_FORMAT_FULL}
                          label={'Желаемая дата и время доставки'}
                          name={'desiredDeliveryDate'}
                          testId={'desiredDeliveryDate'}
                        />

                        <FormikTextarea name={'commentForCourier'} label={'Комментарий курьеру'} />
                      </div>

                      {/*recipient fields*/}
                      <div className='mb-16'>
                        <div className='font-medium text-xl lg:text-2xl mb-4'>
                          Данные получателя{' '}
                          <span className='text-sm text-secondary-text inline-block'>
                            если получатель не вы
                          </span>
                        </div>
                        <FormikInput name={'recipientName'} label={'Имя и фамилия'} />
                        <FormikInput name={'recipientPhone'} type={'tel'} label={'Телефон'} />
                        <Button type={'submit'}>Сохранить</Button>
                      </div>
                    </Inner>
                  </div>
                </div>

                {/*map*/}
                <div className='hidden md:block relative z-10 col-span-3 lg:col-span-4'>
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
                              const selectedAddress: GeocodeResultInterface = {
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
