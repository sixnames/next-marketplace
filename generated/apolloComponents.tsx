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
  /** Date custom scalar type */
  Date: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** Mongo object id scalar type */
  ObjectId: any;
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
};

export type AddAttributeToGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  metricId?: Maybe<Scalars['ObjectId']>;
  capitalise?: Maybe<Scalars['Boolean']>;
  notShowAsAlphabet?: Maybe<Scalars['Boolean']>;
  showNameInTitle?: Maybe<Scalars['Boolean']>;
  showNameInSelectedAttributes?: Maybe<Scalars['Boolean']>;
  showNameInSnippetTitle?: Maybe<Scalars['Boolean']>;
  showAsBreadcrumb: Scalars['Boolean'];
  showAsCatalogueBreadcrumb: Scalars['Boolean'];
  showInSnippet: Scalars['Boolean'];
  showInCard: Scalars['Boolean'];
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
};

export type AddAttributesGroupToCategoryInput = {
  categoryId: Scalars['ObjectId'];
  attributesGroupId: Scalars['ObjectId'];
};

export type AddAttributesGroupToRubricInput = {
  rubricId: Scalars['ObjectId'];
  attributesGroupId: Scalars['ObjectId'];
};

export type AddCityToCountryInput = {
  countryId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
};

export type AddCollectionToBrandInput = {
  brandId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type AddOptionToGroupInput = {
  optionsGroupId: Scalars['ObjectId'];
  parentId?: Maybe<Scalars['ObjectId']>;
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  variants: Scalars['JSONObject'];
  gender?: Maybe<Gender>;
};

export type AddProductToCartInput = {
  productId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
  amount: Scalars['Int'];
};

export type AddProductToConnectionInput = {
  productId: Scalars['ObjectId'];
  addProductId: Scalars['ObjectId'];
  connectionId: Scalars['ObjectId'];
};

export type AddProductToShopInput = {
  shopId: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
  price: Scalars['Int'];
  available: Scalars['Int'];
};

export type AddShopToCartProductInput = {
  cartProductId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
};

export type AddShopToCompanyInput = {
  companyId: Scalars['ObjectId'];
  name: Scalars['String'];
  citySlug: Scalars['String'];
  license?: Maybe<Scalars['String']>;
  contacts: ContactsInput;
  address: AddressInput;
};

export type AddShoplessProductToCartInput = {
  productId: Scalars['ObjectId'];
  amount: Scalars['Int'];
};

export type Address = {
  __typename?: 'Address';
  formattedAddress: Scalars['String'];
  point: PointGeoJson;
  formattedCoordinates: Coordinates;
};

export type AddressInput = {
  formattedAddress: Scalars['String'];
  point: CoordinatesInput;
};

export type AlphabetList = {
  letter: Scalars['String'];
};

export type Asset = {
  __typename?: 'Asset';
  url: Scalars['String'];
  index: Scalars['Int'];
};

export type Attribute = {
  __typename?: 'Attribute';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug?: Maybe<Scalars['String']>;
  capitalise?: Maybe<Scalars['Boolean']>;
  notShowAsAlphabet?: Maybe<Scalars['Boolean']>;
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
  metric?: Maybe<Metric>;
  name: Scalars['String'];
  optionsGroup?: Maybe<OptionsGroup>;
};

/** Attribute position in catalogue title enum. */
export enum AttributePositionInTitle {
  Begin = 'begin',
  End = 'end',
  BeforeKeyword = 'beforeKeyword',
  AfterKeyword = 'afterKeyword',
  ReplaceKeyword = 'replaceKeyword'
}

/** Attribute variant enum. */
export enum AttributeVariant {
  Select = 'select',
  MultipleSelect = 'multipleSelect',
  String = 'string',
  Number = 'number'
}

/** Attribute view in product card variant enum. */
export enum AttributeViewVariant {
  List = 'list',
  Text = 'text',
  Tag = 'tag',
  Icon = 'icon',
  OuterRating = 'outerRating'
}

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

export type Base = {
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
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
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  collections: BrandCollectionsPaginationPayload;
  collectionsList: Array<BrandCollection>;
};


export type BrandCollectionsArgs = {
  input?: Maybe<PaginationInput>;
};

export type BrandAlphabetInput = {
  slugs?: Maybe<Array<Scalars['String']>>;
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

export type BrandCollectionAlphabetInput = {
  brandId?: Maybe<Scalars['ObjectId']>;
  brandSlug?: Maybe<Scalars['String']>;
  slugs?: Maybe<Array<Scalars['String']>>;
};

export type BrandCollectionsAlphabetList = AlphabetList & {
  __typename?: 'BrandCollectionsAlphabetList';
  letter: Scalars['String'];
  docs: Array<BrandCollection>;
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

export type BrandPayload = Payload & {
  __typename?: 'BrandPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Brand>;
};

export type BrandsAlphabetList = AlphabetList & {
  __typename?: 'BrandsAlphabetList';
  letter: Scalars['String'];
  docs: Array<Brand>;
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

export type Cart = {
  __typename?: 'Cart';
  _id: Scalars['ObjectId'];
  cartProducts: Array<CartProduct>;
};

export type CartPayload = {
  __typename?: 'CartPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type CartProduct = Base & {
  __typename?: 'CartProduct';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  amount: Scalars['Int'];
  shopProductId?: Maybe<Scalars['ObjectId']>;
  productId?: Maybe<Scalars['ObjectId']>;
};

export type CatalogueAdditionalOptionsInput = {
  companyId?: Maybe<Scalars['ObjectId']>;
  isSearchResult?: Maybe<Scalars['Boolean']>;
  attributeSlug: Scalars['String'];
  filter: Array<Scalars['String']>;
  rubricSlug: Scalars['String'];
};

export type CatalogueDataInput = {
  companySlug?: Maybe<Scalars['String']>;
  filter: Array<Scalars['String']>;
  rubricSlug: Scalars['String'];
};

export type CatalogueSearchInput = {
  search: Scalars['String'];
  companyId?: Maybe<Scalars['ObjectId']>;
  companySlug?: Maybe<Scalars['String']>;
};

export type CatalogueSearchResult = {
  __typename?: 'CatalogueSearchResult';
  rubrics: Array<Rubric>;
  products: Array<Product>;
};

export type CatalogueSearchTopItemsInput = {
  companyId?: Maybe<Scalars['ObjectId']>;
  companySlug?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  image?: Maybe<Scalars['String']>;
  rubricId: Scalars['ObjectId'];
  parentId?: Maybe<Scalars['ObjectId']>;
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
};

export type CategoryPayload = Payload & {
  __typename?: 'CategoryPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Category>;
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

export type City = {
  __typename?: 'City';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  name: Scalars['String'];
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

export type CompanyPayload = Payload & {
  __typename?: 'CompanyPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Company>;
};

export type Config = {
  __typename?: 'Config';
  _id: Scalars['ObjectId'];
  /** Set to true if config is able to hold multiple values. */
  multi: Scalars['Boolean'];
  /** Accepted formats for asset config */
  acceptedFormats: Array<Scalars['String']>;
  slug: Scalars['String'];
  group: Scalars['String'];
  companySlug: Scalars['String'];
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

/** Site config variant enum. */
export enum ConfigVariant {
  String = 'string',
  Number = 'number',
  Tel = 'tel',
  Email = 'email',
  Asset = 'asset',
  Boolean = 'boolean',
  Constructor = 'constructor',
  Color = 'color'
}

export type ConfirmOrderInput = {
  orderId: Scalars['ObjectId'];
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

export type Coordinates = {
  __typename?: 'Coordinates';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type CoordinatesInput = {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type CopyProductInput = {
  productId: Scalars['ObjectId'];
  barcode?: Maybe<Array<Scalars['String']>>;
  active: Scalars['Boolean'];
  originalName: Scalars['String'];
  nameI18n?: Maybe<Scalars['JSONObject']>;
  descriptionI18n: Scalars['JSONObject'];
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

export type CreateAttributesGroupInput = {
  nameI18n: Scalars['JSONObject'];
};

export type CreateBrandInput = {
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type CreateCategoryInput = {
  nameI18n: Scalars['JSONObject'];
  parentId?: Maybe<Scalars['ObjectId']>;
  rubricId: Scalars['ObjectId'];
  gender?: Maybe<Gender>;
};

export type CreateCompanyInput = {
  name: Scalars['String'];
  ownerId: Scalars['ObjectId'];
  staffIds: Array<Scalars['ObjectId']>;
  domain?: Maybe<Scalars['String']>;
  contacts: ContactsInput;
};

export type CreateCountryInput = {
  name: Scalars['String'];
  currency: Scalars['String'];
};

export type CreateCurrencyInput = {
  name: Scalars['String'];
};

export type CreateLanguageInput = {
  name: Scalars['String'];
  slug: Scalars['String'];
  nativeName: Scalars['String'];
};

export type CreateManufacturerInput = {
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type CreateMetricInput = {
  nameI18n: Scalars['JSONObject'];
};

export type CreateNavItemInput = {
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  path: Scalars['String'];
  navGroup: Scalars['String'];
  index: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
};

export type CreateOptionsGroupInput = {
  nameI18n: Scalars['JSONObject'];
  variant: OptionsGroupVariant;
};

export type CreateOrderStatusInput = {
  nameI18n: Scalars['JSONObject'];
  color: Scalars['String'];
  index: Scalars['Int'];
};

export type CreatePageInput = {
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  index: Scalars['Int'];
  pagesGroupId: Scalars['ObjectId'];
  citySlug: Scalars['String'];
  isTemplate?: Maybe<Scalars['Boolean']>;
};

export type CreatePagesGroupInput = {
  nameI18n: Scalars['JSONObject'];
  index: Scalars['Int'];
  companySlug: Scalars['String'];
  showInFooter: Scalars['Boolean'];
  showInHeader: Scalars['Boolean'];
  isTemplate?: Maybe<Scalars['Boolean']>;
};

export type CreateProductConnectionInput = {
  productId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type CreateProductInput = {
  active: Scalars['Boolean'];
  barcode?: Maybe<Array<Scalars['String']>>;
  originalName: Scalars['String'];
  nameI18n?: Maybe<Scalars['JSONObject']>;
  descriptionI18n: Scalars['JSONObject'];
  rubricId: Scalars['ObjectId'];
};

export type CreateProductWithSyncErrorInput = {
  barcode: Scalars['String'];
  available: Scalars['Int'];
  price: Scalars['Int'];
  shopId: Scalars['ObjectId'];
  productFields: CreateProductInput;
};

export type CreateRoleInput = {
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  isStaff: Scalars['Boolean'];
  isCompanyStaff: Scalars['Boolean'];
};

export type CreateRubricInput = {
  nameI18n: Scalars['JSONObject'];
  capitalise?: Maybe<Scalars['Boolean']>;
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  variantId: Scalars['ObjectId'];
  catalogueTitle: RubricCatalogueTitleInput;
};

export type CreateRubricVariantInput = {
  nameI18n: Scalars['JSONObject'];
  companySlug: Scalars['String'];
};

export type CreateSupplierInput = {
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type CreateUserInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  roleId: Scalars['ObjectId'];
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


export type DeleteAttributeFromGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type DeleteAttributesGroupFromCategoryInput = {
  categoryId: Scalars['ObjectId'];
  attributesGroupId: Scalars['ObjectId'];
};

export type DeleteAttributesGroupFromRubricInput = {
  rubricId: Scalars['ObjectId'];
  attributesGroupId: Scalars['ObjectId'];
};

export type DeleteCityFromCountryInput = {
  countryId: Scalars['ObjectId'];
  cityId: Scalars['ObjectId'];
};

export type DeleteCollectionFromBrandInput = {
  brandId: Scalars['ObjectId'];
  brandCollectionId: Scalars['ObjectId'];
};

export type DeleteOptionFromGroupInput = {
  optionId: Scalars['ObjectId'];
  optionsGroupId: Scalars['ObjectId'];
};

export type DeletePageInput = {
  _id: Scalars['ObjectId'];
  isTemplate?: Maybe<Scalars['Boolean']>;
};

export type DeletePagesGroupInput = {
  _id: Scalars['ObjectId'];
  isTemplate?: Maybe<Scalars['Boolean']>;
};

export type DeleteProductAssetInput = {
  productId: Scalars['ObjectId'];
  assetIndex: Scalars['Int'];
};

export type DeleteProductFromCartInput = {
  cartProductId: Scalars['ObjectId'];
};

export type DeleteProductFromCategoryInput = {
  categoryId: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
};

export type DeleteProductFromConnectionInput = {
  productId: Scalars['ObjectId'];
  deleteProductId: Scalars['ObjectId'];
  connectionId: Scalars['ObjectId'];
};

export type DeleteProductFromRubricInput = {
  rubricId: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
};

export type DeleteProductFromShopInput = {
  shopId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
};

export type DeleteShopAssetInput = {
  shopId: Scalars['ObjectId'];
  assetIndex: Scalars['Int'];
};

export type DeleteShopFromCompanyInput = {
  companyId: Scalars['ObjectId'];
  shopId: Scalars['ObjectId'];
};


export type FormattedPhone = {
  __typename?: 'FormattedPhone';
  raw: Scalars['String'];
  readable: Scalars['String'];
};

/** Gender enum. */
export enum Gender {
  He = 'he',
  She = 'she',
  It = 'it',
  Plural = 'plural'
}

export type GetAllRubricsInput = {
  excludedRubricsIds?: Maybe<Array<Scalars['ObjectId']>>;
};

export type GetNewOrdersCounterInput = {
  companyId?: Maybe<Scalars['ObjectId']>;
  shopId?: Maybe<Scalars['ObjectId']>;
  customerId?: Maybe<Scalars['ObjectId']>;
};

export type GetProductShopsInput = {
  productId: Scalars['ObjectId'];
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<SortDirection>;
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

export type MakeAnOrderInput = {
  name: Scalars['String'];
  phone: Scalars['PhoneNumber'];
  email: Scalars['EmailAddress'];
  reservationDate: Scalars['Date'];
  comment?: Maybe<Scalars['String']>;
  companySlug?: Maybe<Scalars['String']>;
};

export type MakeAnOrderPayload = Payload & {
  __typename?: 'MakeAnOrderPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
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

export type ManufacturerAlphabetInput = {
  slugs?: Maybe<Array<Scalars['String']>>;
};

export type ManufacturerPayload = Payload & {
  __typename?: 'ManufacturerPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Manufacturer>;
};

export type ManufacturersAlphabetList = AlphabetList & {
  __typename?: 'ManufacturersAlphabetList';
  letter: Scalars['String'];
  docs: Array<Manufacturer>;
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

export type MapMarker = {
  __typename?: 'MapMarker';
  lightTheme?: Maybe<Scalars['String']>;
  darkTheme?: Maybe<Scalars['String']>;
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
  /** Returns all messages for current current group */
  messages: Array<Message>;
};

export type Metric = {
  __typename?: 'Metric';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  name: Scalars['String'];
};

export type MetricPayload = Payload & {
  __typename?: 'MetricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Metric>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Should create user */
  createUser: UserPayload;
  /** Should update user */
  updateUser: UserPayload;
  /** Should update user password */
  updateUserPassword: UserPayload;
  /** Should update session user profile */
  updateMyProfile: UserPayload;
  /** Should update session user password */
  updateMyPassword: UserPayload;
  /** Should sign up user */
  signUp: UserPayload;
  /** Should delete user */
  deleteUser: UserPayload;
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
  /** Should update catalogue counters */
  updateCatalogueCounters: Scalars['Boolean'];
  /** Should create category */
  createCategory: CategoryPayload;
  /** Should update category */
  updateCategory: CategoryPayload;
  /** Should delete category */
  deleteCategory: CategoryPayload;
  /** Should add attributes group to the category */
  addAttributesGroupToCategory: CategoryPayload;
  /** Should toggle attribute in the category attribute showInCatalogueFilter field */
  toggleAttributeInCategoryCatalogue: CategoryPayload;
  /** Should toggle attribute in the category attribute showInCatalogueNav field */
  toggleAttributeInCategoryNav: CategoryPayload;
  /** Should toggle attribute in the category attribute showInProductAttributes field */
  toggleAttributeInCategoryProductAttributes: CategoryPayload;
  /** Should delete attributes group from category */
  deleteAttributesGroupFromCategory: CategoryPayload;
  /** Should create company */
  createCompany: CompanyPayload;
  /** Should update company */
  updateCompany: CompanyPayload;
  /** Should delete company */
  deleteCompany: CompanyPayload;
  /** Should create shop and add it to the company */
  addShopToCompany: CompanyPayload;
  /** Should delete shop from company and db */
  deleteShopFromCompany: CompanyPayload;
  /** Should update config */
  updateConfig: ConfigPayload;
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
  /** Should create manufacturer */
  createManufacturer: ManufacturerPayload;
  /** Should update manufacturer */
  updateManufacturer: ManufacturerPayload;
  /** Should delete manufacturer */
  deleteManufacturer: ManufacturerPayload;
  /** Should create metric */
  createMetric: MetricPayload;
  /** Should update metric */
  updateMetric: MetricPayload;
  /** Should delete metric */
  deleteMetric: MetricPayload;
  /** Should create nav item */
  createNavItem: NavItemPayload;
  /** Should update nav item */
  updateNavItem: NavItemPayload;
  /** Should delete nav item */
  deleteNavItem: NavItemPayload;
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
  /** Should create order from session cart */
  makeAnOrder: MakeAnOrderPayload;
  /** Should confirm order */
  confirmOrder: MakeAnOrderPayload;
  /** Should create order status */
  createOrderStatus: OrderStatusPayload;
  /** Should update order status */
  updateOrderStatus: OrderStatusPayload;
  /** Should delete order status */
  deleteOrderStatus: OrderStatusPayload;
  /** Should crate page */
  createPage: PagePayload;
  /** Should update page */
  updatePage: PagePayload;
  /** Should delete page */
  deletePage: PagePayload;
  /** Should create pages group */
  createPagesGroup: PagesGroupPayload;
  /** Should update pages group */
  updatePagesGroup: PagesGroupPayload;
  /** Should delete pages group */
  deletePagesGroup: PagesGroupPayload;
  /** Should update / create product card content */
  updateProductCardContent: ProductCardContentPayload;
  /** Should update product brand */
  updateProductBrand: ProductPayload;
  /** Should update product brand collection */
  updateProductBrandCollection: ProductPayload;
  /** Should update product manufacturer */
  updateProductManufacturer: ProductPayload;
  /** Should update product supplier */
  updateProductSupplier: ProductPayload;
  /** Should update product select attribute */
  updateProductSelectAttribute: ProductPayload;
  /** Should update product number attribute */
  updateProductNumberAttribute: ProductPayload;
  /** Should update product text attribute */
  updateProductTextAttribute: ProductPayload;
  /** Should create product connection */
  createProductConnection: ProductPayload;
  /** Should create product connection */
  addProductToConnection: ProductPayload;
  /** Should delete product from connection and delete connection if there is no products left */
  deleteProductFromConnection: ProductPayload;
  /** Should create product */
  createProduct: ProductPayload;
  /** Should update product */
  updateProduct: ProductPayload;
  /** Should update product assets */
  deleteProductAsset: ProductPayload;
  /** Should copy product */
  copyProduct: ProductPayload;
  /** Should update product asset index */
  updateProductAssetIndex: ProductPayload;
  /** Should update product with syn error and remove sync error */
  updateProductWithSyncError: ProductPayload;
  /** Should create product with syn error and remove sync error */
  createProductWithSyncError: ProductPayload;
  /** Should update product category */
  updateProductCategory: ProductPayload;
  /** Should update product counter */
  updateProductCounter: Scalars['Boolean'];
  /** Should create role */
  createRole: RolePayload;
  /** Should update role */
  updateRole: RolePayload;
  /** Should delete role */
  deleteRole: RolePayload;
  /** Should update role nav */
  updateRoleNav: RolePayload;
  /** Should update role rule */
  updateRoleRule: RoleRulePayload;
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
  /** Should toggle attribute in the rubric attribute showInProductAttributes field */
  toggleAttributeInProductAttributes: RubricPayload;
  /** Should delete attributes group from rubric */
  deleteAttributesGroupFromRubric: RubricPayload;
  /** Should remove product from rubric */
  deleteProductFromRubric: RubricPayload;
  /** Should create rubric variant */
  createRubricVariant: RubricVariantPayload;
  /** Should update rubric variant */
  updateRubricVariant: RubricVariantPayload;
  /** Should delete rubric variant */
  deleteRubricVariant: RubricVariantPayload;
  /** Should update shop */
  updateShop: ShopPayload;
  /** Should delete shop asset */
  deleteShopAsset: ShopPayload;
  /** Should update shop asset index */
  updateShopAssetIndex: ShopPayload;
  /** Should add product to the shop */
  addProductToShop: ShopPayload;
  /** Should add many products to the shop */
  addManyProductsToShop: ShopPayload;
  /** Should delete product from shop */
  deleteProductFromShop: ShopPayload;
  /** Should generate shop token */
  generateShopToken: ShopPayload;
  /** Should update shop product */
  updateShopProduct: ShopProductPayload;
  /** Should update many shop products */
  updateManyShopProducts: ShopProductPayload;
  /** Should create supplier */
  createSupplier: SupplierPayload;
  /** Should update supplier */
  updateSupplier: SupplierPayload;
  /** Should delete supplier */
  deleteSupplier: SupplierPayload;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserPasswordArgs = {
  input: UpdateUserPasswordInput;
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


export type MutationDeleteUserArgs = {
  _id: Scalars['ObjectId'];
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


export type MutationUpdateCatalogueCountersArgs = {
  input: CatalogueDataInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationDeleteCategoryArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddAttributesGroupToCategoryArgs = {
  input: AddAttributesGroupToCategoryInput;
};


export type MutationToggleAttributeInCategoryCatalogueArgs = {
  input: UpdateAttributeInCategoryInput;
};


export type MutationToggleAttributeInCategoryNavArgs = {
  input: UpdateAttributeInCategoryInput;
};


export type MutationToggleAttributeInCategoryProductAttributesArgs = {
  input: UpdateAttributeInCategoryInput;
};


export type MutationDeleteAttributesGroupFromCategoryArgs = {
  input: DeleteAttributesGroupFromCategoryInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
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


export type MutationUpdateConfigArgs = {
  input: UpdateConfigInput;
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


export type MutationCreateManufacturerArgs = {
  input: CreateManufacturerInput;
};


export type MutationUpdateManufacturerArgs = {
  input: UpdateManufacturerInput;
};


export type MutationDeleteManufacturerArgs = {
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


export type MutationCreateNavItemArgs = {
  input: CreateNavItemInput;
};


export type MutationUpdateNavItemArgs = {
  input: UpdateNavItemInput;
};


export type MutationDeleteNavItemArgs = {
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


export type MutationMakeAnOrderArgs = {
  input: MakeAnOrderInput;
};


export type MutationConfirmOrderArgs = {
  input: ConfirmOrderInput;
};


export type MutationCreateOrderStatusArgs = {
  input: CreateOrderStatusInput;
};


export type MutationUpdateOrderStatusArgs = {
  input: UpdateOrderStatusInput;
};


export type MutationDeleteOrderStatusArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationUpdatePageArgs = {
  input: UpdatePageInput;
};


export type MutationDeletePageArgs = {
  input: DeletePageInput;
};


export type MutationCreatePagesGroupArgs = {
  input: CreatePagesGroupInput;
};


export type MutationUpdatePagesGroupArgs = {
  input: UpdatePagesGroupInput;
};


export type MutationDeletePagesGroupArgs = {
  input: DeletePagesGroupInput;
};


export type MutationUpdateProductCardContentArgs = {
  input: UpdateProductCardContentInput;
};


export type MutationUpdateProductBrandArgs = {
  input: UpdateProductBrandInput;
};


export type MutationUpdateProductBrandCollectionArgs = {
  input: UpdateProductBrandCollectionInput;
};


export type MutationUpdateProductManufacturerArgs = {
  input: UpdateProductManufacturerInput;
};


export type MutationUpdateProductSupplierArgs = {
  input: UpdateProductSupplierInput;
};


export type MutationUpdateProductSelectAttributeArgs = {
  input: UpdateProductSelectAttributeInput;
};


export type MutationUpdateProductNumberAttributeArgs = {
  input: UpdateProductNumberAttributeInput;
};


export type MutationUpdateProductTextAttributeArgs = {
  input: UpdateProductTextAttributeInput;
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


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationDeleteProductAssetArgs = {
  input: DeleteProductAssetInput;
};


export type MutationCopyProductArgs = {
  input: CopyProductInput;
};


export type MutationUpdateProductAssetIndexArgs = {
  input: UpdateProductAssetIndexInput;
};


export type MutationUpdateProductWithSyncErrorArgs = {
  input: UpdateProductWithSyncErrorInput;
};


export type MutationCreateProductWithSyncErrorArgs = {
  input: CreateProductWithSyncErrorInput;
};


export type MutationUpdateProductCategoryArgs = {
  input: UpdateProductCategoryInput;
};


export type MutationUpdateProductCounterArgs = {
  input: UpdateProductCounterInput;
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


export type MutationUpdateRoleNavArgs = {
  input: UpdateRoleNavInput;
};


export type MutationUpdateRoleRuleArgs = {
  input: UpdateRoleRuleInput;
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


export type MutationToggleAttributeInProductAttributesArgs = {
  input: UpdateAttributeInRubricInput;
};


export type MutationDeleteAttributesGroupFromRubricArgs = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type MutationDeleteProductFromRubricArgs = {
  input: DeleteProductFromRubricInput;
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


export type MutationUpdateShopArgs = {
  input: UpdateShopInput;
};


export type MutationDeleteShopAssetArgs = {
  input: DeleteShopAssetInput;
};


export type MutationUpdateShopAssetIndexArgs = {
  input: UpdateShopAssetIndexInput;
};


export type MutationAddProductToShopArgs = {
  input: AddProductToShopInput;
};


export type MutationAddManyProductsToShopArgs = {
  input: Array<AddProductToShopInput>;
};


export type MutationDeleteProductFromShopArgs = {
  input: DeleteProductFromShopInput;
};


export type MutationGenerateShopTokenArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationUpdateShopProductArgs = {
  input: UpdateShopProductInput;
};


export type MutationUpdateManyShopProductsArgs = {
  input: Array<UpdateShopProductInput>;
};


export type MutationCreateSupplierArgs = {
  input: CreateSupplierInput;
};


export type MutationUpdateSupplierArgs = {
  input: UpdateSupplierInput;
};


export type MutationDeleteSupplierArgs = {
  _id: Scalars['ObjectId'];
};

export type NavItem = {
  __typename?: 'NavItem';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  index: Scalars['Int'];
  slug: Scalars['String'];
  path: Scalars['String'];
  navGroup: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['ObjectId']>;
  name: Scalars['String'];
  children: Array<NavItem>;
};

export type NavItemPayload = Payload & {
  __typename?: 'NavItemPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<NavItem>;
};


export type Option = {
  __typename?: 'Option';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  variants: Scalars['JSONObject'];
  gender?: Maybe<Gender>;
  options?: Maybe<Array<Option>>;
  name: Scalars['String'];
};

export type OptionAlphabetInput = {
  optionsGroupId: Scalars['ObjectId'];
  parentId?: Maybe<Scalars['ObjectId']>;
  slugs?: Maybe<Array<Scalars['String']>>;
};

export type OptionVariantInput = {
  value: Scalars['JSONObject'];
  gender: Gender;
};

export type OptionsAlphabetList = AlphabetList & {
  __typename?: 'OptionsAlphabetList';
  letter: Scalars['String'];
  docs: Array<Option>;
};

export type OptionsGroup = {
  __typename?: 'OptionsGroup';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  variant: OptionsGroupVariant;
  name: Scalars['String'];
  options: Array<Option>;
};

export type OptionsGroupPayload = Payload & {
  __typename?: 'OptionsGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<OptionsGroup>;
};

/** Options group variant enum. */
export enum OptionsGroupVariant {
  Text = 'text',
  Icon = 'icon',
  Color = 'color'
}

export type Order = Base & Timestamp & {
  __typename?: 'Order';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  comment?: Maybe<Scalars['String']>;
  statusId: Scalars['ObjectId'];
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

export type OrderLog = Timestamp & {
  __typename?: 'OrderLog';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  variant: OrderLogVariant;
  userId: Scalars['ObjectId'];
  user?: Maybe<User>;
};

/** Order log variant enum. */
export enum OrderLogVariant {
  Status = 'status',
  Confirm = 'confirm'
}

export type OrderPayload = Payload & {
  __typename?: 'OrderPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Order>;
};

export type OrderProduct = {
  __typename?: 'OrderProduct';
  _id: Scalars['ObjectId'];
  itemId: Scalars['Int'];
  price: Scalars['Int'];
  amount: Scalars['Int'];
  slug: Scalars['String'];
  originalName: Scalars['String'];
  nameI18n?: Maybe<Scalars['JSONObject']>;
  productId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
  shopId: Scalars['ObjectId'];
  companyId: Scalars['ObjectId'];
  product?: Maybe<Product>;
  shopProduct?: Maybe<ShopProduct>;
  shop?: Maybe<Shop>;
  formattedPrice: Scalars['String'];
  formattedTotalPrice: Scalars['String'];
  totalPrice: Scalars['Int'];
};

export type OrderStatus = Timestamp & {
  __typename?: 'OrderStatus';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  color: Scalars['String'];
  index: Scalars['Int'];
  name: Scalars['String'];
};

export type OrderStatusPayload = Payload & {
  __typename?: 'OrderStatusPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<OrderStatus>;
};

export type Page = {
  __typename?: 'Page';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  index: Scalars['Int'];
  slug: Scalars['String'];
  citySlug: Scalars['String'];
  content: Scalars['String'];
  pagesGroupId: Scalars['ObjectId'];
  assetKeys: Array<Scalars['String']>;
  state: PageState;
  name: Scalars['String'];
};

export type PagePayload = Payload & {
  __typename?: 'PagePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Page>;
};

/** Page state enum. */
export enum PageState {
  Draft = 'draft',
  Published = 'published'
}

export type PagesGroup = {
  __typename?: 'PagesGroup';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  index: Scalars['Int'];
  companySlug: Scalars['String'];
  showInFooter: Scalars['Boolean'];
  showInHeader: Scalars['Boolean'];
  name: Scalars['String'];
};

export type PagesGroupPayload = Payload & {
  __typename?: 'PagesGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<PagesGroup>;
};

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

export type Payload = {
  success: Scalars['Boolean'];
  message: Scalars['String'];
};


export type PointGeoJson = {
  __typename?: 'PointGeoJSON';
  /** Field that specifies the GeoJSON object type. */
  type: Scalars['String'];
  /** Coordinates that specifies the object’s coordinates. If specifying latitude and longitude coordinates, list the longitude first and then latitude. */
  coordinates: Array<Scalars['Float']>;
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
  barcode?: Maybe<Scalars['String']>;
  brandSlug?: Maybe<Scalars['String']>;
  brandCollectionSlug?: Maybe<Scalars['String']>;
  manufacturerSlug?: Maybe<Scalars['String']>;
  supplierSlug?: Maybe<Scalars['String']>;
  nameI18n?: Maybe<Scalars['JSONObject']>;
  descriptionI18n: Scalars['JSONObject'];
  rubricId: Scalars['ObjectId'];
  rubricSlug: Scalars['String'];
  available?: Maybe<Scalars['Boolean']>;
  mainImage: Scalars['String'];
  assets?: Maybe<ProductAssets>;
  attributes: Array<ProductAttribute>;
  connections: Array<ProductConnection>;
  description: Scalars['String'];
  cardPrices: ProductCardPrices;
  shopsCount: Scalars['Int'];
  rubric: Rubric;
  brand?: Maybe<Brand>;
  brandCollection?: Maybe<BrandCollection>;
  manufacturer?: Maybe<Manufacturer>;
  /** Returns all shop products that product connected to */
  shopProducts: Array<ShopProduct>;
};

export type ProductAssets = {
  __typename?: 'ProductAssets';
  _id: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
  productSlug: Scalars['ObjectId'];
  assets: Array<Asset>;
};

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  _id: Scalars['ObjectId'];
  showInCard: Scalars['Boolean'];
  showAsBreadcrumb: Scalars['Boolean'];
  attributeId: Scalars['ObjectId'];
  textI18n?: Maybe<Scalars['JSONObject']>;
  number?: Maybe<Scalars['Float']>;
  selectedOptionsIds: Array<Scalars['ObjectId']>;
  /** List of selected options slug */
  selectedOptionsSlugs: Array<Scalars['String']>;
  text: Scalars['String'];
  attribute: Attribute;
};

export type ProductAttributesAstInput = {
  productId?: Maybe<Scalars['ObjectId']>;
  rubricId: Scalars['ObjectId'];
};

export type ProductCardContent = {
  __typename?: 'ProductCardContent';
  _id: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
  productSlug: Scalars['String'];
  content: Scalars['JSONObject'];
  assetKeys: Array<Scalars['String']>;
};

export type ProductCardContentPayload = Payload & {
  __typename?: 'ProductCardContentPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<ProductCardContent>;
};

export type ProductCardPrices = {
  __typename?: 'ProductCardPrices';
  _id: Scalars['ObjectId'];
  min: Scalars['String'];
  max: Scalars['String'];
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  _id: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  attributeSlug: Scalars['String'];
  attributeNameI18n?: Maybe<Scalars['JSONObject']>;
};

export type ProductConnectionItem = {
  __typename?: 'ProductConnectionItem';
  _id: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
  product: Product;
};

export type ProductPayload = Payload & {
  __typename?: 'ProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Product>;
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
  /** Filter by excluded selected options slugs */
  excludedOptionsSlugs?: Maybe<Array<Scalars['String']>>;
  /** Exclude products in current rubrics */
  excludedRubricsIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Exclude current products */
  excludedProductsIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Returns products not added to any rubric. */
  isWithoutRubrics?: Maybe<Scalars['Boolean']>;
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
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Product>;
};

export type Query = {
  __typename?: 'Query';
  /** Should return user by _id */
  getUser: User;
  /** Should return paginated users */
  getAllUsers: UsersPaginationPayload;
  /** Should return user company */
  getUserCompany?: Maybe<Company>;
  getAttributesGroup: AttributesGroup;
  getAllAttributesGroups: Array<AttributesGroup>;
  /** Should return brand by _id */
  getBrand: Brand;
  /** Should return brand by slug */
  getBrandBySlug?: Maybe<Brand>;
  /** Should return paginated brands */
  getAllBrands?: Maybe<BrandsPaginationPayload>;
  /** Should return brands grouped by alphabet */
  getBrandAlphabetLists: Array<BrandsAlphabetList>;
  /** Should return brand collections grouped by alphabet */
  getBrandCollectionAlphabetLists: Array<BrandCollectionsAlphabetList>;
  getCatalogueAdditionalOptions?: Maybe<Array<OptionsAlphabetList>>;
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
  /** Should return company by given id */
  getCompany?: Maybe<Company>;
  /** Should return paginated companies */
  getAllCompanies?: Maybe<CompaniesPaginationPayload>;
  getAllConfigs: Array<Config>;
  /** Should return countries list */
  getAllCountries: Array<Country>;
  getAllCurrencies: Array<Currency>;
  /** Should all languages list */
  getAllLanguages: Array<Language>;
  /** Should return manufacturer by given id */
  getManufacturer: Manufacturer;
  /** Should return manufacturer by given slug */
  getManufacturerBySlug: Manufacturer;
  /** Should return paginated manufacturers */
  getAllManufacturers: ManufacturersPaginationPayload;
  /** Should return manufacturers grouped by alphabet */
  getManufacturerAlphabetLists: Array<ManufacturersAlphabetList>;
  /** Should return validation messages list */
  getValidationMessages: Array<Message>;
  /** Should return all metrics list */
  getAllMetricsOptions: Array<Metric>;
  /** Should return options grouped by alphabet */
  getOptionAlphabetLists: Array<OptionsAlphabetList>;
  /** Should return options group by given id */
  getOptionsGroup: OptionsGroup;
  /** Should return options groups list */
  getAllOptionsGroups: Array<OptionsGroup>;
  /** Should return new orders counter */
  getNewOrdersCounter: Scalars['Int'];
  /** Should return product by given id */
  getProduct?: Maybe<Product>;
  /** Should return product by given slug */
  getProductBySlug?: Maybe<Product>;
  /** Should return shops products list for product card */
  getProductShops: Array<ShopProduct>;
  /** Should paginated products */
  getProductsList: ProductsPaginationPayload;
  /** Should return role by give id */
  getRole?: Maybe<Role>;
  /** Should return all roles list */
  getAllRoles: Array<Role>;
  /** Should return rubric by given id */
  getRubric: Rubric;
  /** Should return rubric by given slug */
  getRubricBySlug: Rubric;
  /** Should return rubrics tree */
  getAllRubrics: Array<Rubric>;
  /** Should return rubric variant by given id */
  getRubricVariant: RubricVariant;
  /** Should return rubric variants list */
  getAllRubricVariants: Array<RubricVariant>;
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
  /** Should return shop by given id */
  getShop: Shop;
  /** Should return shop by given slug */
  getShopBySlug: Shop;
  /** Should return shop by given slug */
  getAllShops: ShopsPaginationPayload;
  /** Should return paginated company shops list */
  getCompanyShops: ShopsPaginationPayload;
  /** Should return supplier by given id */
  getSupplier: Supplier;
  /** Should return supplier by given slug */
  getSupplierBySlug: Supplier;
  /** Should return paginated suppliers */
  getAllSuppliers: SuppliersPaginationPayload;
  /** Should return suppliers grouped by alphabet */
  getSupplierAlphabetLists: Array<SuppliersAlphabetList>;
};


export type QueryGetUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllUsersArgs = {
  input?: Maybe<PaginationInput>;
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


export type QueryGetBrandAlphabetListsArgs = {
  input?: Maybe<BrandAlphabetInput>;
};


export type QueryGetBrandCollectionAlphabetListsArgs = {
  input?: Maybe<BrandCollectionAlphabetInput>;
};


export type QueryGetCatalogueAdditionalOptionsArgs = {
  input: CatalogueAdditionalOptionsInput;
};


export type QueryGetCatalogueSearchTopItemsArgs = {
  input: CatalogueSearchTopItemsInput;
};


export type QueryGetCatalogueSearchResultArgs = {
  input: CatalogueSearchInput;
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


export type QueryGetCompanyArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetAllCompaniesArgs = {
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


export type QueryGetManufacturerAlphabetListsArgs = {
  input?: Maybe<ManufacturerAlphabetInput>;
};


export type QueryGetOptionAlphabetListsArgs = {
  input: OptionAlphabetInput;
};


export type QueryGetOptionsGroupArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetNewOrdersCounterArgs = {
  input?: Maybe<GetNewOrdersCounterInput>;
};


export type QueryGetProductArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetProductBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetProductShopsArgs = {
  input: GetProductShopsInput;
};


export type QueryGetProductsListArgs = {
  input?: Maybe<ProductsPaginationInput>;
};


export type QueryGetRoleArgs = {
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


export type QueryGetRubricVariantArgs = {
  _id: Scalars['ObjectId'];
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


export type QueryGetCompanyShopsArgs = {
  input?: Maybe<PaginationInput>;
  companyId: Scalars['ObjectId'];
};


export type QueryGetSupplierArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetSupplierBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllSuppliersArgs = {
  input?: Maybe<PaginationInput>;
};


export type QueryGetSupplierAlphabetListsArgs = {
  input?: Maybe<SupplierAlphabetInput>;
};

export type RepeatOrderInput = {
  orderId: Scalars['ObjectId'];
};

export type Role = Timestamp & {
  __typename?: 'Role';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  isStaff: Scalars['Boolean'];
  isCompanyStaff: Scalars['Boolean'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  description: Scalars['String'];
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

export type RoleRule = {
  __typename?: 'RoleRule';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  allow: Scalars['Boolean'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  roleId: Scalars['ObjectId'];
  description: Scalars['String'];
  name: Scalars['String'];
};

export type RoleRulePayload = Payload & {
  __typename?: 'RoleRulePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<RoleRule>;
};

export type Rubric = {
  __typename?: 'Rubric';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  variantId: Scalars['ObjectId'];
  views: Scalars['JSONObject'];
  capitalise?: Maybe<Scalars['Boolean']>;
  priorities: Scalars['JSONObject'];
  catalogueTitle: RubricCatalogueTitle;
  name: Scalars['String'];
  description: Scalars['String'];
  shortDescription: Scalars['String'];
  variant: RubricVariant;
  products: ProductsPaginationPayload;
};


export type RubricProductsArgs = {
  input?: Maybe<ProductsPaginationInput>;
};

export type RubricAttribute = {
  __typename?: 'RubricAttribute';
  _id: Scalars['ObjectId'];
  showInCatalogueFilter: Scalars['Boolean'];
  showInCatalogueNav: Scalars['Boolean'];
  showInProductAttributes: Scalars['Boolean'];
  nameI18n: Scalars['JSONObject'];
  slug?: Maybe<Scalars['String']>;
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
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
  name: Scalars['String'];
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

export type RubricCatalogueTitleInput = {
  defaultTitleI18n: Scalars['JSONObject'];
  prefixI18n?: Maybe<Scalars['JSONObject']>;
  keywordI18n: Scalars['JSONObject'];
  gender: Gender;
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
  variants: Scalars['JSONObject'];
  name: Scalars['String'];
};

export type RubricPayload = Payload & {
  __typename?: 'RubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Rubric>;
};

export type RubricProductsCountersInput = {
  /** Filter by current attributes */
  attributesIds?: Maybe<Array<Scalars['ObjectId']>>;
  /** Exclude current products */
  excludedProductsIds?: Maybe<Array<Scalars['ObjectId']>>;
};

export type RubricVariant = {
  __typename?: 'RubricVariant';
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  companySlug: Scalars['String'];
  cardLayout?: Maybe<Scalars['String']>;
  gridSnippetLayout?: Maybe<Scalars['String']>;
  rowSnippetLayout?: Maybe<Scalars['String']>;
  catalogueFilterLayout?: Maybe<Scalars['String']>;
  catalogueNavLayout?: Maybe<Scalars['String']>;
  showSnippetBackground?: Maybe<Scalars['Boolean']>;
  showSnippetArticle?: Maybe<Scalars['Boolean']>;
  showSnippetRating?: Maybe<Scalars['Boolean']>;
  showSnippetButtonsOnHover?: Maybe<Scalars['Boolean']>;
  showCardButtonsBackground?: Maybe<Scalars['Boolean']>;
  showCardImagesSlider?: Maybe<Scalars['Boolean']>;
  showCardBrands?: Maybe<Scalars['Boolean']>;
  showCatalogueFilterBrands?: Maybe<Scalars['Boolean']>;
  showCategoriesInFilter?: Maybe<Scalars['Boolean']>;
  showCategoriesInNav?: Maybe<Scalars['Boolean']>;
  gridCatalogueColumns?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};

export type RubricVariantPayload = Payload & {
  __typename?: 'RubricVariantPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<RubricVariant>;
};

/** Type for all selects options. */
export type SelectOption = {
  __typename?: 'SelectOption';
  _id: Scalars['String'];
  name: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
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
  mapMarker?: Maybe<MapMarker>;
  logo: Asset;
  assets: Array<Asset>;
  contacts: Contacts;
  address: Address;
  shopProducts: ShopProductsPaginationPayload;
  city: City;
  company: Company;
  productsCount: Scalars['Int'];
};


export type ShopShopProductsArgs = {
  input?: Maybe<PaginationInput>;
};

export type ShopPayload = Payload & {
  __typename?: 'ShopPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Shop>;
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
  barcode?: Maybe<Scalars['String']>;
  oldPrices: Array<ShopProductOldPrice>;
  oldPrice?: Maybe<Scalars['Int']>;
  discountedPercent?: Maybe<Scalars['Int']>;
  product: Product;
  shop: Shop;
  inCartCount: Scalars['Int'];
};

export type ShopProductOldPrice = Timestamp & {
  __typename?: 'ShopProductOldPrice';
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  price: Scalars['Int'];
};

export type ShopProductPayload = Payload & {
  __typename?: 'ShopProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<ShopProduct>;
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

export type SignUpInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
  password: Scalars['String'];
};

/** Sort direction enum. */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Supplier = Base & Timestamp & {
  __typename?: 'Supplier';
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

export type SupplierAlphabetInput = {
  slugs?: Maybe<Array<Scalars['String']>>;
};

export type SupplierPayload = Payload & {
  __typename?: 'SupplierPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<Supplier>;
};

export type SuppliersAlphabetList = AlphabetList & {
  __typename?: 'SuppliersAlphabetList';
  letter: Scalars['String'];
  docs: Array<Supplier>;
};

export type SuppliersPaginationPayload = PaginationPayload & {
  __typename?: 'SuppliersPaginationPayload';
  sortBy: Scalars['String'];
  sortDir: SortDirection;
  totalDocs: Scalars['Int'];
  totalActiveDocs: Scalars['Int'];
  page: Scalars['Int'];
  limit: Scalars['Int'];
  totalPages: Scalars['Int'];
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  docs: Array<Supplier>;
};

export type Timestamp = {
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};


export type UpdateAttributeInCategoryInput = {
  categoryId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type UpdateAttributeInGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  optionsGroupId?: Maybe<Scalars['ObjectId']>;
  metricId?: Maybe<Scalars['ObjectId']>;
  capitalise?: Maybe<Scalars['Boolean']>;
  notShowAsAlphabet?: Maybe<Scalars['Boolean']>;
  showNameInTitle?: Maybe<Scalars['Boolean']>;
  showNameInSelectedAttributes?: Maybe<Scalars['Boolean']>;
  showNameInSnippetTitle?: Maybe<Scalars['Boolean']>;
  showAsBreadcrumb: Scalars['Boolean'];
  showAsCatalogueBreadcrumb: Scalars['Boolean'];
  showInSnippet: Scalars['Boolean'];
  showInCard: Scalars['Boolean'];
  positioningInTitle?: Maybe<Scalars['JSONObject']>;
  variant: AttributeVariant;
  viewVariant: AttributeViewVariant;
};

export type UpdateAttributeInRubricInput = {
  rubricId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type UpdateAttributesGroupInput = {
  attributesGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
};

export type UpdateBrandInput = {
  brandId: Scalars['ObjectId'];
  url?: Maybe<Array<Scalars['URL']>>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateCategoryInput = {
  categoryId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  rubricId: Scalars['ObjectId'];
  gender?: Maybe<Gender>;
};

export type UpdateCityInCountryInput = {
  countryId: Scalars['ObjectId'];
  cityId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
};

export type UpdateCollectionInBrandInput = {
  brandId: Scalars['ObjectId'];
  brandCollectionId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateCompanyInput = {
  companyId: Scalars['ObjectId'];
  name: Scalars['String'];
  ownerId: Scalars['ObjectId'];
  staffIds: Array<Scalars['ObjectId']>;
  domain?: Maybe<Scalars['String']>;
  contacts: ContactsInput;
};

export type UpdateConfigInput = {
  _id: Scalars['ObjectId'];
  multi: Scalars['Boolean'];
  acceptedFormats: Array<Scalars['String']>;
  slug: Scalars['String'];
  companySlug: Scalars['String'];
  group: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  cities: Scalars['JSONObject'];
  variant: ConfigVariant;
};

export type UpdateCountryInput = {
  countryId: Scalars['ObjectId'];
  name: Scalars['String'];
  currency: Scalars['String'];
};

export type UpdateCurrencyInput = {
  currencyId: Scalars['ObjectId'];
  name: Scalars['String'];
};

export type UpdateLanguageInput = {
  languageId: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
  nativeName: Scalars['String'];
};

export type UpdateManufacturerInput = {
  manufacturerId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  url?: Maybe<Array<Scalars['URL']>>;
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateMetricInput = {
  metricId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
};

export type UpdateMyPasswordInput = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
  newPasswordB: Scalars['String'];
};

export type UpdateMyProfileInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  phone: Scalars['PhoneNumber'];
};

export type UpdateNavItemInput = {
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  slug: Scalars['String'];
  path: Scalars['String'];
  navGroup: Scalars['String'];
  index: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateOptionInGroupInput = {
  optionId: Scalars['ObjectId'];
  parentId?: Maybe<Scalars['ObjectId']>;
  optionsGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  color?: Maybe<Scalars['String']>;
  variants: Scalars['JSONObject'];
  gender?: Maybe<Gender>;
};

export type UpdateOptionsGroupInput = {
  optionsGroupId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  variant: OptionsGroupVariant;
};

export type UpdateOrderStatusInput = {
  orderStatusId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  color: Scalars['String'];
  index: Scalars['Int'];
};

export type UpdatePageInput = {
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  index: Scalars['Int'];
  pagesGroupId: Scalars['ObjectId'];
  citySlug: Scalars['String'];
  content: Scalars['String'];
  state: PageState;
  showAsMainBanner?: Maybe<Scalars['Boolean']>;
  mainBannerTextColor?: Maybe<Scalars['String']>;
  mainBannerVerticalTextAlign?: Maybe<Scalars['String']>;
  mainBannerHorizontalTextAlign?: Maybe<Scalars['String']>;
  mainBannerTextAlign?: Maybe<Scalars['String']>;
  mainBannerTextPadding?: Maybe<Scalars['Float']>;
  mainBannerTextMaxWidth?: Maybe<Scalars['Float']>;
  showAsSecondaryBanner?: Maybe<Scalars['Boolean']>;
  secondaryBannerTextColor?: Maybe<Scalars['String']>;
  secondaryBannerVerticalTextAlign?: Maybe<Scalars['String']>;
  secondaryBannerHorizontalTextAlign?: Maybe<Scalars['String']>;
  secondaryBannerTextAlign?: Maybe<Scalars['String']>;
  secondaryBannerTextPadding?: Maybe<Scalars['Float']>;
  secondaryBannerTextMaxWidth?: Maybe<Scalars['Float']>;
  isTemplate?: Maybe<Scalars['Boolean']>;
};

export type UpdatePagesGroupInput = {
  _id: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  index: Scalars['Int'];
  showInFooter: Scalars['Boolean'];
  showInHeader: Scalars['Boolean'];
  isTemplate?: Maybe<Scalars['Boolean']>;
};

export type UpdateProductAssetIndexInput = {
  productId: Scalars['ObjectId'];
  assetUrl: Scalars['String'];
  assetNewIndex: Scalars['Int'];
};

export type UpdateProductBrandCollectionInput = {
  productId: Scalars['ObjectId'];
  brandCollectionSlug?: Maybe<Scalars['String']>;
};

export type UpdateProductBrandInput = {
  productId: Scalars['ObjectId'];
  brandSlug?: Maybe<Scalars['String']>;
};

export type UpdateProductCardContentInput = {
  _id: Scalars['ObjectId'];
  productId: Scalars['ObjectId'];
  productSlug: Scalars['String'];
  companySlug: Scalars['String'];
  content: Scalars['JSONObject'];
  assetKeys: Array<Scalars['String']>;
};

export type UpdateProductCategoryInput = {
  productId: Scalars['ObjectId'];
  categoryId: Scalars['ObjectId'];
};

export type UpdateProductCounterInput = {
  shopProductIds: Array<Scalars['ObjectId']>;
  companySlug?: Maybe<Scalars['String']>;
};

export type UpdateProductInCartInput = {
  cartProductId: Scalars['ObjectId'];
  amount: Scalars['Int'];
};

export type UpdateProductInput = {
  productId: Scalars['ObjectId'];
  barcode?: Maybe<Array<Scalars['String']>>;
  active: Scalars['Boolean'];
  originalName: Scalars['String'];
  nameI18n?: Maybe<Scalars['JSONObject']>;
  descriptionI18n: Scalars['JSONObject'];
};

export type UpdateProductManufacturerInput = {
  productId: Scalars['ObjectId'];
  manufacturerSlug?: Maybe<Scalars['String']>;
};

export type UpdateProductNumberAttributeInput = {
  productId: Scalars['ObjectId'];
  attributes: Array<UpdateProductNumberAttributeItemInput>;
};

export type UpdateProductNumberAttributeItemInput = {
  productAttributeId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  number?: Maybe<Scalars['Float']>;
};

export type UpdateProductSelectAttributeInput = {
  productId: Scalars['ObjectId'];
  productAttributeId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  selectedOptionsIds: Array<Scalars['ObjectId']>;
};

export type UpdateProductSupplierInput = {
  productId: Scalars['ObjectId'];
  supplierSlug?: Maybe<Scalars['String']>;
};

export type UpdateProductTextAttributeInput = {
  productId: Scalars['ObjectId'];
  attributes: Array<UpdateProductTextAttributeItemInput>;
};

export type UpdateProductTextAttributeItemInput = {
  productAttributeId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  textI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateProductWithSyncErrorInput = {
  productId: Scalars['ObjectId'];
  barcode: Scalars['String'];
  available: Scalars['Int'];
  price: Scalars['Int'];
  shopId: Scalars['ObjectId'];
};

export type UpdateRoleInput = {
  roleId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  isStaff: Scalars['Boolean'];
  isCompanyStaff: Scalars['Boolean'];
};

export type UpdateRoleNavInput = {
  roleId: Scalars['ObjectId'];
  navItemId: Scalars['ObjectId'];
  checked: Scalars['Boolean'];
};

export type UpdateRoleRuleInput = {
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  allow: Scalars['Boolean'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  roleId: Scalars['ObjectId'];
};

export type UpdateRubricInput = {
  rubricId: Scalars['ObjectId'];
  capitalise?: Maybe<Scalars['Boolean']>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  variantId: Scalars['ObjectId'];
  active: Scalars['Boolean'];
  catalogueTitle: RubricCatalogueTitleInput;
};

export type UpdateRubricVariantInput = {
  rubricVariantId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  cardLayout?: Maybe<Scalars['String']>;
  gridSnippetLayout?: Maybe<Scalars['String']>;
  rowSnippetLayout?: Maybe<Scalars['String']>;
  catalogueFilterLayout?: Maybe<Scalars['String']>;
  catalogueNavLayout?: Maybe<Scalars['String']>;
  showSnippetBackground?: Maybe<Scalars['Boolean']>;
  showSnippetArticle?: Maybe<Scalars['Boolean']>;
  showSnippetRating?: Maybe<Scalars['Boolean']>;
  showSnippetButtonsOnHover?: Maybe<Scalars['Boolean']>;
  showCardButtonsBackground?: Maybe<Scalars['Boolean']>;
  showCardImagesSlider?: Maybe<Scalars['Boolean']>;
  showCardBrands?: Maybe<Scalars['Boolean']>;
  showCatalogueFilterBrands?: Maybe<Scalars['Boolean']>;
  showCategoriesInFilter?: Maybe<Scalars['Boolean']>;
  showCategoriesInNav?: Maybe<Scalars['Boolean']>;
  gridCatalogueColumns?: Maybe<Scalars['Int']>;
  cardBrandsLabelI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateShopAssetIndexInput = {
  shopId: Scalars['ObjectId'];
  assetUrl: Scalars['String'];
  assetNewIndex: Scalars['Int'];
};

export type UpdateShopInput = {
  shopId: Scalars['ObjectId'];
  name: Scalars['String'];
  citySlug: Scalars['String'];
  license?: Maybe<Scalars['String']>;
  contacts: ContactsInput;
  address: AddressInput;
};

export type UpdateShopProductInput = {
  available: Scalars['Int'];
  price: Scalars['Int'];
  productId: Scalars['ObjectId'];
  shopProductId: Scalars['ObjectId'];
  barcode?: Maybe<Scalars['String']>;
};

export type UpdateSupplierInput = {
  supplierId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  url?: Maybe<Array<Scalars['URL']>>;
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
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

export type UpdateUserPasswordInput = {
  userId: Scalars['ObjectId'];
  newPassword: Scalars['String'];
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
};

export type UserPayload = Payload & {
  __typename?: 'UserPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  payload?: Maybe<User>;
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

export type RubricInListFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, '_id' | 'nameI18n' | 'slug' | 'name'>
  & { variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, '_id' | 'name'>
  ) }
);

export type RubricProductFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'nameI18n' | 'originalName' | 'slug' | 'mainImage' | 'active' | 'rubricId'>
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

export type ToggleAttributeInProductAttributesMutationVariables = Exact<{
  input: UpdateAttributeInRubricInput;
}>;


export type ToggleAttributeInProductAttributesMutation = (
  { __typename?: 'Mutation' }
  & { toggleAttributeInProductAttributes: (
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

export type GetRubricAttributesQueryVariables = Exact<{
  rubricId: Scalars['ObjectId'];
}>;


export type GetRubricAttributesQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, '_id' | 'name' | 'slug'>
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

export type AddAttributesGroupToCategoryMutationVariables = Exact<{
  input: AddAttributesGroupToCategoryInput;
}>;


export type AddAttributesGroupToCategoryMutation = (
  { __typename?: 'Mutation' }
  & { addAttributesGroupToCategory: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupFromCategoryMutationVariables = Exact<{
  input: DeleteAttributesGroupFromCategoryInput;
}>;


export type DeleteAttributesGroupFromCategoryMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroupFromCategory: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type CreateBrandMutationVariables = Exact<{
  input: CreateBrandInput;
}>;


export type CreateBrandMutation = (
  { __typename?: 'Mutation' }
  & { createBrand: (
    { __typename?: 'BrandPayload' }
    & Pick<BrandPayload, 'success' | 'message'>
  ) }
);

export type UpdateBrandMutationVariables = Exact<{
  input: UpdateBrandInput;
}>;


export type UpdateBrandMutation = (
  { __typename?: 'Mutation' }
  & { updateBrand: (
    { __typename?: 'BrandPayload' }
    & Pick<BrandPayload, 'success' | 'message'>
  ) }
);

export type DeleteBrandMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteBrandMutation = (
  { __typename?: 'Mutation' }
  & { deleteBrand: (
    { __typename?: 'BrandPayload' }
    & Pick<BrandPayload, 'success' | 'message'>
  ) }
);

export type AddCollectionToBrandMutationVariables = Exact<{
  input: AddCollectionToBrandInput;
}>;


export type AddCollectionToBrandMutation = (
  { __typename?: 'Mutation' }
  & { addCollectionToBrand: (
    { __typename?: 'BrandPayload' }
    & Pick<BrandPayload, 'success' | 'message'>
  ) }
);

export type UpdateCollectionInBrandMutationVariables = Exact<{
  input: UpdateCollectionInBrandInput;
}>;


export type UpdateCollectionInBrandMutation = (
  { __typename?: 'Mutation' }
  & { updateCollectionInBrand: (
    { __typename?: 'BrandPayload' }
    & Pick<BrandPayload, 'success' | 'message'>
  ) }
);

export type DeleteCollectionFromBrandMutationVariables = Exact<{
  input: DeleteCollectionFromBrandInput;
}>;


export type DeleteCollectionFromBrandMutation = (
  { __typename?: 'Mutation' }
  & { deleteCollectionFromBrand: (
    { __typename?: 'BrandPayload' }
    & Pick<BrandPayload, 'success' | 'message'>
  ) }
);

export type CartPayloadFragment = (
  { __typename?: 'CartPayload' }
  & Pick<CartPayload, 'success' | 'message'>
);

export type MakeAnOrderPayloadFragment = (
  { __typename?: 'MakeAnOrderPayload' }
  & Pick<MakeAnOrderPayload, 'success' | 'message'>
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

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createCategory: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateCategory: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type DeleteCategoryMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteCategoryMutation = (
  { __typename?: 'Mutation' }
  & { deleteCategory: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type ToggleAttributeInCategoryCatalogueMutationVariables = Exact<{
  input: UpdateAttributeInCategoryInput;
}>;


export type ToggleAttributeInCategoryCatalogueMutation = (
  { __typename?: 'Mutation' }
  & { toggleAttributeInCategoryCatalogue: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type ToggleAttributeInCategoryNavMutationVariables = Exact<{
  input: UpdateAttributeInCategoryInput;
}>;


export type ToggleAttributeInCategoryNavMutation = (
  { __typename?: 'Mutation' }
  & { toggleAttributeInCategoryNav: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
  ) }
);

export type ToggleAttributeInCategoryProductAttributesMutationVariables = Exact<{
  input: UpdateAttributeInCategoryInput;
}>;


export type ToggleAttributeInCategoryProductAttributesMutation = (
  { __typename?: 'Mutation' }
  & { toggleAttributeInCategoryProductAttributes: (
    { __typename?: 'CategoryPayload' }
    & Pick<CategoryPayload, 'success' | 'message'>
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

export type UpdateCatalogueCountersMutationVariables = Exact<{
  input: CatalogueDataInput;
}>;


export type UpdateCatalogueCountersMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateCatalogueCounters'>
);

export type UpdateProductCounterMutationVariables = Exact<{
  input: UpdateProductCounterInput;
}>;


export type UpdateProductCounterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateProductCounter'>
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

export type CreateManufacturerMutationVariables = Exact<{
  input: CreateManufacturerInput;
}>;


export type CreateManufacturerMutation = (
  { __typename?: 'Mutation' }
  & { createManufacturer: (
    { __typename?: 'ManufacturerPayload' }
    & Pick<ManufacturerPayload, 'success' | 'message'>
  ) }
);

export type UpdateManufacturerMutationVariables = Exact<{
  input: UpdateManufacturerInput;
}>;


export type UpdateManufacturerMutation = (
  { __typename?: 'Mutation' }
  & { updateManufacturer: (
    { __typename?: 'ManufacturerPayload' }
    & Pick<ManufacturerPayload, 'success' | 'message'>
  ) }
);

export type DeleteManufacturerMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteManufacturerMutation = (
  { __typename?: 'Mutation' }
  & { deleteManufacturer: (
    { __typename?: 'ManufacturerPayload' }
    & Pick<ManufacturerPayload, 'success' | 'message'>
  ) }
);

export type CreateMetricMutationVariables = Exact<{
  input: CreateMetricInput;
}>;


export type CreateMetricMutation = (
  { __typename?: 'Mutation' }
  & { createMetric: (
    { __typename?: 'MetricPayload' }
    & Pick<MetricPayload, 'success' | 'message'>
  ) }
);

export type UpdateMetricMutationVariables = Exact<{
  input: UpdateMetricInput;
}>;


export type UpdateMetricMutation = (
  { __typename?: 'Mutation' }
  & { updateMetric: (
    { __typename?: 'MetricPayload' }
    & Pick<MetricPayload, 'success' | 'message'>
  ) }
);

export type DeleteMetricMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteMetricMutation = (
  { __typename?: 'Mutation' }
  & { deleteMetric: (
    { __typename?: 'MetricPayload' }
    & Pick<MetricPayload, 'success' | 'message'>
  ) }
);

export type CreateNavItemMutationVariables = Exact<{
  input: CreateNavItemInput;
}>;


export type CreateNavItemMutation = (
  { __typename?: 'Mutation' }
  & { createNavItem: (
    { __typename?: 'NavItemPayload' }
    & Pick<NavItemPayload, 'success' | 'message'>
  ) }
);

export type UpdateNavItemMutationVariables = Exact<{
  input: UpdateNavItemInput;
}>;


export type UpdateNavItemMutation = (
  { __typename?: 'Mutation' }
  & { updateNavItem: (
    { __typename?: 'NavItemPayload' }
    & Pick<NavItemPayload, 'success' | 'message'>
  ) }
);

export type DeleteNavItemMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteNavItemMutation = (
  { __typename?: 'Mutation' }
  & { deleteNavItem: (
    { __typename?: 'NavItemPayload' }
    & Pick<NavItemPayload, 'success' | 'message'>
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

export type ConfirmOrderMutationVariables = Exact<{
  input: ConfirmOrderInput;
}>;


export type ConfirmOrderMutation = (
  { __typename?: 'Mutation' }
  & { confirmOrder: (
    { __typename?: 'MakeAnOrderPayload' }
    & Pick<MakeAnOrderPayload, 'success' | 'message'>
  ) }
);

export type CreateOrderStatusMutationVariables = Exact<{
  input: CreateOrderStatusInput;
}>;


export type CreateOrderStatusMutation = (
  { __typename?: 'Mutation' }
  & { createOrderStatus: (
    { __typename?: 'OrderStatusPayload' }
    & Pick<OrderStatusPayload, 'success' | 'message'>
  ) }
);

export type UpdateOrderStatusMutationVariables = Exact<{
  input: UpdateOrderStatusInput;
}>;


export type UpdateOrderStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateOrderStatus: (
    { __typename?: 'OrderStatusPayload' }
    & Pick<OrderStatusPayload, 'success' | 'message'>
  ) }
);

export type DeleteOrderStatusMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteOrderStatusMutation = (
  { __typename?: 'Mutation' }
  & { deleteOrderStatus: (
    { __typename?: 'OrderStatusPayload' }
    & Pick<OrderStatusPayload, 'success' | 'message'>
  ) }
);

export type CreatePagesGroupMutationVariables = Exact<{
  input: CreatePagesGroupInput;
}>;


export type CreatePagesGroupMutation = (
  { __typename?: 'Mutation' }
  & { createPagesGroup: (
    { __typename?: 'PagesGroupPayload' }
    & Pick<PagesGroupPayload, 'success' | 'message'>
  ) }
);

export type UpdatePagesGroupMutationVariables = Exact<{
  input: UpdatePagesGroupInput;
}>;


export type UpdatePagesGroupMutation = (
  { __typename?: 'Mutation' }
  & { updatePagesGroup: (
    { __typename?: 'PagesGroupPayload' }
    & Pick<PagesGroupPayload, 'success' | 'message'>
  ) }
);

export type DeletePagesGroupMutationVariables = Exact<{
  input: DeletePagesGroupInput;
}>;


export type DeletePagesGroupMutation = (
  { __typename?: 'Mutation' }
  & { deletePagesGroup: (
    { __typename?: 'PagesGroupPayload' }
    & Pick<PagesGroupPayload, 'success' | 'message'>
  ) }
);

export type CreatePageMutationVariables = Exact<{
  input: CreatePageInput;
}>;


export type CreatePageMutation = (
  { __typename?: 'Mutation' }
  & { createPage: (
    { __typename?: 'PagePayload' }
    & Pick<PagePayload, 'success' | 'message'>
  ) }
);

export type UpdatePageMutationVariables = Exact<{
  input: UpdatePageInput;
}>;


export type UpdatePageMutation = (
  { __typename?: 'Mutation' }
  & { updatePage: (
    { __typename?: 'PagePayload' }
    & Pick<PagePayload, 'success' | 'message'>
  ) }
);

export type DeletePageMutationVariables = Exact<{
  input: DeletePageInput;
}>;


export type DeletePageMutation = (
  { __typename?: 'Mutation' }
  & { deletePage: (
    { __typename?: 'PagePayload' }
    & Pick<PagePayload, 'success' | 'message'>
  ) }
);

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { updateProduct: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
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
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, '_id' | 'rubricId'>
    )> }
  ) }
);

export type CopyProductMutationVariables = Exact<{
  input: CopyProductInput;
}>;


export type CopyProductMutation = (
  { __typename?: 'Mutation' }
  & { copyProduct: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, '_id' | 'rubricId'>
    )> }
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

export type UpdateProductBrandMutationVariables = Exact<{
  input: UpdateProductBrandInput;
}>;


export type UpdateProductBrandMutation = (
  { __typename?: 'Mutation' }
  & { updateProductBrand: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductBrandCollectionMutationVariables = Exact<{
  input: UpdateProductBrandCollectionInput;
}>;


export type UpdateProductBrandCollectionMutation = (
  { __typename?: 'Mutation' }
  & { updateProductBrandCollection: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductManufacturerMutationVariables = Exact<{
  input: UpdateProductManufacturerInput;
}>;


export type UpdateProductManufacturerMutation = (
  { __typename?: 'Mutation' }
  & { updateProductManufacturer: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductSupplierMutationVariables = Exact<{
  input: UpdateProductSupplierInput;
}>;


export type UpdateProductSupplierMutation = (
  { __typename?: 'Mutation' }
  & { updateProductSupplier: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductSelectAttributeMutationVariables = Exact<{
  input: UpdateProductSelectAttributeInput;
}>;


export type UpdateProductSelectAttributeMutation = (
  { __typename?: 'Mutation' }
  & { updateProductSelectAttribute: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductNumberAttributeMutationVariables = Exact<{
  input: UpdateProductNumberAttributeInput;
}>;


export type UpdateProductNumberAttributeMutation = (
  { __typename?: 'Mutation' }
  & { updateProductNumberAttribute: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductTextAttributeMutationVariables = Exact<{
  input: UpdateProductTextAttributeInput;
}>;


export type UpdateProductTextAttributeMutation = (
  { __typename?: 'Mutation' }
  & { updateProductTextAttribute: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductCardContentMutationVariables = Exact<{
  input: UpdateProductCardContentInput;
}>;


export type UpdateProductCardContentMutation = (
  { __typename?: 'Mutation' }
  & { updateProductCardContent: (
    { __typename?: 'ProductCardContentPayload' }
    & Pick<ProductCardContentPayload, 'success' | 'message'>
  ) }
);

export type UpdateProductCategoryMutationVariables = Exact<{
  input: UpdateProductCategoryInput;
}>;


export type UpdateProductCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateProductCategory: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
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

export type UpdateRoleRuleMutationVariables = Exact<{
  input: UpdateRoleRuleInput;
}>;


export type UpdateRoleRuleMutation = (
  { __typename?: 'Mutation' }
  & { updateRoleRule: (
    { __typename?: 'RoleRulePayload' }
    & Pick<RoleRulePayload, 'success' | 'message'>
  ) }
);

export type UpdateRoleNavMutationVariables = Exact<{
  input: UpdateRoleNavInput;
}>;


export type UpdateRoleNavMutation = (
  { __typename?: 'Mutation' }
  & { updateRoleNav: (
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

export type GenerateShopTokenMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GenerateShopTokenMutation = (
  { __typename?: 'Mutation' }
  & { generateShopToken: (
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

export type UpdateManyShopProductsMutationVariables = Exact<{
  input: Array<UpdateShopProductInput> | UpdateShopProductInput;
}>;


export type UpdateManyShopProductsMutation = (
  { __typename?: 'Mutation' }
  & { updateManyShopProducts: (
    { __typename?: 'ShopProductPayload' }
    & Pick<ShopProductPayload, 'success' | 'message'>
  ) }
);

export type AddManyProductsToShopMutationVariables = Exact<{
  input: Array<AddProductToShopInput> | AddProductToShopInput;
}>;


export type AddManyProductsToShopMutation = (
  { __typename?: 'Mutation' }
  & { addManyProductsToShop: (
    { __typename?: 'ShopPayload' }
    & Pick<ShopPayload, 'success' | 'message'>
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

export type UpdateProductWithSyncErrorMutationVariables = Exact<{
  input: UpdateProductWithSyncErrorInput;
}>;


export type UpdateProductWithSyncErrorMutation = (
  { __typename?: 'Mutation' }
  & { updateProductWithSyncError: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
  ) }
);

export type CreateProductWithSyncErrorMutationVariables = Exact<{
  input: CreateProductWithSyncErrorInput;
}>;


export type CreateProductWithSyncErrorMutation = (
  { __typename?: 'Mutation' }
  & { createProductWithSyncError: (
    { __typename?: 'ProductPayload' }
    & Pick<ProductPayload, 'success' | 'message'>
    & { payload?: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, '_id' | 'rubricId'>
    )> }
  ) }
);

export type CreateSupplierMutationVariables = Exact<{
  input: CreateSupplierInput;
}>;


export type CreateSupplierMutation = (
  { __typename?: 'Mutation' }
  & { createSupplier: (
    { __typename?: 'SupplierPayload' }
    & Pick<SupplierPayload, 'success' | 'message'>
  ) }
);

export type UpdateSupplierMutationVariables = Exact<{
  input: UpdateSupplierInput;
}>;


export type UpdateSupplierMutation = (
  { __typename?: 'Mutation' }
  & { updateSupplier: (
    { __typename?: 'SupplierPayload' }
    & Pick<SupplierPayload, 'success' | 'message'>
  ) }
);

export type DeleteSupplierMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteSupplierMutation = (
  { __typename?: 'Mutation' }
  & { deleteSupplier: (
    { __typename?: 'SupplierPayload' }
    & Pick<SupplierPayload, 'success' | 'message'>
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
      & Pick<User, '_id' | 'email'>
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
  ) }
);

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserPayload' }
    & Pick<UserPayload, 'success' | 'message'>
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'UserPayload' }
    & Pick<UserPayload, 'success' | 'message'>
  ) }
);

export type UpdateUserPasswordMutationVariables = Exact<{
  input: UpdateUserPasswordInput;
}>;


export type UpdateUserPasswordMutation = (
  { __typename?: 'Mutation' }
  & { updateUserPassword: (
    { __typename?: 'UserPayload' }
    & Pick<UserPayload, 'success' | 'message'>
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: (
    { __typename?: 'UserPayload' }
    & Pick<UserPayload, 'success' | 'message'>
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

export type GetCatalogueAdditionalOptionsQueryVariables = Exact<{
  input: CatalogueAdditionalOptionsInput;
}>;


export type GetCatalogueAdditionalOptionsQuery = (
  { __typename?: 'Query' }
  & { getCatalogueAdditionalOptions?: Maybe<Array<(
    { __typename?: 'OptionsAlphabetList' }
    & Pick<OptionsAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'Option' }
      & Pick<Option, '_id' | 'name' | 'slug'>
    )> }
  )>> }
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

export type GetAppCompanyShopsQueryVariables = Exact<{
  input?: Maybe<PaginationInput>;
  companyId: Scalars['ObjectId'];
}>;


export type GetAppCompanyShopsQuery = (
  { __typename?: 'Query' }
  & { getCompanyShops: (
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
  & Pick<Product, '_id' | 'itemId' | 'originalName' | 'mainImage'>
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

export type GetCompanyShopQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetCompanyShopQuery = (
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
    & Pick<Shop, '_id'>
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

export type GetNewOrdersCounterQueryVariables = Exact<{
  input?: Maybe<GetNewOrdersCounterInput>;
}>;


export type GetNewOrdersCounterQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getNewOrdersCounter'>
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

export type ProductSnippetFragment = (
  { __typename?: 'Product' }
  & Pick<Product, '_id' | 'itemId' | 'originalName' | 'slug' | 'rubricSlug' | 'mainImage' | 'shopsCount'>
  & { cardPrices: (
    { __typename?: 'ProductCardPrices' }
    & Pick<ProductCardPrices, '_id' | 'min' | 'max'>
  ) }
);

export type SearchRubricFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, '_id' | 'name' | 'slug'>
);

export type GetCatalogueSearchTopItemsQueryVariables = Exact<{
  input: CatalogueSearchTopItemsInput;
}>;


export type GetCatalogueSearchTopItemsQuery = (
  { __typename?: 'Query' }
  & { getCatalogueSearchTopItems: (
    { __typename?: 'CatalogueSearchResult' }
    & { rubrics: Array<(
      { __typename?: 'Rubric' }
      & SearchRubricFragment
    )>, products: Array<(
      { __typename?: 'Product' }
      & ProductSnippetFragment
    )> }
  ) }
);

export type GetCatalogueSearchResultQueryVariables = Exact<{
  input: CatalogueSearchInput;
}>;


export type GetCatalogueSearchResultQuery = (
  { __typename?: 'Query' }
  & { getCatalogueSearchResult: (
    { __typename?: 'CatalogueSearchResult' }
    & { rubrics: Array<(
      { __typename?: 'Rubric' }
      & SearchRubricFragment
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

export type GetBrandAlphabetListsQueryVariables = Exact<{
  input?: Maybe<BrandAlphabetInput>;
}>;


export type GetBrandAlphabetListsQuery = (
  { __typename?: 'Query' }
  & { getBrandAlphabetLists: Array<(
    { __typename?: 'BrandsAlphabetList' }
    & Pick<BrandsAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'Brand' }
      & Pick<Brand, '_id' | 'slug' | 'name'>
    )> }
  )> }
);

export type GetBrandCollectionAlphabetListsQueryVariables = Exact<{
  input?: Maybe<BrandCollectionAlphabetInput>;
}>;


export type GetBrandCollectionAlphabetListsQuery = (
  { __typename?: 'Query' }
  & { getBrandCollectionAlphabetLists: Array<(
    { __typename?: 'BrandCollectionsAlphabetList' }
    & Pick<BrandCollectionsAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'BrandCollection' }
      & Pick<BrandCollection, '_id' | 'slug' | 'name'>
    )> }
  )> }
);

export type GetManufacturerAlphabetListsQueryVariables = Exact<{
  input?: Maybe<ManufacturerAlphabetInput>;
}>;


export type GetManufacturerAlphabetListsQuery = (
  { __typename?: 'Query' }
  & { getManufacturerAlphabetLists: Array<(
    { __typename?: 'ManufacturersAlphabetList' }
    & Pick<ManufacturersAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'Manufacturer' }
      & Pick<Manufacturer, '_id' | 'slug' | 'name'>
    )> }
  )> }
);

export type GetSupplierAlphabetListsQueryVariables = Exact<{
  input?: Maybe<SupplierAlphabetInput>;
}>;


export type GetSupplierAlphabetListsQuery = (
  { __typename?: 'Query' }
  & { getSupplierAlphabetLists: Array<(
    { __typename?: 'SuppliersAlphabetList' }
    & Pick<SuppliersAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'Supplier' }
      & Pick<Supplier, '_id' | 'slug' | 'name'>
    )> }
  )> }
);

export type GetOptionAlphabetListsQueryVariables = Exact<{
  input: OptionAlphabetInput;
}>;


export type GetOptionAlphabetListsQuery = (
  { __typename?: 'Query' }
  & { getOptionAlphabetLists: Array<(
    { __typename?: 'OptionsAlphabetList' }
    & Pick<OptionsAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'Option' }
      & Pick<Option, '_id' | 'name' | 'slug'>
      & { options?: Maybe<Array<(
        { __typename?: 'Option' }
        & Pick<Option, '_id' | 'name' | 'slug'>
        & { options?: Maybe<Array<(
          { __typename?: 'Option' }
          & Pick<Option, '_id' | 'name' | 'slug'>
          & { options?: Maybe<Array<(
            { __typename?: 'Option' }
            & Pick<Option, '_id' | 'name' | 'slug'>
            & { options?: Maybe<Array<(
              { __typename?: 'Option' }
              & Pick<Option, '_id' | 'name' | 'slug'>
            )>> }
          )>> }
        )>> }
      )>> }
    )> }
  )> }
);

export type GetSessionCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionCitiesQuery = (
  { __typename?: 'Query' }
  & { getSessionCities: Array<(
    { __typename?: 'City' }
    & Pick<City, '_id' | 'slug' | 'name'>
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

export type UserCompanyFragment = (
  { __typename?: 'Company' }
  & Pick<Company, '_id' | 'name' | 'slug'>
);

export type UserCompanyQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCompanyQuery = (
  { __typename?: 'Query' }
  & { getUserCompany?: Maybe<(
    { __typename?: 'Company' }
    & UserCompanyFragment
  )> }
);

export const RubricInListFragmentDoc = gql`
    fragment RubricInList on Rubric {
  _id
  nameI18n
  slug
  name
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
  originalName
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
export const CartPayloadFragmentDoc = gql`
    fragment CartPayload on CartPayload {
  success
  message
}
    `;
export const MakeAnOrderPayloadFragmentDoc = gql`
    fragment MakeAnOrderPayload on MakeAnOrderPayload {
  success
  message
}
    `;
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
  originalName
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
export const RubricVariantFragmentDoc = gql`
    fragment RubricVariant on RubricVariant {
  _id
  name
  nameI18n
}
    `;
export const ProductSnippetFragmentDoc = gql`
    fragment ProductSnippet on Product {
  _id
  itemId
  originalName
  slug
  rubricSlug
  mainImage
  shopsCount
  cardPrices {
    _id
    min
    max
  }
}
    `;
export const SearchRubricFragmentDoc = gql`
    fragment SearchRubric on Rubric {
  _id
  name
  slug
}
    `;
export const SelectOptionFragmentDoc = gql`
    fragment SelectOption on SelectOption {
  _id
  name
  icon
}
    `;
export const UserCompanyFragmentDoc = gql`
    fragment UserCompany on Company {
  _id
  name
  slug
}
    `;
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
export const ToggleAttributeInProductAttributesDocument = gql`
    mutation ToggleAttributeInProductAttributes($input: UpdateAttributeInRubricInput!) {
  toggleAttributeInProductAttributes(input: $input) {
    success
    message
  }
}
    `;
export type ToggleAttributeInProductAttributesMutationFn = Apollo.MutationFunction<ToggleAttributeInProductAttributesMutation, ToggleAttributeInProductAttributesMutationVariables>;

/**
 * __useToggleAttributeInProductAttributesMutation__
 *
 * To run a mutation, you first call `useToggleAttributeInProductAttributesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAttributeInProductAttributesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAttributeInProductAttributesMutation, { data, loading, error }] = useToggleAttributeInProductAttributesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleAttributeInProductAttributesMutation(baseOptions?: Apollo.MutationHookOptions<ToggleAttributeInProductAttributesMutation, ToggleAttributeInProductAttributesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleAttributeInProductAttributesMutation, ToggleAttributeInProductAttributesMutationVariables>(ToggleAttributeInProductAttributesDocument, options);
      }
export type ToggleAttributeInProductAttributesMutationHookResult = ReturnType<typeof useToggleAttributeInProductAttributesMutation>;
export type ToggleAttributeInProductAttributesMutationResult = Apollo.MutationResult<ToggleAttributeInProductAttributesMutation>;
export type ToggleAttributeInProductAttributesMutationOptions = Apollo.BaseMutationOptions<ToggleAttributeInProductAttributesMutation, ToggleAttributeInProductAttributesMutationVariables>;
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
    name
    slug
  }
}
    `;

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
export const AddAttributesGroupToCategoryDocument = gql`
    mutation AddAttributesGroupToCategory($input: AddAttributesGroupToCategoryInput!) {
  addAttributesGroupToCategory(input: $input) {
    success
    message
  }
}
    `;
export type AddAttributesGroupToCategoryMutationFn = Apollo.MutationFunction<AddAttributesGroupToCategoryMutation, AddAttributesGroupToCategoryMutationVariables>;

/**
 * __useAddAttributesGroupToCategoryMutation__
 *
 * To run a mutation, you first call `useAddAttributesGroupToCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAttributesGroupToCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAttributesGroupToCategoryMutation, { data, loading, error }] = useAddAttributesGroupToCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAttributesGroupToCategoryMutation(baseOptions?: Apollo.MutationHookOptions<AddAttributesGroupToCategoryMutation, AddAttributesGroupToCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAttributesGroupToCategoryMutation, AddAttributesGroupToCategoryMutationVariables>(AddAttributesGroupToCategoryDocument, options);
      }
export type AddAttributesGroupToCategoryMutationHookResult = ReturnType<typeof useAddAttributesGroupToCategoryMutation>;
export type AddAttributesGroupToCategoryMutationResult = Apollo.MutationResult<AddAttributesGroupToCategoryMutation>;
export type AddAttributesGroupToCategoryMutationOptions = Apollo.BaseMutationOptions<AddAttributesGroupToCategoryMutation, AddAttributesGroupToCategoryMutationVariables>;
export const DeleteAttributesGroupFromCategoryDocument = gql`
    mutation DeleteAttributesGroupFromCategory($input: DeleteAttributesGroupFromCategoryInput!) {
  deleteAttributesGroupFromCategory(input: $input) {
    success
    message
  }
}
    `;
export type DeleteAttributesGroupFromCategoryMutationFn = Apollo.MutationFunction<DeleteAttributesGroupFromCategoryMutation, DeleteAttributesGroupFromCategoryMutationVariables>;

/**
 * __useDeleteAttributesGroupFromCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteAttributesGroupFromCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributesGroupFromCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributesGroupFromCategoryMutation, { data, loading, error }] = useDeleteAttributesGroupFromCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteAttributesGroupFromCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributesGroupFromCategoryMutation, DeleteAttributesGroupFromCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributesGroupFromCategoryMutation, DeleteAttributesGroupFromCategoryMutationVariables>(DeleteAttributesGroupFromCategoryDocument, options);
      }
export type DeleteAttributesGroupFromCategoryMutationHookResult = ReturnType<typeof useDeleteAttributesGroupFromCategoryMutation>;
export type DeleteAttributesGroupFromCategoryMutationResult = Apollo.MutationResult<DeleteAttributesGroupFromCategoryMutation>;
export type DeleteAttributesGroupFromCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteAttributesGroupFromCategoryMutation, DeleteAttributesGroupFromCategoryMutationVariables>;
export const CreateBrandDocument = gql`
    mutation CreateBrand($input: CreateBrandInput!) {
  createBrand(input: $input) {
    success
    message
  }
}
    `;
export type CreateBrandMutationFn = Apollo.MutationFunction<CreateBrandMutation, CreateBrandMutationVariables>;

/**
 * __useCreateBrandMutation__
 *
 * To run a mutation, you first call `useCreateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBrandMutation, { data, loading, error }] = useCreateBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBrandMutation(baseOptions?: Apollo.MutationHookOptions<CreateBrandMutation, CreateBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBrandMutation, CreateBrandMutationVariables>(CreateBrandDocument, options);
      }
export type CreateBrandMutationHookResult = ReturnType<typeof useCreateBrandMutation>;
export type CreateBrandMutationResult = Apollo.MutationResult<CreateBrandMutation>;
export type CreateBrandMutationOptions = Apollo.BaseMutationOptions<CreateBrandMutation, CreateBrandMutationVariables>;
export const UpdateBrandDocument = gql`
    mutation UpdateBrand($input: UpdateBrandInput!) {
  updateBrand(input: $input) {
    success
    message
  }
}
    `;
export type UpdateBrandMutationFn = Apollo.MutationFunction<UpdateBrandMutation, UpdateBrandMutationVariables>;

/**
 * __useUpdateBrandMutation__
 *
 * To run a mutation, you first call `useUpdateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBrandMutation, { data, loading, error }] = useUpdateBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBrandMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBrandMutation, UpdateBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBrandMutation, UpdateBrandMutationVariables>(UpdateBrandDocument, options);
      }
export type UpdateBrandMutationHookResult = ReturnType<typeof useUpdateBrandMutation>;
export type UpdateBrandMutationResult = Apollo.MutationResult<UpdateBrandMutation>;
export type UpdateBrandMutationOptions = Apollo.BaseMutationOptions<UpdateBrandMutation, UpdateBrandMutationVariables>;
export const DeleteBrandDocument = gql`
    mutation DeleteBrand($_id: ObjectId!) {
  deleteBrand(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteBrandMutationFn = Apollo.MutationFunction<DeleteBrandMutation, DeleteBrandMutationVariables>;

/**
 * __useDeleteBrandMutation__
 *
 * To run a mutation, you first call `useDeleteBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBrandMutation, { data, loading, error }] = useDeleteBrandMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteBrandMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBrandMutation, DeleteBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBrandMutation, DeleteBrandMutationVariables>(DeleteBrandDocument, options);
      }
export type DeleteBrandMutationHookResult = ReturnType<typeof useDeleteBrandMutation>;
export type DeleteBrandMutationResult = Apollo.MutationResult<DeleteBrandMutation>;
export type DeleteBrandMutationOptions = Apollo.BaseMutationOptions<DeleteBrandMutation, DeleteBrandMutationVariables>;
export const AddCollectionToBrandDocument = gql`
    mutation AddCollectionToBrand($input: AddCollectionToBrandInput!) {
  addCollectionToBrand(input: $input) {
    success
    message
  }
}
    `;
export type AddCollectionToBrandMutationFn = Apollo.MutationFunction<AddCollectionToBrandMutation, AddCollectionToBrandMutationVariables>;

/**
 * __useAddCollectionToBrandMutation__
 *
 * To run a mutation, you first call `useAddCollectionToBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCollectionToBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCollectionToBrandMutation, { data, loading, error }] = useAddCollectionToBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddCollectionToBrandMutation(baseOptions?: Apollo.MutationHookOptions<AddCollectionToBrandMutation, AddCollectionToBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCollectionToBrandMutation, AddCollectionToBrandMutationVariables>(AddCollectionToBrandDocument, options);
      }
export type AddCollectionToBrandMutationHookResult = ReturnType<typeof useAddCollectionToBrandMutation>;
export type AddCollectionToBrandMutationResult = Apollo.MutationResult<AddCollectionToBrandMutation>;
export type AddCollectionToBrandMutationOptions = Apollo.BaseMutationOptions<AddCollectionToBrandMutation, AddCollectionToBrandMutationVariables>;
export const UpdateCollectionInBrandDocument = gql`
    mutation UpdateCollectionInBrand($input: UpdateCollectionInBrandInput!) {
  updateCollectionInBrand(input: $input) {
    success
    message
  }
}
    `;
export type UpdateCollectionInBrandMutationFn = Apollo.MutationFunction<UpdateCollectionInBrandMutation, UpdateCollectionInBrandMutationVariables>;

/**
 * __useUpdateCollectionInBrandMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionInBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionInBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionInBrandMutation, { data, loading, error }] = useUpdateCollectionInBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCollectionInBrandMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCollectionInBrandMutation, UpdateCollectionInBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCollectionInBrandMutation, UpdateCollectionInBrandMutationVariables>(UpdateCollectionInBrandDocument, options);
      }
export type UpdateCollectionInBrandMutationHookResult = ReturnType<typeof useUpdateCollectionInBrandMutation>;
export type UpdateCollectionInBrandMutationResult = Apollo.MutationResult<UpdateCollectionInBrandMutation>;
export type UpdateCollectionInBrandMutationOptions = Apollo.BaseMutationOptions<UpdateCollectionInBrandMutation, UpdateCollectionInBrandMutationVariables>;
export const DeleteCollectionFromBrandDocument = gql`
    mutation DeleteCollectionFromBrand($input: DeleteCollectionFromBrandInput!) {
  deleteCollectionFromBrand(input: $input) {
    success
    message
  }
}
    `;
export type DeleteCollectionFromBrandMutationFn = Apollo.MutationFunction<DeleteCollectionFromBrandMutation, DeleteCollectionFromBrandMutationVariables>;

/**
 * __useDeleteCollectionFromBrandMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionFromBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionFromBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionFromBrandMutation, { data, loading, error }] = useDeleteCollectionFromBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteCollectionFromBrandMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCollectionFromBrandMutation, DeleteCollectionFromBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCollectionFromBrandMutation, DeleteCollectionFromBrandMutationVariables>(DeleteCollectionFromBrandDocument, options);
      }
export type DeleteCollectionFromBrandMutationHookResult = ReturnType<typeof useDeleteCollectionFromBrandMutation>;
export type DeleteCollectionFromBrandMutationResult = Apollo.MutationResult<DeleteCollectionFromBrandMutation>;
export type DeleteCollectionFromBrandMutationOptions = Apollo.BaseMutationOptions<DeleteCollectionFromBrandMutation, DeleteCollectionFromBrandMutationVariables>;
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
export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    success
    message
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
    success
    message
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($_id: ObjectId!) {
  deleteCategory(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const ToggleAttributeInCategoryCatalogueDocument = gql`
    mutation ToggleAttributeInCategoryCatalogue($input: UpdateAttributeInCategoryInput!) {
  toggleAttributeInCategoryCatalogue(input: $input) {
    success
    message
  }
}
    `;
export type ToggleAttributeInCategoryCatalogueMutationFn = Apollo.MutationFunction<ToggleAttributeInCategoryCatalogueMutation, ToggleAttributeInCategoryCatalogueMutationVariables>;

/**
 * __useToggleAttributeInCategoryCatalogueMutation__
 *
 * To run a mutation, you first call `useToggleAttributeInCategoryCatalogueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAttributeInCategoryCatalogueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAttributeInCategoryCatalogueMutation, { data, loading, error }] = useToggleAttributeInCategoryCatalogueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleAttributeInCategoryCatalogueMutation(baseOptions?: Apollo.MutationHookOptions<ToggleAttributeInCategoryCatalogueMutation, ToggleAttributeInCategoryCatalogueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleAttributeInCategoryCatalogueMutation, ToggleAttributeInCategoryCatalogueMutationVariables>(ToggleAttributeInCategoryCatalogueDocument, options);
      }
export type ToggleAttributeInCategoryCatalogueMutationHookResult = ReturnType<typeof useToggleAttributeInCategoryCatalogueMutation>;
export type ToggleAttributeInCategoryCatalogueMutationResult = Apollo.MutationResult<ToggleAttributeInCategoryCatalogueMutation>;
export type ToggleAttributeInCategoryCatalogueMutationOptions = Apollo.BaseMutationOptions<ToggleAttributeInCategoryCatalogueMutation, ToggleAttributeInCategoryCatalogueMutationVariables>;
export const ToggleAttributeInCategoryNavDocument = gql`
    mutation ToggleAttributeInCategoryNav($input: UpdateAttributeInCategoryInput!) {
  toggleAttributeInCategoryNav(input: $input) {
    success
    message
  }
}
    `;
export type ToggleAttributeInCategoryNavMutationFn = Apollo.MutationFunction<ToggleAttributeInCategoryNavMutation, ToggleAttributeInCategoryNavMutationVariables>;

/**
 * __useToggleAttributeInCategoryNavMutation__
 *
 * To run a mutation, you first call `useToggleAttributeInCategoryNavMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAttributeInCategoryNavMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAttributeInCategoryNavMutation, { data, loading, error }] = useToggleAttributeInCategoryNavMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleAttributeInCategoryNavMutation(baseOptions?: Apollo.MutationHookOptions<ToggleAttributeInCategoryNavMutation, ToggleAttributeInCategoryNavMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleAttributeInCategoryNavMutation, ToggleAttributeInCategoryNavMutationVariables>(ToggleAttributeInCategoryNavDocument, options);
      }
export type ToggleAttributeInCategoryNavMutationHookResult = ReturnType<typeof useToggleAttributeInCategoryNavMutation>;
export type ToggleAttributeInCategoryNavMutationResult = Apollo.MutationResult<ToggleAttributeInCategoryNavMutation>;
export type ToggleAttributeInCategoryNavMutationOptions = Apollo.BaseMutationOptions<ToggleAttributeInCategoryNavMutation, ToggleAttributeInCategoryNavMutationVariables>;
export const ToggleAttributeInCategoryProductAttributesDocument = gql`
    mutation ToggleAttributeInCategoryProductAttributes($input: UpdateAttributeInCategoryInput!) {
  toggleAttributeInCategoryProductAttributes(input: $input) {
    success
    message
  }
}
    `;
export type ToggleAttributeInCategoryProductAttributesMutationFn = Apollo.MutationFunction<ToggleAttributeInCategoryProductAttributesMutation, ToggleAttributeInCategoryProductAttributesMutationVariables>;

/**
 * __useToggleAttributeInCategoryProductAttributesMutation__
 *
 * To run a mutation, you first call `useToggleAttributeInCategoryProductAttributesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAttributeInCategoryProductAttributesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAttributeInCategoryProductAttributesMutation, { data, loading, error }] = useToggleAttributeInCategoryProductAttributesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleAttributeInCategoryProductAttributesMutation(baseOptions?: Apollo.MutationHookOptions<ToggleAttributeInCategoryProductAttributesMutation, ToggleAttributeInCategoryProductAttributesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleAttributeInCategoryProductAttributesMutation, ToggleAttributeInCategoryProductAttributesMutationVariables>(ToggleAttributeInCategoryProductAttributesDocument, options);
      }
export type ToggleAttributeInCategoryProductAttributesMutationHookResult = ReturnType<typeof useToggleAttributeInCategoryProductAttributesMutation>;
export type ToggleAttributeInCategoryProductAttributesMutationResult = Apollo.MutationResult<ToggleAttributeInCategoryProductAttributesMutation>;
export type ToggleAttributeInCategoryProductAttributesMutationOptions = Apollo.BaseMutationOptions<ToggleAttributeInCategoryProductAttributesMutation, ToggleAttributeInCategoryProductAttributesMutationVariables>;
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
export const CreateManufacturerDocument = gql`
    mutation CreateManufacturer($input: CreateManufacturerInput!) {
  createManufacturer(input: $input) {
    success
    message
  }
}
    `;
export type CreateManufacturerMutationFn = Apollo.MutationFunction<CreateManufacturerMutation, CreateManufacturerMutationVariables>;

/**
 * __useCreateManufacturerMutation__
 *
 * To run a mutation, you first call `useCreateManufacturerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateManufacturerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createManufacturerMutation, { data, loading, error }] = useCreateManufacturerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateManufacturerMutation(baseOptions?: Apollo.MutationHookOptions<CreateManufacturerMutation, CreateManufacturerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateManufacturerMutation, CreateManufacturerMutationVariables>(CreateManufacturerDocument, options);
      }
export type CreateManufacturerMutationHookResult = ReturnType<typeof useCreateManufacturerMutation>;
export type CreateManufacturerMutationResult = Apollo.MutationResult<CreateManufacturerMutation>;
export type CreateManufacturerMutationOptions = Apollo.BaseMutationOptions<CreateManufacturerMutation, CreateManufacturerMutationVariables>;
export const UpdateManufacturerDocument = gql`
    mutation UpdateManufacturer($input: UpdateManufacturerInput!) {
  updateManufacturer(input: $input) {
    success
    message
  }
}
    `;
export type UpdateManufacturerMutationFn = Apollo.MutationFunction<UpdateManufacturerMutation, UpdateManufacturerMutationVariables>;

/**
 * __useUpdateManufacturerMutation__
 *
 * To run a mutation, you first call `useUpdateManufacturerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateManufacturerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateManufacturerMutation, { data, loading, error }] = useUpdateManufacturerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateManufacturerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateManufacturerMutation, UpdateManufacturerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateManufacturerMutation, UpdateManufacturerMutationVariables>(UpdateManufacturerDocument, options);
      }
export type UpdateManufacturerMutationHookResult = ReturnType<typeof useUpdateManufacturerMutation>;
export type UpdateManufacturerMutationResult = Apollo.MutationResult<UpdateManufacturerMutation>;
export type UpdateManufacturerMutationOptions = Apollo.BaseMutationOptions<UpdateManufacturerMutation, UpdateManufacturerMutationVariables>;
export const DeleteManufacturerDocument = gql`
    mutation DeleteManufacturer($_id: ObjectId!) {
  deleteManufacturer(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteManufacturerMutationFn = Apollo.MutationFunction<DeleteManufacturerMutation, DeleteManufacturerMutationVariables>;

/**
 * __useDeleteManufacturerMutation__
 *
 * To run a mutation, you first call `useDeleteManufacturerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteManufacturerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteManufacturerMutation, { data, loading, error }] = useDeleteManufacturerMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteManufacturerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteManufacturerMutation, DeleteManufacturerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteManufacturerMutation, DeleteManufacturerMutationVariables>(DeleteManufacturerDocument, options);
      }
export type DeleteManufacturerMutationHookResult = ReturnType<typeof useDeleteManufacturerMutation>;
export type DeleteManufacturerMutationResult = Apollo.MutationResult<DeleteManufacturerMutation>;
export type DeleteManufacturerMutationOptions = Apollo.BaseMutationOptions<DeleteManufacturerMutation, DeleteManufacturerMutationVariables>;
export const CreateMetricDocument = gql`
    mutation CreateMetric($input: CreateMetricInput!) {
  createMetric(input: $input) {
    success
    message
  }
}
    `;
export type CreateMetricMutationFn = Apollo.MutationFunction<CreateMetricMutation, CreateMetricMutationVariables>;

/**
 * __useCreateMetricMutation__
 *
 * To run a mutation, you first call `useCreateMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMetricMutation, { data, loading, error }] = useCreateMetricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMetricMutation(baseOptions?: Apollo.MutationHookOptions<CreateMetricMutation, CreateMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMetricMutation, CreateMetricMutationVariables>(CreateMetricDocument, options);
      }
export type CreateMetricMutationHookResult = ReturnType<typeof useCreateMetricMutation>;
export type CreateMetricMutationResult = Apollo.MutationResult<CreateMetricMutation>;
export type CreateMetricMutationOptions = Apollo.BaseMutationOptions<CreateMetricMutation, CreateMetricMutationVariables>;
export const UpdateMetricDocument = gql`
    mutation UpdateMetric($input: UpdateMetricInput!) {
  updateMetric(input: $input) {
    success
    message
  }
}
    `;
export type UpdateMetricMutationFn = Apollo.MutationFunction<UpdateMetricMutation, UpdateMetricMutationVariables>;

/**
 * __useUpdateMetricMutation__
 *
 * To run a mutation, you first call `useUpdateMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMetricMutation, { data, loading, error }] = useUpdateMetricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMetricMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMetricMutation, UpdateMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMetricMutation, UpdateMetricMutationVariables>(UpdateMetricDocument, options);
      }
export type UpdateMetricMutationHookResult = ReturnType<typeof useUpdateMetricMutation>;
export type UpdateMetricMutationResult = Apollo.MutationResult<UpdateMetricMutation>;
export type UpdateMetricMutationOptions = Apollo.BaseMutationOptions<UpdateMetricMutation, UpdateMetricMutationVariables>;
export const DeleteMetricDocument = gql`
    mutation DeleteMetric($_id: ObjectId!) {
  deleteMetric(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteMetricMutationFn = Apollo.MutationFunction<DeleteMetricMutation, DeleteMetricMutationVariables>;

/**
 * __useDeleteMetricMutation__
 *
 * To run a mutation, you first call `useDeleteMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMetricMutation, { data, loading, error }] = useDeleteMetricMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteMetricMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMetricMutation, DeleteMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMetricMutation, DeleteMetricMutationVariables>(DeleteMetricDocument, options);
      }
export type DeleteMetricMutationHookResult = ReturnType<typeof useDeleteMetricMutation>;
export type DeleteMetricMutationResult = Apollo.MutationResult<DeleteMetricMutation>;
export type DeleteMetricMutationOptions = Apollo.BaseMutationOptions<DeleteMetricMutation, DeleteMetricMutationVariables>;
export const CreateNavItemDocument = gql`
    mutation CreateNavItem($input: CreateNavItemInput!) {
  createNavItem(input: $input) {
    success
    message
  }
}
    `;
export type CreateNavItemMutationFn = Apollo.MutationFunction<CreateNavItemMutation, CreateNavItemMutationVariables>;

/**
 * __useCreateNavItemMutation__
 *
 * To run a mutation, you first call `useCreateNavItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNavItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNavItemMutation, { data, loading, error }] = useCreateNavItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNavItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateNavItemMutation, CreateNavItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNavItemMutation, CreateNavItemMutationVariables>(CreateNavItemDocument, options);
      }
export type CreateNavItemMutationHookResult = ReturnType<typeof useCreateNavItemMutation>;
export type CreateNavItemMutationResult = Apollo.MutationResult<CreateNavItemMutation>;
export type CreateNavItemMutationOptions = Apollo.BaseMutationOptions<CreateNavItemMutation, CreateNavItemMutationVariables>;
export const UpdateNavItemDocument = gql`
    mutation UpdateNavItem($input: UpdateNavItemInput!) {
  updateNavItem(input: $input) {
    success
    message
  }
}
    `;
export type UpdateNavItemMutationFn = Apollo.MutationFunction<UpdateNavItemMutation, UpdateNavItemMutationVariables>;

/**
 * __useUpdateNavItemMutation__
 *
 * To run a mutation, you first call `useUpdateNavItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNavItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNavItemMutation, { data, loading, error }] = useUpdateNavItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNavItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNavItemMutation, UpdateNavItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNavItemMutation, UpdateNavItemMutationVariables>(UpdateNavItemDocument, options);
      }
export type UpdateNavItemMutationHookResult = ReturnType<typeof useUpdateNavItemMutation>;
export type UpdateNavItemMutationResult = Apollo.MutationResult<UpdateNavItemMutation>;
export type UpdateNavItemMutationOptions = Apollo.BaseMutationOptions<UpdateNavItemMutation, UpdateNavItemMutationVariables>;
export const DeleteNavItemDocument = gql`
    mutation DeleteNavItem($_id: ObjectId!) {
  deleteNavItem(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteNavItemMutationFn = Apollo.MutationFunction<DeleteNavItemMutation, DeleteNavItemMutationVariables>;

/**
 * __useDeleteNavItemMutation__
 *
 * To run a mutation, you first call `useDeleteNavItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNavItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNavItemMutation, { data, loading, error }] = useDeleteNavItemMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteNavItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNavItemMutation, DeleteNavItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNavItemMutation, DeleteNavItemMutationVariables>(DeleteNavItemDocument, options);
      }
export type DeleteNavItemMutationHookResult = ReturnType<typeof useDeleteNavItemMutation>;
export type DeleteNavItemMutationResult = Apollo.MutationResult<DeleteNavItemMutation>;
export type DeleteNavItemMutationOptions = Apollo.BaseMutationOptions<DeleteNavItemMutation, DeleteNavItemMutationVariables>;
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
export const ConfirmOrderDocument = gql`
    mutation ConfirmOrder($input: ConfirmOrderInput!) {
  confirmOrder(input: $input) {
    success
    message
  }
}
    `;
export type ConfirmOrderMutationFn = Apollo.MutationFunction<ConfirmOrderMutation, ConfirmOrderMutationVariables>;

/**
 * __useConfirmOrderMutation__
 *
 * To run a mutation, you first call `useConfirmOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmOrderMutation, { data, loading, error }] = useConfirmOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmOrderMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmOrderMutation, ConfirmOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmOrderMutation, ConfirmOrderMutationVariables>(ConfirmOrderDocument, options);
      }
export type ConfirmOrderMutationHookResult = ReturnType<typeof useConfirmOrderMutation>;
export type ConfirmOrderMutationResult = Apollo.MutationResult<ConfirmOrderMutation>;
export type ConfirmOrderMutationOptions = Apollo.BaseMutationOptions<ConfirmOrderMutation, ConfirmOrderMutationVariables>;
export const CreateOrderStatusDocument = gql`
    mutation CreateOrderStatus($input: CreateOrderStatusInput!) {
  createOrderStatus(input: $input) {
    success
    message
  }
}
    `;
export type CreateOrderStatusMutationFn = Apollo.MutationFunction<CreateOrderStatusMutation, CreateOrderStatusMutationVariables>;

/**
 * __useCreateOrderStatusMutation__
 *
 * To run a mutation, you first call `useCreateOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderStatusMutation, { data, loading, error }] = useCreateOrderStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrderStatusMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderStatusMutation, CreateOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrderStatusMutation, CreateOrderStatusMutationVariables>(CreateOrderStatusDocument, options);
      }
export type CreateOrderStatusMutationHookResult = ReturnType<typeof useCreateOrderStatusMutation>;
export type CreateOrderStatusMutationResult = Apollo.MutationResult<CreateOrderStatusMutation>;
export type CreateOrderStatusMutationOptions = Apollo.BaseMutationOptions<CreateOrderStatusMutation, CreateOrderStatusMutationVariables>;
export const UpdateOrderStatusDocument = gql`
    mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
  updateOrderStatus(input: $input) {
    success
    message
  }
}
    `;
export type UpdateOrderStatusMutationFn = Apollo.MutationFunction<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;

/**
 * __useUpdateOrderStatusMutation__
 *
 * To run a mutation, you first call `useUpdateOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderStatusMutation, { data, loading, error }] = useUpdateOrderStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrderStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>(UpdateOrderStatusDocument, options);
      }
export type UpdateOrderStatusMutationHookResult = ReturnType<typeof useUpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationResult = Apollo.MutationResult<UpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationOptions = Apollo.BaseMutationOptions<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;
export const DeleteOrderStatusDocument = gql`
    mutation DeleteOrderStatus($_id: ObjectId!) {
  deleteOrderStatus(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteOrderStatusMutationFn = Apollo.MutationFunction<DeleteOrderStatusMutation, DeleteOrderStatusMutationVariables>;

/**
 * __useDeleteOrderStatusMutation__
 *
 * To run a mutation, you first call `useDeleteOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrderStatusMutation, { data, loading, error }] = useDeleteOrderStatusMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteOrderStatusMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrderStatusMutation, DeleteOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrderStatusMutation, DeleteOrderStatusMutationVariables>(DeleteOrderStatusDocument, options);
      }
export type DeleteOrderStatusMutationHookResult = ReturnType<typeof useDeleteOrderStatusMutation>;
export type DeleteOrderStatusMutationResult = Apollo.MutationResult<DeleteOrderStatusMutation>;
export type DeleteOrderStatusMutationOptions = Apollo.BaseMutationOptions<DeleteOrderStatusMutation, DeleteOrderStatusMutationVariables>;
export const CreatePagesGroupDocument = gql`
    mutation CreatePagesGroup($input: CreatePagesGroupInput!) {
  createPagesGroup(input: $input) {
    success
    message
  }
}
    `;
export type CreatePagesGroupMutationFn = Apollo.MutationFunction<CreatePagesGroupMutation, CreatePagesGroupMutationVariables>;

/**
 * __useCreatePagesGroupMutation__
 *
 * To run a mutation, you first call `useCreatePagesGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePagesGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPagesGroupMutation, { data, loading, error }] = useCreatePagesGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePagesGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreatePagesGroupMutation, CreatePagesGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePagesGroupMutation, CreatePagesGroupMutationVariables>(CreatePagesGroupDocument, options);
      }
export type CreatePagesGroupMutationHookResult = ReturnType<typeof useCreatePagesGroupMutation>;
export type CreatePagesGroupMutationResult = Apollo.MutationResult<CreatePagesGroupMutation>;
export type CreatePagesGroupMutationOptions = Apollo.BaseMutationOptions<CreatePagesGroupMutation, CreatePagesGroupMutationVariables>;
export const UpdatePagesGroupDocument = gql`
    mutation UpdatePagesGroup($input: UpdatePagesGroupInput!) {
  updatePagesGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdatePagesGroupMutationFn = Apollo.MutationFunction<UpdatePagesGroupMutation, UpdatePagesGroupMutationVariables>;

/**
 * __useUpdatePagesGroupMutation__
 *
 * To run a mutation, you first call `useUpdatePagesGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePagesGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePagesGroupMutation, { data, loading, error }] = useUpdatePagesGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePagesGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePagesGroupMutation, UpdatePagesGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePagesGroupMutation, UpdatePagesGroupMutationVariables>(UpdatePagesGroupDocument, options);
      }
export type UpdatePagesGroupMutationHookResult = ReturnType<typeof useUpdatePagesGroupMutation>;
export type UpdatePagesGroupMutationResult = Apollo.MutationResult<UpdatePagesGroupMutation>;
export type UpdatePagesGroupMutationOptions = Apollo.BaseMutationOptions<UpdatePagesGroupMutation, UpdatePagesGroupMutationVariables>;
export const DeletePagesGroupDocument = gql`
    mutation DeletePagesGroup($input: DeletePagesGroupInput!) {
  deletePagesGroup(input: $input) {
    success
    message
  }
}
    `;
export type DeletePagesGroupMutationFn = Apollo.MutationFunction<DeletePagesGroupMutation, DeletePagesGroupMutationVariables>;

/**
 * __useDeletePagesGroupMutation__
 *
 * To run a mutation, you first call `useDeletePagesGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePagesGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePagesGroupMutation, { data, loading, error }] = useDeletePagesGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeletePagesGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeletePagesGroupMutation, DeletePagesGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePagesGroupMutation, DeletePagesGroupMutationVariables>(DeletePagesGroupDocument, options);
      }
export type DeletePagesGroupMutationHookResult = ReturnType<typeof useDeletePagesGroupMutation>;
export type DeletePagesGroupMutationResult = Apollo.MutationResult<DeletePagesGroupMutation>;
export type DeletePagesGroupMutationOptions = Apollo.BaseMutationOptions<DeletePagesGroupMutation, DeletePagesGroupMutationVariables>;
export const CreatePageDocument = gql`
    mutation CreatePage($input: CreatePageInput!) {
  createPage(input: $input) {
    success
    message
  }
}
    `;
export type CreatePageMutationFn = Apollo.MutationFunction<CreatePageMutation, CreatePageMutationVariables>;

/**
 * __useCreatePageMutation__
 *
 * To run a mutation, you first call `useCreatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPageMutation, { data, loading, error }] = useCreatePageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePageMutation(baseOptions?: Apollo.MutationHookOptions<CreatePageMutation, CreatePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePageMutation, CreatePageMutationVariables>(CreatePageDocument, options);
      }
export type CreatePageMutationHookResult = ReturnType<typeof useCreatePageMutation>;
export type CreatePageMutationResult = Apollo.MutationResult<CreatePageMutation>;
export type CreatePageMutationOptions = Apollo.BaseMutationOptions<CreatePageMutation, CreatePageMutationVariables>;
export const UpdatePageDocument = gql`
    mutation UpdatePage($input: UpdatePageInput!) {
  updatePage(input: $input) {
    success
    message
  }
}
    `;
export type UpdatePageMutationFn = Apollo.MutationFunction<UpdatePageMutation, UpdatePageMutationVariables>;

/**
 * __useUpdatePageMutation__
 *
 * To run a mutation, you first call `useUpdatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePageMutation, { data, loading, error }] = useUpdatePageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePageMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePageMutation, UpdatePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePageMutation, UpdatePageMutationVariables>(UpdatePageDocument, options);
      }
export type UpdatePageMutationHookResult = ReturnType<typeof useUpdatePageMutation>;
export type UpdatePageMutationResult = Apollo.MutationResult<UpdatePageMutation>;
export type UpdatePageMutationOptions = Apollo.BaseMutationOptions<UpdatePageMutation, UpdatePageMutationVariables>;
export const DeletePageDocument = gql`
    mutation DeletePage($input: DeletePageInput!) {
  deletePage(input: $input) {
    success
    message
  }
}
    `;
export type DeletePageMutationFn = Apollo.MutationFunction<DeletePageMutation, DeletePageMutationVariables>;

/**
 * __useDeletePageMutation__
 *
 * To run a mutation, you first call `useDeletePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePageMutation, { data, loading, error }] = useDeletePageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeletePageMutation(baseOptions?: Apollo.MutationHookOptions<DeletePageMutation, DeletePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePageMutation, DeletePageMutationVariables>(DeletePageDocument, options);
      }
export type DeletePageMutationHookResult = ReturnType<typeof useDeletePageMutation>;
export type DeletePageMutationResult = Apollo.MutationResult<DeletePageMutation>;
export type DeletePageMutationOptions = Apollo.BaseMutationOptions<DeletePageMutation, DeletePageMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    success
    message
  }
}
    `;
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
export const DeleteProductAssetDocument = gql`
    mutation DeleteProductAsset($input: DeleteProductAssetInput!) {
  deleteProductAsset(input: $input) {
    success
    message
  }
}
    `;
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
  }
}
    `;
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
    payload {
      _id
      rubricId
    }
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
export const CopyProductDocument = gql`
    mutation CopyProduct($input: CopyProductInput!) {
  copyProduct(input: $input) {
    success
    message
    payload {
      _id
      rubricId
    }
  }
}
    `;
export type CopyProductMutationFn = Apollo.MutationFunction<CopyProductMutation, CopyProductMutationVariables>;

/**
 * __useCopyProductMutation__
 *
 * To run a mutation, you first call `useCopyProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCopyProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [copyProductMutation, { data, loading, error }] = useCopyProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCopyProductMutation(baseOptions?: Apollo.MutationHookOptions<CopyProductMutation, CopyProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CopyProductMutation, CopyProductMutationVariables>(CopyProductDocument, options);
      }
export type CopyProductMutationHookResult = ReturnType<typeof useCopyProductMutation>;
export type CopyProductMutationResult = Apollo.MutationResult<CopyProductMutation>;
export type CopyProductMutationOptions = Apollo.BaseMutationOptions<CopyProductMutation, CopyProductMutationVariables>;
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
export const UpdateProductBrandDocument = gql`
    mutation UpdateProductBrand($input: UpdateProductBrandInput!) {
  updateProductBrand(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductBrandMutationFn = Apollo.MutationFunction<UpdateProductBrandMutation, UpdateProductBrandMutationVariables>;

/**
 * __useUpdateProductBrandMutation__
 *
 * To run a mutation, you first call `useUpdateProductBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductBrandMutation, { data, loading, error }] = useUpdateProductBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductBrandMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductBrandMutation, UpdateProductBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductBrandMutation, UpdateProductBrandMutationVariables>(UpdateProductBrandDocument, options);
      }
export type UpdateProductBrandMutationHookResult = ReturnType<typeof useUpdateProductBrandMutation>;
export type UpdateProductBrandMutationResult = Apollo.MutationResult<UpdateProductBrandMutation>;
export type UpdateProductBrandMutationOptions = Apollo.BaseMutationOptions<UpdateProductBrandMutation, UpdateProductBrandMutationVariables>;
export const UpdateProductBrandCollectionDocument = gql`
    mutation UpdateProductBrandCollection($input: UpdateProductBrandCollectionInput!) {
  updateProductBrandCollection(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductBrandCollectionMutationFn = Apollo.MutationFunction<UpdateProductBrandCollectionMutation, UpdateProductBrandCollectionMutationVariables>;

/**
 * __useUpdateProductBrandCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateProductBrandCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductBrandCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductBrandCollectionMutation, { data, loading, error }] = useUpdateProductBrandCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductBrandCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductBrandCollectionMutation, UpdateProductBrandCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductBrandCollectionMutation, UpdateProductBrandCollectionMutationVariables>(UpdateProductBrandCollectionDocument, options);
      }
export type UpdateProductBrandCollectionMutationHookResult = ReturnType<typeof useUpdateProductBrandCollectionMutation>;
export type UpdateProductBrandCollectionMutationResult = Apollo.MutationResult<UpdateProductBrandCollectionMutation>;
export type UpdateProductBrandCollectionMutationOptions = Apollo.BaseMutationOptions<UpdateProductBrandCollectionMutation, UpdateProductBrandCollectionMutationVariables>;
export const UpdateProductManufacturerDocument = gql`
    mutation UpdateProductManufacturer($input: UpdateProductManufacturerInput!) {
  updateProductManufacturer(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductManufacturerMutationFn = Apollo.MutationFunction<UpdateProductManufacturerMutation, UpdateProductManufacturerMutationVariables>;

/**
 * __useUpdateProductManufacturerMutation__
 *
 * To run a mutation, you first call `useUpdateProductManufacturerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductManufacturerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductManufacturerMutation, { data, loading, error }] = useUpdateProductManufacturerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductManufacturerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductManufacturerMutation, UpdateProductManufacturerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductManufacturerMutation, UpdateProductManufacturerMutationVariables>(UpdateProductManufacturerDocument, options);
      }
export type UpdateProductManufacturerMutationHookResult = ReturnType<typeof useUpdateProductManufacturerMutation>;
export type UpdateProductManufacturerMutationResult = Apollo.MutationResult<UpdateProductManufacturerMutation>;
export type UpdateProductManufacturerMutationOptions = Apollo.BaseMutationOptions<UpdateProductManufacturerMutation, UpdateProductManufacturerMutationVariables>;
export const UpdateProductSupplierDocument = gql`
    mutation UpdateProductSupplier($input: UpdateProductSupplierInput!) {
  updateProductSupplier(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductSupplierMutationFn = Apollo.MutationFunction<UpdateProductSupplierMutation, UpdateProductSupplierMutationVariables>;

/**
 * __useUpdateProductSupplierMutation__
 *
 * To run a mutation, you first call `useUpdateProductSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductSupplierMutation, { data, loading, error }] = useUpdateProductSupplierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductSupplierMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductSupplierMutation, UpdateProductSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductSupplierMutation, UpdateProductSupplierMutationVariables>(UpdateProductSupplierDocument, options);
      }
export type UpdateProductSupplierMutationHookResult = ReturnType<typeof useUpdateProductSupplierMutation>;
export type UpdateProductSupplierMutationResult = Apollo.MutationResult<UpdateProductSupplierMutation>;
export type UpdateProductSupplierMutationOptions = Apollo.BaseMutationOptions<UpdateProductSupplierMutation, UpdateProductSupplierMutationVariables>;
export const UpdateProductSelectAttributeDocument = gql`
    mutation UpdateProductSelectAttribute($input: UpdateProductSelectAttributeInput!) {
  updateProductSelectAttribute(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductSelectAttributeMutationFn = Apollo.MutationFunction<UpdateProductSelectAttributeMutation, UpdateProductSelectAttributeMutationVariables>;

/**
 * __useUpdateProductSelectAttributeMutation__
 *
 * To run a mutation, you first call `useUpdateProductSelectAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductSelectAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductSelectAttributeMutation, { data, loading, error }] = useUpdateProductSelectAttributeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductSelectAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductSelectAttributeMutation, UpdateProductSelectAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductSelectAttributeMutation, UpdateProductSelectAttributeMutationVariables>(UpdateProductSelectAttributeDocument, options);
      }
export type UpdateProductSelectAttributeMutationHookResult = ReturnType<typeof useUpdateProductSelectAttributeMutation>;
export type UpdateProductSelectAttributeMutationResult = Apollo.MutationResult<UpdateProductSelectAttributeMutation>;
export type UpdateProductSelectAttributeMutationOptions = Apollo.BaseMutationOptions<UpdateProductSelectAttributeMutation, UpdateProductSelectAttributeMutationVariables>;
export const UpdateProductNumberAttributeDocument = gql`
    mutation UpdateProductNumberAttribute($input: UpdateProductNumberAttributeInput!) {
  updateProductNumberAttribute(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductNumberAttributeMutationFn = Apollo.MutationFunction<UpdateProductNumberAttributeMutation, UpdateProductNumberAttributeMutationVariables>;

/**
 * __useUpdateProductNumberAttributeMutation__
 *
 * To run a mutation, you first call `useUpdateProductNumberAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductNumberAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductNumberAttributeMutation, { data, loading, error }] = useUpdateProductNumberAttributeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductNumberAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductNumberAttributeMutation, UpdateProductNumberAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductNumberAttributeMutation, UpdateProductNumberAttributeMutationVariables>(UpdateProductNumberAttributeDocument, options);
      }
export type UpdateProductNumberAttributeMutationHookResult = ReturnType<typeof useUpdateProductNumberAttributeMutation>;
export type UpdateProductNumberAttributeMutationResult = Apollo.MutationResult<UpdateProductNumberAttributeMutation>;
export type UpdateProductNumberAttributeMutationOptions = Apollo.BaseMutationOptions<UpdateProductNumberAttributeMutation, UpdateProductNumberAttributeMutationVariables>;
export const UpdateProductTextAttributeDocument = gql`
    mutation UpdateProductTextAttribute($input: UpdateProductTextAttributeInput!) {
  updateProductTextAttribute(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductTextAttributeMutationFn = Apollo.MutationFunction<UpdateProductTextAttributeMutation, UpdateProductTextAttributeMutationVariables>;

/**
 * __useUpdateProductTextAttributeMutation__
 *
 * To run a mutation, you first call `useUpdateProductTextAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductTextAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductTextAttributeMutation, { data, loading, error }] = useUpdateProductTextAttributeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductTextAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductTextAttributeMutation, UpdateProductTextAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductTextAttributeMutation, UpdateProductTextAttributeMutationVariables>(UpdateProductTextAttributeDocument, options);
      }
export type UpdateProductTextAttributeMutationHookResult = ReturnType<typeof useUpdateProductTextAttributeMutation>;
export type UpdateProductTextAttributeMutationResult = Apollo.MutationResult<UpdateProductTextAttributeMutation>;
export type UpdateProductTextAttributeMutationOptions = Apollo.BaseMutationOptions<UpdateProductTextAttributeMutation, UpdateProductTextAttributeMutationVariables>;
export const UpdateProductCardContentDocument = gql`
    mutation UpdateProductCardContent($input: UpdateProductCardContentInput!) {
  updateProductCardContent(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductCardContentMutationFn = Apollo.MutationFunction<UpdateProductCardContentMutation, UpdateProductCardContentMutationVariables>;

/**
 * __useUpdateProductCardContentMutation__
 *
 * To run a mutation, you first call `useUpdateProductCardContentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductCardContentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductCardContentMutation, { data, loading, error }] = useUpdateProductCardContentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductCardContentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductCardContentMutation, UpdateProductCardContentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductCardContentMutation, UpdateProductCardContentMutationVariables>(UpdateProductCardContentDocument, options);
      }
export type UpdateProductCardContentMutationHookResult = ReturnType<typeof useUpdateProductCardContentMutation>;
export type UpdateProductCardContentMutationResult = Apollo.MutationResult<UpdateProductCardContentMutation>;
export type UpdateProductCardContentMutationOptions = Apollo.BaseMutationOptions<UpdateProductCardContentMutation, UpdateProductCardContentMutationVariables>;
export const UpdateProductCategoryDocument = gql`
    mutation UpdateProductCategory($input: UpdateProductCategoryInput!) {
  updateProductCategory(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductCategoryMutationFn = Apollo.MutationFunction<UpdateProductCategoryMutation, UpdateProductCategoryMutationVariables>;

/**
 * __useUpdateProductCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateProductCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductCategoryMutation, { data, loading, error }] = useUpdateProductCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductCategoryMutation, UpdateProductCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductCategoryMutation, UpdateProductCategoryMutationVariables>(UpdateProductCategoryDocument, options);
      }
export type UpdateProductCategoryMutationHookResult = ReturnType<typeof useUpdateProductCategoryMutation>;
export type UpdateProductCategoryMutationResult = Apollo.MutationResult<UpdateProductCategoryMutation>;
export type UpdateProductCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateProductCategoryMutation, UpdateProductCategoryMutationVariables>;
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
export const UpdateRoleRuleDocument = gql`
    mutation UpdateRoleRule($input: UpdateRoleRuleInput!) {
  updateRoleRule(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRoleRuleMutationFn = Apollo.MutationFunction<UpdateRoleRuleMutation, UpdateRoleRuleMutationVariables>;

/**
 * __useUpdateRoleRuleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleRuleMutation, { data, loading, error }] = useUpdateRoleRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleRuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleRuleMutation, UpdateRoleRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoleRuleMutation, UpdateRoleRuleMutationVariables>(UpdateRoleRuleDocument, options);
      }
export type UpdateRoleRuleMutationHookResult = ReturnType<typeof useUpdateRoleRuleMutation>;
export type UpdateRoleRuleMutationResult = Apollo.MutationResult<UpdateRoleRuleMutation>;
export type UpdateRoleRuleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleRuleMutation, UpdateRoleRuleMutationVariables>;
export const UpdateRoleNavDocument = gql`
    mutation UpdateRoleNav($input: UpdateRoleNavInput!) {
  updateRoleNav(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRoleNavMutationFn = Apollo.MutationFunction<UpdateRoleNavMutation, UpdateRoleNavMutationVariables>;

/**
 * __useUpdateRoleNavMutation__
 *
 * To run a mutation, you first call `useUpdateRoleNavMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleNavMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleNavMutation, { data, loading, error }] = useUpdateRoleNavMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleNavMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleNavMutation, UpdateRoleNavMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoleNavMutation, UpdateRoleNavMutationVariables>(UpdateRoleNavDocument, options);
      }
export type UpdateRoleNavMutationHookResult = ReturnType<typeof useUpdateRoleNavMutation>;
export type UpdateRoleNavMutationResult = Apollo.MutationResult<UpdateRoleNavMutation>;
export type UpdateRoleNavMutationOptions = Apollo.BaseMutationOptions<UpdateRoleNavMutation, UpdateRoleNavMutationVariables>;
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
export const GenerateShopTokenDocument = gql`
    mutation GenerateShopToken($_id: ObjectId!) {
  generateShopToken(_id: $_id) {
    success
    message
  }
}
    `;
export type GenerateShopTokenMutationFn = Apollo.MutationFunction<GenerateShopTokenMutation, GenerateShopTokenMutationVariables>;

/**
 * __useGenerateShopTokenMutation__
 *
 * To run a mutation, you first call `useGenerateShopTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateShopTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateShopTokenMutation, { data, loading, error }] = useGenerateShopTokenMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGenerateShopTokenMutation(baseOptions?: Apollo.MutationHookOptions<GenerateShopTokenMutation, GenerateShopTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateShopTokenMutation, GenerateShopTokenMutationVariables>(GenerateShopTokenDocument, options);
      }
export type GenerateShopTokenMutationHookResult = ReturnType<typeof useGenerateShopTokenMutation>;
export type GenerateShopTokenMutationResult = Apollo.MutationResult<GenerateShopTokenMutation>;
export type GenerateShopTokenMutationOptions = Apollo.BaseMutationOptions<GenerateShopTokenMutation, GenerateShopTokenMutationVariables>;
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
export const UpdateManyShopProductsDocument = gql`
    mutation UpdateManyShopProducts($input: [UpdateShopProductInput!]!) {
  updateManyShopProducts(input: $input) {
    success
    message
  }
}
    `;
export type UpdateManyShopProductsMutationFn = Apollo.MutationFunction<UpdateManyShopProductsMutation, UpdateManyShopProductsMutationVariables>;

/**
 * __useUpdateManyShopProductsMutation__
 *
 * To run a mutation, you first call `useUpdateManyShopProductsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateManyShopProductsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateManyShopProductsMutation, { data, loading, error }] = useUpdateManyShopProductsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateManyShopProductsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateManyShopProductsMutation, UpdateManyShopProductsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateManyShopProductsMutation, UpdateManyShopProductsMutationVariables>(UpdateManyShopProductsDocument, options);
      }
export type UpdateManyShopProductsMutationHookResult = ReturnType<typeof useUpdateManyShopProductsMutation>;
export type UpdateManyShopProductsMutationResult = Apollo.MutationResult<UpdateManyShopProductsMutation>;
export type UpdateManyShopProductsMutationOptions = Apollo.BaseMutationOptions<UpdateManyShopProductsMutation, UpdateManyShopProductsMutationVariables>;
export const AddManyProductsToShopDocument = gql`
    mutation AddManyProductsToShop($input: [AddProductToShopInput!]!) {
  addManyProductsToShop(input: $input) {
    success
    message
  }
}
    `;
export type AddManyProductsToShopMutationFn = Apollo.MutationFunction<AddManyProductsToShopMutation, AddManyProductsToShopMutationVariables>;

/**
 * __useAddManyProductsToShopMutation__
 *
 * To run a mutation, you first call `useAddManyProductsToShopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddManyProductsToShopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addManyProductsToShopMutation, { data, loading, error }] = useAddManyProductsToShopMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddManyProductsToShopMutation(baseOptions?: Apollo.MutationHookOptions<AddManyProductsToShopMutation, AddManyProductsToShopMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddManyProductsToShopMutation, AddManyProductsToShopMutationVariables>(AddManyProductsToShopDocument, options);
      }
export type AddManyProductsToShopMutationHookResult = ReturnType<typeof useAddManyProductsToShopMutation>;
export type AddManyProductsToShopMutationResult = Apollo.MutationResult<AddManyProductsToShopMutation>;
export type AddManyProductsToShopMutationOptions = Apollo.BaseMutationOptions<AddManyProductsToShopMutation, AddManyProductsToShopMutationVariables>;
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
export const UpdateProductWithSyncErrorDocument = gql`
    mutation UpdateProductWithSyncError($input: UpdateProductWithSyncErrorInput!) {
  updateProductWithSyncError(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProductWithSyncErrorMutationFn = Apollo.MutationFunction<UpdateProductWithSyncErrorMutation, UpdateProductWithSyncErrorMutationVariables>;

/**
 * __useUpdateProductWithSyncErrorMutation__
 *
 * To run a mutation, you first call `useUpdateProductWithSyncErrorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductWithSyncErrorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductWithSyncErrorMutation, { data, loading, error }] = useUpdateProductWithSyncErrorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductWithSyncErrorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductWithSyncErrorMutation, UpdateProductWithSyncErrorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductWithSyncErrorMutation, UpdateProductWithSyncErrorMutationVariables>(UpdateProductWithSyncErrorDocument, options);
      }
export type UpdateProductWithSyncErrorMutationHookResult = ReturnType<typeof useUpdateProductWithSyncErrorMutation>;
export type UpdateProductWithSyncErrorMutationResult = Apollo.MutationResult<UpdateProductWithSyncErrorMutation>;
export type UpdateProductWithSyncErrorMutationOptions = Apollo.BaseMutationOptions<UpdateProductWithSyncErrorMutation, UpdateProductWithSyncErrorMutationVariables>;
export const CreateProductWithSyncErrorDocument = gql`
    mutation CreateProductWithSyncError($input: CreateProductWithSyncErrorInput!) {
  createProductWithSyncError(input: $input) {
    success
    message
    payload {
      _id
      rubricId
    }
  }
}
    `;
export type CreateProductWithSyncErrorMutationFn = Apollo.MutationFunction<CreateProductWithSyncErrorMutation, CreateProductWithSyncErrorMutationVariables>;

/**
 * __useCreateProductWithSyncErrorMutation__
 *
 * To run a mutation, you first call `useCreateProductWithSyncErrorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductWithSyncErrorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductWithSyncErrorMutation, { data, loading, error }] = useCreateProductWithSyncErrorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductWithSyncErrorMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductWithSyncErrorMutation, CreateProductWithSyncErrorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductWithSyncErrorMutation, CreateProductWithSyncErrorMutationVariables>(CreateProductWithSyncErrorDocument, options);
      }
export type CreateProductWithSyncErrorMutationHookResult = ReturnType<typeof useCreateProductWithSyncErrorMutation>;
export type CreateProductWithSyncErrorMutationResult = Apollo.MutationResult<CreateProductWithSyncErrorMutation>;
export type CreateProductWithSyncErrorMutationOptions = Apollo.BaseMutationOptions<CreateProductWithSyncErrorMutation, CreateProductWithSyncErrorMutationVariables>;
export const CreateSupplierDocument = gql`
    mutation CreateSupplier($input: CreateSupplierInput!) {
  createSupplier(input: $input) {
    success
    message
  }
}
    `;
export type CreateSupplierMutationFn = Apollo.MutationFunction<CreateSupplierMutation, CreateSupplierMutationVariables>;

/**
 * __useCreateSupplierMutation__
 *
 * To run a mutation, you first call `useCreateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSupplierMutation, { data, loading, error }] = useCreateSupplierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSupplierMutation(baseOptions?: Apollo.MutationHookOptions<CreateSupplierMutation, CreateSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSupplierMutation, CreateSupplierMutationVariables>(CreateSupplierDocument, options);
      }
export type CreateSupplierMutationHookResult = ReturnType<typeof useCreateSupplierMutation>;
export type CreateSupplierMutationResult = Apollo.MutationResult<CreateSupplierMutation>;
export type CreateSupplierMutationOptions = Apollo.BaseMutationOptions<CreateSupplierMutation, CreateSupplierMutationVariables>;
export const UpdateSupplierDocument = gql`
    mutation UpdateSupplier($input: UpdateSupplierInput!) {
  updateSupplier(input: $input) {
    success
    message
  }
}
    `;
export type UpdateSupplierMutationFn = Apollo.MutationFunction<UpdateSupplierMutation, UpdateSupplierMutationVariables>;

/**
 * __useUpdateSupplierMutation__
 *
 * To run a mutation, you first call `useUpdateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSupplierMutation, { data, loading, error }] = useUpdateSupplierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSupplierMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSupplierMutation, UpdateSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSupplierMutation, UpdateSupplierMutationVariables>(UpdateSupplierDocument, options);
      }
export type UpdateSupplierMutationHookResult = ReturnType<typeof useUpdateSupplierMutation>;
export type UpdateSupplierMutationResult = Apollo.MutationResult<UpdateSupplierMutation>;
export type UpdateSupplierMutationOptions = Apollo.BaseMutationOptions<UpdateSupplierMutation, UpdateSupplierMutationVariables>;
export const DeleteSupplierDocument = gql`
    mutation DeleteSupplier($_id: ObjectId!) {
  deleteSupplier(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteSupplierMutationFn = Apollo.MutationFunction<DeleteSupplierMutation, DeleteSupplierMutationVariables>;

/**
 * __useDeleteSupplierMutation__
 *
 * To run a mutation, you first call `useDeleteSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSupplierMutation, { data, loading, error }] = useDeleteSupplierMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteSupplierMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSupplierMutation, DeleteSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSupplierMutation, DeleteSupplierMutationVariables>(DeleteSupplierDocument, options);
      }
export type DeleteSupplierMutationHookResult = ReturnType<typeof useDeleteSupplierMutation>;
export type DeleteSupplierMutationResult = Apollo.MutationResult<DeleteSupplierMutation>;
export type DeleteSupplierMutationOptions = Apollo.BaseMutationOptions<DeleteSupplierMutation, DeleteSupplierMutationVariables>;
export const UpdateMyProfileDocument = gql`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
  updateMyProfile(input: $input) {
    success
    message
    payload {
      _id
      email
    }
  }
}
    `;
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
  }
}
    `;
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
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    success
    message
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    success
    message
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserPasswordDocument = gql`
    mutation UpdateUserPassword($input: UpdateUserPasswordInput!) {
  updateUserPassword(input: $input) {
    success
    message
  }
}
    `;
export type UpdateUserPasswordMutationFn = Apollo.MutationFunction<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;

/**
 * __useUpdateUserPasswordMutation__
 *
 * To run a mutation, you first call `useUpdateUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPasswordMutation, { data, loading, error }] = useUpdateUserPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>(UpdateUserPasswordDocument, options);
      }
export type UpdateUserPasswordMutationHookResult = ReturnType<typeof useUpdateUserPasswordMutation>;
export type UpdateUserPasswordMutationResult = Apollo.MutationResult<UpdateUserPasswordMutation>;
export type UpdateUserPasswordMutationOptions = Apollo.BaseMutationOptions<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($_id: ObjectId!) {
  deleteUser(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
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
export const GetCatalogueAdditionalOptionsDocument = gql`
    query GetCatalogueAdditionalOptions($input: CatalogueAdditionalOptionsInput!) {
  getCatalogueAdditionalOptions(input: $input) {
    letter
    docs {
      _id
      name
      slug
    }
  }
}
    `;

/**
 * __useGetCatalogueAdditionalOptionsQuery__
 *
 * To run a query within a React component, call `useGetCatalogueAdditionalOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueAdditionalOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueAdditionalOptionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCatalogueAdditionalOptionsQuery(baseOptions: Apollo.QueryHookOptions<GetCatalogueAdditionalOptionsQuery, GetCatalogueAdditionalOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatalogueAdditionalOptionsQuery, GetCatalogueAdditionalOptionsQueryVariables>(GetCatalogueAdditionalOptionsDocument, options);
      }
export function useGetCatalogueAdditionalOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueAdditionalOptionsQuery, GetCatalogueAdditionalOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatalogueAdditionalOptionsQuery, GetCatalogueAdditionalOptionsQueryVariables>(GetCatalogueAdditionalOptionsDocument, options);
        }
export type GetCatalogueAdditionalOptionsQueryHookResult = ReturnType<typeof useGetCatalogueAdditionalOptionsQuery>;
export type GetCatalogueAdditionalOptionsLazyQueryHookResult = ReturnType<typeof useGetCatalogueAdditionalOptionsLazyQuery>;
export type GetCatalogueAdditionalOptionsQueryResult = Apollo.QueryResult<GetCatalogueAdditionalOptionsQuery, GetCatalogueAdditionalOptionsQueryVariables>;
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
export const GetAppCompanyShopsDocument = gql`
    query GetAppCompanyShops($input: PaginationInput, $companyId: ObjectId!) {
  getCompanyShops(input: $input, companyId: $companyId) {
    totalPages
    docs {
      ...ShopInList
    }
  }
}
    ${ShopInListFragmentDoc}`;

/**
 * __useGetAppCompanyShopsQuery__
 *
 * To run a query within a React component, call `useGetAppCompanyShopsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppCompanyShopsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppCompanyShopsQuery({
 *   variables: {
 *      input: // value for 'input'
 *      companyId: // value for 'companyId'
 *   },
 * });
 */
export function useGetAppCompanyShopsQuery(baseOptions: Apollo.QueryHookOptions<GetAppCompanyShopsQuery, GetAppCompanyShopsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppCompanyShopsQuery, GetAppCompanyShopsQueryVariables>(GetAppCompanyShopsDocument, options);
      }
export function useGetAppCompanyShopsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppCompanyShopsQuery, GetAppCompanyShopsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppCompanyShopsQuery, GetAppCompanyShopsQueryVariables>(GetAppCompanyShopsDocument, options);
        }
export type GetAppCompanyShopsQueryHookResult = ReturnType<typeof useGetAppCompanyShopsQuery>;
export type GetAppCompanyShopsLazyQueryHookResult = ReturnType<typeof useGetAppCompanyShopsLazyQuery>;
export type GetAppCompanyShopsQueryResult = Apollo.QueryResult<GetAppCompanyShopsQuery, GetAppCompanyShopsQueryVariables>;
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
export const GetCompanyShopDocument = gql`
    query GetCompanyShop($_id: ObjectId!) {
  getShop(_id: $_id) {
    ...Shop
  }
}
    ${ShopFragmentDoc}`;

/**
 * __useGetCompanyShopQuery__
 *
 * To run a query within a React component, call `useGetCompanyShopQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyShopQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyShopQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetCompanyShopQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyShopQuery, GetCompanyShopQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyShopQuery, GetCompanyShopQueryVariables>(GetCompanyShopDocument, options);
      }
export function useGetCompanyShopLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyShopQuery, GetCompanyShopQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyShopQuery, GetCompanyShopQueryVariables>(GetCompanyShopDocument, options);
        }
export type GetCompanyShopQueryHookResult = ReturnType<typeof useGetCompanyShopQuery>;
export type GetCompanyShopLazyQueryHookResult = ReturnType<typeof useGetCompanyShopLazyQuery>;
export type GetCompanyShopQueryResult = Apollo.QueryResult<GetCompanyShopQuery, GetCompanyShopQueryVariables>;
export const GetShopProductsDocument = gql`
    query GetShopProducts($shopId: ObjectId!, $input: PaginationInput) {
  getShop(_id: $shopId) {
    _id
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
export const GetNewOrdersCounterDocument = gql`
    query GetNewOrdersCounter($input: GetNewOrdersCounterInput) {
  getNewOrdersCounter(input: $input)
}
    `;

/**
 * __useGetNewOrdersCounterQuery__
 *
 * To run a query within a React component, call `useGetNewOrdersCounterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNewOrdersCounterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewOrdersCounterQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetNewOrdersCounterQuery(baseOptions?: Apollo.QueryHookOptions<GetNewOrdersCounterQuery, GetNewOrdersCounterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNewOrdersCounterQuery, GetNewOrdersCounterQueryVariables>(GetNewOrdersCounterDocument, options);
      }
export function useGetNewOrdersCounterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNewOrdersCounterQuery, GetNewOrdersCounterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNewOrdersCounterQuery, GetNewOrdersCounterQueryVariables>(GetNewOrdersCounterDocument, options);
        }
export type GetNewOrdersCounterQueryHookResult = ReturnType<typeof useGetNewOrdersCounterQuery>;
export type GetNewOrdersCounterLazyQueryHookResult = ReturnType<typeof useGetNewOrdersCounterLazyQuery>;
export type GetNewOrdersCounterQueryResult = Apollo.QueryResult<GetNewOrdersCounterQuery, GetNewOrdersCounterQueryVariables>;
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
    query GetCatalogueSearchTopItems($input: CatalogueSearchTopItemsInput!) {
  getCatalogueSearchTopItems(input: $input) {
    rubrics {
      ...SearchRubric
    }
    products {
      ...ProductSnippet
    }
  }
}
    ${SearchRubricFragmentDoc}
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
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCatalogueSearchTopItemsQuery(baseOptions: Apollo.QueryHookOptions<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>) {
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
    query GetCatalogueSearchResult($input: CatalogueSearchInput!) {
  getCatalogueSearchResult(input: $input) {
    rubrics {
      ...SearchRubric
    }
    products {
      ...ProductSnippet
    }
  }
}
    ${SearchRubricFragmentDoc}
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
 *      input: // value for 'input'
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
export const GetBrandAlphabetListsDocument = gql`
    query GetBrandAlphabetLists($input: BrandAlphabetInput) {
  getBrandAlphabetLists(input: $input) {
    letter
    docs {
      _id
      slug
      name
    }
  }
}
    `;

/**
 * __useGetBrandAlphabetListsQuery__
 *
 * To run a query within a React component, call `useGetBrandAlphabetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrandAlphabetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrandAlphabetListsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetBrandAlphabetListsQuery(baseOptions?: Apollo.QueryHookOptions<GetBrandAlphabetListsQuery, GetBrandAlphabetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBrandAlphabetListsQuery, GetBrandAlphabetListsQueryVariables>(GetBrandAlphabetListsDocument, options);
      }
export function useGetBrandAlphabetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBrandAlphabetListsQuery, GetBrandAlphabetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBrandAlphabetListsQuery, GetBrandAlphabetListsQueryVariables>(GetBrandAlphabetListsDocument, options);
        }
export type GetBrandAlphabetListsQueryHookResult = ReturnType<typeof useGetBrandAlphabetListsQuery>;
export type GetBrandAlphabetListsLazyQueryHookResult = ReturnType<typeof useGetBrandAlphabetListsLazyQuery>;
export type GetBrandAlphabetListsQueryResult = Apollo.QueryResult<GetBrandAlphabetListsQuery, GetBrandAlphabetListsQueryVariables>;
export const GetBrandCollectionAlphabetListsDocument = gql`
    query GetBrandCollectionAlphabetLists($input: BrandCollectionAlphabetInput) {
  getBrandCollectionAlphabetLists(input: $input) {
    letter
    docs {
      _id
      slug
      name
    }
  }
}
    `;

/**
 * __useGetBrandCollectionAlphabetListsQuery__
 *
 * To run a query within a React component, call `useGetBrandCollectionAlphabetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrandCollectionAlphabetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrandCollectionAlphabetListsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetBrandCollectionAlphabetListsQuery(baseOptions?: Apollo.QueryHookOptions<GetBrandCollectionAlphabetListsQuery, GetBrandCollectionAlphabetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBrandCollectionAlphabetListsQuery, GetBrandCollectionAlphabetListsQueryVariables>(GetBrandCollectionAlphabetListsDocument, options);
      }
export function useGetBrandCollectionAlphabetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBrandCollectionAlphabetListsQuery, GetBrandCollectionAlphabetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBrandCollectionAlphabetListsQuery, GetBrandCollectionAlphabetListsQueryVariables>(GetBrandCollectionAlphabetListsDocument, options);
        }
export type GetBrandCollectionAlphabetListsQueryHookResult = ReturnType<typeof useGetBrandCollectionAlphabetListsQuery>;
export type GetBrandCollectionAlphabetListsLazyQueryHookResult = ReturnType<typeof useGetBrandCollectionAlphabetListsLazyQuery>;
export type GetBrandCollectionAlphabetListsQueryResult = Apollo.QueryResult<GetBrandCollectionAlphabetListsQuery, GetBrandCollectionAlphabetListsQueryVariables>;
export const GetManufacturerAlphabetListsDocument = gql`
    query GetManufacturerAlphabetLists($input: ManufacturerAlphabetInput) {
  getManufacturerAlphabetLists(input: $input) {
    letter
    docs {
      _id
      slug
      name
    }
  }
}
    `;

/**
 * __useGetManufacturerAlphabetListsQuery__
 *
 * To run a query within a React component, call `useGetManufacturerAlphabetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetManufacturerAlphabetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetManufacturerAlphabetListsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetManufacturerAlphabetListsQuery(baseOptions?: Apollo.QueryHookOptions<GetManufacturerAlphabetListsQuery, GetManufacturerAlphabetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetManufacturerAlphabetListsQuery, GetManufacturerAlphabetListsQueryVariables>(GetManufacturerAlphabetListsDocument, options);
      }
export function useGetManufacturerAlphabetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetManufacturerAlphabetListsQuery, GetManufacturerAlphabetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetManufacturerAlphabetListsQuery, GetManufacturerAlphabetListsQueryVariables>(GetManufacturerAlphabetListsDocument, options);
        }
export type GetManufacturerAlphabetListsQueryHookResult = ReturnType<typeof useGetManufacturerAlphabetListsQuery>;
export type GetManufacturerAlphabetListsLazyQueryHookResult = ReturnType<typeof useGetManufacturerAlphabetListsLazyQuery>;
export type GetManufacturerAlphabetListsQueryResult = Apollo.QueryResult<GetManufacturerAlphabetListsQuery, GetManufacturerAlphabetListsQueryVariables>;
export const GetSupplierAlphabetListsDocument = gql`
    query GetSupplierAlphabetLists($input: SupplierAlphabetInput) {
  getSupplierAlphabetLists(input: $input) {
    letter
    docs {
      _id
      slug
      name
    }
  }
}
    `;

/**
 * __useGetSupplierAlphabetListsQuery__
 *
 * To run a query within a React component, call `useGetSupplierAlphabetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSupplierAlphabetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSupplierAlphabetListsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSupplierAlphabetListsQuery(baseOptions?: Apollo.QueryHookOptions<GetSupplierAlphabetListsQuery, GetSupplierAlphabetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSupplierAlphabetListsQuery, GetSupplierAlphabetListsQueryVariables>(GetSupplierAlphabetListsDocument, options);
      }
export function useGetSupplierAlphabetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSupplierAlphabetListsQuery, GetSupplierAlphabetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSupplierAlphabetListsQuery, GetSupplierAlphabetListsQueryVariables>(GetSupplierAlphabetListsDocument, options);
        }
export type GetSupplierAlphabetListsQueryHookResult = ReturnType<typeof useGetSupplierAlphabetListsQuery>;
export type GetSupplierAlphabetListsLazyQueryHookResult = ReturnType<typeof useGetSupplierAlphabetListsLazyQuery>;
export type GetSupplierAlphabetListsQueryResult = Apollo.QueryResult<GetSupplierAlphabetListsQuery, GetSupplierAlphabetListsQueryVariables>;
export const GetOptionAlphabetListsDocument = gql`
    query GetOptionAlphabetLists($input: OptionAlphabetInput!) {
  getOptionAlphabetLists(input: $input) {
    letter
    docs {
      _id
      name
      slug
      options {
        _id
        name
        slug
        options {
          _id
          name
          slug
          options {
            _id
            name
            slug
            options {
              _id
              name
              slug
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetOptionAlphabetListsQuery__
 *
 * To run a query within a React component, call `useGetOptionAlphabetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOptionAlphabetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOptionAlphabetListsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetOptionAlphabetListsQuery(baseOptions: Apollo.QueryHookOptions<GetOptionAlphabetListsQuery, GetOptionAlphabetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOptionAlphabetListsQuery, GetOptionAlphabetListsQueryVariables>(GetOptionAlphabetListsDocument, options);
      }
export function useGetOptionAlphabetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOptionAlphabetListsQuery, GetOptionAlphabetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOptionAlphabetListsQuery, GetOptionAlphabetListsQueryVariables>(GetOptionAlphabetListsDocument, options);
        }
export type GetOptionAlphabetListsQueryHookResult = ReturnType<typeof useGetOptionAlphabetListsQuery>;
export type GetOptionAlphabetListsLazyQueryHookResult = ReturnType<typeof useGetOptionAlphabetListsLazyQuery>;
export type GetOptionAlphabetListsQueryResult = Apollo.QueryResult<GetOptionAlphabetListsQuery, GetOptionAlphabetListsQueryVariables>;
export const GetSessionCitiesDocument = gql`
    query GetSessionCities {
  getSessionCities {
    _id
    slug
    name
  }
}
    `;

/**
 * __useGetSessionCitiesQuery__
 *
 * To run a query within a React component, call `useGetSessionCitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionCitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionCitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSessionCitiesQuery(baseOptions?: Apollo.QueryHookOptions<GetSessionCitiesQuery, GetSessionCitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSessionCitiesQuery, GetSessionCitiesQueryVariables>(GetSessionCitiesDocument, options);
      }
export function useGetSessionCitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSessionCitiesQuery, GetSessionCitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSessionCitiesQuery, GetSessionCitiesQueryVariables>(GetSessionCitiesDocument, options);
        }
export type GetSessionCitiesQueryHookResult = ReturnType<typeof useGetSessionCitiesQuery>;
export type GetSessionCitiesLazyQueryHookResult = ReturnType<typeof useGetSessionCitiesLazyQuery>;
export type GetSessionCitiesQueryResult = Apollo.QueryResult<GetSessionCitiesQuery, GetSessionCitiesQueryVariables>;
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
export const UserCompanyDocument = gql`
    query UserCompany {
  getUserCompany {
    ...UserCompany
  }
}
    ${UserCompanyFragmentDoc}`;

/**
 * __useUserCompanyQuery__
 *
 * To run a query within a React component, call `useUserCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserCompanyQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserCompanyQuery(baseOptions?: Apollo.QueryHookOptions<UserCompanyQuery, UserCompanyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserCompanyQuery, UserCompanyQueryVariables>(UserCompanyDocument, options);
      }
export function useUserCompanyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserCompanyQuery, UserCompanyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserCompanyQuery, UserCompanyQueryVariables>(UserCompanyDocument, options);
        }
export type UserCompanyQueryHookResult = ReturnType<typeof useUserCompanyQuery>;
export type UserCompanyLazyQueryHookResult = ReturnType<typeof useUserCompanyLazyQuery>;
export type UserCompanyQueryResult = Apollo.QueryResult<UserCompanyQuery, UserCompanyQueryVariables>;