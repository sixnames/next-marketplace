import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: any;
  /** Upload custom scalar type */
  Upload: any;
  /** Date custom scalar type */
  Date: any;
  /** Mongo object id scalar type */
  ObjectId: any;
};





/** Gender enum. */
export enum Gender {
  He = 'he',
  She = 'she',
  It = 'it'
}

export type FormattedPhone = {
  __typename?: 'FormattedPhone';
  raw: Scalars['String'];
  readable: Scalars['String'];
};

export type Contacts = {
  __typename?: 'Contacts';
  emails: Array<Scalars['EmailAddress']>;
  phones: Array<Scalars['PhoneNumber']>;
  formattedPhones: Array<FormattedPhone>;
};

export type ContactsInput = {
  emails: Array<Scalars['EmailAddress']>;
  phones: Array<Scalars['PhoneNumber']>;
};

export type Asset = {
  __typename?: 'Asset';
  url: Scalars['String'];
  index: Scalars['Int'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type PointGeoJson = {
  __typename?: 'PointGeoJSON';
  /** Field that specifies the GeoJSON object type. */
  type: Scalars['String'];
  /** Coordinates that specifies the object’s coordinates. If specifying latitude and longitude coordinates, list the longitude first and then latitude. */
  coordinates: Array<Scalars['Float']>;
};

export type Address = {
  __typename?: 'Address';
  formattedAddress: Scalars['String'];
  point: PointGeoJson;
  formattedCoordinates: Coordinates;
};

export type CoordinatesInput = {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type AddressInput = {
  formattedAddress: Scalars['String'];
  point: CoordinatesInput;
};

export type Base = {
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
};

export type Timestamp = {
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type Payload = {
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

/** Type for all selects options. */
export type SelectOption = {
  __typename?: 'SelectOption';
  _id: Scalars['String'];
  name: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

/** Sort direction enum. */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginationInput = {
  search?: Maybe<Scalars['String']>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type PaginationPayload = {
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
};

export type Currency = {
  __typename?: 'Currency';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
};

export type CurrencyPayload = Payload & {
  __typename?: 'CurrencyPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Currency>;
};

export type CreateCurrencyInput = {
  name: Scalars['String'];
};

export type UpdateCurrencyInput = {
  currencyId: Scalars['ObjectId'];
  name: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
  nativeName: Scalars['String'];
};

export type LanguagePayload = Payload & {
  __typename?: 'LanguagePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Language>;
};

export type CreateLanguageInput = {
  name: Scalars['String'];
  slug: Scalars['String'];
  nativeName: Scalars['String'];
};

export type UpdateLanguageInput = {
  languageId: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
  nativeName: Scalars['String'];
};

export type CatalogueSearchResult = {
  __typename?: 'CatalogueSearchResult';
  rubrics: Array<Rubric>;
  products: Array<Product>;
};

export type CatalogueFilterAttributeOption = {
  __typename?: 'CatalogueFilterAttributeOption';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
  nextSlug: Scalars['String'];
  isSelected: Scalars['Boolean'];
};

export type CatalogueFilterAttribute = {
  __typename?: 'CatalogueFilterAttribute';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
  clearSlug: Scalars['String'];
  isSelected: Scalars['Boolean'];
  options: Array<CatalogueFilterAttributeOption>;
};

export type CatalogueData = {
  __typename?: 'CatalogueData';
  _id: Scalars['ObjectId'];
  lastProductId?: Maybe<Scalars['ObjectId']>;
  hasMore: Scalars['Boolean'];
  clearSlug: Scalars['String'];
  filter: Array<Scalars['String']>;
  rubric: Rubric;
  products: Array<Product>;
  totalProducts: Scalars['Int'];
  catalogueTitle: Scalars['String'];
  attributes: Array<CatalogueFilterAttribute>;
  selectedAttributes: Array<CatalogueFilterAttribute>;
};

export type CatalogueDataInput = {
  lastProductId?: Maybe<Scalars['ObjectId']>;
  filter: Array<Scalars['String']>;
};

export type CatalogueAdditionalAttributesInput = {
  shownAttributesSlugs: Array<Scalars['String']>;
  filter: Array<Scalars['String']>;
};

export type City = {
  __typename?: 'City';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  name: Scalars['String'];
};

export type CitiesPaginationPayload = PaginationPayload & {
  __typename?: 'CitiesPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<City>;
};

export type Country = {
  __typename?: 'Country';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  currency: Scalars['String'];
  citiesIds: Array<Scalars['ObjectId']>;
  cities: Array<City>;
};

export type CountryPayload = Payload & {
  __typename?: 'CountryPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Country>;
};

export type CreateCountryInput = {
  name: Scalars['String'];
  currency: Scalars['String'];
};

export type UpdateCountryInput = {
  countryId: Scalars['ObjectId'];
  name: Scalars['String'];
  currency: Scalars['String'];
};

export type AddCityToCountryInput = {
  countryId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
};

export type UpdateCityInCountryInput = {
  countryId: Scalars['ObjectId'];
  cityId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
};

export type DeleteCityFromCountryInput = {
  countryId: Scalars['ObjectId'];
  cityId: Scalars['ObjectId'];
};

/** Site config variant enum. */
export enum ConfigVariant {
  String = 'string',
  Number = 'number',
  Tel = 'tel',
  Email = 'email',
  Asset = 'asset'
}

export type Config = {
  __typename?: 'Config';
  _id: Scalars['ObjectId'];
  /** Set to true if config is able to hold multiple values. */
  multi: Scalars['Boolean'];
  /** Accepted formats for asset config */
  acceptedFormats: Array<Scalars['String']>;
  slug: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /**
   * Each key is city slug with value for current city.
   * Each city contains object with key as locale and value for current locale
   */
  cities: Scalars['JSONObject'];
  variant?: Maybe<ConfigVariant>;
  /** Returns current value of current city and locale. */
  value: Array<Scalars['String']>;
  /** Returns first value of current city and locale. */
  singleValue: Scalars['String'];
};

export type ConfigPayload = Payload & {
  __typename?: 'ConfigPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Config>;
};

export type UpdateConfigInput = {
  configId: Scalars['ObjectId'];
  cities: Scalars['JSONObject'];
};

export type UpdateAssetConfigInput = {
  configId: Scalars['ObjectId'];
  assets: Array<Scalars['Upload']>;
};

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  messageI18n: Scalars['JSONObject'];
  /** Returns message for current locale */
  message: Scalars['String'];
};

export type MessagesGroup = {
  __typename?: 'MessagesGroup';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  messagesIds: Array<Scalars['ObjectId']>;
  /** Returns all messages for current current group */
  messages: Array<Message>;
};

export type User = Base & Timestamp & {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  roleId: Scalars['ObjectId'];
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  formattedPhone: FormattedPhone;
  role: Role;
  orders: OrdersPaginationPayload;
};


export type UserOrdersArgs = {
  input?: Maybe<PaginationInput>;
};

export type UsersPaginationPayload = PaginationPayload & {
  __typename?: 'UsersPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  /** Should return session user if authenticated */
  me?: Maybe<User>;
  /** Should return user by _id */
  getUser: User;
  /** Should return paginated users */
  getAllUsers: UsersPaginationPayload;
  getAllCurrencies: Array<Currency>;
  /** Should all languages list */
  getAllLanguages: Array<Language>;
  /** Should return catalogue page data */
  getCatalogueData?: Maybe<CatalogueData>;
  /** Should return top search items */
  getCatalogueSearchTopItems: CatalogueSearchResult;
  /** Should return top search items */
  getCatalogueSearchResult: CatalogueSearchResult;
  /** Should return city by given id */
  getCity: City;
  /** Should return city by given slug */
  getCityBySlug: City;
  /** Should return paginated cities */
  getAllCities: CitiesPaginationPayload;
  /** Should return cities list */
  getSessionCities: Array<City>;
  /** Should return currency for session locale */
  getSessionCurrency: Scalars['String'];
  /** Should return countries list */
  getAllCountries: Array<Country>;
  getAllConfigs: Array<Config>;
  /** Should return validation messages list */
  getValidationMessages: Array<Message>;
  /** Should return role by give id */
  getRole?: Maybe<Role>;
  /** Should return all roles list */
  getAllRoles: Array<Role>;
  /** Should return paginated metrics */
  getAllMetrics: PaginationPayload;
  /** Should return all metrics list */
  getAllMetricsOptions: Array<Metric>;
  /** Should return all app nav items */
  getAllAppNavItems: Array<NavItem>;
  /** Should return all cms nav items */
  getAllCmsNavItems: Array<NavItem>;
  /** Should return options group by given id */
  getOptionsGroup: OptionsGroup;
  /** Should return options groups list */
  getAllOptionsGroups: Array<OptionsGroup>;
  getAttributesGroup: AttributesGroup;
  getAllAttributesGroups: Array<AttributesGroup>;
  /** Should return brand by _id */
  getBrand: Brand;
  /** Should return brand by slug */
  getBrandBySlug?: Maybe<Brand>;
  /** Should return paginated brands */
  getAllBrands?: Maybe<BrandsPaginationPayload>;
  /** Should return brands list */
  getBrandsOptions: Array<Brand>;
  /** Should return manufacturer by given id */
  getManufacturer: Manufacturer;
  /** Should return manufacturer by given slug */
  getManufacturerBySlug: Manufacturer;
  /** Should return paginated manufacturers */
  getAllManufacturers: ManufacturersPaginationPayload;
  /** Should return manufacturers list */
  getManufacturersOptions: Array<Manufacturer>;
  /** Should return rubric variant by given id */
  getRubricVariant: RubricVariant;
  /** Should return rubric variants list */
  getAllRubricVariants: Array<RubricVariant>;
  /** Should return rubric by given id */
  getRubric: Rubric;
  /** Should return rubric by given slug */
  getRubricBySlug: Rubric;
  /** Should return rubrics tree */
  getAllRubrics: Array<Rubric>;
  /** Should return catalogue nav rubrics */
  getCatalogueNavRubrics: Array<Rubric>;
  /** Should return gender options */
  getGenderOptions: Array<SelectOption>;
  /** Should return attribute variants options */
  getAttributeVariantsOptions: Array<SelectOption>;
  /** Should return attribute view variants options */
  getAttributeViewVariantsOptions: Array<SelectOption>;
  /** Should return options groups variants options */
  getOptionsGroupVariantsOptions: Array<SelectOption>;
  /** Should return attribute positioning options */
  getAttributePositioningOptions: Array<SelectOption>;
  /** Should return ISO languages options */
  getISOLanguagesOptions: Array<SelectOption>;
  /** Should return icon options */
  getIconsOptions: Array<SelectOption>;
  /** Should return product by given id */
  getProduct?: Maybe<Product>;
  /** Should return product by given slug */
  getProductBySlug?: Maybe<Product>;
  /** Should return product for card page and increase view counter */
  getProductCard: Product;
  /** Should return shops products list for product card */
  getProductShops: Array<ShopProduct>;
  /** Should paginated products */
  getProductsList: ProductsPaginationPayload;
  /** Should return product attributes AST for selected rubrics */
  getProductAttributesAST: Array<ProductAttribute>;
  /** Should return shop by given id */
  getShop: Shop;
  /** Should return shop by given slug */
  getShopBySlug: Shop;
  /** Should return shop by given slug */
  getAllShops: ShopsPaginationPayload;
  /** Should return company by given id */
  getCompany?: Maybe<Company>;
  /** Should return paginated companies */
  getAllCompanies?: Maybe<CompaniesPaginationPayload>;
  /** Should return session user cart */
  getSessionCart: Cart;
  /** Should return order by given id */
  getOrder: Order;
  /** Should return session user order by given id */
  getMyOrder?: Maybe<Order>;
  /** Should return all paginated orders */
  getAllOrders: OrdersPaginationPayload;
  /** Should return all paginated orders */
  getAllMyOrders?: Maybe<OrdersPaginationPayload>;
};


export type QueryGetUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllUsersArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetCatalogueDataArgs = {
  input: CatalogueDataInput;
};


export type QueryGetCatalogueSearchResultArgs = {
  search: Scalars['String'];
};


export type QueryGetCityArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetCityBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllCitiesArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetRoleArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllMetricsArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetOptionsGroupArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAttributesGroupArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllAttributesGroupsArgs = {
  excludedIds?: Maybe<Array<Scalars['ObjectId']>>;
};


export type QueryGetBrandArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetBrandBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllBrandsArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetManufacturerArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetManufacturerBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllManufacturersArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetRubricVariantArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetRubricArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetRubricBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllRubricsArgs = {
  input?: Maybe<GetAllRubricsInput>;
};


export type QueryGetProductArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetProductBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetProductCardArgs = {
  slug: Array<Scalars['String']>;
};


export type QueryGetProductShopsArgs = {
  input: GetProductShopsInput;
};


export type QueryGetProductsListArgs = {
  input?: Maybe<ProductsPaginationInput>;
};


export type QueryGetProductAttributesAstArgs = {
  input: ProductAttributesAstInput;
};


export type QueryGetShopArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetShopBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllShopsArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetCompanyArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllCompaniesArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetOrderArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetMyOrderArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllOrdersArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetAllMyOrdersArgs = {
  input?: Maybe<PaginationInput>;
};

export type UserPayload = Payload & {
  __typename?: 'UserPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<User>;
};

export type CreateUserInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  roleId: Scalars['ObjectId'];
};

export type UpdateUserInput = {
  userId: Scalars['ObjectId'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  roleId: Scalars['ObjectId'];
};

export type UpdateMyProfileInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
};

export type SignUpInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  password: Scalars['String'];
};

export type UpdateMyPasswordInput = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
  newPasswordB: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Should create user */
  createUser: UserPayload;
  /** Should update user */
  updateUser: UserPayload;
  /** Should update session user profile */
  updateMyProfile: UserPayload;
  /** Should update session user password */
  updateMyPassword: UserPayload;
  /** Should sign up user */
  signUp: UserPayload;
  /** Should create currency */
  createCurrency: CurrencyPayload;
  /** Should update currency */
  updateCurrency: CurrencyPayload;
  /** Should delete currency */
  deleteCurrency: CurrencyPayload;
  /** Should create language */
  createLanguage: LanguagePayload;
  /** Should update language */
  updateLanguage: LanguagePayload;
  /** Should delete language */
  deleteLanguage: LanguagePayload;
  /** Should update catalogue counters */
  updateCatalogueCounters: Scalars['Boolean'];
  /** Should create country */
  createCountry: CountryPayload;
  /** Should update country */
  updateCountry: CountryPayload;
  /** Should delete country */
  deleteCountry: CountryPayload;
  /** Should create city and add it to the country */
  addCityToCountry: CountryPayload;
  /** Should update city */
  updateCityInCountry: CountryPayload;
  /** Should delete city */
  deleteCityFromCountry: CountryPayload;
  /** Should update config */
  updateConfig: ConfigPayload;
  /** Should asset update config */
  updateAssetConfig: ConfigPayload;
  /** Should create role */
  createRole: RolePayload;
  /** Should update role */
  updateRole: RolePayload;
  /** Should delete role */
  deleteRole: RolePayload;
  /** Should create metric */
  createMetric: MetricPayload;
  /** Should update metric */
  updateMetric: MetricPayload;
  /** Should delete metric */
  deleteMetric: MetricPayload;
  /** Should create options group */
  createOptionsGroup: OptionsGroupPayload;
  /** Should update options group */
  updateOptionsGroup: OptionsGroupPayload;
  /** Should delete options group */
  deleteOptionsGroup: OptionsGroupPayload;
  /** Should add option to the group */
  addOptionToGroup: OptionsGroupPayload;
  /** Should update option in the group */
  updateOptionInGroup: OptionsGroupPayload;
  /** Should delete option from the group */
  deleteOptionFromGroup: OptionsGroupPayload;
  /** Should create attributes group */
  createAttributesGroup: AttributesGroupPayload;
  /** Should update attributes group */
  updateAttributesGroup: AttributesGroupPayload;
  /** Should delete attributes group */
  deleteAttributesGroup: AttributesGroupPayload;
  /** Should create attribute and add it to the attributes group */
  addAttributeToGroup: AttributesGroupPayload;
  /** Should update attribute in the attributes group */
  updateAttributeInGroup: AttributesGroupPayload;
  /** Should delete attribute from the attributes group */
  deleteAttributeFromGroup: AttributesGroupPayload;
  /** Should create brand */
  createBrand: BrandPayload;
  /** Should update brand */
  updateBrand: BrandPayload;
  /** Should delete brand */
  deleteBrand: BrandPayload;
  /** Should add brand collection to the brand */
  addCollectionToBrand: BrandPayload;
  /** Should update brand collection in the brand */
  updateCollectionInBrand: BrandPayload;
  /** Should delete brand collection from brand */
  deleteCollectionFromBrand: BrandPayload;
  /** Should create manufacturer */
  createManufacturer: ManufacturerPayload;
  /** Should update manufacturer */
  updateManufacturer: ManufacturerPayload;
  /** Should delete manufacturer */
  deleteManufacturer: ManufacturerPayload;
  /** Should create rubric variant */
  createRubricVariant: RubricVariantPayload;
  /** Should update rubric variant */
  updateRubricVariant: RubricVariantPayload;
  /** Should delete rubric variant */
  deleteRubricVariant: RubricVariantPayload;
  /** Should create rubric */
  createRubric: RubricPayload;
  /** Should update rubric */
  updateRubric: RubricPayload;
  /** Should delete rubric */
  deleteRubric: RubricPayload;
  /** Should add attributes group to the rubric */
  addAttributesGroupToRubric: RubricPayload;
  /** Should toggle attribute in the rubric attribute showInCatalogueFilter field */
  toggleAttributeInRubricCatalogue: RubricPayload;
  /** Should toggle attribute in the rubric attribute showInCatalogueNav field */
  toggleAttributeInRubricNav: RubricPayload;
  /** Should delete attributes group from rubric */
  deleteAttributesGroupFromRubric: RubricPayload;
  /** Should remove product from rubric */
  deleteProductFromRubric: RubricPayload;
  /** Should create product */
  createProduct: ProductPayload;
  /** Should update product */
  updateProduct: ProductPayload;
  /** Should add product assets */
  addProductAssets: ProductPayload;
  /** Should update product assets */
  deleteProductAsset: ProductPayload;
  /** Should update product asset index */
  updateProductAssetIndex: ProductPayload;
  /** Should create product connection */
  createProductConnection: ProductPayload;
  /** Should create product connection */
  addProductToConnection: ProductPayload;
  /** Should create product connection */
  deleteProductFromConnection: ProductPayload;
  /** Should update product counter */
  updateProductCounter: Scalars['Boolean'];
  /** Should update shop product */
  updateShopProduct: ShopProductPayload;
  /** Should update shop */
  updateShop: ShopPayload;
  /** Should add shop assets */
  addShopAssets: ShopPayload;
  /** Should delete shop asset */
  deleteShopAsset: ShopPayload;
  /** Should update shop asset index */
  updateShopAssetIndex: ShopPayload;
  /** Should update shop logo */
  updateShopLogo: ShopPayload;
  /** Should add product to the shop */
  addProductToShop: ShopPayload;
  /** Should delete product from shop */
  deleteProductFromShop: ShopPayload;
  /** Should create company */
  createCompany: CompanyPayload;
  /** Should update company */
  updateCompany: CompanyPayload;
  /** Should update company logo */
  updateCompanyLogo: CompanyPayload;
  /** Should delete company */
  deleteCompany: CompanyPayload;
  /** Should create shop and add it to the company */
  addShopToCompany: CompanyPayload;
  /** Should delete shop from company and db */
  deleteShopFromCompany: CompanyPayload;
  /** Should add product to the cart or should increase product amount if already exist in cart */
  addProductToCart: CartPayload;
  /** Should add shopless product to the cart or should increase product amount if already exist in cart */
  addShoplessProductToCart: CartPayload;
  /** Should add shop to the cart product */
  addShopToCartProduct: CartPayload;
  /** Should update cart product amount */
  updateProductInCart: CartPayload;
  /** Should delete product from cart */
  deleteProductFromCart: CartPayload;
  /** Should delete all products from cart */
  clearCart: CartPayload;
  /** Should add all products to the cart from user's old order */
  repeatOrder: CartPayload;
  /** Should create order from session cart */
  makeAnOrder: MakeAnOrderPayload;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput;
};


export type MutationUpdateMyPasswordArgs = {
  input: UpdateMyPasswordInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationCreateCurrencyArgs = {
  input: CreateCurrencyInput;
};


export type MutationUpdateCurrencyArgs = {
  input: UpdateCurrencyInput;
};


export type MutationDeleteCurrencyArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreateLanguageArgs = {
  input: CreateLanguageInput;
};


export type MutationUpdateLanguageArgs = {
  input: UpdateLanguageInput;
};


export type MutationDeleteLanguageArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationUpdateCatalogueCountersArgs = {
  input: CatalogueDataInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationDeleteCountryArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddCityToCountryArgs = {
  input: AddCityToCountryInput;
};


export type MutationUpdateCityInCountryArgs = {
  input: UpdateCityInCountryInput;
};


export type MutationDeleteCityFromCountryArgs = {
  input: DeleteCityFromCountryInput;
};


export type MutationUpdateConfigArgs = {
  input: UpdateConfigInput;
};


export type MutationUpdateAssetConfigArgs = {
  input: UpdateAssetConfigInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationDeleteRoleArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreateMetricArgs = {
  input: CreateMetricInput;
};


export type MutationUpdateMetricArgs = {
  input: UpdateMetricInput;
};


export type MutationDeleteMetricArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreateOptionsGroupArgs = {
  input: CreateOptionsGroupInput;
};


export type MutationUpdateOptionsGroupArgs = {
  input: UpdateOptionsGroupInput;
};


export type MutationDeleteOptionsGroupArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddOptionToGroupArgs = {
  input: AddOptionToGroupInput;
};


export type MutationUpdateOptionInGroupArgs = {
  input: UpdateOptionInGroupInput;
};


export type MutationDeleteOptionFromGroupArgs = {
  input: DeleteOptionFromGroupInput;
};


export type MutationCreateAttributesGroupArgs = {
  input: CreateAttributesGroupInput;
};


export type MutationUpdateAttributesGroupArgs = {
  input: UpdateAttributesGroupInput;
};


export type MutationDeleteAttributesGroupArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddAttributeToGroupArgs = {
  input: AddAttributeToGroupInput;
};


export type MutationUpdateAttributeInGroupArgs = {
  input: UpdateAttributeInGroupInput;
};


export type MutationDeleteAttributeFromGroupArgs = {
  input: DeleteAttributeFromGroupInput;
};


export type MutationCreateBrandArgs = {
  input: CreateBrandInput;
};


export type MutationUpdateBrandArgs = {
  input: UpdateBrandInput;
};


export type MutationDeleteBrandArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddCollectionToBrandArgs = {
  input: AddCollectionToBrandInput;
};


export type MutationUpdateCollectionInBrandArgs = {
  input: UpdateCollectionInBrandInput;
};


export type MutationDeleteCollectionFromBrandArgs = {
  input: DeleteCollectionFromBrandInput;
};


export type MutationCreateManufacturerArgs = {
  input: CreateManufacturerInput;
};


export type MutationUpdateManufacturerArgs = {
  input: UpdateManufacturerInput;
};


export type MutationDeleteManufacturerArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreateRubricVariantArgs = {
  input: CreateRubricVariantInput;
};


export type MutationUpdateRubricVariantArgs = {
  input: UpdateRubricVariantInput;
};


export type MutationDeleteRubricVariantArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreateRubricArgs = {
  input: CreateRubricInput;
};


export type MutationUpdateRubricArgs = {
  input: UpdateRubricInput;
};


export type MutationDeleteRubricArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddAttributesGroupToRubricArgs = {
  input: AddAttributesGroupToRubricInput;
};


export type MutationToggleAttributeInRubricCatalogueArgs = {
  input: UpdateAttributeInRubricInput;
};


export type MutationToggleAttributeInRubricNavArgs = {
  input: UpdateAttributeInRubricInput;
};


export type MutationDeleteAttributesGroupFromRubricArgs = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type MutationDeleteProductFromRubricArgs = {
  input: DeleteProductFromRubricInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationAddProductAssetsArgs = {
  input: AddProductAssetsInput;
};


export type MutationDeleteProductAssetArgs = {
  input: DeleteProductAssetInput;
};


export type MutationUpdateProductAssetIndexArgs = {
  input: UpdateProductAssetIndexInput;
};


export type MutationCreateProductConnectionArgs = {
  input: CreateProductConnectionInput;
};


export type MutationAddProductToConnectionArgs = {
  input: AddProductToConnectionInput;
};


export type MutationDeleteProductFromConnectionArgs = {
  input: DeleteProductFromConnectionInput;
};


export type MutationUpdateProductCounterArgs = {
  input: UpdateProductCounterInput;
};


export type MutationUpdateShopProductArgs = {
  input: UpdateShopProductInput;
};


export type MutationUpdateShopArgs = {
  input: UpdateShopInput;
};


export type MutationAddShopAssetsArgs = {
  input: AddShopAssetsInput;
};


export type MutationDeleteShopAssetArgs = {
  input: DeleteShopAssetInput;
};


export type MutationUpdateShopAssetIndexArgs = {
  input: UpdateShopAssetIndexInput;
};


export type MutationUpdateShopLogoArgs = {
  input: UpdateShopLogoInput;
};


export type MutationAddProductToShopArgs = {
  input: AddProductToShopInput;
};


export type MutationDeleteProductFromShopArgs = {
  input: DeleteProductFromShopInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationUpdateCompanyLogoArgs = {
  input: UpdateCompanyLogoInput;
};


export type MutationDeleteCompanyArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddShopToCompanyArgs = {
  input: AddShopToCompanyInput;
};


export type MutationDeleteShopFromCompanyArgs = {
  input: DeleteShopFromCompanyInput;
};


export type MutationAddProductToCartArgs = {
  input: AddProductToCartInput;
};


export type MutationAddShoplessProductToCartArgs = {
  input: AddShoplessProductToCartInput;
};


export type MutationAddShopToCartProductArgs = {
  input: AddShopToCartProductInput;
};


export type MutationUpdateProductInCartArgs = {
  input: UpdateProductInCartInput;
};


export type MutationDeleteProductFromCartArgs = {
  input: DeleteProductFromCartInput;
};


export type MutationRepeatOrderArgs = {
  input: RepeatOrderInput;
};


export type MutationMakeAnOrderArgs = {
  input: MakeAnOrderInput;
};

export type Role = Timestamp & {
  __typename?: 'Role';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  isStuff: Scalars['Boolean'];
  nameI18n: Scalars['JSONObject'];
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  appNavigation: Array<NavItem>;
  cmsNavigation: Array<NavItem>;
};

export type RolePayload = Payload & {
  __typename?: 'RolePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Role>;
};

export type CreateRoleInput = {
  nameI18n: Scalars['JSONObject'];
  description?: Maybe<Scalars['String']>;
  isStuff: Scalars['Boolean'];
};

export type UpdateRoleInput = {
  roleId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  description?: Maybe<Scalars['String']>;
  isStuff: Scalars['Boolean'];
};

/** Order log variant enum. */
export enum OrderLogVariant {
  Status = 'status'
}

export type OrderLog = Timestamp & {
  __typename?: 'OrderLog';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  variant: OrderLogVariant;
  userId: Scalars['ObjectId'];
  user?: Maybe<User>;
};

export type Metric = {
  __typename?: 'Metric';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  name: Scalars['String'];
};

export type MetricsPaginationPayload = PaginationPayload & {
  __typename?: 'MetricsPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Metric>;
};

export type MetricPayload = Payload & {
  __typename?: 'MetricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Metric>;
};

export type CreateMetricInput = {
  nameI18n: Scalars['JSONObject'];
};

export type UpdateMetricInput = {
  metricId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
};

export type NavItem = {
  __typename?: 'NavItem';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  navGroup: Scalars['String'];
  index: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['ObjectId']>;
  name: Scalars['String'];
  children: Array<NavItem>;
  appNavigationChildren: Array<NavItem>;
};

export type Option = {
  __typename?: 'Option';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  variants: Scalars['JSONObject'];
  gender?: Maybe<Gender>;
  options: Array<Option>;
  name: Scalars['String'];
};

/** Options group variant enum. */
export enum OptionsGroupVariant {
  Text = 'text',
  Icon = 'icon',
  Color = 'color'
}

export type OptionsGroup = {
  __typename?: 'OptionsGroup';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  options: Array<Option>;
  variant: OptionsGroupVariant;
  name: Scalars['String'];
};

export type OptionsGroupPayload = Payload & {
  __typename?: 'OptionsGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<OptionsGroup>;
};

export type CreateOptionsGroupInput = {
  nameI18n: Scalars['JSONObject'];
  variant: OptionsGroupVariant;
};

export type UpdateOptionsGroupInput = {
  optionsGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  variant: OptionsGroupVariant;
};

export type OptionVariantInput = {
  value: Scalars['JSONObject'];
  gender: Gender;
};

export type AddOptionToGroupInput = {
  optionsGroupId: Scalars['ObjectId'];
  parentOptionId?: Maybe<Scalars['ObjectId']>;
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  variants: Scalars['JSONObject'];
  gender: Gender;
};

export type UpdateOptionInGroupInput = {
  optionId: Scalars['ObjectId'];
  optionsGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  variants: Scalars['JSONObject'];
  gender?: Maybe<Gender>;
};

export type DeleteOptionFromGroupInput = {
  optionId: Scalars['ObjectId'];
  optionsGroupId: Scalars['ObjectId'];
};

/** Attribute variant enum. */
export enum AttributeVariant {
  Select = 'select',
  MultipleSelect = 'multipleSelect',
  String = 'string',
  Number = 'number'
}

/** Attribute position in catalogue title enum. */
export enum AttributePositionInTitle {
  Begin = 'begin',
  End = 'end',
  BeforeKeyword = 'beforeKeyword',
  AfterKeyword = 'afterKeyword',
  ReplaceKeyword = 'replaceKeyword'
}

/** Attribute view in product card variant enum. */
export enum AttributeViewVariant {
  List = 'list',
  Text = 'text',
  Tag = 'tag',
  Icon = 'icon',
  OuterRating = 'outerRating'
}

export type Attribute = {
  __typename?: 'Attribute';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug?: Maybe<Scalars['String']>;
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  options: Array<Option>;
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
  metric?: Maybe<Metric>;
  name: Scalars['String'];
  optionsGroup?: Maybe<OptionsGroup>;
};

export type AttributesGroup = {
  __typename?: 'AttributesGroup';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  attributesIds: Array<Scalars['ObjectId']>;
  name: Scalars['String'];
  attributes: Array<Attribute>;
};

export type AttributesGroupPayload = Payload & {
  __typename?: 'AttributesGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<AttributesGroup>;
};

export type CreateAttributesGroupInput = {
  nameI18n: Scalars['JSONObject'];
};

export type UpdateAttributesGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
};

export type AddAttributeToGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  metricId?: Maybe<Scalars['ObjectId']>;
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
};

export type UpdateAttributeInGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  metricId?: Maybe<Scalars['ObjectId']>;
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
};

export type DeleteAttributeFromGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type BrandCollection = Base & Timestamp & {
  __typename?: 'BrandCollection';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type BrandCollectionsPaginationPayload = PaginationPayload & {
  __typename?: 'BrandCollectionsPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<BrandCollection>;
};

export type Brand = Base & Timestamp & {
  __typename?: 'Brand';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  url?: Maybe<Array<Scalars['URL']>>;
  slug: Scalars['String'];
  nameI18n: Scalars['String'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  collectionsIds: Array<Scalars['ObjectId']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  collections: BrandCollectionsPaginationPayload;
  collectionsList: Array<BrandCollection>;
};


export type BrandCollectionsArgs = {
  input?: Maybe<PaginationInput>;
};

export type BrandsPaginationPayload = PaginationPayload & {
  __typename?: 'BrandsPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Brand>;
};

export type BrandPayload = Payload & {
  __typename?: 'BrandPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Brand>;
};

export type CreateBrandInput = {
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateBrandInput = {
  brandId: Scalars['ObjectId'];
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type AddCollectionToBrandInput = {
  brandId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateCollectionInBrandInput = {
  brandId: Scalars['ObjectId'];
  brandCollectionId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type DeleteCollectionFromBrandInput = {
  brandId: Scalars['ObjectId'];
  brandCollectionId: Scalars['ObjectId'];
};

export type Manufacturer = Base & Timestamp & {
  __typename?: 'Manufacturer';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  url?: Maybe<Array<Scalars['URL']>>;
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type ManufacturersPaginationPayload = PaginationPayload & {
  __typename?: 'ManufacturersPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Manufacturer>;
};

export type ManufacturerPayload = Payload & {
  __typename?: 'ManufacturerPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Manufacturer>;
};

export type CreateManufacturerInput = {
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateManufacturerInput = {
  manufacturerId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  url?: Maybe<Array<Scalars['URL']>>;
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type RubricVariant = {
  __typename?: 'RubricVariant';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  name: Scalars['String'];
};

export type RubricVariantPayload = Payload & {
  __typename?: 'RubricVariantPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<RubricVariant>;
};

export type CreateRubricVariantInput = {
  nameI18n: Scalars['JSONObject'];
};

export type UpdateRubricVariantInput = {
  rubricVariantId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
};

export type RubricProductsCountersInput = {
  /** Filter by current attributes */
  attributesIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Exclude current products */
  excludedProductsIds?: Maybe<Array<Scalars['ObjectId']>>;
};

export type Rubric = {
  __typename?: 'Rubric';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  active: Scalars['Boolean'];
  variantId: Scalars['ObjectId'];
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
  productsCount: Scalars['Int'];
  activeProductsCount: Scalars['Int'];
  attributes: Array<RubricAttribute>;
  catalogueTitle: RubricCatalogueTitle;
  attributesGroups: Array<RubricAttributesGroup>;
  name: Scalars['String'];
  description: Scalars['String'];
  shortDescription: Scalars['String'];
  variant: RubricVariant;
  products: ProductsPaginationPayload;
  navItems: Array<RubricAttribute>;
};


export type RubricProductsArgs = {
  input?: Maybe<ProductsPaginationInput>;
};

export type RubricCatalogueTitle = {
  __typename?: 'RubricCatalogueTitle';
  defaultTitleI18n: Scalars['JSONObject'];
  prefixI18n?: Maybe<Scalars['JSONObject']>;
  keywordI18n: Scalars['JSONObject'];
  gender: Gender;
  defaultTitle: Scalars['String'];
  prefix?: Maybe<Scalars['String']>;
  keyword: Scalars['String'];
};

export type RubricOption = {
  __typename?: 'RubricOption';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
  isSelected: Scalars['Boolean'];
  variants: Scalars['JSONObject'];
  options: Array<RubricOption>;
  name: Scalars['String'];
};

export type RubricAttribute = {
  __typename?: 'RubricAttribute';
  _id: Scalars['ObjectId'];
  showInCatalogueFilter: Scalars['Boolean'];
  showInCatalogueNav: Scalars['Boolean'];
  nameI18n: Scalars['JSONObject'];
  slug?: Maybe<Scalars['String']>;
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  options: Array<RubricOption>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
  metric?: Maybe<Metric>;
  optionsGroup?: Maybe<OptionsGroup>;
  name: Scalars['String'];
};

export type RubricAttributesGroup = {
  __typename?: 'RubricAttributesGroup';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  attributesIds: Array<Scalars['ObjectId']>;
  attributes: Array<RubricAttribute>;
  name: Scalars['String'];
};

export type GetAllRubricsInput = {
  excludedRubricsIds?: Maybe<Array<Scalars['ObjectId']>>;
};

export type RubricPayload = Payload & {
  __typename?: 'RubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Rubric>;
};

export type RubricCatalogueTitleInput = {
  defaultTitleI18n: Scalars['JSONObject'];
  prefixI18n?: Maybe<Scalars['JSONObject']>;
  keywordI18n: Scalars['JSONObject'];
  gender: Gender;
};

export type CreateRubricInput = {
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  variantId: Scalars['ObjectId'];
  catalogueTitle: RubricCatalogueTitleInput;
};

export type UpdateRubricInput = {
  rubricId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  variantId: Scalars['ObjectId'];
  active: Scalars['Boolean'];
  catalogueTitle: RubricCatalogueTitleInput;
};

export type AddAttributesGroupToRubricInput = {
  rubricId: Scalars['ObjectId'];
  attributesGroupId: Scalars['ObjectId'];
};

export type DeleteAttributesGroupFromRubricInput = {
  rubricId: Scalars['ObjectId'];
  attributesGroupId: Scalars['ObjectId'];
};

export type UpdateAttributeInRubricInput = {
  rubricId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type DeleteProductFromRubricInput = {
  rubricId: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
};

export type ProductCardPrices = {
  __typename?: 'ProductCardPrices';
  _id: Scalars['ObjectId'];
  min: Scalars['String'];
  max: Scalars['String'];
};

export type ProductCardBreadcrumb = {
  __typename?: 'ProductCardBreadcrumb';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  href: Scalars['String'];
};

export type ProductAttributesGroupAst = Base & {
  __typename?: 'ProductAttributesGroupAst';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  attributesIds: Array<Scalars['ObjectId']>;
  astAttributes: Array<ProductAttribute>;
  name: Scalars['String'];
  attributes: Array<Attribute>;
};

export type Product = Base & Timestamp & {
  __typename?: 'Product';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  active: Scalars['Boolean'];
  slug: Scalars['String'];
  originalName: Scalars['String'];
  brandSlug?: Maybe<Scalars['String']>;
  brandCollectionSlug?: Maybe<Scalars['String']>;
  manufacturerSlug?: Maybe<Scalars['String']>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  rubricId: Scalars['ObjectId'];
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
  available?: Maybe<Scalars['Boolean']>;
  assets: Array<Asset>;
  attributes: Array<ProductAttribute>;
  connections: Array<ProductConnection>;
  name: Scalars['String'];
  description: Scalars['String'];
  mainImage: Scalars['String'];
  rubric: Rubric;
  brand?: Maybe<Brand>;
  brandCollection?: Maybe<BrandCollection>;
  manufacturer?: Maybe<Manufacturer>;
  shopsCount: Scalars['Int'];
  /** Returns shop products of session city for product card page */
  cardShopProducts: Array<ShopProduct>;
  /** Returns all shop products that product connected to */
  allShopProducts: Array<ShopProduct>;
  minPrice: Scalars['Int'];
  isCustomersChoice: Scalars['Boolean'];
  maxPrice: Scalars['Int'];
  /** Should find all connected shop products and return minimal and maximal price. */
  cardPrices: ProductCardPrices;
  /** Should return product card breadcrumbs configs list for product card page */
  cardBreadcrumbs: Array<ProductCardBreadcrumb>;
  listFeatures: Array<ProductAttribute>;
  textFeatures: Array<ProductAttribute>;
  tagFeatures: Array<ProductAttribute>;
  iconFeatures: Array<ProductAttribute>;
  ratingFeatures: Array<ProductAttribute>;
};


export type ProductCardBreadcrumbsArgs = {
  slug: Array<Scalars['String']>;
};

export type ProductsPaginationPayload = {
  __typename?: 'ProductsPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  maxPrice: Scalars['Int'];
  minPrice: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Product>;
};

export type ProductsPaginationInput = {
  search?: Maybe<Scalars['String']>;
  minPrice?: Maybe<Scalars['Int']>;
  maxPrice?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  /** Filter by current rubrics */
  rubricId?: Maybe<Scalars['ObjectId']>;
  /** Filter by current attributes */
  attributesIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Exclude products in current rubrics */
  excludedRubricsIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Exclude current products */
  excludedProductsIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Returns products not added to any rubric. */
  isWithoutRubrics?: Maybe<Scalars['Boolean']>;
};

export type GetProductShopsInput = {
  productId: Scalars['ObjectId'];
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<SortDirection>;
};

export type ProductAttributesAstInput = {
  productId?: Maybe<Scalars['ObjectId']>;
  rubricId: Scalars['ObjectId'];
};

export type ProductPayload = Payload & {
  __typename?: 'ProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Product>;
};

export type ProductAttributeInput = {
  _id: Scalars['ObjectId'];
  showInCard: Scalars['Boolean'];
  showAsBreadcrumb: Scalars['Boolean'];
  attributeId: Scalars['ObjectId'];
  attributeSlug: Scalars['String'];
  attributeNameI18n: Scalars['JSONObject'];
  attributeViewVariant: AttributeViewVariant;
  attributeVariant: AttributeVariant;
  textI18n?: Maybe<Scalars['JSONObject']>;
  number?: Maybe<Scalars['Float']>;
  /** List of selected options slug */
  selectedOptionsSlugs: Array<Scalars['String']>;
};

export type CreateProductInput = {
  active: Scalars['Boolean'];
  originalName: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  assets: Array<Scalars['Upload']>;
  rubricId: Scalars['ObjectId'];
  brandSlug?: Maybe<Scalars['String']>;
  brandCollectionSlug?: Maybe<Scalars['String']>;
  manufacturerSlug?: Maybe<Scalars['String']>;
  attributes: Array<ProductAttributeInput>;
};

export type AddProductAssetsInput = {
  productId: Scalars['ObjectId'];
  assets: Array<Scalars['Upload']>;
};

export type DeleteProductAssetInput = {
  productId: Scalars['ObjectId'];
  assetIndex: Scalars['Int'];
};

export type UpdateProductAssetIndexInput = {
  productId: Scalars['ObjectId'];
  assetUrl: Scalars['String'];
  assetNewIndex: Scalars['Int'];
};

export type UpdateProductInput = {
  productId: Scalars['ObjectId'];
  active: Scalars['Boolean'];
  originalName: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  rubricId: Scalars['ObjectId'];
  brandSlug?: Maybe<Scalars['String']>;
  brandCollectionSlug?: Maybe<Scalars['String']>;
  manufacturerSlug?: Maybe<Scalars['String']>;
  attributes: Array<ProductAttributeInput>;
};

export type CreateProductConnectionInput = {
  productId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type AddProductToConnectionInput = {
  productId: Scalars['ObjectId'];
  addProductId: Scalars['ObjectId'];
  connectionId: Scalars['ObjectId'];
};

export type DeleteProductFromConnectionInput = {
  productId: Scalars['ObjectId'];
  deleteProductId: Scalars['ObjectId'];
  connectionId: Scalars['ObjectId'];
};

export type UpdateProductCounterInput = {
  productSlug: Scalars['String'];
};

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  _id: Scalars['ObjectId'];
  showInCard: Scalars['Boolean'];
  showAsBreadcrumb: Scalars['Boolean'];
  attributeId: Scalars['ObjectId'];
  attributeSlug: Scalars['String'];
  attributeViewVariant: AttributeViewVariant;
  attributeVariant: AttributeVariant;
  attributeNameI18n: Scalars['JSONObject'];
  textI18n?: Maybe<Scalars['JSONObject']>;
  number?: Maybe<Scalars['Float']>;
  /** List of selected options slug */
  selectedOptionsSlugs: Array<Scalars['String']>;
  selectedOptions: Array<Option>;
  attributeMetric?: Maybe<Metric>;
  attributeName: Scalars['String'];
  text: Scalars['String'];
  attribute: Attribute;
  readableValue?: Maybe<Scalars['String']>;
};

export type ProductConnectionItem = {
  __typename?: 'ProductConnectionItem';
  _id: Scalars['ObjectId'];
  option: Option;
  productId: Scalars['ObjectId'];
  product: Product;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  _id: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  attributeSlug: Scalars['String'];
  attributeNameI18n?: Maybe<Scalars['JSONObject']>;
  attributeViewVariant: AttributeViewVariant;
  attributeVariant: AttributeVariant;
  connectionProducts: Array<ProductConnectionItem>;
  attributeName: Scalars['String'];
};

export type ShopProductOldPrice = Timestamp & {
  __typename?: 'ShopProductOldPrice';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  price: Scalars['Int'];
};

export type ShopProduct = Timestamp & {
  __typename?: 'ShopProduct';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  citySlug: Scalars['String'];
  available: Scalars['Int'];
  price: Scalars['Int'];
  productId: Scalars['ObjectId'];
  shopId: Scalars['ObjectId'];
  oldPrices: Array<ShopProductOldPrice>;
  product: Product;
  shop: Shop;
  formattedPrice: Scalars['String'];
  formattedOldPrice?: Maybe<Scalars['String']>;
  discountedPercent?: Maybe<Scalars['Int']>;
  inCartCount: Scalars['Int'];
};

export type ShopProductPayload = Payload & {
  __typename?: 'ShopProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<ShopProduct>;
};

export type UpdateShopProductInput = {
  available: Scalars['Int'];
  price: Scalars['Int'];
  productId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
};

export type ShopProductsPaginationPayload = PaginationPayload & {
  __typename?: 'ShopProductsPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<ShopProduct>;
};

export type Shop = Base & Timestamp & {
  __typename?: 'Shop';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  name: Scalars['String'];
  slug: Scalars['String'];
  citySlug: Scalars['String'];
  companyId: Scalars['ObjectId'];
  logo: Asset;
  assets: Array<Asset>;
  contacts: Contacts;
  address: Address;
  shopProductsIds: Array<Scalars['ObjectId']>;
  shopProducts: ShopProductsPaginationPayload;
  city: City;
  company: Company;
  productsCount: Scalars['Int'];
};


export type ShopShopProductsArgs = {
  input?: Maybe<PaginationInput>;
};

export type ShopsPaginationPayload = PaginationPayload & {
  __typename?: 'ShopsPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Shop>;
};

export type ShopPayload = Payload & {
  __typename?: 'ShopPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Shop>;
};

export type AddProductToShopInput = {
  shopId: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
  price: Scalars['Int'];
  available: Scalars['Int'];
};

export type DeleteProductFromShopInput = {
  shopId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
};

export type UpdateShopInput = {
  shopId: Scalars['ObjectId'];
  name: Scalars['String'];
  citySlug: Scalars['String'];
  contacts: ContactsInput;
  address: AddressInput;
};

export type UpdateShopLogoInput = {
  shopId: Scalars['ObjectId'];
  logo: Array<Scalars['Upload']>;
};

export type AddShopAssetsInput = {
  shopId: Scalars['ObjectId'];
  assets: Array<Scalars['Upload']>;
};

export type DeleteShopAssetInput = {
  shopId: Scalars['ObjectId'];
  assetIndex: Scalars['Int'];
};

export type UpdateShopAssetIndexInput = {
  shopId: Scalars['ObjectId'];
  assetUrl: Scalars['String'];
  assetNewIndex: Scalars['Int'];
};

export type Company = Base & Timestamp & {
  __typename?: 'Company';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  name: Scalars['String'];
  slug: Scalars['String'];
  ownerId: Scalars['ObjectId'];
  domain?: Maybe<Scalars['String']>;
  staffIds: Array<Scalars['ObjectId']>;
  shopsIds: Array<Scalars['ObjectId']>;
  logo: Asset;
  contacts: Contacts;
  owner: User;
  staff: Array<User>;
  shops: ShopsPaginationPayload;
};


export type CompanyShopsArgs = {
  input?: Maybe<PaginationInput>;
};

export type CompaniesPaginationPayload = PaginationPayload & {
  __typename?: 'CompaniesPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Company>;
};

export type CreateCompanyInput = {
  name: Scalars['String'];
  ownerId: Scalars['ObjectId'];
  staffIds: Array<Scalars['ObjectId']>;
  domain?: Maybe<Scalars['String']>;
  logo: Array<Scalars['Upload']>;
  contacts: ContactsInput;
};

export type UpdateCompanyInput = {
  companyId: Scalars['ObjectId'];
  name: Scalars['String'];
  ownerId: Scalars['ObjectId'];
  staffIds: Array<Scalars['ObjectId']>;
  domain?: Maybe<Scalars['String']>;
  contacts: ContactsInput;
};

export type UpdateCompanyLogoInput = {
  companyId: Scalars['ObjectId'];
  logo: Array<Scalars['Upload']>;
};

export type AddShopToCompanyInput = {
  companyId: Scalars['ObjectId'];
  name: Scalars['String'];
  citySlug: Scalars['String'];
  logo: Array<Scalars['Upload']>;
  assets: Array<Scalars['Upload']>;
  contacts: ContactsInput;
  address: AddressInput;
};

export type DeleteShopFromCompanyInput = {
  companyId: Scalars['ObjectId'];
  shopId: Scalars['ObjectId'];
};

export type CompanyPayload = Payload & {
  __typename?: 'CompanyPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Company>;
};

export type CartProduct = Base & {
  __typename?: 'CartProduct';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  amount: Scalars['Int'];
  shopProductId?: Maybe<Scalars['ObjectId']>;
  productId?: Maybe<Scalars['ObjectId']>;
  shopProduct?: Maybe<ShopProduct>;
  product?: Maybe<Product>;
  isShopless: Scalars['Boolean'];
  formattedTotalPrice: Scalars['String'];
  totalPrice: Scalars['Int'];
};

export type Cart = {
  __typename?: 'Cart';
  _id: Scalars['ObjectId'];
  cartProducts: Array<CartProduct>;
  totalPrice: Scalars['Int'];
  formattedTotalPrice: Scalars['String'];
  productsCount: Scalars['Int'];
  isWithShopless: Scalars['Boolean'];
};

export type CartPayload = Payload & {
  __typename?: 'CartPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Cart>;
};

export type AddProductToCartInput = {
  shopProductId: Scalars['ObjectId'];
  amount: Scalars['Int'];
};

export type UpdateProductInCartInput = {
  cartProductId: Scalars['ObjectId'];
  amount: Scalars['Int'];
};

export type DeleteProductFromCartInput = {
  cartProductId: Scalars['ObjectId'];
};

export type AddShoplessProductToCartInput = {
  productId: Scalars['ObjectId'];
  amount: Scalars['Int'];
};

export type AddShopToCartProductInput = {
  cartProductId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
};

export type RepeatOrderInput = {
  orderId: Scalars['ObjectId'];
};

export type OrderStatus = Timestamp & {
  __typename?: 'OrderStatus';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  color: Scalars['String'];
  name: Scalars['String'];
};

export type OrderProduct = {
  __typename?: 'OrderProduct';
  _id: Scalars['ObjectId'];
  itemId: Scalars['Int'];
  price: Scalars['Int'];
  amount: Scalars['Int'];
  slug: Scalars['String'];
  originalName: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  productId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
  shopId: Scalars['ObjectId'];
  companyId: Scalars['ObjectId'];
  oldPrices: Array<ShopProductOldPrice>;
  name: Scalars['String'];
  description: Scalars['String'];
  product?: Maybe<Product>;
  shopProduct?: Maybe<ShopProduct>;
  shop?: Maybe<Shop>;
  company?: Maybe<Company>;
  formattedPrice: Scalars['String'];
  formattedTotalPrice: Scalars['String'];
  totalPrice: Scalars['Int'];
  formattedOldPrice?: Maybe<Scalars['String']>;
  discountedPercent?: Maybe<Scalars['Int']>;
};

export type OrderCustomer = {
  __typename?: 'OrderCustomer';
  _id: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  user?: Maybe<User>;
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  formattedPhone: FormattedPhone;
};

export type Order = Base & Timestamp & {
  __typename?: 'Order';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  comment?: Maybe<Scalars['String']>;
  statusId: Scalars['ObjectId'];
  customer: OrderCustomer;
  products: Array<OrderProduct>;
  logs: Array<OrderLog>;
  status: OrderStatus;
  totalPrice: Scalars['Int'];
  formattedTotalPrice: Scalars['String'];
  productsCount: Scalars['Int'];
};

export type OrdersPaginationPayload = PaginationPayload & {
  __typename?: 'OrdersPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Order>;
};

export type OrderPayload = Payload & {
  __typename?: 'OrderPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Order>;
};

export type MakeAnOrderPayload = Payload & {
  __typename?: 'MakeAnOrderPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  order?: Maybe<Order>;
  cart?: Maybe<Cart>;
};

export type MakeAnOrderInput = {
  name: Scalars['String'];
  phone: Scalars['PhoneNumber'];
  email: Scalars['EmailAddress'];
  comment?: Maybe<Scalars['String']>;
};




export type CmsProductAttributeFragment = (
  { __typename?: 'ProductAttribute' }
  & Pick<ProductAttribute, 'attributeId' | 'attributeSlug' | 'showInCard' | 'selectedOptionsSlugs'>
  & { attribute: (
    { __typename?: 'Attribute' }
    & Pick<Attribute, '_id' | 'slug' | 'name' | 'variant' | 'viewVariant'>
    & { metric?: Maybe<(
      { __typename?: 'Metric' }
      & Pick<Metric, '_id' | 'name'>
    )>, options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, '_id' | 'name' | 'color'>
    )> }
  ) }
);

export type CmsProductConnectionItemFragment = (
  { __typename?: 'ProductConnectionItem' }
  & Pick<ProductConnectionItem, 'productId'>
  & { option: (
    { __typename?: 'Option' }
    & Pick<Option, '_id' | 'name'>
  ), product: (
    { __typename?: 'Product' }
    & Pick<Product, '_id' | 'itemId' | 'active' | 'name' | 'slug' | 'mainImage'>
  ) }
);

export type CmsProductConnectionFragment = (
  { __typename?: 'ProductConnection' }
  & Pick<ProductConnection, '_id' | 'attributeId' | 'attributeName'>
  & { connectionProducts: Array<(
    { __typename?: 'ProductConnectionItem' }
    & CmsProductConnectionItemFragment
  )> }
);

export type CmsProductFieldsFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'nameI18n' | 'name' | 'originalName' | 'slug' | 'descriptionI18n' | 'description' | 'active' | 'mainImage' | 'rubricId' | 'brandSlug' | 'brandCollectionSlug' | 'manufacturerSlug'>
  & { assets: Array<(
    { __typename?: 'Asset' }
    & Pick<Asset, 'url' | 'index'>
  )>, rubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, '_id' | 'slug' | 'name'>
  ), attributes: Array<(
    { __typename?: 'ProductAttribute' }
    & CmsProductAttributeFragment
  )>, connections: Array<(
    { __typename?: 'ProductConnection' }
    & CmsProductConnectionFragment
  )> }
);

export type CmsProductFragment = (
  { __typename?: 'Product' }
  & CmsProductFieldsFragment
);

export type GetProductQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetProductQuery = (
  { __typename?: 'Query' }
  & { getProduct?: Maybe<(
    { __typename?: 'Product' }
    & CmsProductFragment
  )> }
);

export type ProductAttributeAstFragment = (
  { __typename?: 'ProductAttribute' }
  & Pick<ProductAttribute, '_id' | 'showInCard' | 'showAsBreadcrumb' | 'attributeId' | 'attributeSlug' | 'textI18n' | 'number' | 'selectedOptionsSlugs' | 'attributeName' | 'attributeNameI18n' | 'attributeVariant' | 'attributeViewVariant'>
  & { attribute: (
    { __typename?: 'Attribute' }
    & Pick<Attribute, '_id' | 'name' | 'variant'>
    & { metric?: Maybe<(
      { __typename?: 'Metric' }
      & Pick<Metric, '_id' | 'name'>
    )>, options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, '_id' | 'slug' | 'name'>
    )> }
  ) }
);

export type GetProductAttributesAstQueryVariables = Exact<{
  input: ProductAttributesAstInput;
}>;


export type GetProductAttributesAstQuery = (
  { __typename?: 'Query' }
  & { getProductAttributesAST: Array<(
    { __typename?: 'ProductAttribute' }
    & ProductAttributeAstFragment
  )> }
);

export type BrandCollectionsOptionFragment = (
  { __typename?: 'BrandCollection' }
  & Pick<BrandCollection, '_id' | 'slug' | 'name'>
);

export type GetProductBrandsOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductBrandsOptionsQuery = (
  { __typename?: 'Query' }
  & { getBrandsOptions: Array<(
    { __typename?: 'Brand' }
    & Pick<Brand, '_id' | 'slug' | 'name'>
    & { collectionsList: Array<(
      { __typename?: 'BrandCollection' }
      & BrandCollectionsOptionFragment
    )> }
  )>, getManufacturersOptions: Array<(
    { __typename?: 'Manufacturer' }
    & Pick<Manufacturer, '_id' | 'slug' | 'name'>
  )> }
);

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { updateProduct: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & CmsProductFragment
    )> }
  ) }
);

export type AddProductAssetsMutationVariables = Exact<{
  input: AddProductAssetsInput;
}>;


export type AddProductAssetsMutation = (
  { __typename?: 'Mutation' }
  & { addProductAssets: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & CmsProductFragment
    )> }
  ) }
);

export type DeleteProductAssetMutationVariables = Exact<{
  input: DeleteProductAssetInput;
}>;


export type DeleteProductAssetMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductAsset: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & CmsProductFragment
    )> }
  ) }
);

