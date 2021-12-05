import { GEO_POINT_TYPE } from '../config/common';

export const ADDRESS_COMPONENTS = [
  {
    shortName: '20а',
    longName: '20а',
    types: ['street_number'],
  },
  {
    shortName: 'Ходынский б-р',
    longName: 'Ходынский бульвар',
    types: ['route'],
  },
  {
    shortName: 'Северный административный округ',
    longName: 'Северный административный округ',
    types: ['political', 'sublocality', 'sublocality_level_1'],
  },
  {
    shortName: 'Москва',
    longName: 'Москва',
    types: ['locality', 'political'],
  },
  {
    shortName: 'Хорошевский',
    longName: 'Хорошевский',
    types: ['administrative_area_level_3', 'political'],
  },
  {
    shortName: 'Москва',
    longName: 'Москва',
    types: ['administrative_area_level_2', 'political'],
  },
  {
    shortName: 'RU',
    longName: 'Россия',
    types: ['country', 'political'],
  },
  {
    shortName: '125252',
    longName: '125252',
    types: ['postal_code'],
  },
];

export const MOCK_ADDRESS_A = {
  addressComponents: ADDRESS_COMPONENTS,
  readableAddress: 'Ходынский бульвар, 20а, Москва',
  formattedAddress: 'Ходынский бульвар, 20а, Москва, Россия, 125252',
  point: {
    type: GEO_POINT_TYPE,
    coordinates: [37.5228921272735, 55.790804890785395],
  },
};

export const MOCK_ADDRESS_B = {
  addressComponents: ADDRESS_COMPONENTS,
  readableAddress: 'улица Пятницкая, 27а, Москва',
  formattedAddress: 'улица Пятницкая, 27а, Москва, Russia',
  point: {
    type: GEO_POINT_TYPE,
    coordinates: [37.62867021460195, 55.74116803925581],
  },
};
