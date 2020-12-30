import {
  ADMIN_EMAIL,
  ADMIN_LAST_NAME,
  ADMIN_NAME,
  ADMIN_PASSWORD,
  ADMIN_PHONE,
  DEFAULT_CITY,
  DEFAULT_LANG,
  GEO_POINT_TYPE,
  SECONDARY_CITY,
  SECONDARY_LANG,
} from '../config';

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

// Company
export const MOCK_COMPANY = {
  nameString: 'Company',
  slug: 'company',
  contacts: {
    emails: ['company1@gmail.com', 'company2@gmail.com'],
    phones: ['+78990002235', '+78890002235'],
  },
};

export const MOCK_NEW_COMPANY = {
  nameString: 'New Company',
  slug: 'new_company',
  contacts: {
    emails: ['new.company1@gmail.com', 'new.company2@gmail.com'],
    phones: ['+78990002222', '+78890001111'],
  },
};

export const MOCK_NEW_COMPANY_B = {
  nameString: 'New Company B',
  slug: 'new_company_b',
  contacts: {
    emails: ['new.companyB1@gmail.com', 'new.companyB2@gmail.com'],
    phones: ['+78990003333', '+78890004444'],
  },
};

export const MOCK_COMPANIES = [MOCK_COMPANY];

// Shop
export const MOCK_SHOP = {
  nameString: 'Shop',
  slug: 'shop',
  city: DEFAULT_CITY,
  contacts: {
    emails: ['shop1@gmail.com', 'shop2@gmail.com'],
    phones: ['+78990002245', '+78890002246'],
  },
  address: {
    formattedAddress: MOCK_ADDRESS_A.formattedAddress,
    point: {
      type: GEO_POINT_TYPE,
      coordinates: [MOCK_ADDRESS_A.point.lng, MOCK_ADDRESS_A.point.lat],
    },
  },
};

export const MOCK_SHOP_B = {
  nameString: 'Shop B',
  slug: 'shop_b',
  city: DEFAULT_CITY,
  contacts: {
    emails: ['shopB1@gmail.com', 'shopB2@gmail.com'],
    phones: ['+78111112245', '+78121112246'],
  },
  address: {
    formattedAddress: MOCK_ADDRESS_B.formattedAddress,
    point: {
      type: GEO_POINT_TYPE,
      coordinates: [MOCK_ADDRESS_B.point.lng, MOCK_ADDRESS_B.point.lat],
    },
  },
};

export const MOCK_NEW_SHOP = {
  nameString: 'New Shop',
  slug: 'new_shop',
  contacts: {
    emails: ['new.shop1@gmail.com', 'new.shop2@gmail.com'],
    phones: ['+78990002255', '+78890002256'],
  },
  address: {
    formattedAddress: MOCK_ADDRESS_A.formattedAddress,
    point: {
      type: GEO_POINT_TYPE,
      coordinates: [MOCK_ADDRESS_A.point.lng, MOCK_ADDRESS_A.point.lat],
    },
  },
};

export const MOCK_SHOPS = [MOCK_SHOP, MOCK_SHOP_B];

// Languages
export const ISO_LANGUAGES = [
  {
    id: DEFAULT_LANG,
    nameString: 'Russian',
    nativeName: 'ru',
  },
  {
    id: SECONDARY_LANG,
    nameString: 'English',
    nativeName: 'en',
  },
  {
    id: 'ua-UA',
    nameString: 'Украинский',
    nativeName: 'ua',
  },
  {
    id: 'pl',
    nameString: 'Польский',
    nativeName: 'pl',
  },
];

export const SECONDARY_CITY_OBJ = {
  name: [
    { key: DEFAULT_LANG, value: 'Нью Йорк' },
    { key: SECONDARY_LANG, value: 'New York' },
  ],
  slug: SECONDARY_CITY,
};

// Languages
export const INITIAL_LANGUAGES = [
  {
    key: DEFAULT_LANG,
    name: 'Русский',
    nativeName: 'ru',
    isDefault: true,
  },
];

export const SECONDARY_LANGUAGES_OBJ = {
  key: SECONDARY_LANG,
  name: 'Английский',
  nativeName: 'en',
  isDefault: false,
};

// Products
const productDescription = [
  { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
  { key: SECONDARY_LANG, value: 'Very long product description' },
];

export const MOCK_PRODUCT_A = {
  priority: 10,
  slug: 'productA',
  originalName: 'productA',
  name: [
    { key: DEFAULT_LANG, value: 'productA' },
    { key: SECONDARY_LANG, value: 'productA' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productA' },
    { key: SECONDARY_LANG, value: 'Card_name_productA' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 10 }],
  price: 100,
  description: productDescription,
};

export const MOCK_PRODUCT_B = {
  priority: 9,
  slug: 'productB',
  originalName: 'productB',
  name: [
    { key: DEFAULT_LANG, value: 'productB' },
    { key: SECONDARY_LANG, value: 'productB' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productB' },
    { key: SECONDARY_LANG, value: 'Card_name_productB' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 9 }],
  price: 200,
  description: productDescription,
};

export const MOCK_PRODUCT_C = {
  priority: 1,
  slug: 'productC',
  originalName: 'productC',
  name: [
    { key: DEFAULT_LANG, value: 'productC' },
    { key: SECONDARY_LANG, value: 'productC' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productC' },
    { key: SECONDARY_LANG, value: 'Card_name_productC' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 8 }],
  price: 50,
  description: productDescription,
};

export const MOCK_PRODUCT_D = {
  priority: 1,
  slug: 'productD',
  originalName: 'productD',
  name: [
    { key: DEFAULT_LANG, value: 'productD' },
    { key: SECONDARY_LANG, value: 'productD' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productD' },
    { key: SECONDARY_LANG, value: 'Card_name_productD' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 7 }],
  price: 1150,
  description: productDescription,
};

export const MOCK_PRODUCT_E = {
  priority: 1,
  slug: 'productE',
  originalName: 'productE',
  name: [
    { key: DEFAULT_LANG, value: 'productE' },
    { key: SECONDARY_LANG, value: 'productE' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productE' },
    { key: SECONDARY_LANG, value: 'Card_name_productE' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 6 }],
  price: 500,
  description: productDescription,
};

export const MOCK_PRODUCT_F = {
  priority: 1,
  slug: 'productF',
  originalName: 'productF',
  name: [
    { key: DEFAULT_LANG, value: 'productF' },
    { key: SECONDARY_LANG, value: 'productF' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productF' },
    { key: SECONDARY_LANG, value: 'Card_name_productF' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 5 }],
  price: 500,
  description: productDescription,
};

export const MOCK_PRODUCT_NEW = {
  originalName: 'productNew',
  name: [
    { key: DEFAULT_LANG, value: 'productNew' },
    { key: SECONDARY_LANG, value: 'productNew' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productNew' },
    { key: SECONDARY_LANG, value: 'Card_name_productNew' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 1 }],
  price: 2000,
  description: productDescription,
};

export const MOCK_PRODUCT_CREATE = {
  originalName: 'productCreate',
  name: [
    { key: DEFAULT_LANG, value: 'productCreate' },
    { key: SECONDARY_LANG, value: 'productCreate' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productCreate' },
    { key: SECONDARY_LANG, value: 'Card_name_productCreate' },
  ],
  views: [{ key: DEFAULT_CITY, counter: 1 }],
  price: 2000,
  description: productDescription,
};