export type UpdateProductAssetIndexMutationVariables = Exact<{
  input: UpdateProductAssetIndexInput;
}>;


export type UpdateProductAssetIndexMutation = (
  { __typename?: 'Mutation' }
  & { updateProductAssetIndex: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & CmsProductFragment
    )> }
  ) }
);

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = (
  { __typename?: 'Mutation' }
  & { createProduct: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type CreateProductConnectionMutationVariables = Exact<{
  input: CreateProductConnectionInput;
}>;


export type CreateProductConnectionMutation = (
  { __typename?: 'Mutation' }
  & { createProductConnection: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type AddProductToConnectionMutationVariables = Exact<{
  input: AddProductToConnectionInput;
}>;


export type AddProductToConnectionMutation = (
  { __typename?: 'Mutation' }
  & { addProductToConnection: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type DeleteProductFromConnectionMutationVariables = Exact<{
  input: DeleteProductFromConnectionInput;
}>;


export type DeleteProductFromConnectionMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromConnection: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type RubricInListFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, '_id' | 'nameI18n' | 'slug' | 'name' | 'productsCount' | 'activeProductsCount'>
  & { variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, '_id' | 'name'>
  ) }
);

export type RubricProductFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'nameI18n' | 'name' | 'slug' | 'mainImage' | 'active' | 'rubricId'>
);

export type RubricProductsPaginationFragment = (
  { __typename?: 'ProductsPaginationPayload' }
  & Pick<ProductsPaginationPayload, 'totalDocs' | 'page' | 'totalPages' | 'totalActiveDocs'>
  & { docs: Array<(
    { __typename?: 'Product' }
    & RubricProductFragment
  )> }
);

export type GetAllRubricsQueryVariables = Exact<{
  input?: Maybe<GetAllRubricsInput>;
}>;


export type GetAllRubricsQuery = (
  { __typename?: 'Query' }
  & { getAllRubrics: Array<(
    { __typename?: 'Rubric' }
    & RubricInListFragment
  )> }
);

export type GetRubricQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetRubricQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'active' | 'variantId' | 'descriptionI18n' | 'shortDescriptionI18n'>
    & { catalogueTitle: (
      { __typename?: 'RubricCatalogueTitle' }
      & Pick<RubricCatalogueTitle, 'defaultTitleI18n' | 'prefixI18n' | 'keywordI18n' | 'gender'>
    ) }
    & RubricInListFragment
  ) }
);

