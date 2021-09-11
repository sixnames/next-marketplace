import { GEO_POINT_TYPE } from '../config/common';

export const MOCK_ADDRESS_A = {
  formattedAddress: 'Ходынский бульвар, 20а, Москва, Россия, 125252',
  point: {
    type: GEO_POINT_TYPE,
    coordinates: [37.5228921272735, 55.790804890785395],
  },
};

export const MOCK_ADDRESS_B = {
  formattedAddress: 'улица Пятницкая, 27а, Москва, Russia',
  point: {
    type: GEO_POINT_TYPE,
    coordinates: [37.62867021460195, 55.74116803925581],
  },
};
