import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import ControlButton from 'components/button/ControlButton';
import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import { useAppContext } from 'context/appContext';
import { Form, Formik } from 'formik';
import * as React from 'react';

// Moscow center
const defaultMapCenter = {
  lat: 55.751957,
  lng: 37.617575,
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export interface OrderDeliveryAddressModalInterface {
  confirm: (values: any) => void;
}

const OrderDeliveryAddressModal: React.FC<OrderDeliveryAddressModalInterface> = ({ confirm }) => {
  const { hideModal, ipInfo } = useAppContext();
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

  console.log(ipInfo);

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
      {({ values }) => {
        console.log('values.address', values.address);
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
                    <FormikAddressInput name={'address'} label={'Поиск по адресу'} />
                  </Inner>
                </div>
                <div className='relative z-10 col-span-4'>
                  <GoogleMap
                    onLoad={onLoad}
                    mapContainerStyle={mapContainerStyle}
                    mapContainerClassName='absolute inset-0 block w-full h-full'
                    zoom={12}
                    center={
                      ipInfo
                        ? {
                            lat: ipInfo.location.latitude,
                            lng: ipInfo.location.longitude,
                          }
                        : defaultMapCenter
                    }
                  />
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