export type GetRubricBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetRubricBySlugQuery = (
  { __typename?: 'Query' }
  & { getRubricBySlug: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'active' | 'variantId' | 'descriptionI18n' | 'shortDescriptionI18n'>
    & { catalogueTitle: (
      { __typename?: 'RubricCatalogueTitle' }
      & Pick<RubricCatalogueTitle, 'defaultTitleI18n' | 'prefixI18n' | 'keywordI18n' | 'gender'>
    ) }
    & RubricInListFragment
  ) }
);

export type CreateRubricMutationVariables = Exact<{
  input: CreateRubricInput;
}>;


export type CreateRubricMutation = (
  { __typename?: 'Mutation' }
  & { createRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type UpdateRubricMutationVariables = Exact<{
  input: UpdateRubricInput;
}>;


export type UpdateRubricMutation = (
  { __typename?: 'Mutation' }
  & { updateRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type DeleteRubricMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type GetRubricProductsQueryVariables = Exact<{
  rubricSlug: Scalars['String'];
  productsInput?: Maybe<ProductsPaginationInput>;
}>;


export type GetRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getRubricBySlug: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, '_id' | 'name'>
    & { products: (
      { __typename?: 'ProductsPaginationPayload' }
      & RubricProductsPaginationFragment
    ) }
  ) }
);

export type GetNonRubricProductsQueryVariables = Exact<{
  input: ProductsPaginationInput;
}>;


export type GetNonRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getProductsList: (
    { __typename?: 'ProductsPaginationPayload' }
    & RubricProductsPaginationFragment
  ) }
);

export type DeleteProductFromRubricMutationVariables = Exact<{
  input: DeleteProductFromRubricInput;
}>;


export type DeleteProductFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type ToggleAttributeInRubricCatalogueMutationVariables = Exact<{
  input: UpdateAttributeInRubricInput;
}>;


export type ToggleAttributeInRubricCatalogueMutation = (
  { __typename?: 'Mutation' }
  & { toggleAttributeInRubricCatalogue: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type ToggleAttributeInRubricNavMutationVariables = Exact<{
  input: UpdateAttributeInRubricInput;
}>;


export type ToggleAttributeInRubricNavMutation = (
  { __typename?: 'Mutation' }
  & { toggleAttributeInRubricNav: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type GetAllProductsQueryVariables = Exact<{
  input: ProductsPaginationInput;
}>;


export type GetAllProductsQuery = (
  { __typename?: 'Query' }
  & { getProductsList: (
    { __typename?: 'ProductsPaginationPayload' }
    & RubricProductsPaginationFragment
  ) }
);

export type RubricAttributeFragment = (
  { __typename?: 'RubricAttribute' }
  & Pick<RubricAttribute, '_id' | 'name' | 'variant' | 'optionsGroupId' | 'showInCatalogueFilter' | 'showInCatalogueNav'>
  & { metric?: Maybe<(
    { __typename?: 'Metric' }
    & Pick<Metric, '_id' | 'name'>
  )>, optionsGroup?: Maybe<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, '_id' | 'name'>
  )> }
);

export type RubricAttributesGroupFragment = (
  { __typename?: 'RubricAttributesGroup' }
  & Pick<RubricAttributesGroup, '_id' | 'name'>
  & { attributes: Array<(
    { __typename?: 'RubricAttribute' }
    & RubricAttributeFragment
  )> }
);

export type GetRubricAttributesQueryVariables = Exact<{
  rubricId: Scalars['ObjectId'];
}>;


export type GetRubricAttributesQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, '_id'>
    & { attributesGroups: Array<(
      { __typename?: 'RubricAttributesGroup' }
      & RubricAttributesGroupFragment
    )> }
  ) }
);

export type CreateAttributesGroupMutationVariables = Exact<{
  input: CreateAttributesGroupInput;
}>;


export type CreateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { createAttributesGroup: (
    { __typename?: 'AttributesGroupPayload' }
    & Pick<AttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type UpdateAttributesGroupMutationVariables = Exact<{
  input: UpdateAttributesGroupInput;
}>;


export type UpdateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributesGroup: (
    { __typename?: 'AttributesGroupPayload' }
    & Pick<AttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroup: (
    { __typename?: 'AttributesGroupPayload' }
    & Pick<AttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type AddAttributeToGroupMutationVariables = Exact<{
  input: AddAttributeToGroupInput;
}>;


export type AddAttributeToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addAttributeToGroup: (
    { __typename?: 'AttributesGroupPayload' }
    & Pick<AttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type UpdateAttributeInGroupMutationVariables = Exact<{
  input: UpdateAttributeInGroupInput;
}>;


export type UpdateAttributeInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributeInGroup: (
    { __typename?: 'AttributesGroupPayload' }
    & Pick<AttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type DeleteAttributeFromGroupMutationVariables = Exact<{
  input: DeleteAttributeFromGroupInput;
}>;


export type DeleteAttributeFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributeFromGroup: (
    { __typename?: 'AttributesGroupPayload' }
    & Pick<AttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type AddAttributesGroupToRubricMutationVariables = Exact<{
  input: AddAttributesGroupToRubricInput;
}>;


export type AddAttributesGroupToRubricMutation = (
  { __typename?: 'Mutation' }
  & { addAttributesGroupToRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupFromRubricMutationVariables = Exact<{
  input: DeleteAttributesGroupFromRubricInput;
}>;


export type DeleteAttributesGroupFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroupFromRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
  ) }
);

export type CartProductFragment = (
  { __typename?: 'CartProduct' }
  & Pick<CartProduct, '_id' | 'amount' | 'formattedTotalPrice' | 'isShopless'>
  & { product?: Maybe<(
    { __typename?: 'Product' }
    & ProductSnippetFragment
  )>, shopProduct?: Maybe<(
    { __typename?: 'ShopProduct' }
    & { product: (
      { __typename?: 'Product' }
      & ProductSnippetFragment
    ) }
    & ShopProductSnippetFragment
  )> }
);

export type CartFragment = (
  { __typename?: 'Cart' }
  & Pick<Cart, '_id' | 'formattedTotalPrice' | 'productsCount' | 'isWithShopless'>
  & { cartProducts: Array<(
    { __typename?: 'CartProduct' }
    & CartProductFragment
  )> }
);

export type OrderInCartFragment = (
  { __typename?: 'Order' }
  & Pick<Order, '_id' | 'itemId'>
);

export type CartPayloadFragment = (
  { __typename?: 'CartPayload' }
  & Pick<CartPayload, 'success' | 'message'>
  & { payload?: Maybe<(
    { __typename?: 'Cart' }
    & CartFragment
  )> }
);

export type MakeAnOrderPayloadFragment = (
  { __typename?: 'MakeAnOrderPayload' }
  & Pick<MakeAnOrderPayload, 'success' | 'message'>
  & { cart?: Maybe<(
    { __typename?: 'Cart' }
    & CartFragment
  )>, order?: Maybe<(
    { __typename?: 'Order' }
    & OrderInCartFragment
  )> }
);

export type AddProductToCartMutationVariables = Exact<{
  input: AddProductToCartInput;
}>;


export type AddProductToCartMutation = (
  { __typename?: 'Mutation' }
  & { addProductToCart: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type AddShoplessProductToCartMutationVariables = Exact<{
  input: AddShoplessProductToCartInput;
}>;


export type AddShoplessProductToCartMutation = (
  { __typename?: 'Mutation' }
  & { addShoplessProductToCart: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type AddShopToCartProductMutationVariables = Exact<{
  input: AddShopToCartProductInput;
}>;


export type AddShopToCartProductMutation = (
  { __typename?: 'Mutation' }
  & { addShopToCartProduct: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type UpdateProductInCartMutationVariables = Exact<{
  input: UpdateProductInCartInput;
}>;


export type UpdateProductInCartMutation = (
  { __typename?: 'Mutation' }
  & { updateProductInCart: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type DeleteProductFromCartMutationVariables = Exact<{
  input: DeleteProductFromCartInput;
}>;


export type DeleteProductFromCartMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromCart: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type ClearCartMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearCartMutation = (
  { __typename?: 'Mutation' }
  & { clearCart: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type MakeAnOrderMutationVariables = Exact<{
  input: MakeAnOrderInput;
}>;


export type MakeAnOrderMutation = (
  { __typename?: 'Mutation' }
  & { makeAnOrder: (
    { __typename?: 'MakeAnOrderPayload' }
    & MakeAnOrderPayloadFragment
  ) }
);

export type RepeatAnOrderMutationVariables = Exact<{
  input: RepeatOrderInput;
}>;


export type RepeatAnOrderMutation = (
  { __typename?: 'Mutation' }
  & { repeatOrder: (
    { __typename?: 'CartPayload' }
    & CartPayloadFragment
  ) }
);

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = (
  { __typename?: 'Mutation' }
  & { createCompany: (
    { __typename?: 'CompanyPayload' }
    & Pick<CompanyPayload, 'success' | 'message'>
  ) }
);

export type DeleteCompanyMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteCompanyMutation = (
  { __typename?: 'Mutation' }
  & { deleteCompany: (
    { __typename?: 'CompanyPayload' }
    & Pick<CompanyPayload, 'success' | 'message'>
  ) }
);

export type UpdateCompanyMutationVariables = Exact<{
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = (
  { __typename?: 'Mutation' }
  & { updateCompany: (
    { __typename?: 'CompanyPayload' }
    & Pick<CompanyPayload, 'success' | 'message'>
  ) }
);

export type UpdateCompanyLogoMutationVariables = Exact<{
  input: UpdateCompanyLogoInput;
}>;


export type UpdateCompanyLogoMutation = (
  { __typename?: 'Mutation' }
  & { updateCompanyLogo: (
    { __typename?: 'CompanyPayload' }
    & Pick<CompanyPayload, 'success' | 'message'>
  ) }
);

export type AddShopToCompanyMutationVariables = Exact<{
  input: AddShopToCompanyInput;
}>;


export type AddShopToCompanyMutation = (
  { __typename?: 'Mutation' }
  & { addShopToCompany: (
    { __typename?: 'CompanyPayload' }
    & Pick<CompanyPayload, 'success' | 'message'>
  ) }
);

export type DeleteShopFromCompanyMutationVariables = Exact<{
  input: DeleteShopFromCompanyInput;
}>;


export type DeleteShopFromCompanyMutation = (
  { __typename?: 'Mutation' }
  & { deleteShopFromCompany: (
    { __typename?: 'CompanyPayload' }
    & Pick<CompanyPayload, 'success' | 'message'>
  ) }
);

export type UpdateConfigMutationVariables = Exact<{
  input: UpdateConfigInput;
}>;


export type UpdateConfigMutation = (
  { __typename?: 'Mutation' }
  & { updateConfig: (
    { __typename?: 'ConfigPayload' }
    & Pick<ConfigPayload, 'success' | 'message'>
  ) }
);

export type UpdateAssetConfigMutationVariables = Exact<{
  input: UpdateAssetConfigInput;
}>;


export type UpdateAssetConfigMutation = (
  { __typename?: 'Mutation' }
  & { updateAssetConfig: (
    { __typename?: 'ConfigPayload' }
    & Pick<ConfigPayload, 'success' | 'message'>
  ) }
);

export type CreateLanguageMutationVariables = Exact<{
  input: CreateLanguageInput;
}>;


export type CreateLanguageMutation = (
  { __typename?: 'Mutation' }
  & { createLanguage: (
    { __typename?: 'LanguagePayload' }
    & Pick<LanguagePayload, 'success' | 'message'>
  ) }
);

export type UpdateLanguageMutationVariables = Exact<{
  input: UpdateLanguageInput;
}>;


export type UpdateLanguageMutation = (
  { __typename?: 'Mutation' }
  & { updateLanguage: (
    { __typename?: 'LanguagePayload' }
    & Pick<LanguagePayload, 'success' | 'message'>
  ) }
);

export type DeleteLanguageMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteLanguageMutation = (
  { __typename?: 'Mutation' }
  & { deleteLanguage: (
    { __typename?: 'LanguagePayload' }
    & Pick<LanguagePayload, 'success' | 'message'>
  ) }
);

export type CreateOptionsGroupMutationVariables = Exact<{
  input: CreateOptionsGroupInput;
}>;


export type CreateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { createOptionsGroup: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type UpdateOptionsGroupMutationVariables = Exact<{
  input: UpdateOptionsGroupInput;
}>;


export type UpdateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionsGroup: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type DeleteOptionsGroupMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionsGroup: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type AddOptionToGroupMutationVariables = Exact<{
  input: AddOptionToGroupInput;
}>;


export type AddOptionToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addOptionToGroup: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type UpdateOptionInGroupMutationVariables = Exact<{
  input: UpdateOptionInGroupInput;
}>;


export type UpdateOptionInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionInGroup: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type DeleteOptionFromGroupMutationVariables = Exact<{
  input: DeleteOptionFromGroupInput;
}>;


export type DeleteOptionFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionFromGroup: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = (
  { __typename?: 'Mutation' }
  & { createRole: (
    { __typename?: 'RolePayload' }
    & Pick<RolePayload, 'success' | 'message'>
  ) }
);

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateRole: (
    { __typename?: 'RolePayload' }
    & Pick<RolePayload, 'success' | 'message'>
  ) }
);

export type DeleteRoleMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteRoleMutation = (
  { __typename?: 'Mutation' }
  & { deleteRole: (
    { __typename?: 'RolePayload' }
    & Pick<RolePayload, 'success' | 'message'>
  ) }
);

export type CreateRubricVariantMutationVariables = Exact<{
  input: CreateRubricVariantInput;
}>;


export type CreateRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { createRubricVariant: (
    { __typename?: 'RubricVariantPayload' }
    & Pick<RubricVariantPayload, 'success' | 'message'>
  ) }
);

export type UpdateRubricVariantMutationVariables = Exact<{
  input: UpdateRubricVariantInput;
}>;


export type UpdateRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { updateRubricVariant: (
    { __typename?: 'RubricVariantPayload' }
    & Pick<RubricVariantPayload, 'success' | 'message'>
  ) }
);

export type DeleteRubricVariantMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubricVariant: (
    { __typename?: 'RubricVariantPayload' }
    & Pick<RubricVariantPayload, 'success' | 'message'>
  ) }
);

export type UpdateShopMutationVariables = Exact<{
  input: UpdateShopInput;
}>;


export type UpdateShopMutation = (
  { __typename?: 'Mutation' }
  & { updateShop: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type AddShopAssetsMutationVariables = Exact<{
  input: AddShopAssetsInput;
}>;


export type AddShopAssetsMutation = (
  { __typename?: 'Mutation' }
  & { addShopAssets: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type DeleteShopAssetMutationVariables = Exact<{
  input: DeleteShopAssetInput;
}>;


export type DeleteShopAssetMutation = (
  { __typename?: 'Mutation' }
  & { deleteShopAsset: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type UpdateShopAssetIndexMutationVariables = Exact<{
  input: UpdateShopAssetIndexInput;
}>;


export type UpdateShopAssetIndexMutation = (
  { __typename?: 'Mutation' }
  & { updateShopAssetIndex: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type UpdateShopLogoMutationVariables = Exact<{
  input: UpdateShopLogoInput;
}>;


export type UpdateShopLogoMutation = (
  { __typename?: 'Mutation' }
  & { updateShopLogo: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type AddProductToShopMutationVariables = Exact<{
  input: AddProductToShopInput;
}>;


export type AddProductToShopMutation = (
  { __typename?: 'Mutation' }
  & { addProductToShop: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type UpdateShopProductMutationVariables = Exact<{
  input: UpdateShopProductInput;
}>;


export type UpdateShopProductMutation = (
  { __typename?: 'Mutation' }
  & { updateShopProduct: (
    { __typename?: 'ShopProductPayload' }
    & Pick<ShopProductPayload, 'success' | 'message'>
  ) }
);

export type DeleteProductFromShopMutationVariables = Exact<{
  input: DeleteProductFromShopInput;
}>;


export type DeleteProductFromShopMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromShop: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
  ) }
);

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateMyProfile: (
    { __typename?: 'UserPayload' }
    & Pick<UserPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'User' }
      & SessionUserFragment
    )> }
  ) }
);

export type UpdateMyPasswordMutationVariables = Exact<{
  input: UpdateMyPasswordInput;
}>;


export type UpdateMyPasswordMutation = (
  { __typename?: 'Mutation' }
  & { updateMyPassword: (
    { __typename?: 'UserPayload' }
    & Pick<UserPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'User' }
      & SessionUserFragment
    )> }
  ) }
);

export type GetAllAttributesGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAttributesGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, '_id' | 'name'>
  )> }
);

export type AttributeInGroupFragment = (
  { __typename?: 'Attribute' }
  & Pick<Attribute, '_id' | 'nameI18n' | 'name' | 'variant' | 'viewVariant' | 'positioningInTitle' | 'optionsGroupId'>
  & { optionsGroup?: Maybe<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, '_id' | 'name'>
  )>, metric?: Maybe<(
    { __typename?: 'Metric' }
    & Pick<Metric, '_id' | 'name'>
  )> }
);

export type GetAttributesGroupQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetAttributesGroupQuery = (
  { __typename?: 'Query' }
  & { getAttributesGroup: (
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, '_id' | 'nameI18n' | 'name'>
    & { attributes: Array<(
      { __typename?: 'Attribute' }
      & AttributeInGroupFragment
    )> }
  ) }
);

export type GetAttributesGroupsForRubricQueryVariables = Exact<{
  excludedIds?: Maybe<Array<Scalars['ObjectId']> | Scalars['ObjectId']>;
}>;


export type GetAttributesGroupsForRubricQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, '_id' | 'name'>
  )> }
);

export type CardFeatureFragment = (
  { __typename?: 'ProductAttribute' }
  & Pick<ProductAttribute, '_id' | 'showInCard' | 'text' | 'number' | 'attributeName' | 'attributeViewVariant' | 'readableValue'>
  & { selectedOptions: Array<(
    { __typename?: 'Option' }
    & Pick<Option, '_id' | 'slug' | 'name' | 'icon'>
  )> }
);

export type CardConnectionProductFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'slug'>
);

export type CardConnectionItemFragment = (
  { __typename?: 'ProductConnectionItem' }
  & Pick<ProductConnectionItem, '_id'>
  & { option: (
    { __typename?: 'Option' }
    & Pick<Option, '_id' | 'name'>
  ), product: (
    { __typename?: 'Product' }
    & CardConnectionProductFragment
  ) }
);

export type CardConnectionFragment = (
  { __typename?: 'ProductConnection' }
  & Pick<ProductConnection, '_id' | 'attributeName'>
  & { connectionProducts: Array<(
    { __typename?: 'ProductConnectionItem' }
    & CardConnectionItemFragment
  )> }
);

export type ShopSnippetFragment = (
  { __typename?: 'Shop' }
  & Pick<Shop, '_id' | 'name' | 'slug' | 'productsCount'>
  & { address: (
    { __typename?: 'Address' }
    & Pick<Address, 'formattedAddress'>
    & { formattedCoordinates: (
      { __typename?: 'Coordinates' }
      & Pick<Coordinates, 'lat' | 'lng'>
    ) }
  ), contacts: (
    { __typename?: 'Contacts' }
    & { formattedPhones: Array<(
      { __typename?: 'FormattedPhone' }
      & Pick<FormattedPhone, 'raw' | 'readable'>
    )> }
  ), assets: Array<(
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  )>, logo: (
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  ) }
);

export type ShopProductSnippetFragment = (
  { __typename?: 'ShopProduct' }
  & Pick<ShopProduct, '_id' | 'available' | 'formattedPrice' | 'formattedOldPrice' | 'discountedPercent' | 'inCartCount'>
  & { shop: (
    { __typename?: 'Shop' }
    & ShopSnippetFragment
  ) }
);

export type ProductCardFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'name' | 'originalName' | 'slug' | 'mainImage' | 'description' | 'shopsCount' | 'isCustomersChoice'>
  & { cardPrices: (
    { __typename?: 'ProductCardPrices' }
    & Pick<ProductCardPrices, '_id' | 'min' | 'max'>
  ), cardShopProducts: Array<(
    { __typename?: 'ShopProduct' }
    & ShopProductSnippetFragment
  )>, listFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & CardFeatureFragment
  )>, textFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & CardFeatureFragment
  )>, tagFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & CardFeatureFragment
  )>, iconFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & CardFeatureFragment
  )>, ratingFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & CardFeatureFragment
  )>, connections: Array<(
    { __typename?: 'ProductConnection' }
    & CardConnectionFragment
  )> }
);

export type GetCatalogueCardQueryVariables = Exact<{
  slug: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetCatalogueCardQuery = (
  { __typename?: 'Query' }
  & { getProductCard: (
    { __typename?: 'Product' }
    & { cardBreadcrumbs: Array<(
      { __typename?: 'ProductCardBreadcrumb' }
      & Pick<ProductCardBreadcrumb, '_id' | 'name' | 'href'>
    )> }
    & ProductCardFragment
  ) }
);

export type GetCatalogueCardShopsQueryVariables = Exact<{
  input: GetProductShopsInput;
}>;


export type GetCatalogueCardShopsQuery = (
  { __typename?: 'Query' }
  & { getProductShops: Array<(
    { __typename?: 'ShopProduct' }
    & ShopProductSnippetFragment
  )> }
);

export type UpdateProductCounterMutationVariables = Exact<{
  input: UpdateProductCounterInput;
}>;


export type UpdateProductCounterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateProductCounter'>
);

export type SnippetConnectionItemFragment = (
  { __typename?: 'ProductConnectionItem' }
  & Pick<ProductConnectionItem, '_id' | 'productId'>
  & { option: (
    { __typename?: 'Option' }
    & Pick<Option, '_id' | 'name'>
  ) }
);

export type SnippetConnectionFragment = (
  { __typename?: 'ProductConnection' }
  & Pick<ProductConnection, '_id' | 'attributeName'>
  & { connectionProducts: Array<(
    { __typename?: 'ProductConnectionItem' }
    & SnippetConnectionItemFragment
  )> }
);

export type ProductSnippetFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'name' | 'originalName' | 'slug' | 'mainImage' | 'shopsCount' | 'isCustomersChoice'>
  & { listFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & Pick<ProductAttribute, '_id' | 'attributeId' | 'attributeName' | 'readableValue'>
    & { attributeMetric?: Maybe<(
      { __typename?: 'Metric' }
      & Pick<Metric, '_id' | 'name'>
    )> }
  )>, ratingFeatures: Array<(
    { __typename?: 'ProductAttribute' }
    & Pick<ProductAttribute, '_id' | 'attributeId' | 'attributeName' | 'readableValue'>
    & { attributeMetric?: Maybe<(
      { __typename?: 'Metric' }
      & Pick<Metric, '_id' | 'name'>
    )> }
  )>, connections: Array<(
    { __typename?: 'ProductConnection' }
    & SnippetConnectionFragment
  )>, cardPrices: (
    { __typename?: 'ProductCardPrices' }
    & Pick<ProductCardPrices, '_id' | 'min' | 'max'>
  ) }
);

export type CatalogueFilterAttributeOptionFragment = (
  { __typename?: 'CatalogueFilterAttributeOption' }
  & Pick<CatalogueFilterAttributeOption, '_id' | 'name' | 'slug' | 'nextSlug' | 'isSelected'>
);

export type CatalogueFilterAttributeFragment = (
  { __typename?: 'CatalogueFilterAttribute' }
  & Pick<CatalogueFilterAttribute, '_id' | 'slug' | 'clearSlug' | 'isSelected' | 'name'>
  & { options: Array<(
    { __typename?: 'CatalogueFilterAttributeOption' }
    & CatalogueFilterAttributeOptionFragment
  )> }
);

export type CatalogueRubricFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, '_id' | 'name' | 'slug'>
  & { variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, '_id' | 'name'>
  ) }
);

export type CatalogueDataFragment = (
  { __typename?: 'CatalogueData' }
  & Pick<CatalogueData, '_id' | 'lastProductId' | 'hasMore' | 'clearSlug' | 'filter' | 'catalogueTitle' | 'totalProducts'>
  & { rubric: (
    { __typename?: 'Rubric' }
    & CatalogueRubricFragment
  ), products: Array<(
    { __typename?: 'Product' }
    & ProductSnippetFragment
  )>, attributes: Array<(
    { __typename?: 'CatalogueFilterAttribute' }
    & CatalogueFilterAttributeFragment
  )>, selectedAttributes: Array<(
    { __typename?: 'CatalogueFilterAttribute' }
    & CatalogueFilterAttributeFragment
  )> }
);

export type GetCatalogueRubricQueryVariables = Exact<{
  input: CatalogueDataInput;
}>;


export type GetCatalogueRubricQuery = (
  { __typename?: 'Query' }
  & { getCatalogueData?: Maybe<(
    { __typename?: 'CatalogueData' }
    & CatalogueDataFragment
  )> }
);

export type UpdateCatalogueCountersMutationVariables = Exact<{
  input: CatalogueDataInput;
}>;


export type UpdateCatalogueCountersMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateCatalogueCounters'>
);

export type CompanyInListFragment = (
  { __typename?: 'Company' }
  & Pick<Company, '_id' | 'itemId' | 'slug' | 'name' | 'ownerId' | 'staffIds' | 'domain'>
  & { owner: (
    { __typename?: 'User' }
    & Pick<User, '_id' | 'fullName'>
  ), logo: (
    { __typename?: 'Asset' }
    & Pick<Asset, 'url'>
  ) }
);

export type GetAllCompaniesQueryVariables = Exact<{
  input?: Maybe<PaginationInput>;
}>;


export type GetAllCompaniesQuery = (
  { __typename?: 'Query' }
  & { getAllCompanies?: Maybe<(
    { __typename?: 'CompaniesPaginationPayload' }
    & Pick<CompaniesPaginationPayload, 'totalDocs' | 'page' | 'totalPages'>
    & { docs: Array<(
      { __typename?: 'Company' }
      & CompanyInListFragment
    )> }
  )> }
);

export type ShopInListFragment = (
  { __typename?: 'Shop' }
  & Pick<Shop, '_id' | 'itemId' | 'slug' | 'name' | 'companyId'>
  & { city: (
    { __typename?: 'City' }
    & Pick<City, '_id' | 'name' | 'slug'>
  ), logo: (
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  ) }
);

export type CompanyFragment = (
  { __typename?: 'Company' }
  & Pick<Company, '_id' | 'itemId' | 'slug' | 'name' | 'ownerId' | 'staffIds' | 'domain'>
  & { staff: Array<(
    { __typename?: 'User' }
    & UserInListFragment
  )>, owner: (
    { __typename?: 'User' }
    & UserInListFragment
  ), logo: (
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  ), contacts: (
    { __typename?: 'Contacts' }
    & Pick<Contacts, 'emails' | 'phones'>
  ) }
);

export type GetCompanyQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetCompanyQuery = (
  { __typename?: 'Query' }
  & { getCompany?: Maybe<(
    { __typename?: 'Company' }
    & CompanyFragment
  )> }
);

export type GetCompanyShopsQueryVariables = Exact<{
  companyId: Scalars['ObjectId'];
  input?: Maybe<PaginationInput>;
}>;


export type GetCompanyShopsQuery = (
  { __typename?: 'Query' }
  & { getCompany?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, '_id'>
    & { shops: (
      { __typename?: 'ShopsPaginationPayload' }
      & Pick<ShopsPaginationPayload, 'totalPages'>
      & { docs: Array<(
        { __typename?: 'Shop' }
        & ShopInListFragment
      )> }
    ) }
  )> }
);

export type GetAllShopsQueryVariables = Exact<{
  input?: Maybe<PaginationInput>;
}>;


