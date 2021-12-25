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
  showAsBreadcrumb?: Maybe<Scalars['Boolean']>;
  showAsCatalogueBreadcrumb?: Maybe<Scalars['Boolean']>;
  showInCardTitle?: Maybe<Scalars['Boolean']>;
  showInSnippetTitle?: Maybe<Scalars['Boolean']>;
  showInCatalogueTitle?: Maybe<Scalars['Boolean']>;
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

export type AddShopProductSupplierInput = {
  shopProductId: Scalars['ObjectId'];
  supplierId: Scalars['ObjectId'];
  price: Scalars['Int'];
  percent: Scalars['Int'];
  variant: SupplierPriceVariant;
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
  readableAddress: Scalars['String'];
  point: PointGeoJson;
  addressComponents: Array<AddressComponent>;
  formattedCoordinates: Coordinates;
};

export type AddressComponent = {
  __typename?: 'AddressComponent';
  types: Array<Scalars['String']>;
  longName: Scalars['String'];
  shortName: Scalars['String'];
};

export type AddressComponentInput = {
  types: Array<Scalars['String']>;
  longName: Scalars['String'];
  shortName: Scalars['String'];
};

export type AddressInput = {
  addressComponents: Array<AddressComponentInput>;
  formattedAddress: Scalars['String'];
  point: CoordinatesInput;
};

