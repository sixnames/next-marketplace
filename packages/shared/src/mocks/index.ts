import { ADMIN_EMAIL, ADMIN_LAST_NAME, ADMIN_NAME, ADMIN_PASSWORD, ADMIN_PHONE } from '../config';

// Users
export const ME_AS_ADMIN = {
  id: 'adminBro',
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  name: ADMIN_NAME,
  secondName: 'SecondName',
  lastName: ADMIN_LAST_NAME,
  phone: ADMIN_PHONE,
};

// Addresses
export const MOCK_ADDRESS_A = {
  formattedAddress: 'Ленинградский пр-т., 35 строение 5, Москва, Россия, 125284',
  point: {
    lat: 55.790229,
    lng: 37.549611,
  },
};

export const MOCK_ADDRESS_B = {
  formattedAddress: '1001 КНИГА, Комсомольская пл., 12, Москва, Россия, 107140',
  point: {
    lat: 55.781155,
    lng: 37.654028,
  },
};