export type GetAllShopsQuery = (
  { __typename?: 'Query' }
  & { getAllShops: (
    { __typename?: 'ShopsPaginationPayload' }
    & Pick<ShopsPaginationPayload, 'totalPages'>
    & { docs: Array<(
      { __typename?: 'Shop' }
      & ShopInListFragment
    )> }
  ) }
);

export type ShopProductNodeFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'name' | 'mainImage'>
);

export type ShopProductFragment = (
  { __typename?: 'ShopProduct' }
  & Pick<ShopProduct, '_id' | 'available' | 'price'>
  & { product: (
    { __typename?: 'Product' }
    & ShopProductNodeFragment
  ) }
);

export type ShopFragment = (
  { __typename?: 'Shop' }
  & Pick<Shop, '_id' | 'slug' | 'itemId' | 'name' | 'companyId'>
  & { contacts: (
    { __typename?: 'Contacts' }
    & Pick<Contacts, 'emails' | 'phones'>
  ), city: (
    { __typename?: 'City' }
    & Pick<City, '_id' | 'name' | 'slug'>
  ), address: (
    { __typename?: 'Address' }
    & Pick<Address, 'formattedAddress'>
    & { point: (
      { __typename?: 'PointGeoJSON' }
      & Pick<PointGeoJson, 'coordinates'>
    ) }
  ), logo: (
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  ), assets: Array<(
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  )> }
);

export type GetShopQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetShopQuery = (
  { __typename?: 'Query' }
  & { getShop: (
    { __typename?: 'Shop' }
    & ShopFragment
  ) }
);

export type GetShopProductsQueryVariables = Exact<{
  shopId: Scalars['ObjectId'];
  input?: Maybe<PaginationInput>;
}>;


export type GetShopProductsQuery = (
  { __typename?: 'Query' }
  & { getShop: (
    { __typename?: 'Shop' }
    & Pick<Shop, '_id' | 'shopProductsIds'>
    & { shopProducts: (
      { __typename?: 'ShopProductsPaginationPayload' }
      & Pick<ShopProductsPaginationPayload, 'totalPages'>
      & { docs: Array<(
        { __typename?: 'ShopProduct' }
        & ShopProductFragment
      )> }
    ) }
  ) }
);

export type SiteConfigFragment = (
  { __typename?: 'Config' }
  & Pick<Config, '_id' | 'slug' | 'value' | 'singleValue' | 'name' | 'description' | 'variant' | 'acceptedFormats' | 'multi' | 'cities'>
);

export type GetAllConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllConfigsQuery = (
  { __typename?: 'Query' }
  & { getAllConfigs: Array<(
    { __typename?: 'Config' }
    & SiteConfigFragment
  )> }
);

export type AppNavItemFragment = (
  { __typename?: 'NavItem' }
  & Pick<NavItem, '_id' | 'name' | 'icon' | 'path'>
);

export type AppNavParentItemFragment = (
  { __typename?: 'NavItem' }
  & { appNavigationChildren: Array<(
    { __typename?: 'NavItem' }
    & AppNavItemFragment
  )> }
  & AppNavItemFragment
);

export type SessionRoleFragmentFragment = (
  { __typename?: 'Role' }
  & Pick<Role, '_id' | 'name' | 'slug' | 'isStuff'>
  & { appNavigation: Array<(
    { __typename?: 'NavItem' }
    & AppNavParentItemFragment
  )>, cmsNavigation: Array<(
    { __typename?: 'NavItem' }
    & AppNavParentItemFragment
  )> }
);

export type SessionUserFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone'>
  & { role: (
    { __typename?: 'Role' }
    & SessionRoleFragmentFragment
  ) }
);

export type RubricNavItemAttributeOptionFragment = (
  { __typename?: 'RubricOption' }
  & Pick<RubricOption, '_id' | 'slug' | 'name'>
);

export type RubricNavItemAttributeFragment = (
  { __typename?: 'RubricAttribute' }
  & Pick<RubricAttribute, '_id' | 'name'>
  & { options: Array<(
    { __typename?: 'RubricOption' }
    & RubricNavItemAttributeOptionFragment
  )> }
);

export type CatalogueNavRubricFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, '_id' | 'name' | 'slug'>
  & { variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, '_id' | 'name'>
  ), navItems: Array<(
    { __typename?: 'RubricAttribute' }
    & RubricNavItemAttributeFragment
  )> }
);

export type InitialQueryCityFragment = (
  { __typename?: 'City' }
  & Pick<City, '_id' | 'slug' | 'name'>
);

export type SessionUserQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionUserQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & SessionUserFragment
  )> }
);

export type SessionCartQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionCartQuery = (
  { __typename?: 'Query' }
  & { getSessionCart: (
    { __typename?: 'Cart' }
    & CartFragment
  ) }
);

export type InitialQueryLanguageFragment = (
  { __typename?: 'Language' }
  & Pick<Language, '_id' | 'slug' | 'name' | 'nativeName'>
);

export type InitialDataFragment = (
  { __typename?: 'Query' }
  & Pick<Query, 'getSessionCurrency'>
  & { getAllLanguages: Array<(
    { __typename?: 'Language' }
    & InitialQueryLanguageFragment
  )>, getSessionCities: Array<(
    { __typename?: 'City' }
    & InitialQueryCityFragment
  )>, getAllConfigs: Array<(
    { __typename?: 'Config' }
    & SiteConfigFragment
  )> }
);

export type InitialSiteQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialSiteQuery = (
  { __typename?: 'Query' }
  & { getCatalogueNavRubrics: Array<(
    { __typename?: 'Rubric' }
    & CatalogueNavRubricFragment
  )> }
  & InitialDataFragment
);

export type InitialAppQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialAppQuery = (
  { __typename?: 'Query' }
  & InitialDataFragment
);

export type LanguageFragment = (
  { __typename?: 'Language' }
  & Pick<Language, '_id' | 'name' | 'slug' | 'nativeName'>
);

export type GetAllLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLanguagesQuery = (
  { __typename?: 'Query' }
  & { getAllLanguages: Array<(
    { __typename?: 'Language' }
    & LanguageFragment
  )> }
);

export type MessageFragment = (
  { __typename?: 'Message' }
  & Pick<Message, '_id' | 'slug' | 'messageI18n' | 'message'>
);

export type GetValidationMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetValidationMessagesQuery = (
  { __typename?: 'Query' }
  & { getValidationMessages: Array<(
    { __typename?: 'Message' }
    & MessageFragment
  )> }
);

export type OptionsGroupInlistFragment = (
  { __typename?: 'OptionsGroup' }
  & Pick<OptionsGroup, '_id' | 'name'>
  & { options: Array<(
    { __typename?: 'Option' }
    & Pick<Option, '_id'>
  )> }
);

export type GetAllOptionsGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOptionsGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllOptionsGroups: Array<(
    { __typename?: 'OptionsGroup' }
    & OptionsGroupInlistFragment
  )> }
);

export type OptionInGroupFragment = (
  { __typename?: 'Option' }
  & Pick<Option, '_id' | 'nameI18n' | 'name' | 'color' | 'icon' | 'gender' | 'variants'>
);

export type OptionsGroupFragment = (
  { __typename?: 'OptionsGroup' }
  & Pick<OptionsGroup, '_id' | 'nameI18n' | 'variant' | 'name'>
  & { options: Array<(
    { __typename?: 'Option' }
    & OptionInGroupFragment
  )> }
);

export type GetOptionsGroupQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetOptionsGroupQuery = (
  { __typename?: 'Query' }
  & { getOptionsGroup: (
    { __typename?: 'OptionsGroup' }
    & OptionsGroupFragment
  ) }
);

export type OrderStatusFragment = (
  { __typename?: 'OrderStatus' }
  & Pick<OrderStatus, '_id' | 'name' | 'color'>
);

export type CmsOrderInListCustomerFragment = (
  { __typename?: 'OrderCustomer' }
  & Pick<OrderCustomer, '_id' | 'itemId' | 'shortName' | 'email'>
  & { formattedPhone: (
    { __typename?: 'FormattedPhone' }
    & Pick<FormattedPhone, 'raw' | 'readable'>
  ) }
);

export type CmsOrderInListFragment = (
  { __typename?: 'Order' }
  & Pick<Order, '_id' | 'itemId' | 'productsCount' | 'formattedTotalPrice' | 'comment' | 'createdAt'>
  & { status: (
    { __typename?: 'OrderStatus' }
    & OrderStatusFragment
  ), customer: (
    { __typename?: 'OrderCustomer' }
    & CmsOrderInListCustomerFragment
  ) }
);

export type GetAllCmsOrdersQueryVariables = Exact<{
  input?: Maybe<PaginationInput>;
}>;


export type GetAllCmsOrdersQuery = (
  { __typename?: 'Query' }
  & { getAllOrders: (
    { __typename?: 'OrdersPaginationPayload' }
    & Pick<OrdersPaginationPayload, 'totalDocs' | 'page' | 'totalPages'>
    & { docs: Array<(
      { __typename?: 'Order' }
      & CmsOrderInListFragment
    )> }
  ) }
);

export type CmsOrderShopProductFragment = (
  { __typename?: 'ShopProduct' }
  & Pick<ShopProduct, '_id'>
  & { product: (
    { __typename?: 'Product' }
    & Pick<Product, '_id' | 'mainImage'>
  ) }
);

export type CmsOrderShopFragment = (
  { __typename?: 'Shop' }
  & Pick<Shop, '_id' | 'name' | 'slug'>
  & { address: (
    { __typename?: 'Address' }
    & Pick<Address, 'formattedAddress'>
    & { formattedCoordinates: (
      { __typename?: 'Coordinates' }
      & Pick<Coordinates, 'lat' | 'lng'>
    ) }
  ), contacts: (
    { __typename?: 'Contacts' }
    & Pick<Contacts, 'emails'>
    & { formattedPhones: Array<(
      { __typename?: 'FormattedPhone' }
      & Pick<FormattedPhone, 'raw' | 'readable'>
    )> }
  ), logo: (
    { __typename?: 'Asset' }
    & Pick<Asset, 'index' | 'url'>
  ) }
);

export type CmsOrderProductFragment = (
  { __typename?: 'OrderProduct' }
  & Pick<OrderProduct, '_id' | 'itemId' | 'amount' | 'formattedPrice' | 'formattedTotalPrice'>
  & { shopProduct?: Maybe<(
    { __typename?: 'ShopProduct' }
    & CmsOrderShopProductFragment
  )>, shop?: Maybe<(
    { __typename?: 'Shop' }
    & CmsOrderShopFragment
  )> }
);

export type CmsOrderFragment = (
  { __typename?: 'Order' }
  & Pick<Order, '_id' | 'itemId' | 'productsCount' | 'formattedTotalPrice' | 'comment' | 'createdAt'>
  & { products: Array<(
    { __typename?: 'OrderProduct' }
    & CmsOrderProductFragment
  )>, status: (
    { __typename?: 'OrderStatus' }
    & OrderStatusFragment
  ), customer: (
    { __typename?: 'OrderCustomer' }
    & CmsOrderInListCustomerFragment
  ) }
);

export type GetCmsOrderQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetCmsOrderQuery = (
  { __typename?: 'Query' }
  & { getOrder: (
    { __typename?: 'Order' }
    & CmsOrderFragment
  ) }
);

export type MyOrderShopProductFragment = (
  { __typename?: 'ShopProduct' }
  & Pick<ShopProduct, '_id' | 'available' | 'inCartCount'>
  & { product: (
    { __typename?: 'Product' }
    & Pick<Product, '_id' | 'slug' | 'itemId' | 'mainImage'>
  ) }
);

export type MyOrderShopFragment = (
  { __typename?: 'Shop' }
  & Pick<Shop, '_id' | 'name' | 'slug'>
  & { address: (
    { __typename?: 'Address' }
    & Pick<Address, 'formattedAddress'>
    & { formattedCoordinates: (
      { __typename?: 'Coordinates' }
      & Pick<Coordinates, 'lat' | 'lng'>
    ) }
  ) }
);

export type MyOrderProductFragment = (
  { __typename?: 'OrderProduct' }
  & Pick<OrderProduct, '_id' | 'itemId' | 'amount' | 'formattedPrice' | 'formattedTotalPrice' | 'formattedOldPrice' | 'discountedPercent' | 'name'>
  & { shopProduct?: Maybe<(
    { __typename?: 'ShopProduct' }
    & MyOrderShopProductFragment
  )>, shop?: Maybe<(
    { __typename?: 'Shop' }
    & MyOrderShopFragment
  )> }
);

export type MyOrderFragment = (
  { __typename?: 'Order' }
  & Pick<Order, '_id' | 'itemId' | 'productsCount' | 'formattedTotalPrice' | 'comment' | 'createdAt'>
  & { products: Array<(
    { __typename?: 'OrderProduct' }
    & MyOrderProductFragment
  )>, status: (
    { __typename?: 'OrderStatus' }
    & OrderStatusFragment
  ) }
);

export type GetAllMyOrdersQueryVariables = Exact<{
  input?: Maybe<PaginationInput>;
}>;


export type GetAllMyOrdersQuery = (
  { __typename?: 'Query' }
  & { getAllMyOrders?: Maybe<(
    { __typename?: 'OrdersPaginationPayload' }
    & Pick<OrdersPaginationPayload, 'totalDocs' | 'page' | 'totalPages'>
    & { docs: Array<(
      { __typename?: 'Order' }
      & MyOrderFragment
    )> }
  )> }
);

export type CmsRoleFragment = (
  { __typename?: 'Role' }
  & Pick<Role, '_id' | 'name' | 'slug' | 'isStuff' | 'description' | 'nameI18n'>
);

export type GetAllRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRolesQuery = (
  { __typename?: 'Query' }
  & { getAllRoles: Array<(
    { __typename?: 'Role' }
    & CmsRoleFragment
  )> }
);

export type GetRoleQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetRoleQuery = (
  { __typename?: 'Query' }
  & { getRole?: Maybe<(
    { __typename?: 'Role' }
    & CmsRoleFragment
  )> }
);

export type RubricVariantFragment = (
  { __typename?: 'RubricVariant' }
  & Pick<RubricVariant, '_id' | 'name' | 'nameI18n'>
);

export type GetAllRubricVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRubricVariantsQuery = (
  { __typename?: 'Query' }
  & { getAllRubricVariants: Array<(
    { __typename?: 'RubricVariant' }
    & RubricVariantFragment
  )>, getGenderOptions: Array<(
    { __typename?: 'SelectOption' }
    & Pick<SelectOption, '_id' | 'name'>
  )> }
);

export type GetCatalogueSearchTopItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCatalogueSearchTopItemsQuery = (
  { __typename?: 'Query' }
  & { getCatalogueSearchTopItems: (
    { __typename?: 'CatalogueSearchResult' }
    & { rubrics: Array<(
      { __typename?: 'Rubric' }
      & CatalogueRubricFragment
    )>, products: Array<(
      { __typename?: 'Product' }
      & ProductSnippetFragment
    )> }
  ) }
);

export type GetCatalogueSearchResultQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type GetCatalogueSearchResultQuery = (
  { __typename?: 'Query' }
  & { getCatalogueSearchResult: (
    { __typename?: 'CatalogueSearchResult' }
    & { rubrics: Array<(
      { __typename?: 'Rubric' }
      & CatalogueRubricFragment
    )>, products: Array<(
      { __typename?: 'Product' }
      & ProductSnippetFragment
    )> }
  ) }
);

export type SelectOptionFragment = (
  { __typename?: 'SelectOption' }
  & Pick<SelectOption, '_id' | 'name' | 'icon'>
);

export type GetGenderOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenderOptionsQuery = (
  { __typename?: 'Query' }
  & { getGenderOptions: Array<(
    { __typename?: 'SelectOption' }
    & SelectOptionFragment
  )> }
);

export type AttributeViewVariantOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AttributeViewVariantOptionsQuery = (
  { __typename?: 'Query' }
  & { getAttributeViewVariantsOptions: Array<(
    { __typename?: 'SelectOption' }
    & SelectOptionFragment
  )> }
);

export type IconsOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type IconsOptionsQuery = (
  { __typename?: 'Query' }
  & { getIconsOptions: Array<(
    { __typename?: 'SelectOption' }
    & SelectOptionFragment
  )> }
);

export type OptionsGroupVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type OptionsGroupVariantsQuery = (
  { __typename?: 'Query' }
  & { getOptionsGroupVariantsOptions: Array<(
    { __typename?: 'SelectOption' }
    & SelectOptionFragment
  )> }
);

export type GetIsoLanguagesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIsoLanguagesListQuery = (
  { __typename?: 'Query' }
  & { getISOLanguagesOptions: Array<(
    { __typename?: 'SelectOption' }
    & SelectOptionFragment
  )> }
);

export type GetNewAttributeOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNewAttributeOptionsQuery = (
  { __typename?: 'Query' }
  & { getAllOptionsGroups: Array<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, '_id' | 'name'>
  )>, getAllMetricsOptions: Array<(
    { __typename?: 'Metric' }
    & Pick<Metric, '_id' | 'name'>
  )>, getAttributeVariantsOptions: Array<(
    { __typename?: 'SelectOption' }
    & Pick<SelectOption, '_id' | 'name'>
  )>, getAttributePositioningOptions: Array<(
    { __typename?: 'SelectOption' }
    & Pick<SelectOption, '_id' | 'name'>
  )>, getAttributeViewVariantsOptions: Array<(
    { __typename?: 'SelectOption' }
    & SelectOptionFragment
  )> }
);

export type UserInListFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'itemId' | 'email' | 'fullName' | 'shortName'>
  & { formattedPhone: (
    { __typename?: 'FormattedPhone' }
    & Pick<FormattedPhone, 'raw' | 'readable'>
  ), role: (
    { __typename?: 'Role' }
    & Pick<Role, '_id' | 'name'>
  ) }
);

export type UsersSerchQueryVariables = Exact<{
  input: PaginationInput;
}>;


export type UsersSerchQuery = (
  { __typename?: 'Query' }
  & { getAllUsers: (
    { __typename?: 'UsersPaginationPayload' }
    & Pick<UsersPaginationPayload, 'totalDocs' | 'page' | 'totalPages'>
    & { docs: Array<(
      { __typename?: 'User' }
      & UserInListFragment
    )> }
  ) }
);

export const CmsProductAttributeFragmentDoc = gql`
    fragment CMSProductAttribute on ProductAttribute {
  attributeId
  attributeSlug
  showInCard
  selectedOptionsSlugs
  attribute {
    _id
    slug
    name
    variant
    viewVariant
    metric {
      _id
      name
    }
    options {
      _id
      name
      color
    }
  }
}
    `;
export const CmsProductConnectionItemFragmentDoc = gql`
    fragment CmsProductConnectionItem on ProductConnectionItem {
  option {
    _id
    name
  }
  productId
  product {
    _id
    itemId
    active
    name
    slug
    mainImage
  }
}
    `;
export const CmsProductConnectionFragmentDoc = gql`
    fragment CmsProductConnection on ProductConnection {
  _id
  attributeId
  attributeName
  connectionProducts {
    ...CmsProductConnectionItem
  }
}
    ${CmsProductConnectionItemFragmentDoc}`;
export const CmsProductFieldsFragmentDoc = gql`
    fragment CMSProductFields on Product {
  _id
  itemId
  nameI18n
  name
  originalName
  slug
  descriptionI18n
  description
  assets {
    url
    index
  }
  active
  mainImage
  rubricId
  rubric {
    _id
    slug
    name
  }
  brandSlug
  brandCollectionSlug
  manufacturerSlug
  attributes {
    ...CMSProductAttribute
  }
  connections {
    ...CmsProductConnection
  }
}
    ${CmsProductAttributeFragmentDoc}
${CmsProductConnectionFragmentDoc}`;
export const CmsProductFragmentDoc = gql`
    fragment CMSProduct on Product {
  ...CMSProductFields
}
    ${CmsProductFieldsFragmentDoc}`;
export const ProductAttributeAstFragmentDoc = gql`
    fragment ProductAttributeAst on ProductAttribute {
  _id
  showInCard
  showAsBreadcrumb
  attributeId
  attributeSlug
  textI18n
  number
  selectedOptionsSlugs
  attributeName
  attributeNameI18n
  attributeSlug
  attributeVariant
  attributeViewVariant
  attribute {
    _id
    name
    variant
    metric {
      _id
      name
    }
    options {
      _id
      slug
      name
    }
  }
}
    `;
export const BrandCollectionsOptionFragmentDoc = gql`
    fragment BrandCollectionsOption on BrandCollection {
  _id
  slug
  name
}
    `;
export const RubricInListFragmentDoc = gql`
    fragment RubricInList on Rubric {
  _id
  nameI18n
  slug
  name
  productsCount
  activeProductsCount
  variant {
    _id
    name
  }
}
    `;
export const RubricProductFragmentDoc = gql`
    fragment RubricProduct on Product {
  _id
  itemId
  nameI18n
  name
  slug
  mainImage
  active
  rubricId
}
    `;
export const RubricProductsPaginationFragmentDoc = gql`
    fragment RubricProductsPagination on ProductsPaginationPayload {
  totalDocs
  page
  totalPages
  totalActiveDocs
  docs {
    ...RubricProduct
  }
}
    ${RubricProductFragmentDoc}`;
export const RubricAttributeFragmentDoc = gql`
    fragment RubricAttribute on RubricAttribute {
  _id
  name
  variant
  metric {
    _id
    name
  }
  optionsGroupId
  optionsGroup {
    _id
    name
  }
  showInCatalogueFilter
  showInCatalogueNav
}
    `;
export const RubricAttributesGroupFragmentDoc = gql`
    fragment RubricAttributesGroup on RubricAttributesGroup {
  _id
  name
  attributes {
    ...RubricAttribute
  }
}
    ${RubricAttributeFragmentDoc}`;
export const SnippetConnectionItemFragmentDoc = gql`
    fragment SnippetConnectionItem on ProductConnectionItem {
  _id
  productId
  option {
    _id
    name
  }
}
    `;
export const SnippetConnectionFragmentDoc = gql`
    fragment SnippetConnection on ProductConnection {
  _id
  attributeName
  connectionProducts {
    ...SnippetConnectionItem
  }
}
    ${SnippetConnectionItemFragmentDoc}`;
export const ProductSnippetFragmentDoc = gql`
    fragment ProductSnippet on Product {
  _id
  itemId
  name
  originalName
  slug
  mainImage
  shopsCount
  isCustomersChoice
  listFeatures {
    _id
    attributeId
    attributeName
    readableValue
    attributeMetric {
      _id
      name
    }
  }
  ratingFeatures {
    _id
    attributeId
    attributeName
    readableValue
    attributeMetric {
      _id
      name
    }
  }
  connections {
    ...SnippetConnection
  }
  cardPrices {
    _id
    min
    max
  }
}
    ${SnippetConnectionFragmentDoc}`;
export const ShopSnippetFragmentDoc = gql`
    fragment ShopSnippet on Shop {
  _id
  name
  slug
  productsCount
  address {
    formattedAddress
    formattedCoordinates {
      lat
      lng
    }
  }
  contacts {
    formattedPhones {
      raw
      readable
    }
  }
  assets {
    index
    url
  }
  logo {
    index
    url
  }
}
    `;
export const ShopProductSnippetFragmentDoc = gql`
    fragment ShopProductSnippet on ShopProduct {
  _id
  available
  formattedPrice
  formattedOldPrice
  discountedPercent
  inCartCount
  shop {
    ...ShopSnippet
  }
}
    ${ShopSnippetFragmentDoc}`;
export const CartProductFragmentDoc = gql`
    fragment CartProduct on CartProduct {
  _id
  amount
  formattedTotalPrice
  isShopless
  product {
    ...ProductSnippet
  }
  shopProduct {
    ...ShopProductSnippet
    product {
      ...ProductSnippet
    }
  }
}
    ${ProductSnippetFragmentDoc}
${ShopProductSnippetFragmentDoc}`;
export const CartFragmentDoc = gql`
    fragment Cart on Cart {
  _id
  formattedTotalPrice
  productsCount
  isWithShopless
  cartProducts {
    ...CartProduct
  }
}
    ${CartProductFragmentDoc}`;
export const CartPayloadFragmentDoc = gql`
    fragment CartPayload on CartPayload {
  success
  message
  payload {
    ...Cart
  }
}
    ${CartFragmentDoc}`;
export const OrderInCartFragmentDoc = gql`
    fragment OrderInCart on Order {
  _id
  itemId
}
    `;
export const MakeAnOrderPayloadFragmentDoc = gql`
    fragment MakeAnOrderPayload on MakeAnOrderPayload {
  success
  message
  cart {
    ...Cart
  }
  order {
    ...OrderInCart
  }
}
    ${CartFragmentDoc}
${OrderInCartFragmentDoc}`;
export const AttributeInGroupFragmentDoc = gql`
    fragment AttributeInGroup on Attribute {
  _id
  nameI18n
  name
  variant
  viewVariant
  positioningInTitle
  optionsGroupId
  optionsGroup {
    _id
    name
  }
  metric {
    _id
    name
  }
}
    `;
export const CardFeatureFragmentDoc = gql`
    fragment CardFeature on ProductAttribute {
  _id
  showInCard
  text
  number
  attributeName
  attributeViewVariant
  readableValue
  selectedOptions {
    _id
    slug
    name
    icon
  }
}
    `;
export const CardConnectionProductFragmentDoc = gql`
    fragment CardConnectionProduct on Product {
  _id
  slug
}
    `;
export const CardConnectionItemFragmentDoc = gql`
    fragment CardConnectionItem on ProductConnectionItem {
  _id
  option {
    _id
    name
  }
  product {
    ...CardConnectionProduct
  }
}
    ${CardConnectionProductFragmentDoc}`;
export const CardConnectionFragmentDoc = gql`
    fragment CardConnection on ProductConnection {
  _id
  attributeName
  connectionProducts {
    ...CardConnectionItem
  }
}
    ${CardConnectionItemFragmentDoc}`;
export const ProductCardFragmentDoc = gql`
    fragment ProductCard on Product {
  _id
  itemId
  name
  originalName
  slug
  mainImage
  description
  cardPrices {
    _id
    min
    max
  }
  shopsCount
  isCustomersChoice
  cardShopProducts {
    ...ShopProductSnippet
  }
  listFeatures {
    ...CardFeature
  }
  textFeatures {
    ...CardFeature
  }
  tagFeatures {
    ...CardFeature
  }
  iconFeatures {
    ...CardFeature
  }
  ratingFeatures {
    ...CardFeature
  }
  connections {
    ...CardConnection
  }
}
    ${ShopProductSnippetFragmentDoc}
${CardFeatureFragmentDoc}
${CardConnectionFragmentDoc}`;
export const CatalogueRubricFragmentDoc = gql`
    fragment CatalogueRubric on Rubric {
  _id
  name
  slug
  variant {
    _id
    name
  }
}
    `;
export const CatalogueFilterAttributeOptionFragmentDoc = gql`
    fragment CatalogueFilterAttributeOption on CatalogueFilterAttributeOption {
  _id
  name
  slug
  nextSlug
  isSelected
}
    `;
export const CatalogueFilterAttributeFragmentDoc = gql`
    fragment CatalogueFilterAttribute on CatalogueFilterAttribute {
  _id
  slug
  clearSlug
  isSelected
  name
  options {
    ...CatalogueFilterAttributeOption
  }
}
    ${CatalogueFilterAttributeOptionFragmentDoc}`;
export const CatalogueDataFragmentDoc = gql`
    fragment CatalogueData on CatalogueData {
  _id
  lastProductId
  hasMore
  clearSlug
  filter
  catalogueTitle
  rubric {
    ...CatalogueRubric
  }
  products {
    ...ProductSnippet
  }
  totalProducts
  catalogueTitle
  attributes {
    ...CatalogueFilterAttribute
  }
  selectedAttributes {
    ...CatalogueFilterAttribute
  }
}
    ${CatalogueRubricFragmentDoc}
${ProductSnippetFragmentDoc}
${CatalogueFilterAttributeFragmentDoc}`;
export const CompanyInListFragmentDoc = gql`
    fragment CompanyInList on Company {
  _id
  itemId
  slug
  name
  ownerId
  staffIds
  domain
  owner {
    _id
    fullName
  }
  logo {
    url
  }
}
    `;
export const ShopInListFragmentDoc = gql`
    fragment ShopInList on Shop {
  _id
  itemId
  slug
  name
  companyId
  city {
    _id
    name
    slug
  }
  logo {
    index
    url
  }
}
    `;
export const UserInListFragmentDoc = gql`
    fragment UserInList on User {
  _id
  itemId
  email
  fullName
  shortName
  formattedPhone {
    raw
    readable
  }
  role {
    _id
    name
  }
}
    `;
export const CompanyFragmentDoc = gql`
    fragment Company on Company {
  _id
  itemId
  slug
  name
  ownerId
  staffIds
  domain
  staff {
    ...UserInList
  }
  owner {
    ...UserInList
  }
  logo {
    index
    url
  }
  contacts {
    emails
    phones
  }
}
    ${UserInListFragmentDoc}`;