export type AlphabetList = {
  letter: Scalars['String'];
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
  cartDeliveryProducts: Array<CartProduct>;
  cartBookingProducts: Array<CartProduct>;
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

export type CategoriesAlphabetList = AlphabetList & {
  __typename?: 'CategoriesAlphabetList';
  letter: Scalars['String'];
  docs: Array<Category>;
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ObjectId'];
  slug: Scalars['String'];
  nameI18n: Scalars['JSONObject'];
  image?: Maybe<Scalars['String']>;
  rubricId: Scalars['ObjectId'];
  parentId?: Maybe<Scalars['ObjectId']>;
  replaceParentNameInCatalogueTitle?: Maybe<Scalars['Boolean']>;
  views: Scalars['JSONObject'];
  priorities: Scalars['JSONObject'];
  name: Scalars['String'];
  categories: Array<Category>;
};

export type CategoryAlphabetInput = {
  slugs?: Maybe<Array<Scalars['String']>>;
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
  logo: Scalars['String'];
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
  Color = 'color',
  Address = 'address',
  Password = 'password',
  CategoriesTree = 'categoriesTree',
  Rubrics = 'rubrics'
}

export type Contacts = {
  __typename?: 'Contacts';
  emails: Array<Scalars['EmailAddress']>;
  phones: Array<Scalars['String']>;
  formattedPhones: Array<FormattedPhone>;
};

export type ContactsInput = {
  emails: Array<Scalars['EmailAddress']>;
  phones: Array<Scalars['String']>;
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

export type Country = {
  __typename?: 'Country';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  currency: Scalars['String'];
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
  showAsBreadcrumb?: Maybe<Scalars['Boolean']>;
  showAsCatalogueBreadcrumb?: Maybe<Scalars['Boolean']>;
  showInCardTitle?: Maybe<Scalars['Boolean']>;
  showInSnippetTitle?: Maybe<Scalars['Boolean']>;
  showInCatalogueTitle?: Maybe<Scalars['Boolean']>;
};

export type CreateCategoryInput = {
  nameI18n: Scalars['JSONObject'];
  parentId?: Maybe<Scalars['ObjectId']>;
  rubricId: Scalars['ObjectId'];
  variants: Scalars['JSONObject'];
  replaceParentNameInCatalogueTitle?: Maybe<Scalars['Boolean']>;
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
  isNew: Scalars['Boolean'];
  isConfirmed: Scalars['Boolean'];
  isPayed: Scalars['Boolean'];
  isDone: Scalars['Boolean'];
  isCancelationRequest: Scalars['Boolean'];
  isCanceled: Scalars['Boolean'];
};

export type CreateProductConnectionInput = {
  productId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
};

export type CreateRoleInput = {
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  isStaff: Scalars['Boolean'];
  isCompanyStaff: Scalars['Boolean'];
  showAdminUiInCatalogue: Scalars['Boolean'];
};

export type CreateRubricInput = {
  nameI18n: Scalars['JSONObject'];
  capitalise?: Maybe<Scalars['Boolean']>;
  showRubricNameInProductTitle?: Maybe<Scalars['Boolean']>;
  showCategoryInProductTitle?: Maybe<Scalars['Boolean']>;
  showBrandInNav?: Maybe<Scalars['Boolean']>;
  showBrandInFilter?: Maybe<Scalars['Boolean']>;
  showBrandAsAlphabet?: Maybe<Scalars['Boolean']>;
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  variantId: Scalars['ObjectId'];
  defaultTitleI18n: Scalars['JSONObject'];
  prefixI18n?: Maybe<Scalars['JSONObject']>;
  keywordI18n: Scalars['JSONObject'];
  gender: Gender;
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
  Plural = 'plural',
  Singular = 'singular'
}


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

export type Manufacturer = Base & Timestamp & {
  __typename?: 'Manufacturer';
  _id: Scalars['ObjectId'];
  itemId: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  url?: Maybe<Array<Scalars['URL']>>;
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

export type MoveOptionInput = {
  optionsGroupId: Scalars['ObjectId'];
  optionId: Scalars['ObjectId'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Should create attributes group */
  createAttributesGroup: AttributesGroupPayload;
  /** Should update attributes group */
  updateAttributesGroup: AttributesGroupPayload;
  /** Should delete attributes group */
  deleteAttributesGroup: AttributesGroupPayload;
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
  /** Should update nav categories config */
  updateVisibleCategoriesInNavDropdown: ConfigPayload;
  /** Should update rubric nav item config */
  updateRubricNavItemConfig: ConfigPayload;
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
  /** Should move option to another options group */
  moveOption: OptionsGroupPayload;
  /** Should delete option from the group */
  deleteOptionFromGroup: OptionsGroupPayload;
  /** Should create order status */
  createOrderStatus: OrderStatusPayload;
  /** Should update order status */
  updateOrderStatus: OrderStatusPayload;
  /** Should delete order status */
  deleteOrderStatus: OrderStatusPayload;
  /** Should update product brand */
  updateProductBrand: ProductPayload;
  /** Should update product brand collection */
  updateProductBrandCollection: ProductPayload;
  /** Should update product manufacturer */
  updateProductManufacturer: ProductPayload;
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
  /** Should delete attributes group from rubric */
  deleteAttributesGroupFromRubric: RubricPayload;
  /** Should update rubric attribute */
  updateAttributeInRubric: RubricPayload;
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
  /** Should add many products to the shop */
  addManyProductsToShop: ShopPayload;
  /** Should delete product from shop */
  deleteProductFromShop: ShopPayload;
  /** Should generate shop token */
  generateShopToken: ShopPayload;
  /** Should add shop products supplier */
  addShopProductSupplier: ShopProductPayload;
  /** Should update shop products supplier */
  updateShopProductSupplier: ShopProductPayload;
  /** Should delete shop products supplier */
  deleteShopProductSupplier: ShopProductPayload;
  /** Should create supplier */
  createSupplier: SupplierPayload;
  /** Should update supplier */
  updateSupplier: SupplierPayload;
  /** Should delete supplier */
  deleteSupplier: SupplierPayload;
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


export type MutationUpdateVisibleCategoriesInNavDropdownArgs = {
  input: UpdateVisibleCategoriesInNavDropdownInput;
};


export type MutationUpdateRubricNavItemConfigArgs = {
  input: UpdateRubricNavItemConfigInput;
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


export type MutationMoveOptionArgs = {
  input: MoveOptionInput;
};


export type MutationDeleteOptionFromGroupArgs = {
  input: DeleteOptionFromGroupInput;
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


export type MutationUpdateProductBrandArgs = {
  input: UpdateProductBrandInput;
};


export type MutationUpdateProductBrandCollectionArgs = {
  input: UpdateProductBrandCollectionInput;
};


export type MutationUpdateProductManufacturerArgs = {
  input: UpdateProductManufacturerInput;
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


export type MutationDeleteAttributesGroupFromRubricArgs = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type MutationUpdateAttributeInRubricArgs = {
  input: UpdateAttributeInRubricInput;
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


export type MutationAddManyProductsToShopArgs = {
  input: Array<AddProductToShopInput>;
};


export type MutationDeleteProductFromShopArgs = {
  input: DeleteProductFromShopInput;
};


export type MutationGenerateShopTokenArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddShopProductSupplierArgs = {
  input: AddShopProductSupplierInput;
};


export type MutationUpdateShopProductSupplierArgs = {
  input: UpdateShopProductSupplierInput;
};


export type MutationDeleteShopProductSupplierArgs = {
  _id: Scalars['ObjectId'];
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
  phone: Scalars['String'];
  user?: Maybe<User>;
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  formattedPhone: FormattedPhone;
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

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  _id: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  textI18n?: Maybe<Scalars['JSONObject']>;
  number?: Maybe<Scalars['Float']>;
  text: Scalars['String'];
  attribute: Attribute;
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
};

export type ProductPayload = Payload & {
  __typename?: 'ProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
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
  /** Should return categories grouped by alphabet */
  getCategoriesAlphabetLists: Array<CategoriesAlphabetList>;
  /** Should return city by given id */
  getCity: City;
  /** Should return city by given slug */
  getCityBySlug: City;
  /** Should return paginated cities */
  getAllCities: CitiesPaginationPayload;
  /** Should return cities list */
  getSessionCities: Array<City>;
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
  /** Should return role by give id */
  getRole?: Maybe<Role>;
  /** Should return all roles list */
  getAllRoles: Array<Role>;
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


export type QueryGetCategoriesAlphabetListsArgs = {
  input?: Maybe<CategoryAlphabetInput>;
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


export type QueryGetAllOptionsGroupsArgs = {
  excludedIds?: Maybe<Array<Scalars['ObjectId']>>;
};


export type QueryGetRoleArgs = {
  _id: Scalars['ObjectId'];
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
  textTopI18n?: Maybe<Scalars['JSONObject']>;
  textBottomI18n?: Maybe<Scalars['JSONObject']>;
  slug: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  variantId: Scalars['ObjectId'];
  views: Scalars['JSONObject'];
  capitalise?: Maybe<Scalars['Boolean']>;
  priorities: Scalars['JSONObject'];
  defaultTitleI18n: Scalars['JSONObject'];
  prefixI18n?: Maybe<Scalars['JSONObject']>;
  keywordI18n: Scalars['JSONObject'];
  gender: Gender;
  name: Scalars['String'];
  description: Scalars['String'];
  shortDescription: Scalars['String'];
  variant: RubricVariant;
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
  catalogueHeadLayout?: Maybe<Scalars['String']>;
  catalogueNavLayout?: Maybe<Scalars['String']>;
  showSnippetConnections?: Maybe<Scalars['Boolean']>;
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
  allowDelivery?: Maybe<Scalars['Boolean']>;
  gridCatalogueColumns?: Maybe<Scalars['Int']>;
  navCategoryColumns?: Maybe<Scalars['Int']>;
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
  logo: Scalars['String'];
  assets: Array<Scalars['String']>;
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
  barcode?: Maybe<Array<Scalars['String']>>;
  oldPrices: Array<ShopProductOldPrice>;
  oldPrice?: Maybe<Scalars['Int']>;
  discountedPercent?: Maybe<Scalars['Int']>;
  shop: Shop;
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

/** SupplierPriceVariant variant enum. */
export enum SupplierPriceVariant {
  Discount = 'discount',
  Charge = 'charge'
}

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
  showAsBreadcrumb?: Maybe<Scalars['Boolean']>;
  showAsCatalogueBreadcrumb?: Maybe<Scalars['Boolean']>;
  showInCardTitle?: Maybe<Scalars['Boolean']>;
  showInSnippetTitle?: Maybe<Scalars['Boolean']>;
  showInCatalogueTitle?: Maybe<Scalars['Boolean']>;
};

export type UpdateCategoryInput = {
  companySlug: Scalars['String'];
  categoryId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  textTop?: Maybe<Scalars['JSONObject']>;
  textBottom?: Maybe<Scalars['JSONObject']>;
  rubricId: Scalars['ObjectId'];
  variants: Scalars['JSONObject'];
  replaceParentNameInCatalogueTitle?: Maybe<Scalars['Boolean']>;
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
  showAsBreadcrumb?: Maybe<Scalars['Boolean']>;
  showAsCatalogueBreadcrumb?: Maybe<Scalars['Boolean']>;
  showInCardTitle?: Maybe<Scalars['Boolean']>;
  showInSnippetTitle?: Maybe<Scalars['Boolean']>;
  showInCatalogueTitle?: Maybe<Scalars['Boolean']>;
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
  isNew: Scalars['Boolean'];
  isConfirmed: Scalars['Boolean'];
  isPayed: Scalars['Boolean'];
  isDone: Scalars['Boolean'];
  isCancelationRequest: Scalars['Boolean'];
  isCanceled: Scalars['Boolean'];
};

export type UpdateProductBrandCollectionInput = {
  productId: Scalars['ObjectId'];
  brandCollectionSlug?: Maybe<Scalars['String']>;
};

export type UpdateProductBrandInput = {
  productId: Scalars['ObjectId'];
  brandSlug?: Maybe<Scalars['String']>;
};

export type UpdateProductInCartInput = {
  cartProductId: Scalars['ObjectId'];
  amount: Scalars['Int'];
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

export type UpdateProductTextAttributeInput = {
  productId: Scalars['ObjectId'];
  attributes: Array<UpdateProductTextAttributeItemInput>;
};

export type UpdateProductTextAttributeItemInput = {
  productAttributeId: Scalars['ObjectId'];
  attributeId: Scalars['ObjectId'];
  textI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateRoleInput = {
  roleId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
  isStaff: Scalars['Boolean'];
  isCompanyStaff: Scalars['Boolean'];
  showAdminUiInCatalogue: Scalars['Boolean'];
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
  companySlug: Scalars['String'];
  rubricId: Scalars['ObjectId'];
  capitalise?: Maybe<Scalars['Boolean']>;
  showRubricNameInProductTitle?: Maybe<Scalars['Boolean']>;
  showCategoryInProductTitle?: Maybe<Scalars['Boolean']>;
  showBrandInNav?: Maybe<Scalars['Boolean']>;
  showBrandInFilter?: Maybe<Scalars['Boolean']>;
  showBrandAsAlphabet?: Maybe<Scalars['Boolean']>;
  nameI18n: Scalars['JSONObject'];
  descriptionI18n: Scalars['JSONObject'];
  shortDescriptionI18n: Scalars['JSONObject'];
  textTop?: Maybe<Scalars['JSONObject']>;
  textBottom?: Maybe<Scalars['JSONObject']>;
  variantId: Scalars['ObjectId'];
  active: Scalars['Boolean'];
  defaultTitleI18n: Scalars['JSONObject'];
  prefixI18n?: Maybe<Scalars['JSONObject']>;
  keywordI18n: Scalars['JSONObject'];
  gender: Gender;
};

export type UpdateRubricNavItemConfigInput = {
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
  rubricId: Scalars['ObjectId'];
  citySlug: Scalars['String'];
};

export type UpdateRubricVariantInput = {
  rubricVariantId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  cardLayout?: Maybe<Scalars['String']>;
  gridSnippetLayout?: Maybe<Scalars['String']>;
  rowSnippetLayout?: Maybe<Scalars['String']>;
  catalogueFilterLayout?: Maybe<Scalars['String']>;
  catalogueHeadLayout?: Maybe<Scalars['String']>;
  catalogueNavLayout?: Maybe<Scalars['String']>;
  showSnippetConnections?: Maybe<Scalars['Boolean']>;
  showSnippetBackground?: Maybe<Scalars['Boolean']>;
  showSnippetArticle?: Maybe<Scalars['Boolean']>;
  showCardArticle?: Maybe<Scalars['Boolean']>;
  showSnippetRating?: Maybe<Scalars['Boolean']>;
  showSnippetButtonsOnHover?: Maybe<Scalars['Boolean']>;
  showCardButtonsBackground?: Maybe<Scalars['Boolean']>;
  showCardImagesSlider?: Maybe<Scalars['Boolean']>;
  showCardBrands?: Maybe<Scalars['Boolean']>;
  showCatalogueFilterBrands?: Maybe<Scalars['Boolean']>;
  showCategoriesInFilter?: Maybe<Scalars['Boolean']>;
  showCategoriesInNav?: Maybe<Scalars['Boolean']>;
  allowDelivery?: Maybe<Scalars['Boolean']>;
  gridCatalogueColumns?: Maybe<Scalars['Int']>;
  navCategoryColumns?: Maybe<Scalars['Int']>;
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
  priceWarningI18n?: Maybe<Scalars['JSONObject']>;
  contacts: ContactsInput;
  address: AddressInput;
};

export type UpdateShopProductSupplierInput = {
  supplierProductId: Scalars['ObjectId'];
  price: Scalars['Int'];
  percent: Scalars['Int'];
  variant: SupplierPriceVariant;
};

export type UpdateSupplierInput = {
  supplierId: Scalars['ObjectId'];
  nameI18n: Scalars['JSONObject'];
  url?: Maybe<Array<Scalars['URL']>>;
  descriptionI18n?: Maybe<Scalars['JSONObject']>;
};

export type UpdateVisibleCategoriesInNavDropdownInput = {
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
  categoryId: Scalars['ObjectId'];
  rubricId: Scalars['ObjectId'];
  citySlug: Scalars['String'];
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
  phone: Scalars['String'];
  roleId: Scalars['ObjectId'];
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  formattedPhone: FormattedPhone;
  role: Role;
};

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

export type UpdateVisibleCategoriesInNavDropdownMutationVariables = Exact<{
  input: UpdateVisibleCategoriesInNavDropdownInput;
}>;


export type UpdateVisibleCategoriesInNavDropdownMutation = (
  { __typename?: 'Mutation' }
  & { updateVisibleCategoriesInNavDropdown: (
    { __typename?: 'ConfigPayload' }
    & Pick<ConfigPayload, 'success' | 'message'>
  ) }
);

export type UpdateRubricNavItemConfigMutationVariables = Exact<{
  input: UpdateRubricNavItemConfigInput;
}>;


export type UpdateRubricNavItemConfigMutation = (
  { __typename?: 'Mutation' }
  & { updateRubricNavItemConfig: (
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

export type MoveOptionMutationVariables = Exact<{
  input: MoveOptionInput;
}>;


export type MoveOptionMutation = (
  { __typename?: 'Mutation' }
  & { moveOption: (
    { __typename?: 'OptionsGroupPayload' }
    & Pick<OptionsGroupPayload, 'success' | 'message'>
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

export type UpdateAttributeInRubricMutationVariables = Exact<{
  input: UpdateAttributeInRubricInput;
}>;


export type UpdateAttributeInRubricMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributeInRubric: (
    { __typename?: 'RubricPayload' }
    & Pick<RubricPayload, 'success' | 'message'>
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

export type AddShopProductSupplierMutationVariables = Exact<{
  input: AddShopProductSupplierInput;
}>;


export type AddShopProductSupplierMutation = (
  { __typename?: 'Mutation' }
  & { addShopProductSupplier: (
    { __typename?: 'ShopProductPayload' }
    & Pick<ShopProductPayload, 'success' | 'message'>
  ) }
);

export type UpdateShopProductSupplierMutationVariables = Exact<{
  input: UpdateShopProductSupplierInput;
}>;


export type UpdateShopProductSupplierMutation = (
  { __typename?: 'Mutation' }
  & { updateShopProductSupplier: (
    { __typename?: 'ShopProductPayload' }
    & Pick<ShopProductPayload, 'success' | 'message'>
  ) }
);

export type DeleteShopProductSupplierMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteShopProductSupplierMutation = (
  { __typename?: 'Mutation' }
  & { deleteShopProductSupplier: (
    { __typename?: 'ShopProductPayload' }
    & Pick<ShopProductPayload, 'success' | 'message'>
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
      & Pick<Brand, '_id' | 'itemId' | 'name'>
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
      & Pick<BrandCollection, '_id' | 'itemId' | 'name'>
    )> }
  )> }
);

export type GetCategoriesAlphabetListsQueryVariables = Exact<{
  input?: Maybe<CategoryAlphabetInput>;
}>;


export type GetCategoriesAlphabetListsQuery = (
  { __typename?: 'Query' }
  & { getCategoriesAlphabetLists: Array<(
    { __typename?: 'CategoriesAlphabetList' }
    & Pick<CategoriesAlphabetList, 'letter'>
    & { docs: Array<(
      { __typename?: 'Category' }
      & Pick<Category, '_id' | 'slug' | 'name'>
      & { categories: Array<(
        { __typename?: 'Category' }
        & Pick<Category, '_id' | 'slug' | 'name'>
        & { categories: Array<(
          { __typename?: 'Category' }
          & Pick<Category, '_id' | 'slug' | 'name'>
          & { categories: Array<(
            { __typename?: 'Category' }
            & Pick<Category, '_id' | 'slug' | 'name'>
            & { categories: Array<(
              { __typename?: 'Category' }
              & Pick<Category, '_id' | 'slug' | 'name'>
              & { categories: Array<(
                { __typename?: 'Category' }
                & Pick<Category, '_id' | 'slug' | 'name'>
              )> }
            )> }
          )> }
        )> }
      )> }
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
      & Pick<Manufacturer, '_id' | 'itemId' | 'name'>
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
      & Pick<Supplier, '_id' | 'itemId' | 'name'>
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

export type GetAllOptionsGroupsQueryVariables = Exact<{
  excludedIds?: Maybe<Array<Scalars['ObjectId']> | Scalars['ObjectId']>;
}>;


export type GetAllOptionsGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllOptionsGroups: Array<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, '_id' | 'name'>
  )> }
);

export const CartPayloadFragmentDoc = gql`
    fragment CartPayload on CartPayload {
  success
  message
}
    `;
export const SelectOptionFragmentDoc = gql`
    fragment SelectOption on SelectOption {
  _id
  name
  icon
}
    `;
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
export const UpdateVisibleCategoriesInNavDropdownDocument = gql`
    mutation UpdateVisibleCategoriesInNavDropdown($input: UpdateVisibleCategoriesInNavDropdownInput!) {
  updateVisibleCategoriesInNavDropdown(input: $input) {
    success
    message
  }
}
    `;
export type UpdateVisibleCategoriesInNavDropdownMutationFn = Apollo.MutationFunction<UpdateVisibleCategoriesInNavDropdownMutation, UpdateVisibleCategoriesInNavDropdownMutationVariables>;

/**
 * __useUpdateVisibleCategoriesInNavDropdownMutation__
 *
 * To run a mutation, you first call `useUpdateVisibleCategoriesInNavDropdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVisibleCategoriesInNavDropdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVisibleCategoriesInNavDropdownMutation, { data, loading, error }] = useUpdateVisibleCategoriesInNavDropdownMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateVisibleCategoriesInNavDropdownMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVisibleCategoriesInNavDropdownMutation, UpdateVisibleCategoriesInNavDropdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVisibleCategoriesInNavDropdownMutation, UpdateVisibleCategoriesInNavDropdownMutationVariables>(UpdateVisibleCategoriesInNavDropdownDocument, options);
      }
export type UpdateVisibleCategoriesInNavDropdownMutationHookResult = ReturnType<typeof useUpdateVisibleCategoriesInNavDropdownMutation>;
export type UpdateVisibleCategoriesInNavDropdownMutationResult = Apollo.MutationResult<UpdateVisibleCategoriesInNavDropdownMutation>;
export type UpdateVisibleCategoriesInNavDropdownMutationOptions = Apollo.BaseMutationOptions<UpdateVisibleCategoriesInNavDropdownMutation, UpdateVisibleCategoriesInNavDropdownMutationVariables>;
export const UpdateRubricNavItemConfigDocument = gql`
    mutation UpdateRubricNavItemConfig($input: UpdateRubricNavItemConfigInput!) {
  updateRubricNavItemConfig(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRubricNavItemConfigMutationFn = Apollo.MutationFunction<UpdateRubricNavItemConfigMutation, UpdateRubricNavItemConfigMutationVariables>;

/**
 * __useUpdateRubricNavItemConfigMutation__
 *
 * To run a mutation, you first call `useUpdateRubricNavItemConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRubricNavItemConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRubricNavItemConfigMutation, { data, loading, error }] = useUpdateRubricNavItemConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRubricNavItemConfigMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRubricNavItemConfigMutation, UpdateRubricNavItemConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRubricNavItemConfigMutation, UpdateRubricNavItemConfigMutationVariables>(UpdateRubricNavItemConfigDocument, options);
      }
export type UpdateRubricNavItemConfigMutationHookResult = ReturnType<typeof useUpdateRubricNavItemConfigMutation>;
export type UpdateRubricNavItemConfigMutationResult = Apollo.MutationResult<UpdateRubricNavItemConfigMutation>;
export type UpdateRubricNavItemConfigMutationOptions = Apollo.BaseMutationOptions<UpdateRubricNavItemConfigMutation, UpdateRubricNavItemConfigMutationVariables>;
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
export const MoveOptionDocument = gql`
    mutation MoveOption($input: MoveOptionInput!) {
  moveOption(input: $input) {
    success
    message
  }
}
    `;
export type MoveOptionMutationFn = Apollo.MutationFunction<MoveOptionMutation, MoveOptionMutationVariables>;

/**
 * __useMoveOptionMutation__
 *
 * To run a mutation, you first call `useMoveOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveOptionMutation, { data, loading, error }] = useMoveOptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMoveOptionMutation(baseOptions?: Apollo.MutationHookOptions<MoveOptionMutation, MoveOptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveOptionMutation, MoveOptionMutationVariables>(MoveOptionDocument, options);
      }
export type MoveOptionMutationHookResult = ReturnType<typeof useMoveOptionMutation>;
export type MoveOptionMutationResult = Apollo.MutationResult<MoveOptionMutation>;
export type MoveOptionMutationOptions = Apollo.BaseMutationOptions<MoveOptionMutation, MoveOptionMutationVariables>;
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
export const UpdateAttributeInRubricDocument = gql`
    mutation UpdateAttributeInRubric($input: UpdateAttributeInRubricInput!) {
  updateAttributeInRubric(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributeInRubricMutationFn = Apollo.MutationFunction<UpdateAttributeInRubricMutation, UpdateAttributeInRubricMutationVariables>;

/**
 * __useUpdateAttributeInRubricMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeInRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeInRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeInRubricMutation, { data, loading, error }] = useUpdateAttributeInRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAttributeInRubricMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeInRubricMutation, UpdateAttributeInRubricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeInRubricMutation, UpdateAttributeInRubricMutationVariables>(UpdateAttributeInRubricDocument, options);
      }
export type UpdateAttributeInRubricMutationHookResult = ReturnType<typeof useUpdateAttributeInRubricMutation>;
export type UpdateAttributeInRubricMutationResult = Apollo.MutationResult<UpdateAttributeInRubricMutation>;
export type UpdateAttributeInRubricMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeInRubricMutation, UpdateAttributeInRubricMutationVariables>;
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
export const AddShopProductSupplierDocument = gql`
    mutation AddShopProductSupplier($input: AddShopProductSupplierInput!) {
  addShopProductSupplier(input: $input) {
    success
    message
  }
}
    `;
export type AddShopProductSupplierMutationFn = Apollo.MutationFunction<AddShopProductSupplierMutation, AddShopProductSupplierMutationVariables>;

/**
 * __useAddShopProductSupplierMutation__
 *
 * To run a mutation, you first call `useAddShopProductSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddShopProductSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addShopProductSupplierMutation, { data, loading, error }] = useAddShopProductSupplierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddShopProductSupplierMutation(baseOptions?: Apollo.MutationHookOptions<AddShopProductSupplierMutation, AddShopProductSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddShopProductSupplierMutation, AddShopProductSupplierMutationVariables>(AddShopProductSupplierDocument, options);
      }
export type AddShopProductSupplierMutationHookResult = ReturnType<typeof useAddShopProductSupplierMutation>;
export type AddShopProductSupplierMutationResult = Apollo.MutationResult<AddShopProductSupplierMutation>;
export type AddShopProductSupplierMutationOptions = Apollo.BaseMutationOptions<AddShopProductSupplierMutation, AddShopProductSupplierMutationVariables>;
export const UpdateShopProductSupplierDocument = gql`
    mutation UpdateShopProductSupplier($input: UpdateShopProductSupplierInput!) {
  updateShopProductSupplier(input: $input) {
    success
    message
  }
}
    `;
export type UpdateShopProductSupplierMutationFn = Apollo.MutationFunction<UpdateShopProductSupplierMutation, UpdateShopProductSupplierMutationVariables>;

/**
 * __useUpdateShopProductSupplierMutation__
 *
 * To run a mutation, you first call `useUpdateShopProductSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShopProductSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShopProductSupplierMutation, { data, loading, error }] = useUpdateShopProductSupplierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShopProductSupplierMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShopProductSupplierMutation, UpdateShopProductSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShopProductSupplierMutation, UpdateShopProductSupplierMutationVariables>(UpdateShopProductSupplierDocument, options);
      }
export type UpdateShopProductSupplierMutationHookResult = ReturnType<typeof useUpdateShopProductSupplierMutation>;
export type UpdateShopProductSupplierMutationResult = Apollo.MutationResult<UpdateShopProductSupplierMutation>;
export type UpdateShopProductSupplierMutationOptions = Apollo.BaseMutationOptions<UpdateShopProductSupplierMutation, UpdateShopProductSupplierMutationVariables>;
export const DeleteShopProductSupplierDocument = gql`
    mutation DeleteShopProductSupplier($_id: ObjectId!) {
  deleteShopProductSupplier(_id: $_id) {
    success
    message
  }
}
    `;
export type DeleteShopProductSupplierMutationFn = Apollo.MutationFunction<DeleteShopProductSupplierMutation, DeleteShopProductSupplierMutationVariables>;

/**
 * __useDeleteShopProductSupplierMutation__
 *
 * To run a mutation, you first call `useDeleteShopProductSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShopProductSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShopProductSupplierMutation, { data, loading, error }] = useDeleteShopProductSupplierMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteShopProductSupplierMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShopProductSupplierMutation, DeleteShopProductSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShopProductSupplierMutation, DeleteShopProductSupplierMutationVariables>(DeleteShopProductSupplierDocument, options);
      }
export type DeleteShopProductSupplierMutationHookResult = ReturnType<typeof useDeleteShopProductSupplierMutation>;
export type DeleteShopProductSupplierMutationResult = Apollo.MutationResult<DeleteShopProductSupplierMutation>;
export type DeleteShopProductSupplierMutationOptions = Apollo.BaseMutationOptions<DeleteShopProductSupplierMutation, DeleteShopProductSupplierMutationVariables>;
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
      itemId
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
      itemId
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
export const GetCategoriesAlphabetListsDocument = gql`
    query GetCategoriesAlphabetLists($input: CategoryAlphabetInput) {
  getCategoriesAlphabetLists(input: $input) {
    letter
    docs {
      _id
      slug
      name
      categories {
        _id
        slug
        name
        categories {
          _id
          slug
          name
          categories {
            _id
            slug
            name
            categories {
              _id
              slug
              name
              categories {
                _id
                slug
                name
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetCategoriesAlphabetListsQuery__
 *
 * To run a query within a React component, call `useGetCategoriesAlphabetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesAlphabetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesAlphabetListsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCategoriesAlphabetListsQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesAlphabetListsQuery, GetCategoriesAlphabetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesAlphabetListsQuery, GetCategoriesAlphabetListsQueryVariables>(GetCategoriesAlphabetListsDocument, options);
      }
export function useGetCategoriesAlphabetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesAlphabetListsQuery, GetCategoriesAlphabetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesAlphabetListsQuery, GetCategoriesAlphabetListsQueryVariables>(GetCategoriesAlphabetListsDocument, options);
        }
export type GetCategoriesAlphabetListsQueryHookResult = ReturnType<typeof useGetCategoriesAlphabetListsQuery>;
export type GetCategoriesAlphabetListsLazyQueryHookResult = ReturnType<typeof useGetCategoriesAlphabetListsLazyQuery>;
export type GetCategoriesAlphabetListsQueryResult = Apollo.QueryResult<GetCategoriesAlphabetListsQuery, GetCategoriesAlphabetListsQueryVariables>;
export const GetManufacturerAlphabetListsDocument = gql`
    query GetManufacturerAlphabetLists($input: ManufacturerAlphabetInput) {
  getManufacturerAlphabetLists(input: $input) {
    letter
    docs {
      _id
      itemId
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
      itemId
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
export const GetAllOptionsGroupsDocument = gql`
    query GetAllOptionsGroups($excludedIds: [ObjectId!]) {
  getAllOptionsGroups(excludedIds: $excludedIds) {
    _id
    name
  }
}
    `;

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
 *      excludedIds: // value for 'excludedIds'
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