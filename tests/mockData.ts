// Users
export const ME_AS_ADMIN = {
  password: `${process.env.ADMIN_PASSWORD}`,
  name: `${process.env.ADMIN_NAME}`,
  lastName: `${process.env.ADMIN_LAST_NAME}`,
  secondName: `${process.env.ADMIN_SECOND_NAME}`,
  email: `${process.env.ADMIN_EMAIL}`,
  phone: `${process.env.ADMIN_PHONE}`,
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