export const ShopProductNodeFragmentDoc = gql`
    fragment ShopProductNode on Product {
  _id
  itemId
  name
  mainImage
}
    `;
export const ShopProductFragmentDoc = gql`
    fragment ShopProduct on ShopProduct {
  _id
  available
  price
  product {
    ...ShopProductNode
  }
}
    ${ShopProductNodeFragmentDoc}`;
export const ShopFragmentDoc = gql`
    fragment Shop on Shop {
  _id
  slug
  itemId
  name
  companyId
  contacts {
    emails
    phones
  }
  city {
    _id
    name
    slug
  }
  address {
    formattedAddress
    point {
      coordinates
    }
  }
  logo {
    index
    url
  }
  assets {
    index
    url
  }
}
    `;
export const AppNavItemFragmentDoc = gql`
    fragment AppNavItem on NavItem {
  _id
  name
  icon
  path
}
    `;
export const AppNavParentItemFragmentDoc = gql`
    fragment AppNavParentItem on NavItem {
  ...AppNavItem
  appNavigationChildren {
    ...AppNavItem
  }
}
    ${AppNavItemFragmentDoc}`;
export const SessionRoleFragmentFragmentDoc = gql`
    fragment SessionRoleFragment on Role {
  _id
  name
  slug
  isStuff
  appNavigation {
    ...AppNavParentItem
  }
  cmsNavigation {
    ...AppNavParentItem
  }
}
    ${AppNavParentItemFragmentDoc}`;
export const SessionUserFragmentDoc = gql`
    fragment SessionUser on User {
  _id
  email
  name
  secondName
  lastName
  fullName
  shortName
  phone
  role {
    ...SessionRoleFragment
  }
}
    ${SessionRoleFragmentFragmentDoc}`;
export const RubricNavItemAttributeOptionFragmentDoc = gql`
    fragment RubricNavItemAttributeOption on RubricOption {
  _id
  slug
  name
}
    `;
export const RubricNavItemAttributeFragmentDoc = gql`
    fragment RubricNavItemAttribute on RubricAttribute {
  _id
  name
  options {
    ...RubricNavItemAttributeOption
  }
}
    ${RubricNavItemAttributeOptionFragmentDoc}`;
export const CatalogueNavRubricFragmentDoc = gql`
    fragment CatalogueNavRubric on Rubric {
  _id
  name
  slug
  variant {
    _id
    name
  }
  navItems {
    ...RubricNavItemAttribute
  }
}
    ${RubricNavItemAttributeFragmentDoc}`;
export const InitialQueryLanguageFragmentDoc = gql`
    fragment InitialQueryLanguage on Language {
  _id
  slug
  name
  nativeName
}
    `;
export const InitialQueryCityFragmentDoc = gql`
    fragment InitialQueryCity on City {
  _id
  slug
  name
}
    `;
export const SiteConfigFragmentDoc = gql`
    fragment SiteConfig on Config {
  _id
  slug
  value
  singleValue
  name
  description
  variant
  acceptedFormats
  multi
  cities
}
    `;
export const InitialDataFragmentDoc = gql`
    fragment InitialData on Query {
  getSessionCurrency
  getAllLanguages {
    ...InitialQueryLanguage
  }
  getSessionCities {
    ...InitialQueryCity
  }
  getAllConfigs {
    ...SiteConfig
  }
}
    ${InitialQueryLanguageFragmentDoc}
${InitialQueryCityFragmentDoc}
${SiteConfigFragmentDoc}`;
export const LanguageFragmentDoc = gql`
    fragment Language on Language {
  _id
  name
  slug
  nativeName
}
    `;
export const MessageFragmentDoc = gql`
    fragment Message on Message {
  _id
  slug
  messageI18n
  message
}
    `;
export const OptionsGroupInlistFragmentDoc = gql`
    fragment OptionsGroupInlist on OptionsGroup {
  _id
  name
  options {
    _id
  }
}
    `;
export const OptionInGroupFragmentDoc = gql`
    fragment OptionInGroup on Option {
  _id
  nameI18n
  name
  color
  icon
  gender
  variants
}
    `;
export const OptionsGroupFragmentDoc = gql`
    fragment OptionsGroup on OptionsGroup {
  _id
  nameI18n
  variant
  name
  options {
    ...OptionInGroup
  }
}
    ${OptionInGroupFragmentDoc}`;
export const OrderStatusFragmentDoc = gql`
    fragment OrderStatus on OrderStatus {
  _id
  name
  color
}
    `;
export const CmsOrderInListCustomerFragmentDoc = gql`
    fragment CmsOrderInListCustomer on OrderCustomer {
  _id
  itemId
  shortName
  formattedPhone {
    raw
    readable
  }
  email
}
    `;
export const CmsOrderInListFragmentDoc = gql`
    fragment CmsOrderInList on Order {
  _id
  itemId
  productsCount
  formattedTotalPrice
  comment
  createdAt
  status {
    ...OrderStatus
  }
  customer {
    ...CmsOrderInListCustomer
  }
}
    ${OrderStatusFragmentDoc}
${CmsOrderInListCustomerFragmentDoc}`;
export const CmsOrderShopProductFragmentDoc = gql`
    fragment CmsOrderShopProduct on ShopProduct {
  _id
  product {
    _id
    mainImage
  }
}
    `;
export const CmsOrderShopFragmentDoc = gql`
    fragment CmsOrderShop on Shop {
  _id
  name
  slug
  address {
    formattedAddress
    formattedCoordinates {
      lat
      lng
    }
  }
  contacts {
    emails
    formattedPhones {
      raw
      readable
    }
  }
  logo {
    index
    url
  }
}
    `;
export const CmsOrderProductFragmentDoc = gql`
    fragment CmsOrderProduct on OrderProduct {
  _id
  itemId
  amount
  formattedPrice
  formattedTotalPrice
  shopProduct {
    ...CmsOrderShopProduct
  }
  shop {
    ...CmsOrderShop
  }
}
    ${CmsOrderShopProductFragmentDoc}
${CmsOrderShopFragmentDoc}`;
export const CmsOrderFragmentDoc = gql`
    fragment CmsOrder on Order {
  _id
  itemId
  productsCount
  formattedTotalPrice
  comment
  createdAt
  products {
    ...CmsOrderProduct
  }
  status {
    ...OrderStatus
  }
  customer {
    ...CmsOrderInListCustomer
  }
}
    ${CmsOrderProductFragmentDoc}
${OrderStatusFragmentDoc}
${CmsOrderInListCustomerFragmentDoc}`;
export const MyOrderShopProductFragmentDoc = gql`
    fragment MyOrderShopProduct on ShopProduct {
  _id
  available
  inCartCount
  product {
    _id
    slug
    itemId
    mainImage
  }
}
    `;
export const MyOrderShopFragmentDoc = gql`
    fragment MyOrderShop on Shop {
  _id
  name
  slug
  address {
    formattedAddress
    formattedCoordinates {
      lat
      lng
    }
  }
}
    `;
export const MyOrderProductFragmentDoc = gql`
    fragment MyOrderProduct on OrderProduct {
  _id
  itemId
  amount
  formattedPrice
  formattedTotalPrice
  formattedOldPrice
  discountedPercent
  name
  shopProduct {
    ...MyOrderShopProduct
  }
  shop {
    ...MyOrderShop
  }
}
    ${MyOrderShopProductFragmentDoc}
${MyOrderShopFragmentDoc}`;
export const MyOrderFragmentDoc = gql`
    fragment MyOrder on Order {
  _id
  itemId
  productsCount
  formattedTotalPrice
  comment
  createdAt
  products {
    ...MyOrderProduct
  }
  status {
    ...OrderStatus
  }
}
    ${MyOrderProductFragmentDoc}
${OrderStatusFragmentDoc}`;
export const CmsRoleFragmentDoc = gql`
    fragment CmsRole on Role {
  _id
  name
  slug
  isStuff
  description
  nameI18n
}
    `;
export const RubricVariantFragmentDoc = gql`
    fragment RubricVariant on RubricVariant {
  _id
  name
  nameI18n
}
    `;
export const SelectOptionFragmentDoc = gql`
    fragment SelectOption on SelectOption {
  _id
  name
  icon
}
    `;
export const GetProductDocument = gql`
    query GetProduct($_id: ObjectId!) {
  getProduct(_id: $_id) {
    ...CMSProduct
  }
}
    ${CmsProductFragmentDoc}`;

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions: Apollo.QueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;
export const GetProductAttributesAstDocument = gql`
    query GetProductAttributesAST($input: ProductAttributesASTInput!) {
  getProductAttributesAST(input: $input) {
    ...ProductAttributeAst
  }
}
    ${ProductAttributeAstFragmentDoc}`;

/**
 * __useGetProductAttributesAstQuery__
 *
 * To run a query within a React component, call `useGetProductAttributesAstQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductAttributesAstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductAttributesAstQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetProductAttributesAstQuery(baseOptions: Apollo.QueryHookOptions<GetProductAttributesAstQuery, GetProductAttributesAstQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductAttributesAstQuery, GetProductAttributesAstQueryVariables>(GetProductAttributesAstDocument, options);
      }
export function useGetProductAttributesAstLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductAttributesAstQuery, GetProductAttributesAstQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductAttributesAstQuery, GetProductAttributesAstQueryVariables>(GetProductAttributesAstDocument, options);
        }
export type GetProductAttributesAstQueryHookResult = ReturnType<typeof useGetProductAttributesAstQuery>;
export type GetProductAttributesAstLazyQueryHookResult = ReturnType<typeof useGetProductAttributesAstLazyQuery>;
export type GetProductAttributesAstQueryResult = Apollo.QueryResult<GetProductAttributesAstQuery, GetProductAttributesAstQueryVariables>;
export const GetProductBrandsOptionsDocument = gql`
    query GetProductBrandsOptions {
  getBrandsOptions {
    _id
    slug
    name
    collectionsList {
      ...BrandCollectionsOption
    }
  }
  getManufacturersOptions {
    _id
    slug
    name
  }
}
    ${BrandCollectionsOptionFragmentDoc}`;

/**
 * __useGetProductBrandsOptionsQuery__
 *
 * To run a query within a React component, call `useGetProductBrandsOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductBrandsOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductBrandsOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProductBrandsOptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductBrandsOptionsQuery, GetProductBrandsOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductBrandsOptionsQuery, GetProductBrandsOptionsQueryVariables>(GetProductBrandsOptionsDocument, options);
      }
export function useGetProductBrandsOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductBrandsOptionsQuery, GetProductBrandsOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductBrandsOptionsQuery, GetProductBrandsOptionsQueryVariables>(GetProductBrandsOptionsDocument, options);
        }
export type GetProductBrandsOptionsQueryHookResult = ReturnType<typeof useGetProductBrandsOptionsQuery>;
export type GetProductBrandsOptionsLazyQueryHookResult = ReturnType<typeof useGetProductBrandsOptionsLazyQuery>;
export type GetProductBrandsOptionsQueryResult = Apollo.QueryResult<GetProductBrandsOptionsQuery, GetProductBrandsOptionsQueryVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    success
    message
    payload {
      ...CMSProduct
    }
  }
}
    ${CmsProductFragmentDoc}`;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const AddProductAssetsDocument = gql`
    mutation AddProductAssets($input: AddProductAssetsInput!) {
  addProductAssets(input: $input) {
    success
    message
    payload {
      ...CMSProduct
    }
  }
}
    ${CmsProductFragmentDoc}`;
export type AddProductAssetsMutationFn = Apollo.MutationFunction<AddProductAssetsMutation, AddProductAssetsMutationVariables>;

/**
 * __useAddProductAssetsMutation__
 *
 * To run a mutation, you first call `useAddProductAssetsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductAssetsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductAssetsMutation, { data, loading, error }] = useAddProductAssetsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProductAssetsMutation(baseOptions?: Apollo.MutationHookOptions<AddProductAssetsMutation, AddProductAssetsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductAssetsMutation, AddProductAssetsMutationVariables>(AddProductAssetsDocument, options);
      }
export type AddProductAssetsMutationHookResult = ReturnType<typeof useAddProductAssetsMutation>;
export type AddProductAssetsMutationResult = Apollo.MutationResult<AddProductAssetsMutation>;
export type AddProductAssetsMutationOptions = Apollo.BaseMutationOptions<AddProductAssetsMutation, AddProductAssetsMutationVariables>;
export const DeleteProductAssetDocument = gql`
    mutation DeleteProductAsset($input: DeleteProductAssetInput!) {
  deleteProductAsset(input: $input) {
    success
    message
    payload {
      ...CMSProduct
    }
  }
}
    ${CmsProductFragmentDoc}`;
export type DeleteProductAssetMutationFn = Apollo.MutationFunction<DeleteProductAssetMutation, DeleteProductAssetMutationVariables>;

/**
 * __useDeleteProductAssetMutation__
 *
 * To run a mutation, you first call `useDeleteProductAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductAssetMutation, { data, loading, error }] = useDeleteProductAssetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteProductAssetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductAssetMutation, DeleteProductAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductAssetMutation, DeleteProductAssetMutationVariables>(DeleteProductAssetDocument, options);
      }
export type DeleteProductAssetMutationHookResult = ReturnType<typeof useDeleteProductAssetMutation>;
export type DeleteProductAssetMutationResult = Apollo.MutationResult<DeleteProductAssetMutation>;
export type DeleteProductAssetMutationOptions = Apollo.BaseMutationOptions<DeleteProductAssetMutation, DeleteProductAssetMutationVariables>;
export const UpdateProductAssetIndexDocument = gql`
    mutation UpdateProductAssetIndex($input: UpdateProductAssetIndexInput!) {
  updateProductAssetIndex(input: $input) {
    success
    message
    payload {
      ...CMSProduct
    }
  }
}
    ${CmsProductFragmentDoc}`;
export type UpdateProductAssetIndexMutationFn = Apollo.MutationFunction<UpdateProductAssetIndexMutation, UpdateProductAssetIndexMutationVariables>;

/**
 * __useUpdateProductAssetIndexMutation__
 *
 * To run a mutation, you first call `useUpdateProductAssetIndexMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductAssetIndexMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductAssetIndexMutation, { data, loading, error }] = useUpdateProductAssetIndexMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductAssetIndexMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductAssetIndexMutation, UpdateProductAssetIndexMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductAssetIndexMutation, UpdateProductAssetIndexMutationVariables>(UpdateProductAssetIndexDocument, options);
      }
export type UpdateProductAssetIndexMutationHookResult = ReturnType<typeof useUpdateProductAssetIndexMutation>;
export type UpdateProductAssetIndexMutationResult = Apollo.MutationResult<UpdateProductAssetIndexMutation>;
export type UpdateProductAssetIndexMutationOptions = Apollo.BaseMutationOptions<UpdateProductAssetIndexMutation, UpdateProductAssetIndexMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    success
    message
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const CreateProductConnectionDocument = gql`
    mutation CreateProductConnection($input: CreateProductConnectionInput!) {
  createProductConnection(input: $input) {
    success
    message
  }
}
    `;
export type CreateProductConnectionMutationFn = Apollo.MutationFunction<CreateProductConnectionMutation, CreateProductConnectionMutationVariables>;

/**
 * __useCreateProductConnectionMutation__
 *
 * To run a mutation, you first call `useCreateProductConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductConnectionMutation, { data, loading, error }] = useCreateProductConnectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductConnectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductConnectionMutation, CreateProductConnectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductConnectionMutation, CreateProductConnectionMutationVariables>(CreateProductConnectionDocument, options);
      }
export type CreateProductConnectionMutationHookResult = ReturnType<typeof useCreateProductConnectionMutation>;
export type CreateProductConnectionMutationResult = Apollo.MutationResult<CreateProductConnectionMutation>;
export type CreateProductConnectionMutationOptions = Apollo.BaseMutationOptions<CreateProductConnectionMutation, CreateProductConnectionMutationVariables>;
export const AddProductToConnectionDocument = gql`
    mutation AddProductToConnection($input: AddProductToConnectionInput!) {
  addProductToConnection(input: $input) {
    success
    message
  }
}
    `;
export type AddProductToConnectionMutationFn = Apollo.MutationFunction<AddProductToConnectionMutation, AddProductToConnectionMutationVariables>;

/**
 * __useAddProductToConnectionMutation__
 *
 * To run a mutation, you first call `useAddProductToConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductToConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductToConnectionMutation, { data, loading, error }] = useAddProductToConnectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProductToConnectionMutation(baseOptions?: Apollo.MutationHookOptions<AddProductToConnectionMutation, AddProductToConnectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductToConnectionMutation, AddProductToConnectionMutationVariables>(AddProductToConnectionDocument, options);
      }
export type AddProductToConnectionMutationHookResult = ReturnType<typeof useAddProductToConnectionMutation>;
export type AddProductToConnectionMutationResult = Apollo.MutationResult<AddProductToConnectionMutation>;
export type AddProductToConnectionMutationOptions = Apollo.BaseMutationOptions<AddProductToConnectionMutation, AddProductToConnectionMutationVariables>;
export const DeleteProductFromConnectionDocument = gql`
    mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
  deleteProductFromConnection(input: $input) {
    success
    message
  }
}
    `;
export type DeleteProductFromConnectionMutationFn = Apollo.MutationFunction<DeleteProductFromConnectionMutation, DeleteProductFromConnectionMutationVariables>;

/**
 * __useDeleteProductFromConnectionMutation__
 *
 * To run a mutation, you first call `useDeleteProductFromConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductFromConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductFromConnectionMutation, { data, loading, error }] = useDeleteProductFromConnectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteProductFromConnectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductFromConnectionMutation, DeleteProductFromConnectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductFromConnectionMutation, DeleteProductFromConnectionMutationVariables>(DeleteProductFromConnectionDocument, options);
      }
export type DeleteProductFromConnectionMutationHookResult = ReturnType<typeof useDeleteProductFromConnectionMutation>;
export type DeleteProductFromConnectionMutationResult = Apollo.MutationResult<DeleteProductFromConnectionMutation>;
export type DeleteProductFromConnectionMutationOptions = Apollo.BaseMutationOptions<DeleteProductFromConnectionMutation, DeleteProductFromConnectionMutationVariables>;
export const GetAllRubricsDocument = gql`
    query GetAllRubrics($input: GetAllRubricsInput) {
  getAllRubrics(input: $input) {
    ...RubricInList
  }
}
    ${RubricInListFragmentDoc}`;

/**
 * __useGetAllRubricsQuery__
 *
 * To run a query within a React component, call `useGetAllRubricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRubricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRubricsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAllRubricsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRubricsQuery, GetAllRubricsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRubricsQuery, GetAllRubricsQueryVariables>(GetAllRubricsDocument, options);
      }
export function useGetAllRubricsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRubricsQuery, GetAllRubricsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRubricsQuery, GetAllRubricsQueryVariables>(GetAllRubricsDocument, options);
        }
export type GetAllRubricsQueryHookResult = ReturnType<typeof useGetAllRubricsQuery>;
export type GetAllRubricsLazyQueryHookResult = ReturnType<typeof useGetAllRubricsLazyQuery>;
export type GetAllRubricsQueryResult = Apollo.QueryResult<GetAllRubricsQuery, GetAllRubricsQueryVariables>;
export const GetRubricDocument = gql`
    query GetRubric($_id: ObjectId!) {
  getRubric(_id: $_id) {
    ...RubricInList
    active
    variantId
    descriptionI18n
    shortDescriptionI18n
    catalogueTitle {
      defaultTitleI18n
      prefixI18n
      keywordI18n
      gender
    }
  }
}
    ${RubricInListFragmentDoc}`;

/**
 * __useGetRubricQuery__
 *
 * To run a query within a React component, call `useGetRubricQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubricQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetRubricQuery(baseOptions: Apollo.QueryHookOptions<GetRubricQuery, GetRubricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubricQuery, GetRubricQueryVariables>(GetRubricDocument, options);
      }
export function useGetRubricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricQuery, GetRubricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubricQuery, GetRubricQueryVariables>(GetRubricDocument, options);
        }
export type GetRubricQueryHookResult = ReturnType<typeof useGetRubricQuery>;
export type GetRubricLazyQueryHookResult = ReturnType<typeof useGetRubricLazyQuery>;
export type GetRubricQueryResult = Apollo.QueryResult<GetRubricQuery, GetRubricQueryVariables>;
export const GetRubricBySlugDocument = gql`
    query GetRubricBySlug($slug: String!) {
  getRubricBySlug(slug: $slug) {
    ...RubricInList
    active
    variantId
    descriptionI18n
    shortDescriptionI18n
    catalogueTitle {
      defaultTitleI18n
      prefixI18n
      keywordI18n
      gender
    }
  }
}
    ${RubricInListFragmentDoc}`;

/**
 * __useGetRubricBySlugQuery__
 *
 * To run a query within a React component, call `useGetRubricBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubricBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubricBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetRubricBySlugQuery(baseOptions: Apollo.QueryHookOptions<GetRubricBySlugQuery, GetRubricBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubricBySlugQuery, GetRubricBySlugQueryVariables>(GetRubricBySlugDocument, options);
      }
export function useGetRubricBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricBySlugQuery, GetRubricBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubricBySlugQuery, GetRubricBySlugQueryVariables>(GetRubricBySlugDocument, options);
        }
export type GetRubricBySlugQueryHookResult = ReturnType<typeof useGetRubricBySlugQuery>;
export type GetRubricBySlugLazyQueryHookResult = ReturnType<typeof useGetRubricBySlugLazyQuery>;
export type GetRubricBySlugQueryResult = Apollo.QueryResult<GetRubricBySlugQuery, GetRubricBySlugQueryVariables>;
export const CreateRubricDocument = gql`
    mutation CreateRubric($input: CreateRubricInput!) {
  createRubric(input: $input) {
    success
    message
  }
}
    `;
export type CreateRubricMutationFn = Apollo.MutationFunction<CreateRubricMutation, CreateRubricMutationVariables>;

/**
 * __useCreateRubricMutation__
 *
 * To run a mutation, you first call `useCreateRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRubricMutation, { data, loading, error }] = useCreateRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRubricMutation(baseOptions?: Apollo.MutationHookOptions<CreateRubricMutation, CreateRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRubricMutation, CreateRubricMutationVariables>(CreateRubricDocument, options);
      }
export type CreateRubricMutationHookResult = ReturnType<typeof useCreateRubricMutation>;
export type CreateRubricMutationResult = Apollo.MutationResult<CreateRubricMutation>;
export type CreateRubricMutationOptions = Apollo.BaseMutationOptions<CreateRubricMutation, CreateRubricMutationVariables>;
export const UpdateRubricDocument = gql`
    mutation UpdateRubric($input: UpdateRubricInput!) {
  updateRubric(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRubricMutationFn = Apollo.MutationFunction<UpdateRubricMutation, UpdateRubricMutationVariables>;

/**
 * __useUpdateRubricMutation__
 *
 * To run a mutation, you first call `useUpdateRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRubricMutation, { data, loading, error }] = useUpdateRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRubricMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRubricMutation, UpdateRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRubricMutation, UpdateRubricMutationVariables>(UpdateRubricDocument, options);
      }
export type UpdateRubricMutationHookResult = ReturnType<typeof useUpdateRubricMutation>;
export type UpdateRubricMutationResult = Apollo.MutationResult<UpdateRubricMutation>;
export type UpdateRubricMutationOptions = Apollo.BaseMutationOptions<UpdateRubricMutation, UpdateRubricMutationVariables>;
export const DeleteRubricDocument = gql`
    mutation DeleteRubric($_id: ObjectId!) {
  deleteRubric(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteRubricMutationFn = Apollo.MutationFunction<DeleteRubricMutation, DeleteRubricMutationVariables>;

/**
 * __useDeleteRubricMutation__
 *
 * To run a mutation, you first call `useDeleteRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRubricMutation, { data, loading, error }] = useDeleteRubricMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteRubricMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRubricMutation, DeleteRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRubricMutation, DeleteRubricMutationVariables>(DeleteRubricDocument, options);
      }
export type DeleteRubricMutationHookResult = ReturnType<typeof useDeleteRubricMutation>;
export type DeleteRubricMutationResult = Apollo.MutationResult<DeleteRubricMutation>;
export type DeleteRubricMutationOptions = Apollo.BaseMutationOptions<DeleteRubricMutation, DeleteRubricMutationVariables>;
export const GetRubricProductsDocument = gql`
    query GetRubricProducts($rubricSlug: String!, $productsInput: ProductsPaginationInput) {
  getRubricBySlug(slug: $rubricSlug) {
    _id
    name
    products(input: $productsInput) {
      ...RubricProductsPagination
    }
  }
}
    ${RubricProductsPaginationFragmentDoc}`;

/**
 * __useGetRubricProductsQuery__
 *
 * To run a query within a React component, call `useGetRubricProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubricProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubricProductsQuery({
 *   variables: {
 *      rubricSlug: // value for 'rubricSlug'
 *      productsInput: // value for 'productsInput'
 *   },
 * });
 */
export function useGetRubricProductsQuery(baseOptions: Apollo.QueryHookOptions<GetRubricProductsQuery, GetRubricProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubricProductsQuery, GetRubricProductsQueryVariables>(GetRubricProductsDocument, options);
      }
export function useGetRubricProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricProductsQuery, GetRubricProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubricProductsQuery, GetRubricProductsQueryVariables>(GetRubricProductsDocument, options);
        }
export type GetRubricProductsQueryHookResult = ReturnType<typeof useGetRubricProductsQuery>;
export type GetRubricProductsLazyQueryHookResult = ReturnType<typeof useGetRubricProductsLazyQuery>;
export type GetRubricProductsQueryResult = Apollo.QueryResult<GetRubricProductsQuery, GetRubricProductsQueryVariables>;
export const GetNonRubricProductsDocument = gql`
    query GetNonRubricProducts($input: ProductsPaginationInput!) {
  getProductsList(input: $input) {
    ...RubricProductsPagination
  }
}
    ${RubricProductsPaginationFragmentDoc}`;

/**
 * __useGetNonRubricProductsQuery__
 *
 * To run a query within a React component, call `useGetNonRubricProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNonRubricProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNonRubricProductsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetNonRubricProductsQuery(baseOptions: Apollo.QueryHookOptions<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>(GetNonRubricProductsDocument, options);
      }
export function useGetNonRubricProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>(GetNonRubricProductsDocument, options);
        }
export type GetNonRubricProductsQueryHookResult = ReturnType<typeof useGetNonRubricProductsQuery>;
export type GetNonRubricProductsLazyQueryHookResult = ReturnType<typeof useGetNonRubricProductsLazyQuery>;
export type GetNonRubricProductsQueryResult = Apollo.QueryResult<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>;
export const DeleteProductFromRubricDocument = gql`
    mutation DeleteProductFromRubric($input: DeleteProductFromRubricInput!) {
  deleteProductFromRubric(input: $input) {
    success
    message
  }
}
    `;
export type DeleteProductFromRubricMutationFn = Apollo.MutationFunction<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>;

/**
 * __useDeleteProductFromRubricMutation__
 *
 * To run a mutation, you first call `useDeleteProductFromRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductFromRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductFromRubricMutation, { data, loading, error }] = useDeleteProductFromRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteProductFromRubricMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>(DeleteProductFromRubricDocument, options);
      }
export type DeleteProductFromRubricMutationHookResult = ReturnType<typeof useDeleteProductFromRubricMutation>;
export type DeleteProductFromRubricMutationResult = Apollo.MutationResult<DeleteProductFromRubricMutation>;
export type DeleteProductFromRubricMutationOptions = Apollo.BaseMutationOptions<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>;
export const ToggleAttributeInRubricCatalogueDocument = gql`
    mutation ToggleAttributeInRubricCatalogue($input: UpdateAttributeInRubricInput!) {
  toggleAttributeInRubricCatalogue(input: $input) {
    success
    message
  }
}
    `;
export type ToggleAttributeInRubricCatalogueMutationFn = Apollo.MutationFunction<ToggleAttributeInRubricCatalogueMutation, ToggleAttributeInRubricCatalogueMutationVariables>;

/**
 * __useToggleAttributeInRubricCatalogueMutation__
 *
 * To run a mutation, you first call `useToggleAttributeInRubricCatalogueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAttributeInRubricCatalogueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAttributeInRubricCatalogueMutation, { data, loading, error }] = useToggleAttributeInRubricCatalogueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleAttributeInRubricCatalogueMutation(baseOptions?: Apollo.MutationHookOptions<ToggleAttributeInRubricCatalogueMutation, ToggleAttributeInRubricCatalogueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleAttributeInRubricCatalogueMutation, ToggleAttributeInRubricCatalogueMutationVariables>(ToggleAttributeInRubricCatalogueDocument, options);
      }
export type ToggleAttributeInRubricCatalogueMutationHookResult = ReturnType<typeof useToggleAttributeInRubricCatalogueMutation>;
export type ToggleAttributeInRubricCatalogueMutationResult = Apollo.MutationResult<ToggleAttributeInRubricCatalogueMutation>;
export type ToggleAttributeInRubricCatalogueMutationOptions = Apollo.BaseMutationOptions<ToggleAttributeInRubricCatalogueMutation, ToggleAttributeInRubricCatalogueMutationVariables>;
export const ToggleAttributeInRubricNavDocument = gql`
    mutation ToggleAttributeInRubricNav($input: UpdateAttributeInRubricInput!) {
  toggleAttributeInRubricNav(input: $input) {
    success
    message
  }
}
    `;
export type ToggleAttributeInRubricNavMutationFn = Apollo.MutationFunction<ToggleAttributeInRubricNavMutation, ToggleAttributeInRubricNavMutationVariables>;

/**
 * __useToggleAttributeInRubricNavMutation__
 *
 * To run a mutation, you first call `useToggleAttributeInRubricNavMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAttributeInRubricNavMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAttributeInRubricNavMutation, { data, loading, error }] = useToggleAttributeInRubricNavMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleAttributeInRubricNavMutation(baseOptions?: Apollo.MutationHookOptions<ToggleAttributeInRubricNavMutation, ToggleAttributeInRubricNavMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleAttributeInRubricNavMutation, ToggleAttributeInRubricNavMutationVariables>(ToggleAttributeInRubricNavDocument, options);
      }
export type ToggleAttributeInRubricNavMutationHookResult = ReturnType<typeof useToggleAttributeInRubricNavMutation>;
export type ToggleAttributeInRubricNavMutationResult = Apollo.MutationResult<ToggleAttributeInRubricNavMutation>;
export type ToggleAttributeInRubricNavMutationOptions = Apollo.BaseMutationOptions<ToggleAttributeInRubricNavMutation, ToggleAttributeInRubricNavMutationVariables>;
export const GetAllProductsDocument = gql`
    query GetAllProducts($input: ProductsPaginationInput!) {
  getProductsList(input: $input) {
    ...RubricProductsPagination
  }
}
    ${RubricProductsPaginationFragmentDoc}`;

/**
 * __useGetAllProductsQuery__
 *
 * To run a query within a React component, call `useGetAllProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProductsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAllProductsQuery(baseOptions: Apollo.QueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, options);
      }
export function useGetAllProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, options);
        }
export type GetAllProductsQueryHookResult = ReturnType<typeof useGetAllProductsQuery>;
export type GetAllProductsLazyQueryHookResult = ReturnType<typeof useGetAllProductsLazyQuery>;
export type GetAllProductsQueryResult = Apollo.QueryResult<GetAllProductsQuery, GetAllProductsQueryVariables>;
export const GetRubricAttributesDocument = gql`
    query GetRubricAttributes($rubricId: ObjectId!) {
  getRubric(_id: $rubricId) {
    _id
    attributesGroups {
      ...RubricAttributesGroup
    }
  }
}
    ${RubricAttributesGroupFragmentDoc}`;

/**
 * __useGetRubricAttributesQuery__
 *
 * To run a query within a React component, call `useGetRubricAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubricAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubricAttributesQuery({
 *   variables: {
 *      rubricId: // value for 'rubricId'
 *   },
 * });
 */
export function useGetRubricAttributesQuery(baseOptions: Apollo.QueryHookOptions<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>(GetRubricAttributesDocument, options);
      }
export function useGetRubricAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>(GetRubricAttributesDocument, options);
        }
export type GetRubricAttributesQueryHookResult = ReturnType<typeof useGetRubricAttributesQuery>;
export type GetRubricAttributesLazyQueryHookResult = ReturnType<typeof useGetRubricAttributesLazyQuery>;
export type GetRubricAttributesQueryResult = Apollo.QueryResult<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>;
export const CreateAttributesGroupDocument = gql`
    mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
  createAttributesGroup(input: $input) {
    success
    message
  }
}
    `;
export type CreateAttributesGroupMutationFn = Apollo.MutationFunction<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>;

/**
 * __useCreateAttributesGroupMutation__
 *
 * To run a mutation, you first call `useCreateAttributesGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttributesGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttributesGroupMutation, { data, loading, error }] = useCreateAttributesGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAttributesGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>(CreateAttributesGroupDocument, options);
      }
export type CreateAttributesGroupMutationHookResult = ReturnType<typeof useCreateAttributesGroupMutation>;
export type CreateAttributesGroupMutationResult = Apollo.MutationResult<CreateAttributesGroupMutation>;
export type CreateAttributesGroupMutationOptions = Apollo.BaseMutationOptions<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>;
export const UpdateAttributesGroupDocument = gql`
    mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
  updateAttributesGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributesGroupMutationFn = Apollo.MutationFunction<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>;

/**
 * __useUpdateAttributesGroupMutation__
 *
 * To run a mutation, you first call `useUpdateAttributesGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributesGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributesGroupMutation, { data, loading, error }] = useUpdateAttributesGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAttributesGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>(UpdateAttributesGroupDocument, options);
      }
export type UpdateAttributesGroupMutationHookResult = ReturnType<typeof useUpdateAttributesGroupMutation>;
export type UpdateAttributesGroupMutationResult = Apollo.MutationResult<UpdateAttributesGroupMutation>;
export type UpdateAttributesGroupMutationOptions = Apollo.BaseMutationOptions<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>;
export const DeleteAttributesGroupDocument = gql`
    mutation DeleteAttributesGroup($_id: ObjectId!) {
  deleteAttributesGroup(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteAttributesGroupMutationFn = Apollo.MutationFunction<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>;

/**
 * __useDeleteAttributesGroupMutation__
 *
 * To run a mutation, you first call `useDeleteAttributesGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributesGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributesGroupMutation, { data, loading, error }] = useDeleteAttributesGroupMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteAttributesGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>(DeleteAttributesGroupDocument, options);
      }
export type DeleteAttributesGroupMutationHookResult = ReturnType<typeof useDeleteAttributesGroupMutation>;
export type DeleteAttributesGroupMutationResult = Apollo.MutationResult<DeleteAttributesGroupMutation>;
export type DeleteAttributesGroupMutationOptions = Apollo.BaseMutationOptions<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>;
export const AddAttributeToGroupDocument = gql`
    mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
  addAttributeToGroup(input: $input) {
    success
    message
  }
}
    `;
export type AddAttributeToGroupMutationFn = Apollo.MutationFunction<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>;

/**
 * __useAddAttributeToGroupMutation__
 *
 * To run a mutation, you first call `useAddAttributeToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAttributeToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAttributeToGroupMutation, { data, loading, error }] = useAddAttributeToGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAttributeToGroupMutation(baseOptions?: Apollo.MutationHookOptions<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>(AddAttributeToGroupDocument, options);
      }
export type AddAttributeToGroupMutationHookResult = ReturnType<typeof useAddAttributeToGroupMutation>;
export type AddAttributeToGroupMutationResult = Apollo.MutationResult<AddAttributeToGroupMutation>;
export type AddAttributeToGroupMutationOptions = Apollo.BaseMutationOptions<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>;
export const UpdateAttributeInGroupDocument = gql`
    mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
  updateAttributeInGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributeInGroupMutationFn = Apollo.MutationFunction<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>;

/**
 * __useUpdateAttributeInGroupMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeInGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeInGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeInGroupMutation, { data, loading, error }] = useUpdateAttributeInGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAttributeInGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>(UpdateAttributeInGroupDocument, options);
      }
export type UpdateAttributeInGroupMutationHookResult = ReturnType<typeof useUpdateAttributeInGroupMutation>;
export type UpdateAttributeInGroupMutationResult = Apollo.MutationResult<UpdateAttributeInGroupMutation>;
export type UpdateAttributeInGroupMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>;
export const DeleteAttributeFromGroupDocument = gql`
    mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
  deleteAttributeFromGroup(input: $input) {
    success
    message
  }
}
    `;
export type DeleteAttributeFromGroupMutationFn = Apollo.MutationFunction<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>;

/**
 * __useDeleteAttributeFromGroupMutation__
 *
 * To run a mutation, you first call `useDeleteAttributeFromGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributeFromGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributeFromGroupMutation, { data, loading, error }] = useDeleteAttributeFromGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteAttributeFromGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>(DeleteAttributeFromGroupDocument, options);
      }
export type DeleteAttributeFromGroupMutationHookResult = ReturnType<typeof useDeleteAttributeFromGroupMutation>;
export type DeleteAttributeFromGroupMutationResult = Apollo.MutationResult<DeleteAttributeFromGroupMutation>;
export type DeleteAttributeFromGroupMutationOptions = Apollo.BaseMutationOptions<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>;
export const AddAttributesGroupToRubricDocument = gql`
    mutation AddAttributesGroupToRubric($input: AddAttributesGroupToRubricInput!) {
  addAttributesGroupToRubric(input: $input) {
    success
    message
  }
}
    `;
export type AddAttributesGroupToRubricMutationFn = Apollo.MutationFunction<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>;

/**
 * __useAddAttributesGroupToRubricMutation__
 *
 * To run a mutation, you first call `useAddAttributesGroupToRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAttributesGroupToRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAttributesGroupToRubricMutation, { data, loading, error }] = useAddAttributesGroupToRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAttributesGroupToRubricMutation(baseOptions?: Apollo.MutationHookOptions<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>(AddAttributesGroupToRubricDocument, options);
      }
export type AddAttributesGroupToRubricMutationHookResult = ReturnType<typeof useAddAttributesGroupToRubricMutation>;
export type AddAttributesGroupToRubricMutationResult = Apollo.MutationResult<AddAttributesGroupToRubricMutation>;
export type AddAttributesGroupToRubricMutationOptions = Apollo.BaseMutationOptions<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>;
export const DeleteAttributesGroupFromRubricDocument = gql`
    mutation DeleteAttributesGroupFromRubric($input: DeleteAttributesGroupFromRubricInput!) {
  deleteAttributesGroupFromRubric(input: $input) {
    success
    message
  }
}
    `;
export type DeleteAttributesGroupFromRubricMutationFn = Apollo.MutationFunction<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>;

/**
 * __useDeleteAttributesGroupFromRubricMutation__
 *
 * To run a mutation, you first call `useDeleteAttributesGroupFromRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributesGroupFromRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributesGroupFromRubricMutation, { data, loading, error }] = useDeleteAttributesGroupFromRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteAttributesGroupFromRubricMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>(DeleteAttributesGroupFromRubricDocument, options);
      }
export type DeleteAttributesGroupFromRubricMutationHookResult = ReturnType<typeof useDeleteAttributesGroupFromRubricMutation>;
export type DeleteAttributesGroupFromRubricMutationResult = Apollo.MutationResult<DeleteAttributesGroupFromRubricMutation>;
export type DeleteAttributesGroupFromRubricMutationOptions = Apollo.BaseMutationOptions<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>;
export const AddProductToCartDocument = gql`
    mutation AddProductToCart($input: AddProductToCartInput!) {
  addProductToCart(input: $input) {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type AddProductToCartMutationFn = Apollo.MutationFunction<AddProductToCartMutation, AddProductToCartMutationVariables>;

/**
 * __useAddProductToCartMutation__
 *
 * To run a mutation, you first call `useAddProductToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductToCartMutation, { data, loading, error }] = useAddProductToCartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProductToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddProductToCartMutation, AddProductToCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductToCartMutation, AddProductToCartMutationVariables>(AddProductToCartDocument, options);
      }
export type AddProductToCartMutationHookResult = ReturnType<typeof useAddProductToCartMutation>;
export type AddProductToCartMutationResult = Apollo.MutationResult<AddProductToCartMutation>;
export type AddProductToCartMutationOptions = Apollo.BaseMutationOptions<AddProductToCartMutation, AddProductToCartMutationVariables>;
export const AddShoplessProductToCartDocument = gql`
    mutation AddShoplessProductToCart($input: AddShoplessProductToCartInput!) {
  addShoplessProductToCart(input: $input) {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type AddShoplessProductToCartMutationFn = Apollo.MutationFunction<AddShoplessProductToCartMutation, AddShoplessProductToCartMutationVariables>;

/**
 * __useAddShoplessProductToCartMutation__
 *
 * To run a mutation, you first call `useAddShoplessProductToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddShoplessProductToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addShoplessProductToCartMutation, { data, loading, error }] = useAddShoplessProductToCartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddShoplessProductToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddShoplessProductToCartMutation, AddShoplessProductToCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddShoplessProductToCartMutation, AddShoplessProductToCartMutationVariables>(AddShoplessProductToCartDocument, options);
      }
export type AddShoplessProductToCartMutationHookResult = ReturnType<typeof useAddShoplessProductToCartMutation>;
export type AddShoplessProductToCartMutationResult = Apollo.MutationResult<AddShoplessProductToCartMutation>;
export type AddShoplessProductToCartMutationOptions = Apollo.BaseMutationOptions<AddShoplessProductToCartMutation, AddShoplessProductToCartMutationVariables>;
export const AddShopToCartProductDocument = gql`
    mutation AddShopToCartProduct($input: AddShopToCartProductInput!) {
  addShopToCartProduct(input: $input) {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type AddShopToCartProductMutationFn = Apollo.MutationFunction<AddShopToCartProductMutation, AddShopToCartProductMutationVariables>;

/**
 * __useAddShopToCartProductMutation__
 *
 * To run a mutation, you first call `useAddShopToCartProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddShopToCartProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addShopToCartProductMutation, { data, loading, error }] = useAddShopToCartProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddShopToCartProductMutation(baseOptions?: Apollo.MutationHookOptions<AddShopToCartProductMutation, AddShopToCartProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddShopToCartProductMutation, AddShopToCartProductMutationVariables>(AddShopToCartProductDocument, options);
      }
export type AddShopToCartProductMutationHookResult = ReturnType<typeof useAddShopToCartProductMutation>;
export type AddShopToCartProductMutationResult = Apollo.MutationResult<AddShopToCartProductMutation>;
export type AddShopToCartProductMutationOptions = Apollo.BaseMutationOptions<AddShopToCartProductMutation, AddShopToCartProductMutationVariables>;
export const UpdateProductInCartDocument = gql`
    mutation UpdateProductInCart($input: UpdateProductInCartInput!) {
  updateProductInCart(input: $input) {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type UpdateProductInCartMutationFn = Apollo.MutationFunction<UpdateProductInCartMutation, UpdateProductInCartMutationVariables>;

/**
 * __useUpdateProductInCartMutation__
 *
 * To run a mutation, you first call `useUpdateProductInCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductInCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductInCartMutation, { data, loading, error }] = useUpdateProductInCartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductInCartMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductInCartMutation, UpdateProductInCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductInCartMutation, UpdateProductInCartMutationVariables>(UpdateProductInCartDocument, options);
      }
export type UpdateProductInCartMutationHookResult = ReturnType<typeof useUpdateProductInCartMutation>;
export type UpdateProductInCartMutationResult = Apollo.MutationResult<UpdateProductInCartMutation>;
export type UpdateProductInCartMutationOptions = Apollo.BaseMutationOptions<UpdateProductInCartMutation, UpdateProductInCartMutationVariables>;
export const DeleteProductFromCartDocument = gql`
    mutation DeleteProductFromCart($input: DeleteProductFromCartInput!) {
  deleteProductFromCart(input: $input) {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type DeleteProductFromCartMutationFn = Apollo.MutationFunction<DeleteProductFromCartMutation, DeleteProductFromCartMutationVariables>;

/**
 * __useDeleteProductFromCartMutation__
 *
 * To run a mutation, you first call `useDeleteProductFromCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductFromCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductFromCartMutation, { data, loading, error }] = useDeleteProductFromCartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteProductFromCartMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductFromCartMutation, DeleteProductFromCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductFromCartMutation, DeleteProductFromCartMutationVariables>(DeleteProductFromCartDocument, options);
      }
export type DeleteProductFromCartMutationHookResult = ReturnType<typeof useDeleteProductFromCartMutation>;
export type DeleteProductFromCartMutationResult = Apollo.MutationResult<DeleteProductFromCartMutation>;
export type DeleteProductFromCartMutationOptions = Apollo.BaseMutationOptions<DeleteProductFromCartMutation, DeleteProductFromCartMutationVariables>;
export const ClearCartDocument = gql`
    mutation ClearCart {
  clearCart {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type ClearCartMutationFn = Apollo.MutationFunction<ClearCartMutation, ClearCartMutationVariables>;

/**
 * __useClearCartMutation__
 *
 * To run a mutation, you first call `useClearCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearCartMutation, { data, loading, error }] = useClearCartMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearCartMutation(baseOptions?: Apollo.MutationHookOptions<ClearCartMutation, ClearCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearCartMutation, ClearCartMutationVariables>(ClearCartDocument, options);
      }
export type ClearCartMutationHookResult = ReturnType<typeof useClearCartMutation>;
export type ClearCartMutationResult = Apollo.MutationResult<ClearCartMutation>;
export type ClearCartMutationOptions = Apollo.BaseMutationOptions<ClearCartMutation, ClearCartMutationVariables>;
export const MakeAnOrderDocument = gql`
    mutation MakeAnOrder($input: MakeAnOrderInput!) {
  makeAnOrder(input: $input) {
    ...MakeAnOrderPayload
  }
}
    ${MakeAnOrderPayloadFragmentDoc}`;
export type MakeAnOrderMutationFn = Apollo.MutationFunction<MakeAnOrderMutation, MakeAnOrderMutationVariables>;

/**
 * __useMakeAnOrderMutation__
 *
 * To run a mutation, you first call `useMakeAnOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMakeAnOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [makeAnOrderMutation, { data, loading, error }] = useMakeAnOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMakeAnOrderMutation(baseOptions?: Apollo.MutationHookOptions<MakeAnOrderMutation, MakeAnOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MakeAnOrderMutation, MakeAnOrderMutationVariables>(MakeAnOrderDocument, options);
      }
export type MakeAnOrderMutationHookResult = ReturnType<typeof useMakeAnOrderMutation>;
export type MakeAnOrderMutationResult = Apollo.MutationResult<MakeAnOrderMutation>;
export type MakeAnOrderMutationOptions = Apollo.BaseMutationOptions<MakeAnOrderMutation, MakeAnOrderMutationVariables>;
export const RepeatAnOrderDocument = gql`
    mutation RepeatAnOrder($input: RepeatOrderInput!) {
  repeatOrder(input: $input) {
    ...CartPayload
  }
}
    ${CartPayloadFragmentDoc}`;
export type RepeatAnOrderMutationFn = Apollo.MutationFunction<RepeatAnOrderMutation, RepeatAnOrderMutationVariables>;

/**
 * __useRepeatAnOrderMutation__
 *
 * To run a mutation, you first call `useRepeatAnOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRepeatAnOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [repeatAnOrderMutation, { data, loading, error }] = useRepeatAnOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRepeatAnOrderMutation(baseOptions?: Apollo.MutationHookOptions<RepeatAnOrderMutation, RepeatAnOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RepeatAnOrderMutation, RepeatAnOrderMutationVariables>(RepeatAnOrderDocument, options);
      }
export type RepeatAnOrderMutationHookResult = ReturnType<typeof useRepeatAnOrderMutation>;
export type RepeatAnOrderMutationResult = Apollo.MutationResult<RepeatAnOrderMutation>;
export type RepeatAnOrderMutationOptions = Apollo.BaseMutationOptions<RepeatAnOrderMutation, RepeatAnOrderMutationVariables>;
export const CreateCompanyDocument = gql`
    mutation CreateCompany($input: CreateCompanyInput!) {
  createCompany(input: $input) {
    success
    message
  }
}
    `;
export type CreateCompanyMutationFn = Apollo.MutationFunction<CreateCompanyMutation, CreateCompanyMutationVariables>;

/**
 * __useCreateCompanyMutation__
 *
 * To run a mutation, you first call `useCreateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyMutation, { data, loading, error }] = useCreateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCompanyMutation(baseOptions?: Apollo.MutationHookOptions<CreateCompanyMutation, CreateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, options);
      }
export type CreateCompanyMutationHookResult = ReturnType<typeof useCreateCompanyMutation>;
export type CreateCompanyMutationResult = Apollo.MutationResult<CreateCompanyMutation>;
export type CreateCompanyMutationOptions = Apollo.BaseMutationOptions<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const DeleteCompanyDocument = gql`
    mutation DeleteCompany($_id: ObjectId!) {
  deleteCompany(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteCompanyMutationFn = Apollo.MutationFunction<DeleteCompanyMutation, DeleteCompanyMutationVariables>;

/**
 * __useDeleteCompanyMutation__
 *
 * To run a mutation, you first call `useDeleteCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompanyMutation, { data, loading, error }] = useDeleteCompanyMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteCompanyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCompanyMutation, DeleteCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, options);
      }
export type DeleteCompanyMutationHookResult = ReturnType<typeof useDeleteCompanyMutation>;
export type DeleteCompanyMutationResult = Apollo.MutationResult<DeleteCompanyMutation>;
export type DeleteCompanyMutationOptions = Apollo.BaseMutationOptions<DeleteCompanyMutation, DeleteCompanyMutationVariables>;
export const UpdateCompanyDocument = gql`
    mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input) {
    success
    message
  }
}
    `;
export type UpdateCompanyMutationFn = Apollo.MutationFunction<UpdateCompanyMutation, UpdateCompanyMutationVariables>;

/**
 * __useUpdateCompanyMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyMutation, { data, loading, error }] = useUpdateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCompanyMutation, UpdateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, options);
      }
export type UpdateCompanyMutationHookResult = ReturnType<typeof useUpdateCompanyMutation>;
export type UpdateCompanyMutationResult = Apollo.MutationResult<UpdateCompanyMutation>;
export type UpdateCompanyMutationOptions = Apollo.BaseMutationOptions<UpdateCompanyMutation, UpdateCompanyMutationVariables>;
export const UpdateCompanyLogoDocument = gql`
    mutation UpdateCompanyLogo($input: UpdateCompanyLogoInput!) {
  updateCompanyLogo(input: $input) {
    success
    message
  }
}
    `;
export type UpdateCompanyLogoMutationFn = Apollo.MutationFunction<UpdateCompanyLogoMutation, UpdateCompanyLogoMutationVariables>;

/**
 * __useUpdateCompanyLogoMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyLogoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyLogoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyLogoMutation, { data, loading, error }] = useUpdateCompanyLogoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyLogoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCompanyLogoMutation, UpdateCompanyLogoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCompanyLogoMutation, UpdateCompanyLogoMutationVariables>(UpdateCompanyLogoDocument, options);
      }
export type UpdateCompanyLogoMutationHookResult = ReturnType<typeof useUpdateCompanyLogoMutation>;
export type UpdateCompanyLogoMutationResult = Apollo.MutationResult<UpdateCompanyLogoMutation>;
export type UpdateCompanyLogoMutationOptions = Apollo.BaseMutationOptions<UpdateCompanyLogoMutation, UpdateCompanyLogoMutationVariables>;
export const AddShopToCompanyDocument = gql`
    mutation AddShopToCompany($input: AddShopToCompanyInput!) {
  addShopToCompany(input: $input) {
    success
    message
  }
}
    `;
export type AddShopToCompanyMutationFn = Apollo.MutationFunction<AddShopToCompanyMutation, AddShopToCompanyMutationVariables>;

/**
 * __useAddShopToCompanyMutation__
 *
 * To run a mutation, you first call `useAddShopToCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddShopToCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addShopToCompanyMutation, { data, loading, error }] = useAddShopToCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddShopToCompanyMutation(baseOptions?: Apollo.MutationHookOptions<AddShopToCompanyMutation, AddShopToCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddShopToCompanyMutation, AddShopToCompanyMutationVariables>(AddShopToCompanyDocument, options);
      }
export type AddShopToCompanyMutationHookResult = ReturnType<typeof useAddShopToCompanyMutation>;
export type AddShopToCompanyMutationResult = Apollo.MutationResult<AddShopToCompanyMutation>;
export type AddShopToCompanyMutationOptions = Apollo.BaseMutationOptions<AddShopToCompanyMutation, AddShopToCompanyMutationVariables>;
export const DeleteShopFromCompanyDocument = gql`
    mutation DeleteShopFromCompany($input: DeleteShopFromCompanyInput!) {
  deleteShopFromCompany(input: $input) {
    success
    message
  }
}
    `;
export type DeleteShopFromCompanyMutationFn = Apollo.MutationFunction<DeleteShopFromCompanyMutation, DeleteShopFromCompanyMutationVariables>;

/**
 * __useDeleteShopFromCompanyMutation__
 *
 * To run a mutation, you first call `useDeleteShopFromCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShopFromCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShopFromCompanyMutation, { data, loading, error }] = useDeleteShopFromCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteShopFromCompanyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShopFromCompanyMutation, DeleteShopFromCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShopFromCompanyMutation, DeleteShopFromCompanyMutationVariables>(DeleteShopFromCompanyDocument, options);
      }
export type DeleteShopFromCompanyMutationHookResult = ReturnType<typeof useDeleteShopFromCompanyMutation>;
export type DeleteShopFromCompanyMutationResult = Apollo.MutationResult<DeleteShopFromCompanyMutation>;
export type DeleteShopFromCompanyMutationOptions = Apollo.BaseMutationOptions<DeleteShopFromCompanyMutation, DeleteShopFromCompanyMutationVariables>;
export const UpdateConfigDocument = gql`
    mutation UpdateConfig($input: UpdateConfigInput!) {
  updateConfig(input: $input) {
    success
    message
  }
}
    `;
export type UpdateConfigMutationFn = Apollo.MutationFunction<UpdateConfigMutation, UpdateConfigMutationVariables>;

/**
 * __useUpdateConfigMutation__
 *
 * To run a mutation, you first call `useUpdateConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateConfigMutation, { data, loading, error }] = useUpdateConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateConfigMutation(baseOptions?: Apollo.MutationHookOptions<UpdateConfigMutation, UpdateConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateConfigMutation, UpdateConfigMutationVariables>(UpdateConfigDocument, options);
      }
export type UpdateConfigMutationHookResult = ReturnType<typeof useUpdateConfigMutation>;
export type UpdateConfigMutationResult = Apollo.MutationResult<UpdateConfigMutation>;
export type UpdateConfigMutationOptions = Apollo.BaseMutationOptions<UpdateConfigMutation, UpdateConfigMutationVariables>;
export const UpdateAssetConfigDocument = gql`
    mutation UpdateAssetConfig($input: UpdateAssetConfigInput!) {
  updateAssetConfig(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAssetConfigMutationFn = Apollo.MutationFunction<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>;

/**
 * __useUpdateAssetConfigMutation__
 *
 * To run a mutation, you first call `useUpdateAssetConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAssetConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAssetConfigMutation, { data, loading, error }] = useUpdateAssetConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAssetConfigMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>(UpdateAssetConfigDocument, options);
      }
export type UpdateAssetConfigMutationHookResult = ReturnType<typeof useUpdateAssetConfigMutation>;
export type UpdateAssetConfigMutationResult = Apollo.MutationResult<UpdateAssetConfigMutation>;
export type UpdateAssetConfigMutationOptions = Apollo.BaseMutationOptions<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>;
export const CreateLanguageDocument = gql`
    mutation CreateLanguage($input: CreateLanguageInput!) {
  createLanguage(input: $input) {
    success
    message
  }
}
    `;
export type CreateLanguageMutationFn = Apollo.MutationFunction<CreateLanguageMutation, CreateLanguageMutationVariables>;

/**
 * __useCreateLanguageMutation__
 *
 * To run a mutation, you first call `useCreateLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLanguageMutation, { data, loading, error }] = useCreateLanguageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLanguageMutation(baseOptions?: Apollo.MutationHookOptions<CreateLanguageMutation, CreateLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLanguageMutation, CreateLanguageMutationVariables>(CreateLanguageDocument, options);
      }
export type CreateLanguageMutationHookResult = ReturnType<typeof useCreateLanguageMutation>;
export type CreateLanguageMutationResult = Apollo.MutationResult<CreateLanguageMutation>;
export type CreateLanguageMutationOptions = Apollo.BaseMutationOptions<CreateLanguageMutation, CreateLanguageMutationVariables>;
export const UpdateLanguageDocument = gql`
    mutation UpdateLanguage($input: UpdateLanguageInput!) {
  updateLanguage(input: $input) {
    success
    message
  }
}
    `;
export type UpdateLanguageMutationFn = Apollo.MutationFunction<UpdateLanguageMutation, UpdateLanguageMutationVariables>;

/**
 * __useUpdateLanguageMutation__
 *
 * To run a mutation, you first call `useUpdateLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLanguageMutation, { data, loading, error }] = useUpdateLanguageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLanguageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLanguageMutation, UpdateLanguageMutationVariables>(UpdateLanguageDocument, options);
      }
export type UpdateLanguageMutationHookResult = ReturnType<typeof useUpdateLanguageMutation>;
export type UpdateLanguageMutationResult = Apollo.MutationResult<UpdateLanguageMutation>;
export type UpdateLanguageMutationOptions = Apollo.BaseMutationOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>;
export const DeleteLanguageDocument = gql`
    mutation DeleteLanguage($_id: ObjectId!) {
  deleteLanguage(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteLanguageMutationFn = Apollo.MutationFunction<DeleteLanguageMutation, DeleteLanguageMutationVariables>;

/**
 * __useDeleteLanguageMutation__
 *
 * To run a mutation, you first call `useDeleteLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLanguageMutation, { data, loading, error }] = useDeleteLanguageMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteLanguageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLanguageMutation, DeleteLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLanguageMutation, DeleteLanguageMutationVariables>(DeleteLanguageDocument, options);
      }
export type DeleteLanguageMutationHookResult = ReturnType<typeof useDeleteLanguageMutation>;
export type DeleteLanguageMutationResult = Apollo.MutationResult<DeleteLanguageMutation>;
export type DeleteLanguageMutationOptions = Apollo.BaseMutationOptions<DeleteLanguageMutation, DeleteLanguageMutationVariables>;
export const CreateOptionsGroupDocument = gql`
    mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
  createOptionsGroup(input: $input) {
    success
    message
  }
}
    `;
export type CreateOptionsGroupMutationFn = Apollo.MutationFunction<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>;

/**
 * __useCreateOptionsGroupMutation__
 *
 * To run a mutation, you first call `useCreateOptionsGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOptionsGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOptionsGroupMutation, { data, loading, error }] = useCreateOptionsGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOptionsGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>(CreateOptionsGroupDocument, options);
      }
export type CreateOptionsGroupMutationHookResult = ReturnType<typeof useCreateOptionsGroupMutation>;
export type CreateOptionsGroupMutationResult = Apollo.MutationResult<CreateOptionsGroupMutation>;
export type CreateOptionsGroupMutationOptions = Apollo.BaseMutationOptions<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>;
export const UpdateOptionsGroupDocument = gql`
    mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
  updateOptionsGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateOptionsGroupMutationFn = Apollo.MutationFunction<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>;

/**
 * __useUpdateOptionsGroupMutation__
 *
 * To run a mutation, you first call `useUpdateOptionsGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOptionsGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOptionsGroupMutation, { data, loading, error }] = useUpdateOptionsGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOptionsGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>(UpdateOptionsGroupDocument, options);
      }
export type UpdateOptionsGroupMutationHookResult = ReturnType<typeof useUpdateOptionsGroupMutation>;
export type UpdateOptionsGroupMutationResult = Apollo.MutationResult<UpdateOptionsGroupMutation>;
export type UpdateOptionsGroupMutationOptions = Apollo.BaseMutationOptions<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>;
export const DeleteOptionsGroupDocument = gql`
    mutation DeleteOptionsGroup($_id: ObjectId!) {
  deleteOptionsGroup(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteOptionsGroupMutationFn = Apollo.MutationFunction<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>;

/**
 * __useDeleteOptionsGroupMutation__
 *
 * To run a mutation, you first call `useDeleteOptionsGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOptionsGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOptionsGroupMutation, { data, loading, error }] = useDeleteOptionsGroupMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteOptionsGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>(DeleteOptionsGroupDocument, options);
      }
export type DeleteOptionsGroupMutationHookResult = ReturnType<typeof useDeleteOptionsGroupMutation>;
export type DeleteOptionsGroupMutationResult = Apollo.MutationResult<DeleteOptionsGroupMutation>;
export type DeleteOptionsGroupMutationOptions = Apollo.BaseMutationOptions<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>;
export const AddOptionToGroupDocument = gql`
    mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
  addOptionToGroup(input: $input) {
    success
    message
  }
}
    `;
export type AddOptionToGroupMutationFn = Apollo.MutationFunction<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>;

/**
 * __useAddOptionToGroupMutation__
 *
 * To run a mutation, you first call `useAddOptionToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOptionToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOptionToGroupMutation, { data, loading, error }] = useAddOptionToGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddOptionToGroupMutation(baseOptions?: Apollo.MutationHookOptions<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>(AddOptionToGroupDocument, options);
      }
export type AddOptionToGroupMutationHookResult = ReturnType<typeof useAddOptionToGroupMutation>;
export type AddOptionToGroupMutationResult = Apollo.MutationResult<AddOptionToGroupMutation>;
export type AddOptionToGroupMutationOptions = Apollo.BaseMutationOptions<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>;
export const UpdateOptionInGroupDocument = gql`
    mutation UpdateOptionInGroup($input: UpdateOptionInGroupInput!) {
  updateOptionInGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateOptionInGroupMutationFn = Apollo.MutationFunction<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>;

/**
 * __useUpdateOptionInGroupMutation__
 *
 * To run a mutation, you first call `useUpdateOptionInGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOptionInGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOptionInGroupMutation, { data, loading, error }] = useUpdateOptionInGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOptionInGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>(UpdateOptionInGroupDocument, options);
      }
export type UpdateOptionInGroupMutationHookResult = ReturnType<typeof useUpdateOptionInGroupMutation>;
export type UpdateOptionInGroupMutationResult = Apollo.MutationResult<UpdateOptionInGroupMutation>;
export type UpdateOptionInGroupMutationOptions = Apollo.BaseMutationOptions<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>;
export const DeleteOptionFromGroupDocument = gql`
    mutation DeleteOptionFromGroup($input: DeleteOptionFromGroupInput!) {
  deleteOptionFromGroup(input: $input) {
    success
    message
  }
}
    `;
export type DeleteOptionFromGroupMutationFn = Apollo.MutationFunction<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>;

/**
 * __useDeleteOptionFromGroupMutation__
 *
 * To run a mutation, you first call `useDeleteOptionFromGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOptionFromGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOptionFromGroupMutation, { data, loading, error }] = useDeleteOptionFromGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteOptionFromGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>(DeleteOptionFromGroupDocument, options);
      }
export type DeleteOptionFromGroupMutationHookResult = ReturnType<typeof useDeleteOptionFromGroupMutation>;
export type DeleteOptionFromGroupMutationResult = Apollo.MutationResult<DeleteOptionFromGroupMutation>;
export type DeleteOptionFromGroupMutationOptions = Apollo.BaseMutationOptions<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    success
    message
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
  updateRole(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRoleMutationFn = Apollo.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($_id: ObjectId!) {
  deleteRole(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteRoleMutationFn = Apollo.MutationFunction<DeleteRoleMutation, DeleteRoleMutationVariables>;

/**
 * __useDeleteRoleMutation__
 *
 * To run a mutation, you first call `useDeleteRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoleMutation, { data, loading, error }] = useDeleteRoleMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, options);
      }
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>;
export type DeleteRoleMutationResult = Apollo.MutationResult<DeleteRoleMutation>;
export type DeleteRoleMutationOptions = Apollo.BaseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const CreateRubricVariantDocument = gql`
    mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
  createRubricVariant(input: $input) {
    success
    message
  }
}
    `;
export type CreateRubricVariantMutationFn = Apollo.MutationFunction<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>;

/**
 * __useCreateRubricVariantMutation__
 *
 * To run a mutation, you first call `useCreateRubricVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRubricVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRubricVariantMutation, { data, loading, error }] = useCreateRubricVariantMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRubricVariantMutation(baseOptions?: Apollo.MutationHookOptions<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>(CreateRubricVariantDocument, options);
      }
export type CreateRubricVariantMutationHookResult = ReturnType<typeof useCreateRubricVariantMutation>;
export type CreateRubricVariantMutationResult = Apollo.MutationResult<CreateRubricVariantMutation>;
export type CreateRubricVariantMutationOptions = Apollo.BaseMutationOptions<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>;
export const UpdateRubricVariantDocument = gql`
    mutation UpdateRubricVariant($input: UpdateRubricVariantInput!) {
  updateRubricVariant(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRubricVariantMutationFn = Apollo.MutationFunction<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>;

/**
 * __useUpdateRubricVariantMutation__
 *
 * To run a mutation, you first call `useUpdateRubricVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRubricVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRubricVariantMutation, { data, loading, error }] = useUpdateRubricVariantMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRubricVariantMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>(UpdateRubricVariantDocument, options);
      }
export type UpdateRubricVariantMutationHookResult = ReturnType<typeof useUpdateRubricVariantMutation>;
export type UpdateRubricVariantMutationResult = Apollo.MutationResult<UpdateRubricVariantMutation>;
export type UpdateRubricVariantMutationOptions = Apollo.BaseMutationOptions<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>;
export const DeleteRubricVariantDocument = gql`
    mutation DeleteRubricVariant($_id: ObjectId!) {
  deleteRubricVariant(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteRubricVariantMutationFn = Apollo.MutationFunction<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>;

/**
 * __useDeleteRubricVariantMutation__
 *
 * To run a mutation, you first call `useDeleteRubricVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRubricVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRubricVariantMutation, { data, loading, error }] = useDeleteRubricVariantMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteRubricVariantMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>(DeleteRubricVariantDocument, options);
      }
export type DeleteRubricVariantMutationHookResult = ReturnType<typeof useDeleteRubricVariantMutation>;
export type DeleteRubricVariantMutationResult = Apollo.MutationResult<DeleteRubricVariantMutation>;
export type DeleteRubricVariantMutationOptions = Apollo.BaseMutationOptions<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>;
export const UpdateShopDocument = gql`
    mutation UpdateShop($input: UpdateShopInput!) {
  updateShop(input: $input) {
    success
    message
  }
}
    `;
export type UpdateShopMutationFn = Apollo.MutationFunction<UpdateShopMutation, UpdateShopMutationVariables>;

/**
 * __useUpdateShopMutation__
 *
 * To run a mutation, you first call `useUpdateShopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShopMutation, { data, loading, error }] = useUpdateShopMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShopMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShopMutation, UpdateShopMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShopMutation, UpdateShopMutationVariables>(UpdateShopDocument, options);
      }
export type UpdateShopMutationHookResult = ReturnType<typeof useUpdateShopMutation>;
export type UpdateShopMutationResult = Apollo.MutationResult<UpdateShopMutation>;
export type UpdateShopMutationOptions = Apollo.BaseMutationOptions<UpdateShopMutation, UpdateShopMutationVariables>;
export const AddShopAssetsDocument = gql`
    mutation AddShopAssets($input: AddShopAssetsInput!) {
  addShopAssets(input: $input) {
    success
    message
  }
}
    `;
export type AddShopAssetsMutationFn = Apollo.MutationFunction<AddShopAssetsMutation, AddShopAssetsMutationVariables>;

/**
 * __useAddShopAssetsMutation__
 *
 * To run a mutation, you first call `useAddShopAssetsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddShopAssetsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addShopAssetsMutation, { data, loading, error }] = useAddShopAssetsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddShopAssetsMutation(baseOptions?: Apollo.MutationHookOptions<AddShopAssetsMutation, AddShopAssetsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddShopAssetsMutation, AddShopAssetsMutationVariables>(AddShopAssetsDocument, options);
      }
export type AddShopAssetsMutationHookResult = ReturnType<typeof useAddShopAssetsMutation>;
export type AddShopAssetsMutationResult = Apollo.MutationResult<AddShopAssetsMutation>;
export type AddShopAssetsMutationOptions = Apollo.BaseMutationOptions<AddShopAssetsMutation, AddShopAssetsMutationVariables>;
export const DeleteShopAssetDocument = gql`
    mutation DeleteShopAsset($input: DeleteShopAssetInput!) {
  deleteShopAsset(input: $input) {
    success
    message
  }
}
    `;
export type DeleteShopAssetMutationFn = Apollo.MutationFunction<DeleteShopAssetMutation, DeleteShopAssetMutationVariables>;

/**
 * __useDeleteShopAssetMutation__
 *
 * To run a mutation, you first call `useDeleteShopAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShopAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShopAssetMutation, { data, loading, error }] = useDeleteShopAssetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteShopAssetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShopAssetMutation, DeleteShopAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShopAssetMutation, DeleteShopAssetMutationVariables>(DeleteShopAssetDocument, options);
      }
export type DeleteShopAssetMutationHookResult = ReturnType<typeof useDeleteShopAssetMutation>;
export type DeleteShopAssetMutationResult = Apollo.MutationResult<DeleteShopAssetMutation>;
export type DeleteShopAssetMutationOptions = Apollo.BaseMutationOptions<DeleteShopAssetMutation, DeleteShopAssetMutationVariables>;
export const UpdateShopAssetIndexDocument = gql`
    mutation UpdateShopAssetIndex($input: UpdateShopAssetIndexInput!) {
  updateShopAssetIndex(input: $input) {
    success
    message
  }
}
    `;
export type UpdateShopAssetIndexMutationFn = Apollo.MutationFunction<UpdateShopAssetIndexMutation, UpdateShopAssetIndexMutationVariables>;

/**
 * __useUpdateShopAssetIndexMutation__
 *
 * To run a mutation, you first call `useUpdateShopAssetIndexMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShopAssetIndexMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShopAssetIndexMutation, { data, loading, error }] = useUpdateShopAssetIndexMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShopAssetIndexMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShopAssetIndexMutation, UpdateShopAssetIndexMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShopAssetIndexMutation, UpdateShopAssetIndexMutationVariables>(UpdateShopAssetIndexDocument, options);
      }
export type UpdateShopAssetIndexMutationHookResult = ReturnType<typeof useUpdateShopAssetIndexMutation>;
export type UpdateShopAssetIndexMutationResult = Apollo.MutationResult<UpdateShopAssetIndexMutation>;
export type UpdateShopAssetIndexMutationOptions = Apollo.BaseMutationOptions<UpdateShopAssetIndexMutation, UpdateShopAssetIndexMutationVariables>;
export const UpdateShopLogoDocument = gql`
    mutation UpdateShopLogo($input: UpdateShopLogoInput!) {
  updateShopLogo(input: $input) {
    success
    message
  }
}
    `;
export type UpdateShopLogoMutationFn = Apollo.MutationFunction<UpdateShopLogoMutation, UpdateShopLogoMutationVariables>;

/**
 * __useUpdateShopLogoMutation__
 *
 * To run a mutation, you first call `useUpdateShopLogoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShopLogoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShopLogoMutation, { data, loading, error }] = useUpdateShopLogoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShopLogoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShopLogoMutation, UpdateShopLogoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShopLogoMutation, UpdateShopLogoMutationVariables>(UpdateShopLogoDocument, options);
      }
export type UpdateShopLogoMutationHookResult = ReturnType<typeof useUpdateShopLogoMutation>;
export type UpdateShopLogoMutationResult = Apollo.MutationResult<UpdateShopLogoMutation>;
export type UpdateShopLogoMutationOptions = Apollo.BaseMutationOptions<UpdateShopLogoMutation, UpdateShopLogoMutationVariables>;
export const AddProductToShopDocument = gql`
    mutation AddProductToShop($input: AddProductToShopInput!) {
  addProductToShop(input: $input) {
    success
    message
  }
}
    `;
export type AddProductToShopMutationFn = Apollo.MutationFunction<AddProductToShopMutation, AddProductToShopMutationVariables>;

/**
 * __useAddProductToShopMutation__
 *
 * To run a mutation, you first call `useAddProductToShopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductToShopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductToShopMutation, { data, loading, error }] = useAddProductToShopMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProductToShopMutation(baseOptions?: Apollo.MutationHookOptions<AddProductToShopMutation, AddProductToShopMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductToShopMutation, AddProductToShopMutationVariables>(AddProductToShopDocument, options);
      }
export type AddProductToShopMutationHookResult = ReturnType<typeof useAddProductToShopMutation>;
export type AddProductToShopMutationResult = Apollo.MutationResult<AddProductToShopMutation>;
export type AddProductToShopMutationOptions = Apollo.BaseMutationOptions<AddProductToShopMutation, AddProductToShopMutationVariables>;
export const UpdateShopProductDocument = gql`
    mutation UpdateShopProduct($input: UpdateShopProductInput!) {
  updateShopProduct(input: $input) {
    success
    message
  }
}
    `;
export type UpdateShopProductMutationFn = Apollo.MutationFunction<UpdateShopProductMutation, UpdateShopProductMutationVariables>;

/**
 * __useUpdateShopProductMutation__
 *
 * To run a mutation, you first call `useUpdateShopProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShopProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShopProductMutation, { data, loading, error }] = useUpdateShopProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShopProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShopProductMutation, UpdateShopProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShopProductMutation, UpdateShopProductMutationVariables>(UpdateShopProductDocument, options);
      }
export type UpdateShopProductMutationHookResult = ReturnType<typeof useUpdateShopProductMutation>;
export type UpdateShopProductMutationResult = Apollo.MutationResult<UpdateShopProductMutation>;
export type UpdateShopProductMutationOptions = Apollo.BaseMutationOptions<UpdateShopProductMutation, UpdateShopProductMutationVariables>;
export const DeleteProductFromShopDocument = gql`
    mutation DeleteProductFromShop($input: DeleteProductFromShopInput!) {
  deleteProductFromShop(input: $input) {
    success
    message
  }
}
    `;
export type DeleteProductFromShopMutationFn = Apollo.MutationFunction<DeleteProductFromShopMutation, DeleteProductFromShopMutationVariables>;

/**
 * __useDeleteProductFromShopMutation__
 *
 * To run a mutation, you first call `useDeleteProductFromShopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductFromShopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductFromShopMutation, { data, loading, error }] = useDeleteProductFromShopMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteProductFromShopMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductFromShopMutation, DeleteProductFromShopMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductFromShopMutation, DeleteProductFromShopMutationVariables>(DeleteProductFromShopDocument, options);
      }
export type DeleteProductFromShopMutationHookResult = ReturnType<typeof useDeleteProductFromShopMutation>;
export type DeleteProductFromShopMutationResult = Apollo.MutationResult<DeleteProductFromShopMutation>;
export type DeleteProductFromShopMutationOptions = Apollo.BaseMutationOptions<DeleteProductFromShopMutation, DeleteProductFromShopMutationVariables>;
export const UpdateMyProfileDocument = gql`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
  updateMyProfile(input: $input) {
    success
    message
    payload {
      ...SessionUser
    }
  }
}
    ${SessionUserFragmentDoc}`;
export type UpdateMyProfileMutationFn = Apollo.MutationFunction<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;

/**
 * __useUpdateMyProfileMutation__
 *
 * To run a mutation, you first call `useUpdateMyProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMyProfileMutation, { data, loading, error }] = useUpdateMyProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMyProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>(UpdateMyProfileDocument, options);
      }
export type UpdateMyProfileMutationHookResult = ReturnType<typeof useUpdateMyProfileMutation>;
export type UpdateMyProfileMutationResult = Apollo.MutationResult<UpdateMyProfileMutation>;
export type UpdateMyProfileMutationOptions = Apollo.BaseMutationOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const UpdateMyPasswordDocument = gql`
    mutation UpdateMyPassword($input: UpdateMyPasswordInput!) {
  updateMyPassword(input: $input) {
    success
    message
    payload {
      ...SessionUser
    }
  }
}
    ${SessionUserFragmentDoc}`;
export type UpdateMyPasswordMutationFn = Apollo.MutationFunction<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>;

/**
 * __useUpdateMyPasswordMutation__
 *
 * To run a mutation, you first call `useUpdateMyPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMyPasswordMutation, { data, loading, error }] = useUpdateMyPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMyPasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>(UpdateMyPasswordDocument, options);
      }
export type UpdateMyPasswordMutationHookResult = ReturnType<typeof useUpdateMyPasswordMutation>;
export type UpdateMyPasswordMutationResult = Apollo.MutationResult<UpdateMyPasswordMutation>;
export type UpdateMyPasswordMutationOptions = Apollo.BaseMutationOptions<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>;
export const GetAllAttributesGroupsDocument = gql`
    query GetAllAttributesGroups {
  getAllAttributesGroups {
    _id
    name
  }
}
    `;

/**
 * __useGetAllAttributesGroupsQuery__
 *
 * To run a query within a React component, call `useGetAllAttributesGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAttributesGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAttributesGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllAttributesGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>(GetAllAttributesGroupsDocument, options);
      }
export function useGetAllAttributesGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>(GetAllAttributesGroupsDocument, options);
        }
export type GetAllAttributesGroupsQueryHookResult = ReturnType<typeof useGetAllAttributesGroupsQuery>;
export type GetAllAttributesGroupsLazyQueryHookResult = ReturnType<typeof useGetAllAttributesGroupsLazyQuery>;
export type GetAllAttributesGroupsQueryResult = Apollo.QueryResult<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>;
export const GetAttributesGroupDocument = gql`
    query GetAttributesGroup($_id: ObjectId!) {
  getAttributesGroup(_id: $_id) {
    _id
    nameI18n
    name
    attributes {
      ...AttributeInGroup
    }
  }
}
    ${AttributeInGroupFragmentDoc}`;

/**
 * __useGetAttributesGroupQuery__
 *
 * To run a query within a React component, call `useGetAttributesGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributesGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributesGroupQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetAttributesGroupQuery(baseOptions: Apollo.QueryHookOptions<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>(GetAttributesGroupDocument, options);
      }
export function useGetAttributesGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>(GetAttributesGroupDocument, options);
        }
export type GetAttributesGroupQueryHookResult = ReturnType<typeof useGetAttributesGroupQuery>;
export type GetAttributesGroupLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupLazyQuery>;
export type GetAttributesGroupQueryResult = Apollo.QueryResult<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>;
export const GetAttributesGroupsForRubricDocument = gql`
    query GetAttributesGroupsForRubric($excludedIds: [ObjectId!]) {
  getAllAttributesGroups(excludedIds: $excludedIds) {
    _id
    name
  }
}
    `;

/**
 * __useGetAttributesGroupsForRubricQuery__
 *
 * To run a query within a React component, call `useGetAttributesGroupsForRubricQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributesGroupsForRubricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributesGroupsForRubricQuery({
 *   variables: {
 *      excludedIds: // value for 'excludedIds'
 *   },
 * });
 */
export function useGetAttributesGroupsForRubricQuery(baseOptions?: Apollo.QueryHookOptions<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>(GetAttributesGroupsForRubricDocument, options);
      }
export function useGetAttributesGroupsForRubricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>(GetAttributesGroupsForRubricDocument, options);
        }
export type GetAttributesGroupsForRubricQueryHookResult = ReturnType<typeof useGetAttributesGroupsForRubricQuery>;
export type GetAttributesGroupsForRubricLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupsForRubricLazyQuery>;
export type GetAttributesGroupsForRubricQueryResult = Apollo.QueryResult<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>;
export const GetCatalogueCardDocument = gql`
    query GetCatalogueCard($slug: [String!]!) {
  getProductCard(slug: $slug) {
    ...ProductCard
    cardBreadcrumbs(slug: $slug) {
      _id
      name
      href
    }
  }
}
    ${ProductCardFragmentDoc}`;

/**
 * __useGetCatalogueCardQuery__
 *
 * To run a query within a React component, call `useGetCatalogueCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueCardQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCatalogueCardQuery(baseOptions: Apollo.QueryHookOptions<GetCatalogueCardQuery, GetCatalogueCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatalogueCardQuery, GetCatalogueCardQueryVariables>(GetCatalogueCardDocument, options);
      }
export function useGetCatalogueCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueCardQuery, GetCatalogueCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatalogueCardQuery, GetCatalogueCardQueryVariables>(GetCatalogueCardDocument, options);
        }
export type GetCatalogueCardQueryHookResult = ReturnType<typeof useGetCatalogueCardQuery>;
export type GetCatalogueCardLazyQueryHookResult = ReturnType<typeof useGetCatalogueCardLazyQuery>;
export type GetCatalogueCardQueryResult = Apollo.QueryResult<GetCatalogueCardQuery, GetCatalogueCardQueryVariables>;
export const GetCatalogueCardShopsDocument = gql`
    query GetCatalogueCardShops($input: GetProductShopsInput!) {
  getProductShops(input: $input) {
    ...ShopProductSnippet
  }
}
    ${ShopProductSnippetFragmentDoc}`;

/**
 * __useGetCatalogueCardShopsQuery__
 *
 * To run a query within a React component, call `useGetCatalogueCardShopsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueCardShopsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueCardShopsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCatalogueCardShopsQuery(baseOptions: Apollo.QueryHookOptions<GetCatalogueCardShopsQuery, GetCatalogueCardShopsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatalogueCardShopsQuery, GetCatalogueCardShopsQueryVariables>(GetCatalogueCardShopsDocument, options);
      }
export function useGetCatalogueCardShopsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueCardShopsQuery, GetCatalogueCardShopsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatalogueCardShopsQuery, GetCatalogueCardShopsQueryVariables>(GetCatalogueCardShopsDocument, options);
        }
export type GetCatalogueCardShopsQueryHookResult = ReturnType<typeof useGetCatalogueCardShopsQuery>;
export type GetCatalogueCardShopsLazyQueryHookResult = ReturnType<typeof useGetCatalogueCardShopsLazyQuery>;
export type GetCatalogueCardShopsQueryResult = Apollo.QueryResult<GetCatalogueCardShopsQuery, GetCatalogueCardShopsQueryVariables>;
export const UpdateProductCounterDocument = gql`
    mutation UpdateProductCounter($input: UpdateProductCounterInput!) {
  updateProductCounter(input: $input)
}
    `;
export type UpdateProductCounterMutationFn = Apollo.MutationFunction<UpdateProductCounterMutation, UpdateProductCounterMutationVariables>;

/**
 * __useUpdateProductCounterMutation__
 *
 * To run a mutation, you first call `useUpdateProductCounterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductCounterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductCounterMutation, { data, loading, error }] = useUpdateProductCounterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductCounterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductCounterMutation, UpdateProductCounterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductCounterMutation, UpdateProductCounterMutationVariables>(UpdateProductCounterDocument, options);
      }
export type UpdateProductCounterMutationHookResult = ReturnType<typeof useUpdateProductCounterMutation>;
export type UpdateProductCounterMutationResult = Apollo.MutationResult<UpdateProductCounterMutation>;
export type UpdateProductCounterMutationOptions = Apollo.BaseMutationOptions<UpdateProductCounterMutation, UpdateProductCounterMutationVariables>;
export const GetCatalogueRubricDocument = gql`
    query GetCatalogueRubric($input: CatalogueDataInput!) {
  getCatalogueData(input: $input) {
    ...CatalogueData
  }
}
    ${CatalogueDataFragmentDoc}`;

/**
 * __useGetCatalogueRubricQuery__
 *
 * To run a query within a React component, call `useGetCatalogueRubricQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueRubricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueRubricQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCatalogueRubricQuery(baseOptions: Apollo.QueryHookOptions<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>(GetCatalogueRubricDocument, options);
      }
export function useGetCatalogueRubricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>(GetCatalogueRubricDocument, options);
        }
export type GetCatalogueRubricQueryHookResult = ReturnType<typeof useGetCatalogueRubricQuery>;
export type GetCatalogueRubricLazyQueryHookResult = ReturnType<typeof useGetCatalogueRubricLazyQuery>;
export type GetCatalogueRubricQueryResult = Apollo.QueryResult<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>;
export const UpdateCatalogueCountersDocument = gql`
    mutation UpdateCatalogueCounters($input: CatalogueDataInput!) {
  updateCatalogueCounters(input: $input)
}
    `;
export type UpdateCatalogueCountersMutationFn = Apollo.MutationFunction<UpdateCatalogueCountersMutation, UpdateCatalogueCountersMutationVariables>;

/**
 * __useUpdateCatalogueCountersMutation__
 *
 * To run a mutation, you first call `useUpdateCatalogueCountersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCatalogueCountersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCatalogueCountersMutation, { data, loading, error }] = useUpdateCatalogueCountersMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCatalogueCountersMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCatalogueCountersMutation, UpdateCatalogueCountersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCatalogueCountersMutation, UpdateCatalogueCountersMutationVariables>(UpdateCatalogueCountersDocument, options);
      }
export type UpdateCatalogueCountersMutationHookResult = ReturnType<typeof useUpdateCatalogueCountersMutation>;
export type UpdateCatalogueCountersMutationResult = Apollo.MutationResult<UpdateCatalogueCountersMutation>;
export type UpdateCatalogueCountersMutationOptions = Apollo.BaseMutationOptions<UpdateCatalogueCountersMutation, UpdateCatalogueCountersMutationVariables>;
export const GetAllCompaniesDocument = gql`
    query GetAllCompanies($input: PaginationInput) {
  getAllCompanies(input: $input) {
    totalDocs
    page
    totalPages
    docs {
      ...CompanyInList
    }
  }
}
    ${CompanyInListFragmentDoc}`;

/**
 * __useGetAllCompaniesQuery__
 *
 * To run a query within a React component, call `useGetAllCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCompaniesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAllCompaniesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>(GetAllCompaniesDocument, options);
      }
export function useGetAllCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>(GetAllCompaniesDocument, options);
        }
export type GetAllCompaniesQueryHookResult = ReturnType<typeof useGetAllCompaniesQuery>;
export type GetAllCompaniesLazyQueryHookResult = ReturnType<typeof useGetAllCompaniesLazyQuery>;
export type GetAllCompaniesQueryResult = Apollo.QueryResult<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const GetCompanyDocument = gql`
    query GetCompany($_id: ObjectId!) {
  getCompany(_id: $_id) {
    ...Company
  }
}
    ${CompanyFragmentDoc}`;

/**
 * __useGetCompanyQuery__
 *
 * To run a query within a React component, call `useGetCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetCompanyQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyQuery, GetCompanyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
      }
export function useGetCompanyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyQuery, GetCompanyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
        }
export type GetCompanyQueryHookResult = ReturnType<typeof useGetCompanyQuery>;
export type GetCompanyLazyQueryHookResult = ReturnType<typeof useGetCompanyLazyQuery>;
export type GetCompanyQueryResult = Apollo.QueryResult<GetCompanyQuery, GetCompanyQueryVariables>;
export const GetCompanyShopsDocument = gql`
    query GetCompanyShops($companyId: ObjectId!, $input: PaginationInput) {
  getCompany(_id: $companyId) {
    _id
    shops(input: $input) {
      totalPages
      docs {
        ...ShopInList
      }
    }
  }
}
    ${ShopInListFragmentDoc}`;

/**
 * __useGetCompanyShopsQuery__
 *
 * To run a query within a React component, call `useGetCompanyShopsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyShopsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyShopsQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCompanyShopsQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyShopsQuery, GetCompanyShopsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyShopsQuery, GetCompanyShopsQueryVariables>(GetCompanyShopsDocument, options);
      }
export function useGetCompanyShopsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyShopsQuery, GetCompanyShopsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyShopsQuery, GetCompanyShopsQueryVariables>(GetCompanyShopsDocument, options);
        }
export type GetCompanyShopsQueryHookResult = ReturnType<typeof useGetCompanyShopsQuery>;
export type GetCompanyShopsLazyQueryHookResult = ReturnType<typeof useGetCompanyShopsLazyQuery>;
export type GetCompanyShopsQueryResult = Apollo.QueryResult<GetCompanyShopsQuery, GetCompanyShopsQueryVariables>;
export const GetAllShopsDocument = gql`
    query GetAllShops($input: PaginationInput) {
  getAllShops(input: $input) {
    totalPages
    docs {
      ...ShopInList
    }
  }
}
    ${ShopInListFragmentDoc}`;

/**
 * __useGetAllShopsQuery__
 *
 * To run a query within a React component, call `useGetAllShopsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllShopsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllShopsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAllShopsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllShopsQuery, GetAllShopsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllShopsQuery, GetAllShopsQueryVariables>(GetAllShopsDocument, options);
      }
export function useGetAllShopsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllShopsQuery, GetAllShopsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllShopsQuery, GetAllShopsQueryVariables>(GetAllShopsDocument, options);
        }
export type GetAllShopsQueryHookResult = ReturnType<typeof useGetAllShopsQuery>;
export type GetAllShopsLazyQueryHookResult = ReturnType<typeof useGetAllShopsLazyQuery>;
export type GetAllShopsQueryResult = Apollo.QueryResult<GetAllShopsQuery, GetAllShopsQueryVariables>;
export const GetShopDocument = gql`
    query GetShop($_id: ObjectId!) {
  getShop(_id: $_id) {
    ...Shop
  }
}
    ${ShopFragmentDoc}`;

/**
 * __useGetShopQuery__
 *
 * To run a query within a React component, call `useGetShopQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShopQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShopQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetShopQuery(baseOptions: Apollo.QueryHookOptions<GetShopQuery, GetShopQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShopQuery, GetShopQueryVariables>(GetShopDocument, options);
      }
export function useGetShopLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShopQuery, GetShopQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShopQuery, GetShopQueryVariables>(GetShopDocument, options);
        }
export type GetShopQueryHookResult = ReturnType<typeof useGetShopQuery>;
export type GetShopLazyQueryHookResult = ReturnType<typeof useGetShopLazyQuery>;
export type GetShopQueryResult = Apollo.QueryResult<GetShopQuery, GetShopQueryVariables>;
export const GetShopProductsDocument = gql`
    query GetShopProducts($shopId: ObjectId!, $input: PaginationInput) {
  getShop(_id: $shopId) {
    _id
    shopProductsIds
    shopProducts(input: $input) {
      totalPages
      docs {
        ...ShopProduct
      }
    }
  }
}
    ${ShopProductFragmentDoc}`;

/**
 * __useGetShopProductsQuery__
 *
 * To run a query within a React component, call `useGetShopProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShopProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShopProductsQuery({
 *   variables: {
 *      shopId: // value for 'shopId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetShopProductsQuery(baseOptions: Apollo.QueryHookOptions<GetShopProductsQuery, GetShopProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShopProductsQuery, GetShopProductsQueryVariables>(GetShopProductsDocument, options);
      }
export function useGetShopProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShopProductsQuery, GetShopProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShopProductsQuery, GetShopProductsQueryVariables>(GetShopProductsDocument, options);
        }
export type GetShopProductsQueryHookResult = ReturnType<typeof useGetShopProductsQuery>;
export type GetShopProductsLazyQueryHookResult = ReturnType<typeof useGetShopProductsLazyQuery>;
export type GetShopProductsQueryResult = Apollo.QueryResult<GetShopProductsQuery, GetShopProductsQueryVariables>;
export const GetAllConfigsDocument = gql`
    query GetAllConfigs {
  getAllConfigs {
    ...SiteConfig
  }
}
    ${SiteConfigFragmentDoc}`;

/**
 * __useGetAllConfigsQuery__
 *
 * To run a query within a React component, call `useGetAllConfigsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllConfigsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllConfigsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllConfigsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllConfigsQuery, GetAllConfigsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllConfigsQuery, GetAllConfigsQueryVariables>(GetAllConfigsDocument, options);
      }
export function useGetAllConfigsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllConfigsQuery, GetAllConfigsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllConfigsQuery, GetAllConfigsQueryVariables>(GetAllConfigsDocument, options);
        }
export type GetAllConfigsQueryHookResult = ReturnType<typeof useGetAllConfigsQuery>;
export type GetAllConfigsLazyQueryHookResult = ReturnType<typeof useGetAllConfigsLazyQuery>;
export type GetAllConfigsQueryResult = Apollo.QueryResult<GetAllConfigsQuery, GetAllConfigsQueryVariables>;
export const SessionUserDocument = gql`
    query SessionUser {
  me {
    ...SessionUser
  }
}
    ${SessionUserFragmentDoc}`;

/**
 * __useSessionUserQuery__
 *
 * To run a query within a React component, call `useSessionUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useSessionUserQuery(baseOptions?: Apollo.QueryHookOptions<SessionUserQuery, SessionUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SessionUserQuery, SessionUserQueryVariables>(SessionUserDocument, options);
      }
export function useSessionUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionUserQuery, SessionUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SessionUserQuery, SessionUserQueryVariables>(SessionUserDocument, options);
        }
export type SessionUserQueryHookResult = ReturnType<typeof useSessionUserQuery>;
export type SessionUserLazyQueryHookResult = ReturnType<typeof useSessionUserLazyQuery>;
export type SessionUserQueryResult = Apollo.QueryResult<SessionUserQuery, SessionUserQueryVariables>;
export const SessionCartDocument = gql`
    query SessionCart {
  getSessionCart {
    ...Cart
  }
}
    ${CartFragmentDoc}`;

/**
 * __useSessionCartQuery__
 *
 * To run a query within a React component, call `useSessionCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useSessionCartQuery(baseOptions?: Apollo.QueryHookOptions<SessionCartQuery, SessionCartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SessionCartQuery, SessionCartQueryVariables>(SessionCartDocument, options);
      }
export function useSessionCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionCartQuery, SessionCartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SessionCartQuery, SessionCartQueryVariables>(SessionCartDocument, options);
        }
export type SessionCartQueryHookResult = ReturnType<typeof useSessionCartQuery>;
export type SessionCartLazyQueryHookResult = ReturnType<typeof useSessionCartLazyQuery>;
export type SessionCartQueryResult = Apollo.QueryResult<SessionCartQuery, SessionCartQueryVariables>;
export const InitialSiteDocument = gql`
    query InitialSite {
  ...InitialData
  getCatalogueNavRubrics {
    ...CatalogueNavRubric
  }
}
    ${InitialDataFragmentDoc}
${CatalogueNavRubricFragmentDoc}`;

/**
 * __useInitialSiteQuery__
 *
 * To run a query within a React component, call `useInitialSiteQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitialSiteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitialSiteQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitialSiteQuery(baseOptions?: Apollo.QueryHookOptions<InitialSiteQuery, InitialSiteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitialSiteQuery, InitialSiteQueryVariables>(InitialSiteDocument, options);
      }
export function useInitialSiteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitialSiteQuery, InitialSiteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitialSiteQuery, InitialSiteQueryVariables>(InitialSiteDocument, options);
        }
export type InitialSiteQueryHookResult = ReturnType<typeof useInitialSiteQuery>;
export type InitialSiteLazyQueryHookResult = ReturnType<typeof useInitialSiteLazyQuery>;
export type InitialSiteQueryResult = Apollo.QueryResult<InitialSiteQuery, InitialSiteQueryVariables>;
export const InitialAppDocument = gql`
    query InitialApp {
  ...InitialData
}
    ${InitialDataFragmentDoc}`;

/**
 * __useInitialAppQuery__
 *
 * To run a query within a React component, call `useInitialAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitialAppQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitialAppQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitialAppQuery(baseOptions?: Apollo.QueryHookOptions<InitialAppQuery, InitialAppQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitialAppQuery, InitialAppQueryVariables>(InitialAppDocument, options);
      }
export function useInitialAppLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitialAppQuery, InitialAppQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitialAppQuery, InitialAppQueryVariables>(InitialAppDocument, options);
        }
export type InitialAppQueryHookResult = ReturnType<typeof useInitialAppQuery>;
export type InitialAppLazyQueryHookResult = ReturnType<typeof useInitialAppLazyQuery>;
export type InitialAppQueryResult = Apollo.QueryResult<InitialAppQuery, InitialAppQueryVariables>;
export const GetAllLanguagesDocument = gql`
    query GetAllLanguages {
  getAllLanguages {
    ...Language
  }
}
    ${LanguageFragmentDoc}`;

/**
 * __useGetAllLanguagesQuery__
 *
 * To run a query within a React component, call `useGetAllLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllLanguagesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>(GetAllLanguagesDocument, options);
      }
export function useGetAllLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>(GetAllLanguagesDocument, options);
        }
export type GetAllLanguagesQueryHookResult = ReturnType<typeof useGetAllLanguagesQuery>;
export type GetAllLanguagesLazyQueryHookResult = ReturnType<typeof useGetAllLanguagesLazyQuery>;
export type GetAllLanguagesQueryResult = Apollo.QueryResult<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>;
export const GetValidationMessagesDocument = gql`
    query GetValidationMessages {
  getValidationMessages {
    ...Message
  }
}
    ${MessageFragmentDoc}`;

/**
 * __useGetValidationMessagesQuery__
 *
 * To run a query within a React component, call `useGetValidationMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetValidationMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetValidationMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetValidationMessagesQuery(baseOptions?: Apollo.QueryHookOptions<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>(GetValidationMessagesDocument, options);
      }
export function useGetValidationMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>(GetValidationMessagesDocument, options);
        }
export type GetValidationMessagesQueryHookResult = ReturnType<typeof useGetValidationMessagesQuery>;
export type GetValidationMessagesLazyQueryHookResult = ReturnType<typeof useGetValidationMessagesLazyQuery>;
export type GetValidationMessagesQueryResult = Apollo.QueryResult<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>;
export const GetAllOptionsGroupsDocument = gql`
    query GetAllOptionsGroups {
  getAllOptionsGroups {
    ...OptionsGroupInlist
  }
}
    ${OptionsGroupInlistFragmentDoc}`;

/**
 * __useGetAllOptionsGroupsQuery__
 *
 * To run a query within a React component, call `useGetAllOptionsGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllOptionsGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllOptionsGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllOptionsGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>(GetAllOptionsGroupsDocument, options);
      }
export function useGetAllOptionsGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>(GetAllOptionsGroupsDocument, options);
        }
export type GetAllOptionsGroupsQueryHookResult = ReturnType<typeof useGetAllOptionsGroupsQuery>;
export type GetAllOptionsGroupsLazyQueryHookResult = ReturnType<typeof useGetAllOptionsGroupsLazyQuery>;
export type GetAllOptionsGroupsQueryResult = Apollo.QueryResult<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>;
export const GetOptionsGroupDocument = gql`
    query GetOptionsGroup($_id: ObjectId!) {
  getOptionsGroup(_id: $_id) {
    ...OptionsGroup
  }
}
    ${OptionsGroupFragmentDoc}`;

/**
 * __useGetOptionsGroupQuery__
 *
 * To run a query within a React component, call `useGetOptionsGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOptionsGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOptionsGroupQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetOptionsGroupQuery(baseOptions: Apollo.QueryHookOptions<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>(GetOptionsGroupDocument, options);
      }
export function useGetOptionsGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>(GetOptionsGroupDocument, options);
        }
export type GetOptionsGroupQueryHookResult = ReturnType<typeof useGetOptionsGroupQuery>;
export type GetOptionsGroupLazyQueryHookResult = ReturnType<typeof useGetOptionsGroupLazyQuery>;
export type GetOptionsGroupQueryResult = Apollo.QueryResult<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>;
export const GetAllCmsOrdersDocument = gql`
    query GetAllCMSOrders($input: PaginationInput) {
  getAllOrders(input: $input) {
    totalDocs
    page
    totalPages
    docs {
      ...CmsOrderInList
    }
  }
}
    ${CmsOrderInListFragmentDoc}`;

/**
 * __useGetAllCmsOrdersQuery__
 *
 * To run a query within a React component, call `useGetAllCmsOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCmsOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCmsOrdersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAllCmsOrdersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCmsOrdersQuery, GetAllCmsOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCmsOrdersQuery, GetAllCmsOrdersQueryVariables>(GetAllCmsOrdersDocument, options);
      }
export function useGetAllCmsOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCmsOrdersQuery, GetAllCmsOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCmsOrdersQuery, GetAllCmsOrdersQueryVariables>(GetAllCmsOrdersDocument, options);
        }
export type GetAllCmsOrdersQueryHookResult = ReturnType<typeof useGetAllCmsOrdersQuery>;
export type GetAllCmsOrdersLazyQueryHookResult = ReturnType<typeof useGetAllCmsOrdersLazyQuery>;
export type GetAllCmsOrdersQueryResult = Apollo.QueryResult<GetAllCmsOrdersQuery, GetAllCmsOrdersQueryVariables>;
export const GetCmsOrderDocument = gql`
    query GetCmsOrder($_id: ObjectId!) {
  getOrder(_id: $_id) {
    ...CmsOrder
  }
}
    ${CmsOrderFragmentDoc}`;

/**
 * __useGetCmsOrderQuery__
 *
 * To run a query within a React component, call `useGetCmsOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCmsOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCmsOrderQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetCmsOrderQuery(baseOptions: Apollo.QueryHookOptions<GetCmsOrderQuery, GetCmsOrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCmsOrderQuery, GetCmsOrderQueryVariables>(GetCmsOrderDocument, options);
      }
export function useGetCmsOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCmsOrderQuery, GetCmsOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCmsOrderQuery, GetCmsOrderQueryVariables>(GetCmsOrderDocument, options);
        }
export type GetCmsOrderQueryHookResult = ReturnType<typeof useGetCmsOrderQuery>;
export type GetCmsOrderLazyQueryHookResult = ReturnType<typeof useGetCmsOrderLazyQuery>;
export type GetCmsOrderQueryResult = Apollo.QueryResult<GetCmsOrderQuery, GetCmsOrderQueryVariables>;
export const GetAllMyOrdersDocument = gql`
    query GetAllMyOrders($input: PaginationInput) {
  getAllMyOrders(input: $input) {
    totalDocs
    page
    totalPages
    docs {
      ...MyOrder
    }
  }
}
    ${MyOrderFragmentDoc}`;

/**
 * __useGetAllMyOrdersQuery__
 *
 * To run a query within a React component, call `useGetAllMyOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllMyOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllMyOrdersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAllMyOrdersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllMyOrdersQuery, GetAllMyOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllMyOrdersQuery, GetAllMyOrdersQueryVariables>(GetAllMyOrdersDocument, options);
      }
export function useGetAllMyOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllMyOrdersQuery, GetAllMyOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllMyOrdersQuery, GetAllMyOrdersQueryVariables>(GetAllMyOrdersDocument, options);
        }
export type GetAllMyOrdersQueryHookResult = ReturnType<typeof useGetAllMyOrdersQuery>;
export type GetAllMyOrdersLazyQueryHookResult = ReturnType<typeof useGetAllMyOrdersLazyQuery>;
export type GetAllMyOrdersQueryResult = Apollo.QueryResult<GetAllMyOrdersQuery, GetAllMyOrdersQueryVariables>;
export const GetAllRolesDocument = gql`
    query GetAllRoles {
  getAllRoles {
    ...CmsRole
  }
}
    ${CmsRoleFragmentDoc}`;

/**
 * __useGetAllRolesQuery__
 *
 * To run a query within a React component, call `useGetAllRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, options);
      }
export function useGetAllRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, options);
        }
export type GetAllRolesQueryHookResult = ReturnType<typeof useGetAllRolesQuery>;
export type GetAllRolesLazyQueryHookResult = ReturnType<typeof useGetAllRolesLazyQuery>;
export type GetAllRolesQueryResult = Apollo.QueryResult<GetAllRolesQuery, GetAllRolesQueryVariables>;
export const GetRoleDocument = gql`
    query GetRole($_id: ObjectId!) {
  getRole(_id: $_id) {
    ...CmsRole
  }
}
    ${CmsRoleFragmentDoc}`;

/**
 * __useGetRoleQuery__
 *
 * To run a query within a React component, call `useGetRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoleQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetRoleQuery(baseOptions: Apollo.QueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
      }
export function useGetRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
        }
export type GetRoleQueryHookResult = ReturnType<typeof useGetRoleQuery>;
export type GetRoleLazyQueryHookResult = ReturnType<typeof useGetRoleLazyQuery>;
export type GetRoleQueryResult = Apollo.QueryResult<GetRoleQuery, GetRoleQueryVariables>;
export const GetAllRubricVariantsDocument = gql`
    query GetAllRubricVariants {
  getAllRubricVariants {
    ...RubricVariant
  }
  getGenderOptions {
    _id
    name
  }
}
    ${RubricVariantFragmentDoc}`;

/**
 * __useGetAllRubricVariantsQuery__
 *
 * To run a query within a React component, call `useGetAllRubricVariantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRubricVariantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRubricVariantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRubricVariantsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>(GetAllRubricVariantsDocument, options);
      }
export function useGetAllRubricVariantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>(GetAllRubricVariantsDocument, options);
        }
export type GetAllRubricVariantsQueryHookResult = ReturnType<typeof useGetAllRubricVariantsQuery>;
export type GetAllRubricVariantsLazyQueryHookResult = ReturnType<typeof useGetAllRubricVariantsLazyQuery>;
export type GetAllRubricVariantsQueryResult = Apollo.QueryResult<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>;
export const GetCatalogueSearchTopItemsDocument = gql`
    query GetCatalogueSearchTopItems {
  getCatalogueSearchTopItems {
    rubrics {
      ...CatalogueRubric
    }
    products {
      ...ProductSnippet
    }
  }
}
    ${CatalogueRubricFragmentDoc}
${ProductSnippetFragmentDoc}`;

/**
 * __useGetCatalogueSearchTopItemsQuery__
 *
 * To run a query within a React component, call `useGetCatalogueSearchTopItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueSearchTopItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueSearchTopItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCatalogueSearchTopItemsQuery(baseOptions?: Apollo.QueryHookOptions<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>(GetCatalogueSearchTopItemsDocument, options);
      }
export function useGetCatalogueSearchTopItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>(GetCatalogueSearchTopItemsDocument, options);
        }
export type GetCatalogueSearchTopItemsQueryHookResult = ReturnType<typeof useGetCatalogueSearchTopItemsQuery>;
export type GetCatalogueSearchTopItemsLazyQueryHookResult = ReturnType<typeof useGetCatalogueSearchTopItemsLazyQuery>;
export type GetCatalogueSearchTopItemsQueryResult = Apollo.QueryResult<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>;
export const GetCatalogueSearchResultDocument = gql`
    query GetCatalogueSearchResult($search: String!) {
  getCatalogueSearchResult(search: $search) {
    rubrics {
      ...CatalogueRubric
    }
    products {
      ...ProductSnippet
    }
  }
}
    ${CatalogueRubricFragmentDoc}
${ProductSnippetFragmentDoc}`;

/**
 * __useGetCatalogueSearchResultQuery__
 *
 * To run a query within a React component, call `useGetCatalogueSearchResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueSearchResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueSearchResultQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetCatalogueSearchResultQuery(baseOptions: Apollo.QueryHookOptions<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>(GetCatalogueSearchResultDocument, options);
      }
export function useGetCatalogueSearchResultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>(GetCatalogueSearchResultDocument, options);
        }
export type GetCatalogueSearchResultQueryHookResult = ReturnType<typeof useGetCatalogueSearchResultQuery>;
export type GetCatalogueSearchResultLazyQueryHookResult = ReturnType<typeof useGetCatalogueSearchResultLazyQuery>;
export type GetCatalogueSearchResultQueryResult = Apollo.QueryResult<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>;
export const GetGenderOptionsDocument = gql`
    query GetGenderOptions {
  getGenderOptions {
    ...SelectOption
  }
}
    ${SelectOptionFragmentDoc}`;

/**
 * __useGetGenderOptionsQuery__
 *
 * To run a query within a React component, call `useGetGenderOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGenderOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGenderOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGenderOptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>(GetGenderOptionsDocument, options);
      }
export function useGetGenderOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>(GetGenderOptionsDocument, options);
        }
export type GetGenderOptionsQueryHookResult = ReturnType<typeof useGetGenderOptionsQuery>;
export type GetGenderOptionsLazyQueryHookResult = ReturnType<typeof useGetGenderOptionsLazyQuery>;
export type GetGenderOptionsQueryResult = Apollo.QueryResult<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>;
export const AttributeViewVariantOptionsDocument = gql`
    query AttributeViewVariantOptions {
  getAttributeViewVariantsOptions {
    ...SelectOption
  }
}
    ${SelectOptionFragmentDoc}`;

/**
 * __useAttributeViewVariantOptionsQuery__
 *
 * To run a query within a React component, call `useAttributeViewVariantOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttributeViewVariantOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttributeViewVariantOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAttributeViewVariantOptionsQuery(baseOptions?: Apollo.QueryHookOptions<AttributeViewVariantOptionsQuery, AttributeViewVariantOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AttributeViewVariantOptionsQuery, AttributeViewVariantOptionsQueryVariables>(AttributeViewVariantOptionsDocument, options);
      }
export function useAttributeViewVariantOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AttributeViewVariantOptionsQuery, AttributeViewVariantOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AttributeViewVariantOptionsQuery, AttributeViewVariantOptionsQueryVariables>(AttributeViewVariantOptionsDocument, options);
        }
export type AttributeViewVariantOptionsQueryHookResult = ReturnType<typeof useAttributeViewVariantOptionsQuery>;
export type AttributeViewVariantOptionsLazyQueryHookResult = ReturnType<typeof useAttributeViewVariantOptionsLazyQuery>;
export type AttributeViewVariantOptionsQueryResult = Apollo.QueryResult<AttributeViewVariantOptionsQuery, AttributeViewVariantOptionsQueryVariables>;
export const IconsOptionsDocument = gql`
    query IconsOptions {
  getIconsOptions {
    ...SelectOption
  }
}
    ${SelectOptionFragmentDoc}`;

/**
 * __useIconsOptionsQuery__
 *
 * To run a query within a React component, call `useIconsOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIconsOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIconsOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useIconsOptionsQuery(baseOptions?: Apollo.QueryHookOptions<IconsOptionsQuery, IconsOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IconsOptionsQuery, IconsOptionsQueryVariables>(IconsOptionsDocument, options);
      }
export function useIconsOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IconsOptionsQuery, IconsOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IconsOptionsQuery, IconsOptionsQueryVariables>(IconsOptionsDocument, options);
        }
export type IconsOptionsQueryHookResult = ReturnType<typeof useIconsOptionsQuery>;
export type IconsOptionsLazyQueryHookResult = ReturnType<typeof useIconsOptionsLazyQuery>;
export type IconsOptionsQueryResult = Apollo.QueryResult<IconsOptionsQuery, IconsOptionsQueryVariables>;
export const OptionsGroupVariantsDocument = gql`
    query OptionsGroupVariants {
  getOptionsGroupVariantsOptions {
    ...SelectOption
  }
}
    ${SelectOptionFragmentDoc}`;

/**
 * __useOptionsGroupVariantsQuery__
 *
 * To run a query within a React component, call `useOptionsGroupVariantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOptionsGroupVariantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOptionsGroupVariantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOptionsGroupVariantsQuery(baseOptions?: Apollo.QueryHookOptions<OptionsGroupVariantsQuery, OptionsGroupVariantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OptionsGroupVariantsQuery, OptionsGroupVariantsQueryVariables>(OptionsGroupVariantsDocument, options);
      }
export function useOptionsGroupVariantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OptionsGroupVariantsQuery, OptionsGroupVariantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OptionsGroupVariantsQuery, OptionsGroupVariantsQueryVariables>(OptionsGroupVariantsDocument, options);
        }
export type OptionsGroupVariantsQueryHookResult = ReturnType<typeof useOptionsGroupVariantsQuery>;
export type OptionsGroupVariantsLazyQueryHookResult = ReturnType<typeof useOptionsGroupVariantsLazyQuery>;
export type OptionsGroupVariantsQueryResult = Apollo.QueryResult<OptionsGroupVariantsQuery, OptionsGroupVariantsQueryVariables>;
export const GetIsoLanguagesListDocument = gql`
    query GetISOLanguagesList {
  getISOLanguagesOptions {
    ...SelectOption
  }
}
    ${SelectOptionFragmentDoc}`;

/**
 * __useGetIsoLanguagesListQuery__
 *
 * To run a query within a React component, call `useGetIsoLanguagesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIsoLanguagesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsoLanguagesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetIsoLanguagesListQuery(baseOptions?: Apollo.QueryHookOptions<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>(GetIsoLanguagesListDocument, options);
      }
export function useGetIsoLanguagesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>(GetIsoLanguagesListDocument, options);
        }
export type GetIsoLanguagesListQueryHookResult = ReturnType<typeof useGetIsoLanguagesListQuery>;
export type GetIsoLanguagesListLazyQueryHookResult = ReturnType<typeof useGetIsoLanguagesListLazyQuery>;
export type GetIsoLanguagesListQueryResult = Apollo.QueryResult<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>;
export const GetNewAttributeOptionsDocument = gql`
    query GetNewAttributeOptions {
  getAllOptionsGroups {
    _id
    name
  }
  getAllMetricsOptions {
    _id
    name
  }
  getAttributeVariantsOptions {
    _id
    name
  }
  getAttributePositioningOptions {
    _id
    name
  }
  getAttributeViewVariantsOptions {
    ...SelectOption
  }
}
    ${SelectOptionFragmentDoc}`;

/**
 * __useGetNewAttributeOptionsQuery__
 *
 * To run a query within a React component, call `useGetNewAttributeOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNewAttributeOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewAttributeOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNewAttributeOptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>(GetNewAttributeOptionsDocument, options);
      }
export function useGetNewAttributeOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>(GetNewAttributeOptionsDocument, options);
        }
export type GetNewAttributeOptionsQueryHookResult = ReturnType<typeof useGetNewAttributeOptionsQuery>;
export type GetNewAttributeOptionsLazyQueryHookResult = ReturnType<typeof useGetNewAttributeOptionsLazyQuery>;
export type GetNewAttributeOptionsQueryResult = Apollo.QueryResult<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>;
export const UsersSerchDocument = gql`
    query UsersSerch($input: PaginationInput!) {
  getAllUsers(input: $input) {
    totalDocs
    page
    totalPages
    docs {
      ...UserInList
    }
  }
}
    ${UserInListFragmentDoc}`;

/**
 * __useUsersSerchQuery__
 *
 * To run a query within a React component, call `useUsersSerchQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersSerchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersSerchQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUsersSerchQuery(baseOptions: Apollo.QueryHookOptions<UsersSerchQuery, UsersSerchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersSerchQuery, UsersSerchQueryVariables>(UsersSerchDocument, options);
      }
export function useUsersSerchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersSerchQuery, UsersSerchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersSerchQuery, UsersSerchQueryVariables>(UsersSerchDocument, options);
        }
export type UsersSerchQueryHookResult = ReturnType<typeof useUsersSerchQuery>;
export type UsersSerchLazyQueryHookResult = ReturnType<typeof useUsersSerchLazyQuery>;
export type UsersSerchQueryResult = Apollo.QueryResult<UsersSerchQuery, UsersSerchQueryVariables>;