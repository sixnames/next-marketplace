import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  getProduct: Product;
  getProductBySlug: Product;
  getProductCard: Product;
  getAllProducts: PaginatedProductsResponse;
  getProductsCounters: ProductsCounters;
  getFeaturesAst: Array<AttributesGroup>;
  me?: Maybe<User>;
  getUser?: Maybe<User>;
  getAllUsers: PaginatedUsersResponse;
  getAllCities: Array<City>;
  getCity: City;
  getCityBySlug: City;
  getSessionCurrency: Scalars['String'];
  getAllCountries: Array<Country>;
  getCountry: Country;
  getLanguage?: Maybe<Language>;
  getAllLanguages?: Maybe<Array<Language>>;
  getClientLanguage: Scalars['String'];
  getAllCurrencies: Array<Currency>;
  getCurrency: Currency;
  getAttribute?: Maybe<Attribute>;
  getAttributesGroup?: Maybe<AttributesGroup>;
  getAllAttributesGroups: Array<AttributesGroup>;
  getCatalogueData?: Maybe<CatalogueData>;
  getCatalogueSearchTopItems: CatalogueSearchResult;
  getCatalogueSearchResult: CatalogueSearchResult;
  getMessage: Message;
  getMessagesByKeys: Array<Message>;
  getValidationMessages: Array<Message>;
  getMetric?: Maybe<Metric>;
  getAllMetrics?: Maybe<Array<Metric>>;
  getOption?: Maybe<Option>;
  getOptionsGroup?: Maybe<OptionsGroup>;
  getAllOptionsGroups: Array<OptionsGroup>;
  getRubric: Rubric;
  getRubricBySlug: Rubric;
  getRubricsTree: Array<Rubric>;
  getGenderOptions: Array<GenderOption>;
  getAttributeVariants?: Maybe<Array<AttributeVariant>>;
  getAttributePositioningOptions: Array<AttributePositioningOption>;
  getISOLanguagesList: Array<IsoLanguage>;
  getRubricVariant?: Maybe<RubricVariant>;
  getAllRubricVariants?: Maybe<Array<RubricVariant>>;
  getAllConfigs: Array<Config>;
  getConfigBySlug: Config;
  getConfigValueBySlug: Array<Scalars['String']>;
  getRole: Role;
  getAllRoles: Array<Role>;
  getSessionRole: Role;
  getEntityFields: Array<Scalars['String']>;
  getAllAppNavItems: Array<NavItem>;
};


export type QueryGetProductArgs = {
  id: Scalars['ID'];
};


export type QueryGetProductBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetProductCardArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllProductsArgs = {
  input?: Maybe<ProductPaginateInput>;
};


export type QueryGetProductsCountersArgs = {
  input?: Maybe<ProductsCountersInput>;
};


export type QueryGetFeaturesAstArgs = {
  selectedRubrics: Array<Scalars['ID']>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllUsersArgs = {
  input: UserPaginateInput;
};


export type QueryGetCityArgs = {
  id: Scalars['ID'];
};


export type QueryGetCityBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetCountryArgs = {
  id: Scalars['ID'];
};


export type QueryGetLanguageArgs = {
  id: Scalars['ID'];
};


export type QueryGetCurrencyArgs = {
  id: Scalars['ID'];
};


export type QueryGetAttributeArgs = {
  id: Scalars['ID'];
};


export type QueryGetAttributesGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllAttributesGroupsArgs = {
  exclude?: Maybe<Array<Scalars['ID']>>;
};


export type QueryGetCatalogueDataArgs = {
  productsInput?: Maybe<ProductPaginateInput>;
  catalogueFilter: Array<Scalars['String']>;
};


export type QueryGetCatalogueSearchResultArgs = {
  search: Scalars['String'];
};


export type QueryGetMessageArgs = {
  key: Scalars['String'];
};


export type QueryGetMessagesByKeysArgs = {
  keys: Array<Scalars['String']>;
};


export type QueryGetMetricArgs = {
  id: Scalars['ID'];
};


export type QueryGetOptionArgs = {
  id: Scalars['ID'];
};


export type QueryGetOptionsGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGetRubricArgs = {
  id: Scalars['ID'];
};


export type QueryGetRubricBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetRubricsTreeArgs = {
  excluded?: Maybe<Array<Scalars['ID']>>;
};


export type QueryGetRubricVariantArgs = {
  id: Scalars['ID'];
};


export type QueryGetConfigBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetConfigValueBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetRoleArgs = {
  id: Scalars['ID'];
};


export type QueryGetEntityFieldsArgs = {
  entity: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  views: Array<CityCounter>;
  priorities: Array<CityCounter>;
  name: Array<LanguageType>;
  cardName: Array<LanguageType>;
  slug: Scalars['String'];
  description: Array<LanguageType>;
  rubrics: Array<Scalars['ID']>;
  attributesGroups: Array<ProductAttributesGroup>;
  assets: Array<AssetType>;
  price: Scalars['Int'];
  active: Scalars['Boolean'];
  nameString: Scalars['String'];
  cardNameString: Scalars['String'];
  descriptionString: Scalars['String'];
  mainImage: Scalars['String'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

export type CityCounter = {
  __typename?: 'CityCounter';
  key: Scalars['String'];
  counter: Scalars['Int'];
};

export type LanguageType = {
  __typename?: 'LanguageType';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type ProductAttributesGroup = {
  __typename?: 'ProductAttributesGroup';
  showInCard: Scalars['Boolean'];
  node: AttributesGroup;
  attributes: Array<ProductAttribute>;
};

export type AttributesGroup = {
  __typename?: 'AttributesGroup';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  attributes: Array<Attribute>;
};

export type Attribute = {
  __typename?: 'Attribute';
  id: Scalars['ID'];
  slug: Scalars['String'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  views: Array<AttributeCityCounter>;
  priorities: Array<AttributeCityCounter>;
  variant: AttributeVariantEnum;
  options?: Maybe<OptionsGroup>;
  positioningInTitle?: Maybe<Array<AttributePositioningInTitle>>;
  metric?: Maybe<Metric>;
};

export type AttributeCityCounter = {
  __typename?: 'AttributeCityCounter';
  key: Scalars['String'];
  counter: Scalars['Int'];
  rubricId: Scalars['String'];
};

/** Attribute variant enum */
export enum AttributeVariantEnum {
  Select = 'select',
  MultipleSelect = 'multipleSelect',
  String = 'string',
  Number = 'number'
}

export type OptionsGroup = {
  __typename?: 'OptionsGroup';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  options: Array<Option>;
};

export type Option = {
  __typename?: 'Option';
  id: Scalars['ID'];
  slug: Scalars['String'];
  name: Array<LanguageType>;
  variants?: Maybe<Array<OptionVariant>>;
  gender?: Maybe<GenderEnum>;
  views: Array<OptionCityCounter>;
  priorities: Array<OptionCityCounter>;
  nameString: Scalars['String'];
  filterNameString: Scalars['String'];
  color?: Maybe<Scalars['String']>;
};

export type OptionVariant = {
  __typename?: 'OptionVariant';
  key: GenderEnum;
  value: Array<LanguageType>;
};

/** List of gender enums */
export enum GenderEnum {
  She = 'she',
  He = 'he',
  It = 'it'
}

export type OptionCityCounter = {
  __typename?: 'OptionCityCounter';
  key: Scalars['String'];
  counter: Scalars['Int'];
  attributeId: Scalars['String'];
  rubricId: Scalars['String'];
};

export type AttributePositioningInTitle = {
  __typename?: 'AttributePositioningInTitle';
  key: Scalars['String'];
  value: AttributePositionInTitleEnum;
};

/** Instruction for positioning checked attribute values in catalogue title */
export enum AttributePositionInTitleEnum {
  Begin = 'begin',
  End = 'end',
  BeforeKeyword = 'beforeKeyword',
  AfterKeyword = 'afterKeyword',
  ReplaceKeyword = 'replaceKeyword'
}

export type Metric = {
  __typename?: 'Metric';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
};

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  showInCard: Scalars['Boolean'];
  node: Attribute;
  /** Attribute reference via attribute slug field */
  key: Scalars['String'];
  value: Array<Scalars['String']>;
};

export type AssetType = {
  __typename?: 'AssetType';
  url: Scalars['String'];
  index: Scalars['Int'];
};


export type PaginatedProductsResponse = {
  __typename?: 'PaginatedProductsResponse';
  docs: Array<Product>;
  totalDocs: Scalars['Int'];
  limit: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  totalPages: Scalars['Int'];
  nextPage?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  pagingCounter: Scalars['Int'];
  hasPrevPage: Scalars['Int'];
  hasNextPage: Scalars['Int'];
  activeProductsCount?: Maybe<Scalars['Int']>;
};

export type ProductPaginateInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<PaginateSortDirectionEnum>;
  search?: Maybe<Scalars['String']>;
  sortBy?: Maybe<ProductSortByEnum>;
  rubric?: Maybe<Scalars['ID']>;
  notInRubric?: Maybe<Scalars['ID']>;
  noRubrics?: Maybe<Scalars['Boolean']>;
  countActiveProducts?: Maybe<Scalars['Boolean']>;
};

/** Pagination sortDir enum */
export enum PaginateSortDirectionEnum {
  Asc = 'asc',
  Desc = 'desc'
}

/** Product pagination sortBy enum */
export enum ProductSortByEnum {
  Price = 'price',
  CreatedAt = 'createdAt',
  Priority = 'priority'
}

export type ProductsCounters = {
  __typename?: 'ProductsCounters';
  totalProductsCount: Scalars['Int'];
  activeProductsCount: Scalars['Int'];
};

export type ProductsCountersInput = {
  rubric?: Maybe<Scalars['ID']>;
  notInRubric?: Maybe<Scalars['ID']>;
  noRubrics?: Maybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phone: Scalars['String'];
  role: Role;
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['String'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  description: Scalars['String'];
  slug: Scalars['String'];
  isStuff: Scalars['Boolean'];
  rules: Array<RoleRule>;
  allowedAppNavigation: Array<Scalars['ID']>;
  appNavigation: Array<NavItem>;
};

export type RoleRule = {
  __typename?: 'RoleRule';
  id: Scalars['ID'];
  roleId: Scalars['ID'];
  nameString: Scalars['String'];
  entity: Scalars['String'];
  operations: Array<RoleRuleOperation>;
  restrictedFields: Array<Scalars['String']>;
};

export type RoleRuleOperation = {
  __typename?: 'RoleRuleOperation';
  id: Scalars['ID'];
  operationType: RoleRuleOperationTypeEnum;
  allow: Scalars['Boolean'];
  customFilter: Scalars['String'];
  order: Scalars['Int'];
};

/** Role rule operation type enum */
export enum RoleRuleOperationTypeEnum {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export type NavItem = {
  __typename?: 'NavItem';
  id: Scalars['String'];
  name: Array<LanguageType>;
  path?: Maybe<Scalars['String']>;
  navGroup: Scalars['String'];
  order: Scalars['Int'];
  nameString: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  parent?: Maybe<NavItem>;
  children?: Maybe<Array<NavItem>>;
};

export type PaginatedUsersResponse = {
  __typename?: 'PaginatedUsersResponse';
  docs: Array<User>;
  totalDocs: Scalars['Int'];
  limit: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  totalPages: Scalars['Int'];
  nextPage?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  pagingCounter: Scalars['Int'];
  hasPrevPage: Scalars['Int'];
  hasNextPage: Scalars['Int'];
};

export type UserPaginateInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<PaginateSortDirectionEnum>;
  search?: Maybe<Scalars['String']>;
  sortBy?: Maybe<UserSortByEnum>;
};

/** User pagination sortBy enum */
export enum UserSortByEnum {
  Email = 'email',
  Name = 'name',
  LastName = 'lastName',
  SecondName = 'secondName',
  Phone = 'phone',
  Role = 'role',
  CreatedAt = 'createdAt'
}

export type City = {
  __typename?: 'City';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  slug: Scalars['String'];
  nameString: Scalars['String'];
};

export type Country = {
  __typename?: 'Country';
  id: Scalars['ID'];
  nameString: Scalars['String'];
  cities: Array<City>;
  currency: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  id: Scalars['ID'];
  key: Scalars['String'];
  name: Scalars['String'];
  nativeName: Scalars['String'];
  isDefault: Scalars['Boolean'];
};

export type Currency = {
  __typename?: 'Currency';
  id: Scalars['ID'];
  nameString: Scalars['String'];
};

export type CatalogueData = {
  __typename?: 'CatalogueData';
  rubric: Rubric;
  products: PaginatedProductsResponse;
  catalogueTitle: Scalars['String'];
};

export type Rubric = {
  __typename?: 'Rubric';
  id: Scalars['ID'];
  views: Array<CityCounter>;
  priorities: Array<CityCounter>;
  name: Array<LanguageType>;
  catalogueTitle: RubricCatalogueTitle;
  slug: Scalars['String'];
  priority: Scalars['Int'];
  level: Scalars['Int'];
  active?: Maybe<Scalars['Boolean']>;
  parent?: Maybe<Rubric>;
  attributesGroups: Array<RubricAttributesGroup>;
  variant: RubricVariant;
  nameString: Scalars['String'];
  catalogueTitleString: RubricCatalogueTitleField;
  children: Array<Rubric>;
  filterAttributes: Array<RubricFilterAttribute>;
  products: PaginatedProductsResponse;
  totalProductsCount: Scalars['Int'];
  activeProductsCount: Scalars['Int'];
};


export type RubricChildrenArgs = {
  excluded?: Maybe<Array<Scalars['ID']>>;
};


export type RubricProductsArgs = {
  input?: Maybe<RubricProductPaginateInput>;
};

export type RubricCatalogueTitle = {
  __typename?: 'RubricCatalogueTitle';
  defaultTitle: Array<LanguageType>;
  prefix?: Maybe<Array<LanguageType>>;
  keyword: Array<LanguageType>;
  gender: GenderEnum;
};

export type RubricAttributesGroup = {
  __typename?: 'RubricAttributesGroup';
  id: Scalars['ID'];
  showInCatalogueFilter: Array<Scalars['ID']>;
  isOwner: Scalars['Boolean'];
  node: AttributesGroup;
};

export type RubricVariant = {
  __typename?: 'RubricVariant';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
};

export type RubricCatalogueTitleField = {
  __typename?: 'RubricCatalogueTitleField';
  defaultTitle: Scalars['String'];
  prefix?: Maybe<Scalars['String']>;
  keyword: Scalars['String'];
  gender: GenderEnum;
};

export type RubricFilterAttribute = {
  __typename?: 'RubricFilterAttribute';
  id: Scalars['ID'];
  node: Attribute;
  options: Array<RubricFilterAttributeOption>;
};

export type RubricFilterAttributeOption = {
  __typename?: 'RubricFilterAttributeOption';
  id: Scalars['ID'];
  slug: Scalars['String'];
  name: Array<LanguageType>;
  variants?: Maybe<Array<OptionVariant>>;
  gender?: Maybe<GenderEnum>;
  views: Array<OptionCityCounter>;
  priorities: Array<OptionCityCounter>;
  nameString: Scalars['String'];
  filterNameString: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  counter: Scalars['Int'];
};

export type RubricProductPaginateInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<PaginateSortDirectionEnum>;
  search?: Maybe<Scalars['String']>;
  sortBy?: Maybe<ProductSortByEnum>;
  notInRubric?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  attributes?: Maybe<Array<RubricProductAttributesFilterInput>>;
};

export type RubricProductAttributesFilterInput = {
  key: Scalars['String'];
  value: Array<Scalars['String']>;
};

export type CatalogueSearchResult = {
  __typename?: 'CatalogueSearchResult';
  rubrics: Array<Rubric>;
  products: Array<Product>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  key: Scalars['String'];
  message: Array<LanguageType>;
};

export type GenderOption = {
  __typename?: 'GenderOption';
  id: Scalars['String'];
  nameString: Scalars['String'];
};

export type AttributeVariant = {
  __typename?: 'AttributeVariant';
  id: Scalars['ID'];
  nameString: Scalars['String'];
};

export type AttributePositioningOption = {
  __typename?: 'AttributePositioningOption';
  id: Scalars['String'];
  nameString: Scalars['String'];
};

export type IsoLanguage = {
  __typename?: 'ISOLanguage';
  id: Scalars['String'];
  nameString: Scalars['String'];
  nativeName: Scalars['String'];
};

export type Config = {
  __typename?: 'Config';
  id: Scalars['ID'];
  /** Returns current translation if multiLang field is set to true. Otherwise returns value file of current city. */
  value: Array<Scalars['String']>;
  slug: Scalars['String'];
  nameString: Scalars['String'];
  description: Scalars['String'];
  order: Scalars['Float'];
  /** Set to true if config is able to hold multiple values. */
  multi: Scalars['Boolean'];
  /** Set to true if config is able to hold value for multiple languages. */
  multiLang: Scalars['Boolean'];
  variant: ConfigVariantEnum;
  /** Accepted formats for asset config. */
  acceptedFormats: Array<Scalars['String']>;
  cities: Array<ConfigCity>;
};

/** Config variant enum */
export enum ConfigVariantEnum {
  String = 'string',
  Number = 'number',
  Email = 'email',
  Tel = 'tel',
  Asset = 'asset'
}

export type ConfigCity = {
  __typename?: 'ConfigCity';
  key: Scalars['String'];
  value: Array<Scalars['String']>;
  translations: Array<LanguageType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProduct: ProductPayloadType;
  updateProduct: ProductPayloadType;
  deleteProduct: ProductPayloadType;
  createUser: UserPayloadType;
  updateUser: UserPayloadType;
  updateMyProfile: UserPayloadType;
  updateMyPassword: UserPayloadType;
  deleteUser: UserPayloadType;
  signUp: UserPayloadType;
  signIn: UserPayloadType;
  signOut: UserPayloadType;
  createCountry: CountryPayloadType;
  updateCountry: CountryPayloadType;
  deleteCountry: CountryPayloadType;
  addCityToCountry: CountryPayloadType;
  updateCityInCountry: CountryPayloadType;
  deleteCityFromCountry: CountryPayloadType;
  setLanguageAsDefault: LanguagePayloadType;
  createLanguage: LanguagePayloadType;
  updateLanguage: LanguagePayloadType;
  deleteLanguage: LanguagePayloadType;
  createCurrency: CurrencyPayloadType;
  updateCurrency: CurrencyPayloadType;
  deleteCurrency: CurrencyPayloadType;
  createAttributesGroup: AttributesGroupPayloadType;
  updateAttributesGroup: AttributesGroupPayloadType;
  deleteAttributesGroup: AttributesGroupPayloadType;
  addAttributeToGroup: AttributesGroupPayloadType;
  updateAttributeInGroup: AttributesGroupPayloadType;
  deleteAttributeFromGroup: AttributesGroupPayloadType;
  createMetric: MetricPayloadType;
  updateMetric: MetricPayloadType;
  deleteMetric: MetricPayloadType;
  createOptionsGroup: OptionsGroupPayloadType;
  updateOptionsGroup: OptionsGroupPayloadType;
  deleteOptionsGroup: OptionsGroupPayloadType;
  addOptionToGroup: OptionsGroupPayloadType;
  updateOptionInGroup: OptionsGroupPayloadType;
  deleteOptionFromGroup: OptionsGroupPayloadType;
  createRubric: RubricPayloadType;
  updateRubric: RubricPayloadType;
  deleteRubric: RubricPayloadType;
  addAttributesGroupToRubric: RubricPayloadType;
  updateAttributesGroupInRubric: RubricPayloadType;
  deleteAttributesGroupFromRubric: RubricPayloadType;
  addProductToRubric: RubricPayloadType;
  deleteProductFromRubric: RubricPayloadType;
  createRubricVariant: RubricVariantPayloadType;
  updateRubricVariant: RubricVariantPayloadType;
  deleteRubricVariant: RubricVariantPayloadType;
  updateConfigs: ConfigPayloadType;
  updateAssetConfig: ConfigPayloadType;
  createRole: RolePayloadType;
  updateRole: RolePayloadType;
  deleteRole: RolePayloadType;
  setRoleOperationPermission: RolePayloadType;
  setRoleOperationCustomFilter: RolePayloadType;
  setRoleRuleRestrictedField: RolePayloadType;
  setRoleAllowedNavItem: RolePayloadType;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
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


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID'];
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


export type MutationSetLanguageAsDefaultArgs = {
  id: Scalars['ID'];
};


export type MutationCreateLanguageArgs = {
  input: CreateLanguageInput;
};


export type MutationUpdateLanguageArgs = {
  input: UpdateLanguageInput;
};


export type MutationDeleteLanguageArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCurrencyArgs = {
  input: CreateCurrencyInput;
};


export type MutationUpdateCurrencyArgs = {
  input: UpdateCurrencyInput;
};


export type MutationDeleteCurrencyArgs = {
  id: Scalars['ID'];
};


export type MutationCreateAttributesGroupArgs = {
  input: CreateAttributesGroupInput;
};


export type MutationUpdateAttributesGroupArgs = {
  input: UpdateAttributesGroupInput;
};


export type MutationDeleteAttributesGroupArgs = {
  id: Scalars['ID'];
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


export type MutationCreateMetricArgs = {
  input: CreateMetricInput;
};


export type MutationUpdateMetricArgs = {
  input: UpdateMetricInput;
};


export type MutationDeleteMetricArgs = {
  id: Scalars['ID'];
};


export type MutationCreateOptionsGroupArgs = {
  input: CreateOptionsGroupInput;
};


export type MutationUpdateOptionsGroupArgs = {
  input: UpdateOptionsGroupInput;
};


export type MutationDeleteOptionsGroupArgs = {
  id: Scalars['ID'];
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


export type MutationCreateRubricArgs = {
  input: CreateRubricInput;
};


export type MutationUpdateRubricArgs = {
  input: UpdateRubricInput;
};


export type MutationDeleteRubricArgs = {
  id: Scalars['ID'];
};


export type MutationAddAttributesGroupToRubricArgs = {
  input: AddAttributesGroupToRubricInput;
};


export type MutationUpdateAttributesGroupInRubricArgs = {
  input: UpdateAttributesGroupInRubricInput;
};


export type MutationDeleteAttributesGroupFromRubricArgs = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type MutationAddProductToRubricArgs = {
  input: AddProductToRubricInput;
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
  id: Scalars['ID'];
};


export type MutationUpdateConfigsArgs = {
  input: Array<UpdateConfigInput>;
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
  id: Scalars['ID'];
};


export type MutationSetRoleOperationPermissionArgs = {
  input: SetRoleOperationPermissionInput;
};


export type MutationSetRoleOperationCustomFilterArgs = {
  input: SetRoleOperationCustomFilterInput;
};


export type MutationSetRoleRuleRestrictedFieldArgs = {
  input: SetRoleRuleRestrictedFieldInput;
};


export type MutationSetRoleAllowedNavItemArgs = {
  input: SetRoleAllowedNavItemInput;
};

export type ProductPayloadType = {
  __typename?: 'ProductPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  product?: Maybe<Product>;
};

export type CreateProductInput = {
  name: Array<LangInput>;
  cardName: Array<LangInput>;
  description: Array<LangInput>;
  rubrics: Array<Scalars['ID']>;
  price: Scalars['Int'];
  attributesGroups: Array<ProductAttributesGroupInput>;
  assets: Array<Scalars['Upload']>;
};

export type LangInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type ProductAttributesGroupInput = {
  showInCard: Scalars['Boolean'];
  node: Scalars['ID'];
  attributes: Array<ProductAttributeInput>;
};

export type ProductAttributeInput = {
  showInCard: Scalars['Boolean'];
  node: Scalars['ID'];
  /** Attribute reference via attribute slug field */
  key: Scalars['String'];
  value: Array<Scalars['String']>;
};


export type UpdateProductInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
  cardName: Array<LangInput>;
  description: Array<LangInput>;
  rubrics: Array<Scalars['ID']>;
  price: Scalars['Int'];
  attributesGroups: Array<ProductAttributesGroupInput>;
  assets: Array<Scalars['Upload']>;
};

export type UserPayloadType = {
  __typename?: 'UserPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  role: Scalars['ID'];
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  role: Scalars['ID'];
};

export type UpdateMyProfileInput = {
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
};

export type UpdateMyPasswordInput = {
  id: Scalars['ID'];
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
  newPasswordB: Scalars['String'];
};

export type SignUpInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CountryPayloadType = {
  __typename?: 'CountryPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  country?: Maybe<Country>;
};

export type CreateCountryInput = {
  nameString: Scalars['String'];
  currency: Scalars['String'];
};

export type UpdateCountryInput = {
  id: Scalars['ID'];
  nameString: Scalars['String'];
  currency: Scalars['String'];
};

export type AddCityToCountryInput = {
  countryId: Scalars['ID'];
  name: Array<LangInput>;
  slug: Scalars['String'];
};

export type UpdateCityInCountryInput = {
  countryId: Scalars['ID'];
  cityId: Scalars['ID'];
  name: Array<LangInput>;
  slug: Scalars['String'];
};

export type DeleteCityFromCountryInput = {
  countryId: Scalars['ID'];
  cityId: Scalars['ID'];
};

export type LanguagePayloadType = {
  __typename?: 'LanguagePayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  language?: Maybe<Language>;
};

export type CreateLanguageInput = {
  key: Scalars['String'];
  name: Scalars['String'];
  nativeName: Scalars['String'];
};

export type UpdateLanguageInput = {
  id: Scalars['ID'];
  key: Scalars['String'];
  name: Scalars['String'];
  nativeName: Scalars['String'];
};

export type CurrencyPayloadType = {
  __typename?: 'CurrencyPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  currency?: Maybe<Currency>;
};

export type CreateCurrencyInput = {
  nameString: Scalars['String'];
};

export type UpdateCurrencyInput = {
  id: Scalars['ID'];
  nameString: Scalars['String'];
};

export type AttributesGroupPayloadType = {
  __typename?: 'AttributesGroupPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type CreateAttributesGroupInput = {
  name: Array<LangInput>;
};

export type UpdateAttributesGroupInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
};

export type AddAttributeToGroupInput = {
  groupId: Scalars['ID'];
  name: Array<LangInput>;
  variant: AttributeVariantEnum;
  options?: Maybe<Scalars['ID']>;
  metric?: Maybe<Scalars['ID']>;
  positioningInTitle?: Maybe<Array<AttributePositioningInTitleInput>>;
};

export type AttributePositioningInTitleInput = {
  key: Scalars['String'];
  value: AttributePositionInTitleEnum;
};

export type UpdateAttributeInGroupInput = {
  groupId: Scalars['ID'];
  attributeId: Scalars['ID'];
  name: Array<LangInput>;
  variant: AttributeVariantEnum;
  options?: Maybe<Scalars['ID']>;
  metric?: Maybe<Scalars['ID']>;
  positioningInTitle?: Maybe<Array<AttributePositioningInTitleInput>>;
};

export type DeleteAttributeFromGroupInput = {
  groupId: Scalars['ID'];
  attributeId: Scalars['ID'];
};

export type MetricPayloadType = {
  __typename?: 'MetricPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  metric?: Maybe<Metric>;
};

export type CreateMetricInput = {
  name: Array<LangInput>;
};

export type UpdateMetricInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
};

export type OptionsGroupPayloadType = {
  __typename?: 'OptionsGroupPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<OptionsGroup>;
};

export type CreateOptionsGroupInput = {
  name: Array<LangInput>;
};

export type UpdateOptionsGroupInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
};

export type AddOptionToGroupInput = {
  groupId: Scalars['ID'];
  name: Array<LangInput>;
  color?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<OptionVariantInput>>;
  gender?: Maybe<GenderEnum>;
};

export type OptionVariantInput = {
  key: GenderEnum;
  value: Array<LangInput>;
};

export type UpdateOptionInGroupInput = {
  groupId: Scalars['ID'];
  optionId: Scalars['ID'];
  name: Array<LangInput>;
  color?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<OptionVariantInput>>;
  gender?: Maybe<GenderEnum>;
};

export type DeleteOptionFromGroupInput = {
  groupId: Scalars['ID'];
  optionId: Scalars['ID'];
};

export type RubricPayloadType = {
  __typename?: 'RubricPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type CreateRubricInput = {
  name: Array<LangInput>;
  parent?: Maybe<Scalars['ID']>;
  variant: Scalars['ID'];
  catalogueTitle: RubricCatalogueTitleInput;
};

export type RubricCatalogueTitleInput = {
  defaultTitle: Array<LangInput>;
  prefix?: Maybe<Array<LangInput>>;
  keyword: Array<LangInput>;
  gender: GenderEnum;
};

export type UpdateRubricInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
  catalogueTitle: RubricCatalogueTitleInput;
  parent?: Maybe<Scalars['ID']>;
  variant: Scalars['ID'];
};

export type AddAttributesGroupToRubricInput = {
  rubricId: Scalars['ID'];
  attributesGroupId: Scalars['ID'];
};

export type UpdateAttributesGroupInRubricInput = {
  rubricId: Scalars['ID'];
  attributesGroupId: Scalars['ID'];
  attributeId: Scalars['ID'];
};

export type DeleteAttributesGroupFromRubricInput = {
  rubricId: Scalars['ID'];
  attributesGroupId: Scalars['ID'];
};

export type AddProductToRubricInput = {
  rubricId: Scalars['ID'];
  productId: Scalars['ID'];
};

export type DeleteProductFromRubricInput = {
  rubricId: Scalars['ID'];
  productId: Scalars['ID'];
};

export type RubricVariantPayloadType = {
  __typename?: 'RubricVariantPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  variant?: Maybe<RubricVariant>;
};

export type CreateRubricVariantInput = {
  name: Array<LangInput>;
};

export type UpdateRubricVariantInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
};

export type ConfigPayloadType = {
  __typename?: 'ConfigPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  configs: Array<Config>;
};

export type UpdateConfigInput = {
  id: Scalars['ID'];
  cities: Array<ConfigCityInput>;
};

export type ConfigCityInput = {
  key: Scalars['String'];
  value: Array<Scalars['String']>;
  translations: Array<LangInput>;
};

export type UpdateAssetConfigInput = {
  id: Scalars['ID'];
  value: Array<Scalars['Upload']>;
};

export type RolePayloadType = {
  __typename?: 'RolePayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  role?: Maybe<Role>;
};

export type CreateRoleInput = {
  name: Array<LangInput>;
  description: Scalars['String'];
  isStuff: Scalars['Boolean'];
};

export type UpdateRoleInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
  description: Scalars['String'];
  isStuff: Scalars['Boolean'];
};

export type SetRoleOperationPermissionInput = {
  roleId: Scalars['ID'];
  operationId: Scalars['ID'];
  allow: Scalars['Boolean'];
};

export type SetRoleOperationCustomFilterInput = {
  roleId: Scalars['ID'];
  operationId: Scalars['ID'];
  customFilter: Scalars['String'];
};

export type SetRoleRuleRestrictedFieldInput = {
  roleId: Scalars['ID'];
  ruleId: Scalars['ID'];
  restrictedField: Scalars['String'];
};

export type SetRoleAllowedNavItemInput = {
  roleId: Scalars['ID'];
  navItemId: Scalars['ID'];
};

export type SessionUserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone'>
);

export type SessionRoleFragmentFragment = (
  { __typename?: 'Role' }
  & Pick<Role, 'id' | 'nameString' | 'isStuff'>
);

export type SiteRubricFragmentFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, 'id' | 'nameString' | 'slug' | 'level'>
  & { variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, 'id' | 'nameString'>
  ), filterAttributes: Array<(
    { __typename?: 'RubricFilterAttribute' }
    & Pick<RubricFilterAttribute, 'id'>
    & { node: (
      { __typename?: 'Attribute' }
      & Pick<Attribute, 'id' | 'nameString' | 'slug'>
    ), options: Array<(
      { __typename?: 'RubricFilterAttributeOption' }
      & Pick<RubricFilterAttributeOption, 'id' | 'slug' | 'filterNameString' | 'color' | 'counter'>
    )> }
  )> }
);

export type InitialQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getClientLanguage'>
  & { me?: Maybe<(
    { __typename?: 'User' }
    & SessionUserFragmentFragment
  )>, getSessionRole: (
    { __typename?: 'Role' }
    & { appNavigation: Array<(
      { __typename?: 'NavItem' }
      & Pick<NavItem, 'id' | 'nameString' | 'icon' | 'path'>
      & { children?: Maybe<Array<(
        { __typename?: 'NavItem' }
        & Pick<NavItem, 'id' | 'nameString' | 'icon' | 'path'>
      )>> }
    )> }
    & SessionRoleFragmentFragment
  ), getAllLanguages?: Maybe<Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'id' | 'name' | 'nativeName' | 'key' | 'isDefault'>
  )>>, getAllConfigs: Array<(
    { __typename?: 'Config' }
    & SiteConfigFragment
  )>, getAllCities: Array<(
    { __typename?: 'City' }
    & Pick<City, 'id' | 'slug' | 'nameString'>
  )> }
);

export type InitialSiteQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialSiteQueryQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getSessionCurrency' | 'getClientLanguage'>
  & { me?: Maybe<(
    { __typename?: 'User' }
    & SessionUserFragmentFragment
  )>, getSessionRole: (
    { __typename?: 'Role' }
    & SessionRoleFragmentFragment
  ), getAllLanguages?: Maybe<Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'id' | 'key' | 'name' | 'nativeName' | 'isDefault'>
  )>>, getAllConfigs: Array<(
    { __typename?: 'Config' }
    & SiteConfigFragment
  )>, getRubricsTree: Array<(
    { __typename?: 'Rubric' }
    & SiteRubricFragmentFragment
  )>, getAllCities: Array<(
    { __typename?: 'City' }
    & Pick<City, 'id' | 'slug' | 'nameString'>
  )> }
);

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signIn: (
    { __typename?: 'UserPayloadType' }
    & Pick<UserPayloadType, 'success' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & SessionUserFragmentFragment
    )> }
  ) }
);

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = (
  { __typename?: 'Mutation' }
  & { signOut: (
    { __typename?: 'UserPayloadType' }
    & Pick<UserPayloadType, 'success' | 'message'>
  ) }
);

export type CreateAttributesGroupMutationVariables = Exact<{
  input: CreateAttributesGroupInput;
}>;


export type CreateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { createAttributesGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAttributesGroupMutationVariables = Exact<{
  input: UpdateAttributesGroupInput;
}>;


export type UpdateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributesGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type AddAttributeToGroupMutationVariables = Exact<{
  input: AddAttributeToGroupInput;
}>;


export type AddAttributeToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addAttributeToGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAttributeInGroupMutationVariables = Exact<{
  input: UpdateAttributeInGroupInput;
}>;


export type UpdateAttributeInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributeInGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteAttributeFromGroupMutationVariables = Exact<{
  input: DeleteAttributeFromGroupInput;
}>;


export type DeleteAttributeFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributeFromGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type AddAttributesGroupToRubricMutationVariables = Exact<{
  input: AddAttributesGroupToRubricInput;
}>;


export type AddAttributesGroupToRubricMutation = (
  { __typename?: 'Mutation' }
  & { addAttributesGroupToRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAttributesGroupInRubricMutationVariables = Exact<{
  input: UpdateAttributesGroupInRubricInput;
}>;


export type UpdateAttributesGroupInRubricMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributesGroupInRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupFromRubricMutationVariables = Exact<{
  input: DeleteAttributesGroupFromRubricInput;
}>;


export type DeleteAttributesGroupFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroupFromRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateConfigsMutationVariables = Exact<{
  input: Array<UpdateConfigInput>;
}>;


export type UpdateConfigsMutation = (
  { __typename?: 'Mutation' }
  & { updateConfigs: (
    { __typename?: 'ConfigPayloadType' }
    & Pick<ConfigPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAssetConfigMutationVariables = Exact<{
  input: UpdateAssetConfigInput;
}>;


export type UpdateAssetConfigMutation = (
  { __typename?: 'Mutation' }
  & { updateAssetConfig: (
    { __typename?: 'ConfigPayloadType' }
    & Pick<ConfigPayloadType, 'success' | 'message'>
  ) }
);

export type CreateLanguageMutationVariables = Exact<{
  input: CreateLanguageInput;
}>;


export type CreateLanguageMutation = (
  { __typename?: 'Mutation' }
  & { createLanguage: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type UpdateLanguageMutationVariables = Exact<{
  input: UpdateLanguageInput;
}>;


export type UpdateLanguageMutation = (
  { __typename?: 'Mutation' }
  & { updateLanguage: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type DeleteLanguageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteLanguageMutation = (
  { __typename?: 'Mutation' }
  & { deleteLanguage: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type SetLanguageAsDefaultMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SetLanguageAsDefaultMutation = (
  { __typename?: 'Mutation' }
  & { setLanguageAsDefault: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type CreateOptionsGroupMutationVariables = Exact<{
  input: CreateOptionsGroupInput;
}>;


export type CreateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { createOptionsGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateOptionsGroupMutationVariables = Exact<{
  input: UpdateOptionsGroupInput;
}>;


export type UpdateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionsGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteOptionsGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionsGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type AddOptionToGroupMutationVariables = Exact<{
  input: AddOptionToGroupInput;
}>;


export type AddOptionToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addOptionToGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateOptionInGroupMutationVariables = Exact<{
  input: UpdateOptionInGroupInput;
}>;


export type UpdateOptionInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionInGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteOptionFromGroupMutationVariables = Exact<{
  input: DeleteOptionFromGroupInput;
}>;


export type DeleteOptionFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionFromGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = (
  { __typename?: 'Mutation' }
  & { createRole: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateRole: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRoleMutation = (
  { __typename?: 'Mutation' }
  & { deleteRole: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleOperationPermissionMutationVariables = Exact<{
  input: SetRoleOperationPermissionInput;
}>;


export type SetRoleOperationPermissionMutation = (
  { __typename?: 'Mutation' }
  & { setRoleOperationPermission: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleOperationCustomFilterMutationVariables = Exact<{
  input: SetRoleOperationCustomFilterInput;
}>;


export type SetRoleOperationCustomFilterMutation = (
  { __typename?: 'Mutation' }
  & { setRoleOperationCustomFilter: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleRuleRestrictedFieldMutationVariables = Exact<{
  input: SetRoleRuleRestrictedFieldInput;
}>;


export type SetRoleRuleRestrictedFieldMutation = (
  { __typename?: 'Mutation' }
  & { setRoleRuleRestrictedField: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleAllowedNavItemMutationVariables = Exact<{
  input: SetRoleAllowedNavItemInput;
}>;


export type SetRoleAllowedNavItemMutation = (
  { __typename?: 'Mutation' }
  & { setRoleAllowedNavItem: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type CreateRubricVariantMutationVariables = Exact<{
  input: CreateRubricVariantInput;
}>;


export type CreateRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { createRubricVariant: (
    { __typename?: 'RubricVariantPayloadType' }
    & Pick<RubricVariantPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateRubricVariantMutationVariables = Exact<{
  input: UpdateRubricVariantInput;
}>;


export type UpdateRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { updateRubricVariant: (
    { __typename?: 'RubricVariantPayloadType' }
    & Pick<RubricVariantPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteRubricVariantMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubricVariant: (
    { __typename?: 'RubricVariantPayloadType' }
    & Pick<RubricVariantPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateMyProfile: (
    { __typename?: 'UserPayloadType' }
    & Pick<UserPayloadType, 'success' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & SessionUserFragmentFragment
    )> }
  ) }
);

export type UpdateMyPasswordMutationVariables = Exact<{
  input: UpdateMyPasswordInput;
}>;


export type UpdateMyPasswordMutation = (
  { __typename?: 'Mutation' }
  & { updateMyPassword: (
    { __typename?: 'UserPayloadType' }
    & Pick<UserPayloadType, 'success' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & SessionUserFragmentFragment
    )> }
  ) }
);

export type ProductFragmentFragment = (
  { __typename?: 'Product' }
  & Pick<Product, 'id' | 'itemId' | 'nameString' | 'cardNameString' | 'slug' | 'price' | 'descriptionString' | 'rubrics'>
  & { name: Array<(
    { __typename?: 'LanguageType' }
    & Pick<LanguageType, 'key' | 'value'>
  )>, cardName: Array<(
    { __typename?: 'LanguageType' }
    & Pick<LanguageType, 'key' | 'value'>
  )>, description: Array<(
    { __typename?: 'LanguageType' }
    & Pick<LanguageType, 'key' | 'value'>
  )>, assets: Array<(
    { __typename?: 'AssetType' }
    & Pick<AssetType, 'url' | 'index'>
  )>, attributesGroups: Array<(
    { __typename?: 'ProductAttributesGroup' }
    & Pick<ProductAttributesGroup, 'showInCard'>
    & { node: (
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'nameString'>
    ), attributes: Array<(
      { __typename?: 'ProductAttribute' }
      & Pick<ProductAttribute, 'showInCard' | 'key' | 'value'>
      & { node: (
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'slug' | 'nameString' | 'variant'>
        & { metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'nameString'>
        )>, options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'nameString'>
          & { options: Array<(
            { __typename?: 'Option' }
            & Pick<Option, 'id' | 'nameString' | 'color'>
          )> }
        )> }
      ) }
    )> }
  )> }
);

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductQuery = (
  { __typename?: 'Query' }
  & { getProduct: (
    { __typename?: 'Product' }
    & ProductFragmentFragment
  ) }
);

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { updateProduct: (
    { __typename?: 'ProductPayloadType' }
    & Pick<ProductPayloadType, 'success' | 'message'>
    & { product?: Maybe<(
      { __typename?: 'Product' }
      & ProductFragmentFragment
    )> }
  ) }
);

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = (
  { __typename?: 'Mutation' }
  & { createProduct: (
    { __typename?: 'ProductPayloadType' }
    & Pick<ProductPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductMutation = (
  { __typename?: 'Mutation' }
  & { deleteProduct: (
    { __typename?: 'ProductPayloadType' }
    & Pick<ProductPayloadType, 'success' | 'message'>
  ) }
);

export type GetAllAttributesGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAttributesGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
  )> }
);

export type GetAttributesGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAttributesGroupQuery = (
  { __typename?: 'Query' }
  & { getAttributesGroup?: Maybe<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
    & { name: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )>, attributes: Array<(
      { __typename?: 'Attribute' }
      & Pick<Attribute, 'id' | 'nameString' | 'variant'>
      & { name: Array<(
        { __typename?: 'LanguageType' }
        & Pick<LanguageType, 'key' | 'value'>
      )>, positioningInTitle?: Maybe<Array<(
        { __typename?: 'AttributePositioningInTitle' }
        & Pick<AttributePositioningInTitle, 'key' | 'value'>
      )>>, options?: Maybe<(
        { __typename?: 'OptionsGroup' }
        & Pick<OptionsGroup, 'id' | 'nameString'>
      )>, metric?: Maybe<(
        { __typename?: 'Metric' }
        & Pick<Metric, 'id' | 'nameString'>
      )> }
    )> }
  )> }
);

export type GetAttributesGroupsForRubricQueryVariables = Exact<{
  exclude?: Maybe<Array<Scalars['ID']>>;
}>;


export type GetAttributesGroupsForRubricQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
  )> }
);

export type GetCatalogueCardQueryQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetCatalogueCardQueryQuery = (
  { __typename?: 'Query' }
  & { getProductCard: (
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'itemId' | 'nameString' | 'cardNameString' | 'price' | 'slug' | 'mainImage' | 'descriptionString'>
    & { attributesGroups: Array<(
      { __typename?: 'ProductAttributesGroup' }
      & Pick<ProductAttributesGroup, 'showInCard'>
      & { node: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'nameString'>
      ), attributes: Array<(
        { __typename?: 'ProductAttribute' }
        & Pick<ProductAttribute, 'showInCard' | 'value'>
        & { node: (
          { __typename?: 'Attribute' }
          & Pick<Attribute, 'id' | 'nameString'>
          & { options?: Maybe<(
            { __typename?: 'OptionsGroup' }
            & Pick<OptionsGroup, 'id' | 'nameString'>
            & { options: Array<(
              { __typename?: 'Option' }
              & Pick<Option, 'id' | 'nameString'>
            )> }
          )> }
        ) }
      )> }
    )> }
  ) }
);

export type ProductSnippetFragment = (
  { __typename?: 'Product' }
  & Pick<Product, 'id' | 'itemId' | 'nameString' | 'price' | 'slug' | 'mainImage'>
);

export type CatalogueRubricFragmentFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, 'id' | 'nameString' | 'level' | 'slug'>
  & { variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, 'id' | 'nameString'>
  ), filterAttributes: Array<(
    { __typename?: 'RubricFilterAttribute' }
    & Pick<RubricFilterAttribute, 'id'>
    & { node: (
      { __typename?: 'Attribute' }
      & Pick<Attribute, 'id' | 'nameString' | 'slug'>
    ), options: Array<(
      { __typename?: 'RubricFilterAttributeOption' }
      & Pick<RubricFilterAttributeOption, 'id' | 'slug' | 'filterNameString' | 'color' | 'counter'>
    )> }
  )> }
);

export type GetCatalogueRubricQueryVariables = Exact<{
  catalogueFilter: Array<Scalars['String']>;
}>;


export type GetCatalogueRubricQuery = (
  { __typename?: 'Query' }
  & { getCatalogueData?: Maybe<(
    { __typename?: 'CatalogueData' }
    & Pick<CatalogueData, 'catalogueTitle'>
    & { rubric: (
      { __typename?: 'Rubric' }
      & CatalogueRubricFragmentFragment
    ), products: (
      { __typename?: 'PaginatedProductsResponse' }
      & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages'>
      & { docs: Array<(
        { __typename?: 'Product' }
        & ProductSnippetFragment
      )> }
    ) }
  )> }
);

export type SiteConfigFragment = (
  { __typename?: 'Config' }
  & Pick<Config, 'id' | 'slug' | 'value' | 'nameString' | 'description' | 'variant' | 'acceptedFormats'>
  & { cities: Array<(
    { __typename?: 'ConfigCity' }
    & Pick<ConfigCity, 'key' | 'value'>
    & { translations: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )> }
  )> }
);

export type GetAllConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllConfigsQuery = (
  { __typename?: 'Query' }
  & { getAllConfigs: Array<(
    { __typename?: 'Config' }
    & SiteConfigFragment
  )> }
);

export type GetAllLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLanguagesQuery = (
  { __typename?: 'Query' }
  & { getAllLanguages?: Maybe<Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'id' | 'name' | 'key' | 'isDefault' | 'nativeName'>
  )>> }
);

export type GetMessagesByKeysQueryVariables = Exact<{
  keys: Array<Scalars['String']>;
}>;


export type GetMessagesByKeysQuery = (
  { __typename?: 'Query' }
  & { getMessagesByKeys: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'key'>
    & { message: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )> }
  )> }
);

export type GetValidationMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetValidationMessagesQuery = (
  { __typename?: 'Query' }
  & { getValidationMessages: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'key'>
    & { message: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )> }
  )> }
);

export type GetAllOptionsGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOptionsGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllOptionsGroups: Array<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, 'id' | 'nameString'>
    & { options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, 'id'>
    )> }
  )> }
);

export type GetOptionsGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOptionsGroupQuery = (
  { __typename?: 'Query' }
  & { getOptionsGroup?: Maybe<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, 'id' | 'nameString'>
    & { name: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )>, options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, 'id' | 'nameString' | 'color' | 'gender'>
      & { name: Array<(
        { __typename?: 'LanguageType' }
        & Pick<LanguageType, 'key' | 'value'>
      )>, variants?: Maybe<Array<(
        { __typename?: 'OptionVariant' }
        & Pick<OptionVariant, 'key'>
        & { value: Array<(
          { __typename?: 'LanguageType' }
          & Pick<LanguageType, 'key' | 'value'>
        )> }
      )>> }
    )> }
  )> }
);

export type GetAllRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRolesQuery = (
  { __typename?: 'Query' }
  & { getAllRoles: Array<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'nameString'>
  )> }
);

export type GetRoleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRoleQuery = (
  { __typename?: 'Query' }
  & { getRole: (
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'nameString' | 'allowedAppNavigation' | 'description' | 'isStuff'>
    & { name: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )>, rules: Array<(
      { __typename?: 'RoleRule' }
      & Pick<RoleRule, 'id' | 'entity' | 'nameString' | 'restrictedFields'>
      & { operations: Array<(
        { __typename?: 'RoleRuleOperation' }
        & Pick<RoleRuleOperation, 'id' | 'allow' | 'customFilter' | 'operationType'>
      )> }
    )> }
  ) }
);

export type GetEntityFieldsQueryVariables = Exact<{
  entity: Scalars['String'];
}>;


export type GetEntityFieldsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getEntityFields'>
);

export type GetAllAppNavItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAppNavItemsQuery = (
  { __typename?: 'Query' }
  & { getAllAppNavItems: Array<(
    { __typename?: 'NavItem' }
    & Pick<NavItem, 'id' | 'nameString' | 'path'>
    & { children?: Maybe<Array<(
      { __typename?: 'NavItem' }
      & Pick<NavItem, 'id' | 'nameString' | 'path'>
    )>> }
  )> }
);

export type GetAllRubricVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRubricVariantsQuery = (
  { __typename?: 'Query' }
  & { getAllRubricVariants?: Maybe<Array<(
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, 'id' | 'nameString'>
    & { name: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )> }
  )>>, getGenderOptions: Array<(
    { __typename?: 'GenderOption' }
    & Pick<GenderOption, 'id' | 'nameString'>
  )> }
);

export type GetCatalogueSearchTopItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCatalogueSearchTopItemsQuery = (
  { __typename?: 'Query' }
  & { getCatalogueSearchTopItems: (
    { __typename?: 'CatalogueSearchResult' }
    & { rubrics: Array<(
      { __typename?: 'Rubric' }
      & CatalogueRubricFragmentFragment
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
      & CatalogueRubricFragmentFragment
    )>, products: Array<(
      { __typename?: 'Product' }
      & ProductSnippetFragment
    )> }
  ) }
);

export type GetGenderOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenderOptionsQuery = (
  { __typename?: 'Query' }
  & { getGenderOptions: Array<(
    { __typename?: 'GenderOption' }
    & Pick<GenderOption, 'id' | 'nameString'>
  )> }
);

export type GetIsoLanguagesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIsoLanguagesListQuery = (
  { __typename?: 'Query' }
  & { getISOLanguagesList: Array<(
    { __typename?: 'ISOLanguage' }
    & Pick<IsoLanguage, 'id' | 'nameString' | 'nativeName'>
  )> }
);

export type GetNewAttributeOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNewAttributeOptionsQuery = (
  { __typename?: 'Query' }
  & { getAllOptionsGroups: Array<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, 'id' | 'nameString'>
  )>, getAllMetrics?: Maybe<Array<(
    { __typename?: 'Metric' }
    & Pick<Metric, 'id' | 'nameString'>
  )>>, getAttributeVariants?: Maybe<Array<(
    { __typename?: 'AttributeVariant' }
    & Pick<AttributeVariant, 'id' | 'nameString'>
  )>>, getAttributePositioningOptions: Array<(
    { __typename?: 'AttributePositioningOption' }
    & Pick<AttributePositioningOption, 'id' | 'nameString'>
  )> }
);

export type GetFeaturesAstQueryVariables = Exact<{
  selectedRubrics: Array<Scalars['ID']>;
}>;


export type GetFeaturesAstQuery = (
  { __typename?: 'Query' }
  & { getFeaturesAst: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
    & { attributes: Array<(
      { __typename?: 'Attribute' }
      & Pick<Attribute, 'id' | 'slug' | 'nameString' | 'variant'>
      & { metric?: Maybe<(
        { __typename?: 'Metric' }
        & Pick<Metric, 'id' | 'nameString'>
      )>, options?: Maybe<(
        { __typename?: 'OptionsGroup' }
        & Pick<OptionsGroup, 'id' | 'nameString'>
        & { options: Array<(
          { __typename?: 'Option' }
          & Pick<Option, 'id' | 'slug' | 'nameString' | 'color'>
        )> }
      )> }
    )> }
  )> }
);

export type RubricFragmentFragment = (
  { __typename?: 'Rubric' }
  & Pick<Rubric, 'id' | 'nameString' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
  & { name: Array<(
    { __typename?: 'LanguageType' }
    & Pick<LanguageType, 'key' | 'value'>
  )>, variant: (
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, 'id' | 'nameString'>
  ) }
);

export type RubricProductFragmentFragment = (
  { __typename?: 'PaginatedProductsResponse' }
  & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages' | 'activeProductsCount'>
  & { docs: Array<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'itemId' | 'nameString' | 'price' | 'slug' | 'mainImage' | 'active' | 'rubrics'>
    & { name: Array<(
      { __typename?: 'LanguageType' }
      & Pick<LanguageType, 'key' | 'value'>
    )> }
  )> }
);

export type GetRubricsTreeQueryVariables = Exact<{
  excluded?: Maybe<Array<Scalars['ID']>>;
  counters: ProductsCountersInput;
}>;


export type GetRubricsTreeQuery = (
  { __typename?: 'Query' }
  & { getRubricsTree: Array<(
    { __typename?: 'Rubric' }
    & { children: Array<(
      { __typename?: 'Rubric' }
      & { children: Array<(
        { __typename?: 'Rubric' }
        & RubricFragmentFragment
      )> }
      & RubricFragmentFragment
    )> }
    & RubricFragmentFragment
  )>, getProductsCounters: (
    { __typename?: 'ProductsCounters' }
    & Pick<ProductsCounters, 'totalProductsCount' | 'activeProductsCount'>
  ) }
);

export type GetRubricQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRubricQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & { catalogueTitle: (
      { __typename?: 'RubricCatalogueTitle' }
      & Pick<RubricCatalogueTitle, 'gender'>
      & { defaultTitle: Array<(
        { __typename?: 'LanguageType' }
        & Pick<LanguageType, 'key' | 'value'>
      )>, prefix?: Maybe<Array<(
        { __typename?: 'LanguageType' }
        & Pick<LanguageType, 'key' | 'value'>
      )>>, keyword: Array<(
        { __typename?: 'LanguageType' }
        & Pick<LanguageType, 'key' | 'value'>
      )> }
    ) }
    & RubricFragmentFragment
  ) }
);

export type CreateRubricMutationVariables = Exact<{
  input: CreateRubricInput;
}>;


export type CreateRubricMutation = (
  { __typename?: 'Mutation' }
  & { createRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateRubricMutationVariables = Exact<{
  input: UpdateRubricInput;
}>;


export type UpdateRubricMutation = (
  { __typename?: 'Mutation' }
  & { updateRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteRubricMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type GetRubricProductsQueryVariables = Exact<{
  id: Scalars['ID'];
  notInRubric?: Maybe<Scalars['ID']>;
}>;


export type GetRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id'>
    & { products: (
      { __typename?: 'PaginatedProductsResponse' }
      & RubricProductFragmentFragment
    ) }
  ) }
);

export type GetNonRubricProductsQueryVariables = Exact<{
  input: ProductPaginateInput;
}>;


export type GetNonRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'PaginatedProductsResponse' }
    & RubricProductFragmentFragment
  ) }
);

export type AddProductTuRubricMutationVariables = Exact<{
  input: AddProductToRubricInput;
}>;


export type AddProductTuRubricMutation = (
  { __typename?: 'Mutation' }
  & { addProductToRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteProductFromRubricMutationVariables = Exact<{
  input: DeleteProductFromRubricInput;
}>;


export type DeleteProductFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type GetAllProductsQueryVariables = Exact<{
  input: ProductPaginateInput;
}>;


export type GetAllProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'PaginatedProductsResponse' }
    & RubricProductFragmentFragment
  ) }
);

export type GetRubricAttributesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRubricAttributesQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id' | 'level'>
    & { attributesGroups: Array<(
      { __typename?: 'RubricAttributesGroup' }
      & Pick<RubricAttributesGroup, 'id' | 'isOwner' | 'showInCatalogueFilter'>
      & { node: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'nameString'>
        & { attributes: Array<(
          { __typename?: 'Attribute' }
          & Pick<Attribute, 'id' | 'nameString' | 'variant'>
          & { metric?: Maybe<(
            { __typename?: 'Metric' }
            & Pick<Metric, 'id' | 'nameString'>
          )>, options?: Maybe<(
            { __typename?: 'OptionsGroup' }
            & Pick<OptionsGroup, 'id' | 'nameString'>
          )> }
        )> }
      ) }
    )> }
  ) }
);

export const SessionUserFragmentFragmentDoc = gql`
    fragment SessionUserFragment on User {
  id
  email
  name
  secondName
  lastName
  fullName
  shortName
  phone
}
    `;
export const SessionRoleFragmentFragmentDoc = gql`
    fragment SessionRoleFragment on Role {
  id
  nameString
  isStuff
}
    `;
export const SiteRubricFragmentFragmentDoc = gql`
    fragment SiteRubricFragment on Rubric {
  id
  nameString
  slug
  level
  variant {
    id
    nameString
  }
  filterAttributes {
    id
    node {
      id
      nameString
      slug
    }
    options {
      id
      slug
      filterNameString
      color
      counter
    }
  }
}
    `;
export const ProductFragmentFragmentDoc = gql`
    fragment ProductFragment on Product {
  id
  itemId
  name {
    key
    value
  }
  nameString
  cardName {
    key
    value
  }
  cardNameString
  slug
  price
  description {
    key
    value
  }
  descriptionString
  assets {
    url
    index
  }
  rubrics
  attributesGroups {
    showInCard
    node {
      id
      nameString
    }
    attributes {
      showInCard
      key
      node {
        id
        slug
        nameString
        variant
        metric {
          id
          nameString
        }
        options {
          id
          nameString
          options {
            id
            nameString
            color
          }
        }
      }
      value
    }
  }
}
    `;
export const ProductSnippetFragmentDoc = gql`
    fragment ProductSnippet on Product {
  id
  itemId
  nameString
  price
  slug
  mainImage
}
    `;
export const CatalogueRubricFragmentFragmentDoc = gql`
    fragment CatalogueRubricFragment on Rubric {
  id
  nameString
  level
  slug
  variant {
    id
    nameString
  }
  filterAttributes {
    id
    node {
      id
      nameString
      slug
    }
    options {
      id
      slug
      filterNameString
      color
      counter
      color
    }
  }
}
    `;
export const SiteConfigFragmentDoc = gql`
    fragment SiteConfig on Config {
  id
  slug
  value
  nameString
  description
  variant
  acceptedFormats
  cities {
    key
    value
    translations {
      key
      value
    }
  }
}
    `;
export const RubricFragmentFragmentDoc = gql`
    fragment RubricFragment on Rubric {
  id
  name {
    key
    value
  }
  nameString
  level
  variant {
    id
    nameString
  }
  totalProductsCount
  activeProductsCount
}
    `;
export const RubricProductFragmentFragmentDoc = gql`
    fragment RubricProductFragment on PaginatedProductsResponse {
  totalDocs
  page
  totalPages
  activeProductsCount
  docs {
    id
    itemId
    name {
      key
      value
    }
    nameString
    price
    slug
    mainImage
    active
    rubrics
  }
}
    `;
export const InitialDocument = gql`
    query Initial {
  me {
    ...SessionUserFragment
  }
  getSessionRole {
    ...SessionRoleFragment
    appNavigation {
      id
      nameString
      icon
      path
      children {
        id
        nameString
        icon
        path
      }
    }
  }
  getClientLanguage
  getAllLanguages {
    id
    name
    nativeName
    key
    isDefault
  }
  getAllConfigs {
    ...SiteConfig
  }
  getAllCities {
    id
    slug
    nameString
  }
}
    ${SessionUserFragmentFragmentDoc}
${SessionRoleFragmentFragmentDoc}
${SiteConfigFragmentDoc}`;

/**
 * __useInitialQuery__
 *
 * To run a query within a React component, call `useInitialQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitialQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitialQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitialQuery(baseOptions?: Apollo.QueryHookOptions<InitialQuery, InitialQueryVariables>) {
        return Apollo.useQuery<InitialQuery, InitialQueryVariables>(InitialDocument, baseOptions);
      }
export function useInitialLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitialQuery, InitialQueryVariables>) {
          return Apollo.useLazyQuery<InitialQuery, InitialQueryVariables>(InitialDocument, baseOptions);
        }
export type InitialQueryHookResult = ReturnType<typeof useInitialQuery>;
export type InitialLazyQueryHookResult = ReturnType<typeof useInitialLazyQuery>;
export type InitialQueryResult = Apollo.QueryResult<InitialQuery, InitialQueryVariables>;
export const InitialSiteQueryDocument = gql`
    query InitialSiteQuery {
  me {
    ...SessionUserFragment
  }
  getSessionRole {
    ...SessionRoleFragment
  }
  getSessionCurrency
  getClientLanguage
  getAllLanguages {
    id
    key
    name
    nativeName
    isDefault
  }
  getAllConfigs {
    ...SiteConfig
  }
  getRubricsTree {
    ...SiteRubricFragment
  }
  getAllCities {
    id
    slug
    nameString
  }
}
    ${SessionUserFragmentFragmentDoc}
${SessionRoleFragmentFragmentDoc}
${SiteConfigFragmentDoc}
${SiteRubricFragmentFragmentDoc}`;

/**
 * __useInitialSiteQueryQuery__
 *
 * To run a query within a React component, call `useInitialSiteQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitialSiteQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitialSiteQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitialSiteQueryQuery(baseOptions?: Apollo.QueryHookOptions<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>) {
        return Apollo.useQuery<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>(InitialSiteQueryDocument, baseOptions);
      }
export function useInitialSiteQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>) {
          return Apollo.useLazyQuery<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>(InitialSiteQueryDocument, baseOptions);
        }
export type InitialSiteQueryQueryHookResult = ReturnType<typeof useInitialSiteQueryQuery>;
export type InitialSiteQueryLazyQueryHookResult = ReturnType<typeof useInitialSiteQueryLazyQuery>;
export type InitialSiteQueryQueryResult = Apollo.QueryResult<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>;
export const SignInDocument = gql`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    success
    message
    user {
      ...SessionUserFragment
    }
  }
}
    ${SessionUserFragmentFragmentDoc}`;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, baseOptions);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = gql`
    mutation SignOut {
  signOut {
    success
    message
  }
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, baseOptions);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
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
        return Apollo.useMutation<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>(CreateAttributesGroupDocument, baseOptions);
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
        return Apollo.useMutation<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>(UpdateAttributesGroupDocument, baseOptions);
      }
export type UpdateAttributesGroupMutationHookResult = ReturnType<typeof useUpdateAttributesGroupMutation>;
export type UpdateAttributesGroupMutationResult = Apollo.MutationResult<UpdateAttributesGroupMutation>;
export type UpdateAttributesGroupMutationOptions = Apollo.BaseMutationOptions<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>;
export const DeleteAttributesGroupDocument = gql`
    mutation DeleteAttributesGroup($id: ID!) {
  deleteAttributesGroup(id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAttributesGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>) {
        return Apollo.useMutation<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>(DeleteAttributesGroupDocument, baseOptions);
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
        return Apollo.useMutation<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>(AddAttributeToGroupDocument, baseOptions);
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
        return Apollo.useMutation<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>(UpdateAttributeInGroupDocument, baseOptions);
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
        return Apollo.useMutation<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>(DeleteAttributeFromGroupDocument, baseOptions);
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
        return Apollo.useMutation<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>(AddAttributesGroupToRubricDocument, baseOptions);
      }
export type AddAttributesGroupToRubricMutationHookResult = ReturnType<typeof useAddAttributesGroupToRubricMutation>;
export type AddAttributesGroupToRubricMutationResult = Apollo.MutationResult<AddAttributesGroupToRubricMutation>;
export type AddAttributesGroupToRubricMutationOptions = Apollo.BaseMutationOptions<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>;
export const UpdateAttributesGroupInRubricDocument = gql`
    mutation UpdateAttributesGroupInRubric($input: UpdateAttributesGroupInRubricInput!) {
  updateAttributesGroupInRubric(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributesGroupInRubricMutationFn = Apollo.MutationFunction<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>;

/**
 * __useUpdateAttributesGroupInRubricMutation__
 *
 * To run a mutation, you first call `useUpdateAttributesGroupInRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributesGroupInRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributesGroupInRubricMutation, { data, loading, error }] = useUpdateAttributesGroupInRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAttributesGroupInRubricMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>) {
        return Apollo.useMutation<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>(UpdateAttributesGroupInRubricDocument, baseOptions);
      }
export type UpdateAttributesGroupInRubricMutationHookResult = ReturnType<typeof useUpdateAttributesGroupInRubricMutation>;
export type UpdateAttributesGroupInRubricMutationResult = Apollo.MutationResult<UpdateAttributesGroupInRubricMutation>;
export type UpdateAttributesGroupInRubricMutationOptions = Apollo.BaseMutationOptions<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>;
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
        return Apollo.useMutation<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>(DeleteAttributesGroupFromRubricDocument, baseOptions);
      }
export type DeleteAttributesGroupFromRubricMutationHookResult = ReturnType<typeof useDeleteAttributesGroupFromRubricMutation>;
export type DeleteAttributesGroupFromRubricMutationResult = Apollo.MutationResult<DeleteAttributesGroupFromRubricMutation>;
export type DeleteAttributesGroupFromRubricMutationOptions = Apollo.BaseMutationOptions<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>;
export const UpdateConfigsDocument = gql`
    mutation UpdateConfigs($input: [UpdateConfigInput!]!) {
  updateConfigs(input: $input) {
    success
    message
  }
}
    `;
export type UpdateConfigsMutationFn = Apollo.MutationFunction<UpdateConfigsMutation, UpdateConfigsMutationVariables>;

/**
 * __useUpdateConfigsMutation__
 *
 * To run a mutation, you first call `useUpdateConfigsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateConfigsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateConfigsMutation, { data, loading, error }] = useUpdateConfigsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateConfigsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateConfigsMutation, UpdateConfigsMutationVariables>) {
        return Apollo.useMutation<UpdateConfigsMutation, UpdateConfigsMutationVariables>(UpdateConfigsDocument, baseOptions);
      }
export type UpdateConfigsMutationHookResult = ReturnType<typeof useUpdateConfigsMutation>;
export type UpdateConfigsMutationResult = Apollo.MutationResult<UpdateConfigsMutation>;
export type UpdateConfigsMutationOptions = Apollo.BaseMutationOptions<UpdateConfigsMutation, UpdateConfigsMutationVariables>;
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
        return Apollo.useMutation<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>(UpdateAssetConfigDocument, baseOptions);
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
        return Apollo.useMutation<CreateLanguageMutation, CreateLanguageMutationVariables>(CreateLanguageDocument, baseOptions);
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
        return Apollo.useMutation<UpdateLanguageMutation, UpdateLanguageMutationVariables>(UpdateLanguageDocument, baseOptions);
      }
export type UpdateLanguageMutationHookResult = ReturnType<typeof useUpdateLanguageMutation>;
export type UpdateLanguageMutationResult = Apollo.MutationResult<UpdateLanguageMutation>;
export type UpdateLanguageMutationOptions = Apollo.BaseMutationOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>;
export const DeleteLanguageDocument = gql`
    mutation DeleteLanguage($id: ID!) {
  deleteLanguage(id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLanguageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLanguageMutation, DeleteLanguageMutationVariables>) {
        return Apollo.useMutation<DeleteLanguageMutation, DeleteLanguageMutationVariables>(DeleteLanguageDocument, baseOptions);
      }
export type DeleteLanguageMutationHookResult = ReturnType<typeof useDeleteLanguageMutation>;
export type DeleteLanguageMutationResult = Apollo.MutationResult<DeleteLanguageMutation>;
export type DeleteLanguageMutationOptions = Apollo.BaseMutationOptions<DeleteLanguageMutation, DeleteLanguageMutationVariables>;
export const SetLanguageAsDefaultDocument = gql`
    mutation SetLanguageAsDefault($id: ID!) {
  setLanguageAsDefault(id: $id) {
    success
    message
  }
}
    `;
export type SetLanguageAsDefaultMutationFn = Apollo.MutationFunction<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>;

/**
 * __useSetLanguageAsDefaultMutation__
 *
 * To run a mutation, you first call `useSetLanguageAsDefaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetLanguageAsDefaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setLanguageAsDefaultMutation, { data, loading, error }] = useSetLanguageAsDefaultMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSetLanguageAsDefaultMutation(baseOptions?: Apollo.MutationHookOptions<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>) {
        return Apollo.useMutation<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>(SetLanguageAsDefaultDocument, baseOptions);
      }
export type SetLanguageAsDefaultMutationHookResult = ReturnType<typeof useSetLanguageAsDefaultMutation>;
export type SetLanguageAsDefaultMutationResult = Apollo.MutationResult<SetLanguageAsDefaultMutation>;
export type SetLanguageAsDefaultMutationOptions = Apollo.BaseMutationOptions<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>;
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
        return Apollo.useMutation<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>(CreateOptionsGroupDocument, baseOptions);
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
        return Apollo.useMutation<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>(UpdateOptionsGroupDocument, baseOptions);
      }
export type UpdateOptionsGroupMutationHookResult = ReturnType<typeof useUpdateOptionsGroupMutation>;
export type UpdateOptionsGroupMutationResult = Apollo.MutationResult<UpdateOptionsGroupMutation>;
export type UpdateOptionsGroupMutationOptions = Apollo.BaseMutationOptions<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>;
export const DeleteOptionsGroupDocument = gql`
    mutation DeleteOptionsGroup($id: ID!) {
  deleteOptionsGroup(id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOptionsGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>) {
        return Apollo.useMutation<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>(DeleteOptionsGroupDocument, baseOptions);
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
        return Apollo.useMutation<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>(AddOptionToGroupDocument, baseOptions);
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
        return Apollo.useMutation<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>(UpdateOptionInGroupDocument, baseOptions);
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
        return Apollo.useMutation<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>(DeleteOptionFromGroupDocument, baseOptions);
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
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, baseOptions);
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
        return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, baseOptions);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($id: ID!) {
  deleteRole(id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>) {
        return Apollo.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, baseOptions);
      }
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>;
export type DeleteRoleMutationResult = Apollo.MutationResult<DeleteRoleMutation>;
export type DeleteRoleMutationOptions = Apollo.BaseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const SetRoleOperationPermissionDocument = gql`
    mutation SetRoleOperationPermission($input: SetRoleOperationPermissionInput!) {
  setRoleOperationPermission(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleOperationPermissionMutationFn = Apollo.MutationFunction<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>;

/**
 * __useSetRoleOperationPermissionMutation__
 *
 * To run a mutation, you first call `useSetRoleOperationPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRoleOperationPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRoleOperationPermissionMutation, { data, loading, error }] = useSetRoleOperationPermissionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetRoleOperationPermissionMutation(baseOptions?: Apollo.MutationHookOptions<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>) {
        return Apollo.useMutation<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>(SetRoleOperationPermissionDocument, baseOptions);
      }
export type SetRoleOperationPermissionMutationHookResult = ReturnType<typeof useSetRoleOperationPermissionMutation>;
export type SetRoleOperationPermissionMutationResult = Apollo.MutationResult<SetRoleOperationPermissionMutation>;
export type SetRoleOperationPermissionMutationOptions = Apollo.BaseMutationOptions<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>;
export const SetRoleOperationCustomFilterDocument = gql`
    mutation SetRoleOperationCustomFilter($input: SetRoleOperationCustomFilterInput!) {
  setRoleOperationCustomFilter(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleOperationCustomFilterMutationFn = Apollo.MutationFunction<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>;

/**
 * __useSetRoleOperationCustomFilterMutation__
 *
 * To run a mutation, you first call `useSetRoleOperationCustomFilterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRoleOperationCustomFilterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRoleOperationCustomFilterMutation, { data, loading, error }] = useSetRoleOperationCustomFilterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetRoleOperationCustomFilterMutation(baseOptions?: Apollo.MutationHookOptions<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>) {
        return Apollo.useMutation<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>(SetRoleOperationCustomFilterDocument, baseOptions);
      }
export type SetRoleOperationCustomFilterMutationHookResult = ReturnType<typeof useSetRoleOperationCustomFilterMutation>;
export type SetRoleOperationCustomFilterMutationResult = Apollo.MutationResult<SetRoleOperationCustomFilterMutation>;
export type SetRoleOperationCustomFilterMutationOptions = Apollo.BaseMutationOptions<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>;
export const SetRoleRuleRestrictedFieldDocument = gql`
    mutation SetRoleRuleRestrictedField($input: SetRoleRuleRestrictedFieldInput!) {
  setRoleRuleRestrictedField(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleRuleRestrictedFieldMutationFn = Apollo.MutationFunction<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>;

/**
 * __useSetRoleRuleRestrictedFieldMutation__
 *
 * To run a mutation, you first call `useSetRoleRuleRestrictedFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRoleRuleRestrictedFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRoleRuleRestrictedFieldMutation, { data, loading, error }] = useSetRoleRuleRestrictedFieldMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetRoleRuleRestrictedFieldMutation(baseOptions?: Apollo.MutationHookOptions<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>) {
        return Apollo.useMutation<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>(SetRoleRuleRestrictedFieldDocument, baseOptions);
      }
export type SetRoleRuleRestrictedFieldMutationHookResult = ReturnType<typeof useSetRoleRuleRestrictedFieldMutation>;
export type SetRoleRuleRestrictedFieldMutationResult = Apollo.MutationResult<SetRoleRuleRestrictedFieldMutation>;
export type SetRoleRuleRestrictedFieldMutationOptions = Apollo.BaseMutationOptions<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>;
export const SetRoleAllowedNavItemDocument = gql`
    mutation SetRoleAllowedNavItem($input: SetRoleAllowedNavItemInput!) {
  setRoleAllowedNavItem(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleAllowedNavItemMutationFn = Apollo.MutationFunction<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>;

/**
 * __useSetRoleAllowedNavItemMutation__
 *
 * To run a mutation, you first call `useSetRoleAllowedNavItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRoleAllowedNavItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRoleAllowedNavItemMutation, { data, loading, error }] = useSetRoleAllowedNavItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetRoleAllowedNavItemMutation(baseOptions?: Apollo.MutationHookOptions<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>) {
        return Apollo.useMutation<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>(SetRoleAllowedNavItemDocument, baseOptions);
      }
export type SetRoleAllowedNavItemMutationHookResult = ReturnType<typeof useSetRoleAllowedNavItemMutation>;
export type SetRoleAllowedNavItemMutationResult = Apollo.MutationResult<SetRoleAllowedNavItemMutation>;
export type SetRoleAllowedNavItemMutationOptions = Apollo.BaseMutationOptions<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>;
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
        return Apollo.useMutation<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>(CreateRubricVariantDocument, baseOptions);
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
        return Apollo.useMutation<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>(UpdateRubricVariantDocument, baseOptions);
      }
export type UpdateRubricVariantMutationHookResult = ReturnType<typeof useUpdateRubricVariantMutation>;
export type UpdateRubricVariantMutationResult = Apollo.MutationResult<UpdateRubricVariantMutation>;
export type UpdateRubricVariantMutationOptions = Apollo.BaseMutationOptions<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>;
export const DeleteRubricVariantDocument = gql`
    mutation DeleteRubricVariant($id: ID!) {
  deleteRubricVariant(id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRubricVariantMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>) {
        return Apollo.useMutation<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>(DeleteRubricVariantDocument, baseOptions);
      }
export type DeleteRubricVariantMutationHookResult = ReturnType<typeof useDeleteRubricVariantMutation>;
export type DeleteRubricVariantMutationResult = Apollo.MutationResult<DeleteRubricVariantMutation>;
export type DeleteRubricVariantMutationOptions = Apollo.BaseMutationOptions<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>;
export const UpdateMyProfileDocument = gql`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
  updateMyProfile(input: $input) {
    success
    message
    user {
      ...SessionUserFragment
    }
  }
}
    ${SessionUserFragmentFragmentDoc}`;
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
        return Apollo.useMutation<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>(UpdateMyProfileDocument, baseOptions);
      }
export type UpdateMyProfileMutationHookResult = ReturnType<typeof useUpdateMyProfileMutation>;
export type UpdateMyProfileMutationResult = Apollo.MutationResult<UpdateMyProfileMutation>;
export type UpdateMyProfileMutationOptions = Apollo.BaseMutationOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const UpdateMyPasswordDocument = gql`
    mutation UpdateMyPassword($input: UpdateMyPasswordInput!) {
  updateMyPassword(input: $input) {
    success
    message
    user {
      ...SessionUserFragment
    }
  }
}
    ${SessionUserFragmentFragmentDoc}`;
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
        return Apollo.useMutation<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>(UpdateMyPasswordDocument, baseOptions);
      }
export type UpdateMyPasswordMutationHookResult = ReturnType<typeof useUpdateMyPasswordMutation>;
export type UpdateMyPasswordMutationResult = Apollo.MutationResult<UpdateMyPasswordMutation>;
export type UpdateMyPasswordMutationOptions = Apollo.BaseMutationOptions<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>;
export const GetProductDocument = gql`
    query GetProduct($id: ID!) {
  getProduct(id: $id) {
    ...ProductFragment
  }
}
    ${ProductFragmentFragmentDoc}`;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions?: Apollo.QueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
        return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, baseOptions);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, baseOptions);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    success
    message
    product {
      ...ProductFragment
    }
  }
}
    ${ProductFragmentFragmentDoc}`;
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
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, baseOptions);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
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
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, baseOptions);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    success
    message
  }
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, baseOptions);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const GetAllAttributesGroupsDocument = gql`
    query GetAllAttributesGroups {
  getAllAttributesGroups {
    id
    nameString
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
        return Apollo.useQuery<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>(GetAllAttributesGroupsDocument, baseOptions);
      }
export function useGetAllAttributesGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>(GetAllAttributesGroupsDocument, baseOptions);
        }
export type GetAllAttributesGroupsQueryHookResult = ReturnType<typeof useGetAllAttributesGroupsQuery>;
export type GetAllAttributesGroupsLazyQueryHookResult = ReturnType<typeof useGetAllAttributesGroupsLazyQuery>;
export type GetAllAttributesGroupsQueryResult = Apollo.QueryResult<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>;
export const GetAttributesGroupDocument = gql`
    query GetAttributesGroup($id: ID!) {
  getAttributesGroup(id: $id) {
    id
    name {
      key
      value
    }
    nameString
    attributes {
      id
      name {
        key
        value
      }
      nameString
      variant
      positioningInTitle {
        key
        value
      }
      options {
        id
        nameString
      }
      metric {
        id
        nameString
      }
    }
  }
}
    `;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAttributesGroupQuery(baseOptions?: Apollo.QueryHookOptions<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>) {
        return Apollo.useQuery<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>(GetAttributesGroupDocument, baseOptions);
      }
export function useGetAttributesGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>) {
          return Apollo.useLazyQuery<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>(GetAttributesGroupDocument, baseOptions);
        }
export type GetAttributesGroupQueryHookResult = ReturnType<typeof useGetAttributesGroupQuery>;
export type GetAttributesGroupLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupLazyQuery>;
export type GetAttributesGroupQueryResult = Apollo.QueryResult<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>;
export const GetAttributesGroupsForRubricDocument = gql`
    query GetAttributesGroupsForRubric($exclude: [ID!]) {
  getAllAttributesGroups(exclude: $exclude) {
    id
    nameString
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
 *      exclude: // value for 'exclude'
 *   },
 * });
 */
export function useGetAttributesGroupsForRubricQuery(baseOptions?: Apollo.QueryHookOptions<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>) {
        return Apollo.useQuery<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>(GetAttributesGroupsForRubricDocument, baseOptions);
      }
export function useGetAttributesGroupsForRubricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>) {
          return Apollo.useLazyQuery<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>(GetAttributesGroupsForRubricDocument, baseOptions);
        }
export type GetAttributesGroupsForRubricQueryHookResult = ReturnType<typeof useGetAttributesGroupsForRubricQuery>;
export type GetAttributesGroupsForRubricLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupsForRubricLazyQuery>;
export type GetAttributesGroupsForRubricQueryResult = Apollo.QueryResult<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>;
export const GetCatalogueCardQueryDocument = gql`
    query GetCatalogueCardQuery($slug: String!) {
  getProductCard(slug: $slug) {
    id
    itemId
    nameString
    cardNameString
    price
    slug
    mainImage
    descriptionString
    attributesGroups {
      showInCard
      node {
        id
        nameString
      }
      attributes {
        showInCard
        node {
          id
          nameString
          options {
            id
            nameString
            options {
              id
              nameString
            }
          }
        }
        value
      }
    }
  }
}
    `;

/**
 * __useGetCatalogueCardQueryQuery__
 *
 * To run a query within a React component, call `useGetCatalogueCardQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogueCardQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogueCardQueryQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCatalogueCardQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>) {
        return Apollo.useQuery<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>(GetCatalogueCardQueryDocument, baseOptions);
      }
export function useGetCatalogueCardQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>) {
          return Apollo.useLazyQuery<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>(GetCatalogueCardQueryDocument, baseOptions);
        }
export type GetCatalogueCardQueryQueryHookResult = ReturnType<typeof useGetCatalogueCardQueryQuery>;
export type GetCatalogueCardQueryLazyQueryHookResult = ReturnType<typeof useGetCatalogueCardQueryLazyQuery>;
export type GetCatalogueCardQueryQueryResult = Apollo.QueryResult<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>;
export const GetCatalogueRubricDocument = gql`
    query GetCatalogueRubric($catalogueFilter: [String!]!) {
  getCatalogueData(catalogueFilter: $catalogueFilter) {
    catalogueTitle
    rubric {
      ...CatalogueRubricFragment
    }
    products {
      totalDocs
      page
      totalPages
      docs {
        ...ProductSnippet
      }
    }
  }
}
    ${CatalogueRubricFragmentFragmentDoc}
${ProductSnippetFragmentDoc}`;

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
 *      catalogueFilter: // value for 'catalogueFilter'
 *   },
 * });
 */
export function useGetCatalogueRubricQuery(baseOptions?: Apollo.QueryHookOptions<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>) {
        return Apollo.useQuery<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>(GetCatalogueRubricDocument, baseOptions);
      }
export function useGetCatalogueRubricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>) {
          return Apollo.useLazyQuery<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>(GetCatalogueRubricDocument, baseOptions);
        }
export type GetCatalogueRubricQueryHookResult = ReturnType<typeof useGetCatalogueRubricQuery>;
export type GetCatalogueRubricLazyQueryHookResult = ReturnType<typeof useGetCatalogueRubricLazyQuery>;
export type GetCatalogueRubricQueryResult = Apollo.QueryResult<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>;
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
        return Apollo.useQuery<GetAllConfigsQuery, GetAllConfigsQueryVariables>(GetAllConfigsDocument, baseOptions);
      }
export function useGetAllConfigsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllConfigsQuery, GetAllConfigsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllConfigsQuery, GetAllConfigsQueryVariables>(GetAllConfigsDocument, baseOptions);
        }
export type GetAllConfigsQueryHookResult = ReturnType<typeof useGetAllConfigsQuery>;
export type GetAllConfigsLazyQueryHookResult = ReturnType<typeof useGetAllConfigsLazyQuery>;
export type GetAllConfigsQueryResult = Apollo.QueryResult<GetAllConfigsQuery, GetAllConfigsQueryVariables>;
export const GetAllLanguagesDocument = gql`
    query GetAllLanguages {
  getAllLanguages {
    id
    name
    key
    isDefault
    nativeName
  }
}
    `;

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
        return Apollo.useQuery<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>(GetAllLanguagesDocument, baseOptions);
      }
export function useGetAllLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>) {
          return Apollo.useLazyQuery<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>(GetAllLanguagesDocument, baseOptions);
        }
export type GetAllLanguagesQueryHookResult = ReturnType<typeof useGetAllLanguagesQuery>;
export type GetAllLanguagesLazyQueryHookResult = ReturnType<typeof useGetAllLanguagesLazyQuery>;
export type GetAllLanguagesQueryResult = Apollo.QueryResult<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>;
export const GetMessagesByKeysDocument = gql`
    query GetMessagesByKeys($keys: [String!]!) {
  getMessagesByKeys(keys: $keys) {
    key
    message {
      key
      value
    }
  }
}
    `;

/**
 * __useGetMessagesByKeysQuery__
 *
 * To run a query within a React component, call `useGetMessagesByKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByKeysQuery({
 *   variables: {
 *      keys: // value for 'keys'
 *   },
 * });
 */
export function useGetMessagesByKeysQuery(baseOptions?: Apollo.QueryHookOptions<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>) {
        return Apollo.useQuery<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>(GetMessagesByKeysDocument, baseOptions);
      }
export function useGetMessagesByKeysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>) {
          return Apollo.useLazyQuery<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>(GetMessagesByKeysDocument, baseOptions);
        }
export type GetMessagesByKeysQueryHookResult = ReturnType<typeof useGetMessagesByKeysQuery>;
export type GetMessagesByKeysLazyQueryHookResult = ReturnType<typeof useGetMessagesByKeysLazyQuery>;
export type GetMessagesByKeysQueryResult = Apollo.QueryResult<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>;
export const GetValidationMessagesDocument = gql`
    query GetValidationMessages {
  getValidationMessages {
    key
    message {
      key
      value
    }
  }
}
    `;

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
        return Apollo.useQuery<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>(GetValidationMessagesDocument, baseOptions);
      }
export function useGetValidationMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>) {
          return Apollo.useLazyQuery<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>(GetValidationMessagesDocument, baseOptions);
        }
export type GetValidationMessagesQueryHookResult = ReturnType<typeof useGetValidationMessagesQuery>;
export type GetValidationMessagesLazyQueryHookResult = ReturnType<typeof useGetValidationMessagesLazyQuery>;
export type GetValidationMessagesQueryResult = Apollo.QueryResult<GetValidationMessagesQuery, GetValidationMessagesQueryVariables>;
export const GetAllOptionsGroupsDocument = gql`
    query GetAllOptionsGroups {
  getAllOptionsGroups {
    id
    nameString
    options {
      id
    }
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
 *   },
 * });
 */
export function useGetAllOptionsGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>) {
        return Apollo.useQuery<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>(GetAllOptionsGroupsDocument, baseOptions);
      }
export function useGetAllOptionsGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>(GetAllOptionsGroupsDocument, baseOptions);
        }
export type GetAllOptionsGroupsQueryHookResult = ReturnType<typeof useGetAllOptionsGroupsQuery>;
export type GetAllOptionsGroupsLazyQueryHookResult = ReturnType<typeof useGetAllOptionsGroupsLazyQuery>;
export type GetAllOptionsGroupsQueryResult = Apollo.QueryResult<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>;
export const GetOptionsGroupDocument = gql`
    query GetOptionsGroup($id: ID!) {
  getOptionsGroup(id: $id) {
    id
    name {
      key
      value
    }
    nameString
    options {
      id
      name {
        key
        value
      }
      nameString
      color
      gender
      variants {
        key
        value {
          key
          value
        }
      }
    }
  }
}
    `;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOptionsGroupQuery(baseOptions?: Apollo.QueryHookOptions<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>) {
        return Apollo.useQuery<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>(GetOptionsGroupDocument, baseOptions);
      }
export function useGetOptionsGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>) {
          return Apollo.useLazyQuery<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>(GetOptionsGroupDocument, baseOptions);
        }
export type GetOptionsGroupQueryHookResult = ReturnType<typeof useGetOptionsGroupQuery>;
export type GetOptionsGroupLazyQueryHookResult = ReturnType<typeof useGetOptionsGroupLazyQuery>;
export type GetOptionsGroupQueryResult = Apollo.QueryResult<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>;
export const GetAllRolesDocument = gql`
    query GetAllRoles {
  getAllRoles {
    id
    nameString
  }
}
    `;

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
        return Apollo.useQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, baseOptions);
      }
export function useGetAllRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
          return Apollo.useLazyQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, baseOptions);
        }
export type GetAllRolesQueryHookResult = ReturnType<typeof useGetAllRolesQuery>;
export type GetAllRolesLazyQueryHookResult = ReturnType<typeof useGetAllRolesLazyQuery>;
export type GetAllRolesQueryResult = Apollo.QueryResult<GetAllRolesQuery, GetAllRolesQueryVariables>;
export const GetRoleDocument = gql`
    query GetRole($id: ID!) {
  getRole(id: $id) {
    id
    nameString
    allowedAppNavigation
    description
    isStuff
    name {
      key
      value
    }
    rules {
      id
      entity
      nameString
      nameString
      restrictedFields
      operations {
        id
        allow
        customFilter
        operationType
      }
    }
  }
}
    `;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRoleQuery(baseOptions?: Apollo.QueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
        return Apollo.useQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, baseOptions);
      }
export function useGetRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
          return Apollo.useLazyQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, baseOptions);
        }
export type GetRoleQueryHookResult = ReturnType<typeof useGetRoleQuery>;
export type GetRoleLazyQueryHookResult = ReturnType<typeof useGetRoleLazyQuery>;
export type GetRoleQueryResult = Apollo.QueryResult<GetRoleQuery, GetRoleQueryVariables>;
export const GetEntityFieldsDocument = gql`
    query GetEntityFields($entity: String!) {
  getEntityFields(entity: $entity)
}
    `;

/**
 * __useGetEntityFieldsQuery__
 *
 * To run a query within a React component, call `useGetEntityFieldsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityFieldsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityFieldsQuery({
 *   variables: {
 *      entity: // value for 'entity'
 *   },
 * });
 */
export function useGetEntityFieldsQuery(baseOptions?: Apollo.QueryHookOptions<GetEntityFieldsQuery, GetEntityFieldsQueryVariables>) {
        return Apollo.useQuery<GetEntityFieldsQuery, GetEntityFieldsQueryVariables>(GetEntityFieldsDocument, baseOptions);
      }
export function useGetEntityFieldsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEntityFieldsQuery, GetEntityFieldsQueryVariables>) {
          return Apollo.useLazyQuery<GetEntityFieldsQuery, GetEntityFieldsQueryVariables>(GetEntityFieldsDocument, baseOptions);
        }
export type GetEntityFieldsQueryHookResult = ReturnType<typeof useGetEntityFieldsQuery>;
export type GetEntityFieldsLazyQueryHookResult = ReturnType<typeof useGetEntityFieldsLazyQuery>;
export type GetEntityFieldsQueryResult = Apollo.QueryResult<GetEntityFieldsQuery, GetEntityFieldsQueryVariables>;
export const GetAllAppNavItemsDocument = gql`
    query GetAllAppNavItems {
  getAllAppNavItems {
    id
    nameString
    path
    children {
      id
      nameString
      path
    }
  }
}
    `;

/**
 * __useGetAllAppNavItemsQuery__
 *
 * To run a query within a React component, call `useGetAllAppNavItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAppNavItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAppNavItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllAppNavItemsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllAppNavItemsQuery, GetAllAppNavItemsQueryVariables>) {
        return Apollo.useQuery<GetAllAppNavItemsQuery, GetAllAppNavItemsQueryVariables>(GetAllAppNavItemsDocument, baseOptions);
      }
export function useGetAllAppNavItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAppNavItemsQuery, GetAllAppNavItemsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllAppNavItemsQuery, GetAllAppNavItemsQueryVariables>(GetAllAppNavItemsDocument, baseOptions);
        }
export type GetAllAppNavItemsQueryHookResult = ReturnType<typeof useGetAllAppNavItemsQuery>;
export type GetAllAppNavItemsLazyQueryHookResult = ReturnType<typeof useGetAllAppNavItemsLazyQuery>;
export type GetAllAppNavItemsQueryResult = Apollo.QueryResult<GetAllAppNavItemsQuery, GetAllAppNavItemsQueryVariables>;
export const GetAllRubricVariantsDocument = gql`
    query GetAllRubricVariants {
  getAllRubricVariants {
    id
    nameString
    name {
      key
      value
    }
  }
  getGenderOptions {
    id
    nameString
  }
}
    `;

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
        return Apollo.useQuery<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>(GetAllRubricVariantsDocument, baseOptions);
      }
export function useGetAllRubricVariantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>(GetAllRubricVariantsDocument, baseOptions);
        }
export type GetAllRubricVariantsQueryHookResult = ReturnType<typeof useGetAllRubricVariantsQuery>;
export type GetAllRubricVariantsLazyQueryHookResult = ReturnType<typeof useGetAllRubricVariantsLazyQuery>;
export type GetAllRubricVariantsQueryResult = Apollo.QueryResult<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>;
export const GetCatalogueSearchTopItemsDocument = gql`
    query GetCatalogueSearchTopItems {
  getCatalogueSearchTopItems {
    rubrics {
      ...CatalogueRubricFragment
    }
    products {
      ...ProductSnippet
    }
  }
}
    ${CatalogueRubricFragmentFragmentDoc}
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
        return Apollo.useQuery<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>(GetCatalogueSearchTopItemsDocument, baseOptions);
      }
export function useGetCatalogueSearchTopItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>) {
          return Apollo.useLazyQuery<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>(GetCatalogueSearchTopItemsDocument, baseOptions);
        }
export type GetCatalogueSearchTopItemsQueryHookResult = ReturnType<typeof useGetCatalogueSearchTopItemsQuery>;
export type GetCatalogueSearchTopItemsLazyQueryHookResult = ReturnType<typeof useGetCatalogueSearchTopItemsLazyQuery>;
export type GetCatalogueSearchTopItemsQueryResult = Apollo.QueryResult<GetCatalogueSearchTopItemsQuery, GetCatalogueSearchTopItemsQueryVariables>;
export const GetCatalogueSearchResultDocument = gql`
    query GetCatalogueSearchResult($search: String!) {
  getCatalogueSearchResult(search: $search) {
    rubrics {
      ...CatalogueRubricFragment
    }
    products {
      ...ProductSnippet
    }
  }
}
    ${CatalogueRubricFragmentFragmentDoc}
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
export function useGetCatalogueSearchResultQuery(baseOptions?: Apollo.QueryHookOptions<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>) {
        return Apollo.useQuery<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>(GetCatalogueSearchResultDocument, baseOptions);
      }
export function useGetCatalogueSearchResultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>) {
          return Apollo.useLazyQuery<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>(GetCatalogueSearchResultDocument, baseOptions);
        }
export type GetCatalogueSearchResultQueryHookResult = ReturnType<typeof useGetCatalogueSearchResultQuery>;
export type GetCatalogueSearchResultLazyQueryHookResult = ReturnType<typeof useGetCatalogueSearchResultLazyQuery>;
export type GetCatalogueSearchResultQueryResult = Apollo.QueryResult<GetCatalogueSearchResultQuery, GetCatalogueSearchResultQueryVariables>;
export const GetGenderOptionsDocument = gql`
    query GetGenderOptions {
  getGenderOptions {
    id
    nameString
  }
}
    `;

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
        return Apollo.useQuery<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>(GetGenderOptionsDocument, baseOptions);
      }
export function useGetGenderOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>) {
          return Apollo.useLazyQuery<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>(GetGenderOptionsDocument, baseOptions);
        }
export type GetGenderOptionsQueryHookResult = ReturnType<typeof useGetGenderOptionsQuery>;
export type GetGenderOptionsLazyQueryHookResult = ReturnType<typeof useGetGenderOptionsLazyQuery>;
export type GetGenderOptionsQueryResult = Apollo.QueryResult<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>;
export const GetIsoLanguagesListDocument = gql`
    query GetISOLanguagesList {
  getISOLanguagesList {
    id
    nameString
    nativeName
  }
}
    `;

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
        return Apollo.useQuery<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>(GetIsoLanguagesListDocument, baseOptions);
      }
export function useGetIsoLanguagesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>) {
          return Apollo.useLazyQuery<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>(GetIsoLanguagesListDocument, baseOptions);
        }
export type GetIsoLanguagesListQueryHookResult = ReturnType<typeof useGetIsoLanguagesListQuery>;
export type GetIsoLanguagesListLazyQueryHookResult = ReturnType<typeof useGetIsoLanguagesListLazyQuery>;
export type GetIsoLanguagesListQueryResult = Apollo.QueryResult<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>;
export const GetNewAttributeOptionsDocument = gql`
    query GetNewAttributeOptions {
  getAllOptionsGroups {
    id
    nameString
  }
  getAllMetrics {
    id
    nameString
  }
  getAttributeVariants {
    id
    nameString
  }
  getAttributePositioningOptions {
    id
    nameString
  }
}
    `;

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
        return Apollo.useQuery<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>(GetNewAttributeOptionsDocument, baseOptions);
      }
export function useGetNewAttributeOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>) {
          return Apollo.useLazyQuery<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>(GetNewAttributeOptionsDocument, baseOptions);
        }
export type GetNewAttributeOptionsQueryHookResult = ReturnType<typeof useGetNewAttributeOptionsQuery>;
export type GetNewAttributeOptionsLazyQueryHookResult = ReturnType<typeof useGetNewAttributeOptionsLazyQuery>;
export type GetNewAttributeOptionsQueryResult = Apollo.QueryResult<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>;
export const GetFeaturesAstDocument = gql`
    query GetFeaturesAST($selectedRubrics: [ID!]!) {
  getFeaturesAst(selectedRubrics: $selectedRubrics) {
    id
    nameString
    attributes {
      id
      slug
      nameString
      variant
      metric {
        id
        nameString
      }
      options {
        id
        nameString
        options {
          id
          slug
          nameString
          color
        }
      }
    }
  }
}
    `;

/**
 * __useGetFeaturesAstQuery__
 *
 * To run a query within a React component, call `useGetFeaturesAstQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturesAstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturesAstQuery({
 *   variables: {
 *      selectedRubrics: // value for 'selectedRubrics'
 *   },
 * });
 */
export function useGetFeaturesAstQuery(baseOptions?: Apollo.QueryHookOptions<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>) {
        return Apollo.useQuery<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>(GetFeaturesAstDocument, baseOptions);
      }
export function useGetFeaturesAstLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>) {
          return Apollo.useLazyQuery<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>(GetFeaturesAstDocument, baseOptions);
        }
export type GetFeaturesAstQueryHookResult = ReturnType<typeof useGetFeaturesAstQuery>;
export type GetFeaturesAstLazyQueryHookResult = ReturnType<typeof useGetFeaturesAstLazyQuery>;
export type GetFeaturesAstQueryResult = Apollo.QueryResult<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>;
export const GetRubricsTreeDocument = gql`
    query GetRubricsTree($excluded: [ID!], $counters: ProductsCountersInput!) {
  getRubricsTree(excluded: $excluded) {
    ...RubricFragment
    children(excluded: $excluded) {
      ...RubricFragment
      children(excluded: $excluded) {
        ...RubricFragment
      }
    }
  }
  getProductsCounters(input: $counters) {
    totalProductsCount
    activeProductsCount
  }
}
    ${RubricFragmentFragmentDoc}`;

/**
 * __useGetRubricsTreeQuery__
 *
 * To run a query within a React component, call `useGetRubricsTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubricsTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubricsTreeQuery({
 *   variables: {
 *      excluded: // value for 'excluded'
 *      counters: // value for 'counters'
 *   },
 * });
 */
export function useGetRubricsTreeQuery(baseOptions?: Apollo.QueryHookOptions<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>) {
        return Apollo.useQuery<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>(GetRubricsTreeDocument, baseOptions);
      }
export function useGetRubricsTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>) {
          return Apollo.useLazyQuery<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>(GetRubricsTreeDocument, baseOptions);
        }
export type GetRubricsTreeQueryHookResult = ReturnType<typeof useGetRubricsTreeQuery>;
export type GetRubricsTreeLazyQueryHookResult = ReturnType<typeof useGetRubricsTreeLazyQuery>;
export type GetRubricsTreeQueryResult = Apollo.QueryResult<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>;
export const GetRubricDocument = gql`
    query GetRubric($id: ID!) {
  getRubric(id: $id) {
    ...RubricFragment
    catalogueTitle {
      defaultTitle {
        key
        value
      }
      prefix {
        key
        value
      }
      keyword {
        key
        value
      }
      gender
    }
  }
}
    ${RubricFragmentFragmentDoc}`;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRubricQuery(baseOptions?: Apollo.QueryHookOptions<GetRubricQuery, GetRubricQueryVariables>) {
        return Apollo.useQuery<GetRubricQuery, GetRubricQueryVariables>(GetRubricDocument, baseOptions);
      }
export function useGetRubricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricQuery, GetRubricQueryVariables>) {
          return Apollo.useLazyQuery<GetRubricQuery, GetRubricQueryVariables>(GetRubricDocument, baseOptions);
        }
export type GetRubricQueryHookResult = ReturnType<typeof useGetRubricQuery>;
export type GetRubricLazyQueryHookResult = ReturnType<typeof useGetRubricLazyQuery>;
export type GetRubricQueryResult = Apollo.QueryResult<GetRubricQuery, GetRubricQueryVariables>;
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
        return Apollo.useMutation<CreateRubricMutation, CreateRubricMutationVariables>(CreateRubricDocument, baseOptions);
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
        return Apollo.useMutation<UpdateRubricMutation, UpdateRubricMutationVariables>(UpdateRubricDocument, baseOptions);
      }
export type UpdateRubricMutationHookResult = ReturnType<typeof useUpdateRubricMutation>;
export type UpdateRubricMutationResult = Apollo.MutationResult<UpdateRubricMutation>;
export type UpdateRubricMutationOptions = Apollo.BaseMutationOptions<UpdateRubricMutation, UpdateRubricMutationVariables>;
export const DeleteRubricDocument = gql`
    mutation DeleteRubric($id: ID!) {
  deleteRubric(id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRubricMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRubricMutation, DeleteRubricMutationVariables>) {
        return Apollo.useMutation<DeleteRubricMutation, DeleteRubricMutationVariables>(DeleteRubricDocument, baseOptions);
      }
export type DeleteRubricMutationHookResult = ReturnType<typeof useDeleteRubricMutation>;
export type DeleteRubricMutationResult = Apollo.MutationResult<DeleteRubricMutation>;
export type DeleteRubricMutationOptions = Apollo.BaseMutationOptions<DeleteRubricMutation, DeleteRubricMutationVariables>;
export const GetRubricProductsDocument = gql`
    query GetRubricProducts($id: ID!, $notInRubric: ID) {
  getRubric(id: $id) {
    id
    products(input: {notInRubric: $notInRubric}) {
      ...RubricProductFragment
    }
  }
}
    ${RubricProductFragmentFragmentDoc}`;

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
 *      id: // value for 'id'
 *      notInRubric: // value for 'notInRubric'
 *   },
 * });
 */
export function useGetRubricProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetRubricProductsQuery, GetRubricProductsQueryVariables>) {
        return Apollo.useQuery<GetRubricProductsQuery, GetRubricProductsQueryVariables>(GetRubricProductsDocument, baseOptions);
      }
export function useGetRubricProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricProductsQuery, GetRubricProductsQueryVariables>) {
          return Apollo.useLazyQuery<GetRubricProductsQuery, GetRubricProductsQueryVariables>(GetRubricProductsDocument, baseOptions);
        }
export type GetRubricProductsQueryHookResult = ReturnType<typeof useGetRubricProductsQuery>;
export type GetRubricProductsLazyQueryHookResult = ReturnType<typeof useGetRubricProductsLazyQuery>;
export type GetRubricProductsQueryResult = Apollo.QueryResult<GetRubricProductsQuery, GetRubricProductsQueryVariables>;
export const GetNonRubricProductsDocument = gql`
    query GetNonRubricProducts($input: ProductPaginateInput!) {
  getAllProducts(input: $input) {
    ...RubricProductFragment
  }
}
    ${RubricProductFragmentFragmentDoc}`;

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
export function useGetNonRubricProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>) {
        return Apollo.useQuery<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>(GetNonRubricProductsDocument, baseOptions);
      }
export function useGetNonRubricProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>) {
          return Apollo.useLazyQuery<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>(GetNonRubricProductsDocument, baseOptions);
        }
export type GetNonRubricProductsQueryHookResult = ReturnType<typeof useGetNonRubricProductsQuery>;
export type GetNonRubricProductsLazyQueryHookResult = ReturnType<typeof useGetNonRubricProductsLazyQuery>;
export type GetNonRubricProductsQueryResult = Apollo.QueryResult<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>;
export const AddProductTuRubricDocument = gql`
    mutation AddProductTuRubric($input: AddProductToRubricInput!) {
  addProductToRubric(input: $input) {
    success
    message
  }
}
    `;
export type AddProductTuRubricMutationFn = Apollo.MutationFunction<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>;

/**
 * __useAddProductTuRubricMutation__
 *
 * To run a mutation, you first call `useAddProductTuRubricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductTuRubricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductTuRubricMutation, { data, loading, error }] = useAddProductTuRubricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProductTuRubricMutation(baseOptions?: Apollo.MutationHookOptions<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>) {
        return Apollo.useMutation<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>(AddProductTuRubricDocument, baseOptions);
      }
export type AddProductTuRubricMutationHookResult = ReturnType<typeof useAddProductTuRubricMutation>;
export type AddProductTuRubricMutationResult = Apollo.MutationResult<AddProductTuRubricMutation>;
export type AddProductTuRubricMutationOptions = Apollo.BaseMutationOptions<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>;
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
        return Apollo.useMutation<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>(DeleteProductFromRubricDocument, baseOptions);
      }
export type DeleteProductFromRubricMutationHookResult = ReturnType<typeof useDeleteProductFromRubricMutation>;
export type DeleteProductFromRubricMutationResult = Apollo.MutationResult<DeleteProductFromRubricMutation>;
export type DeleteProductFromRubricMutationOptions = Apollo.BaseMutationOptions<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>;
export const GetAllProductsDocument = gql`
    query GetAllProducts($input: ProductPaginateInput!) {
  getAllProducts(input: $input) {
    ...RubricProductFragment
  }
}
    ${RubricProductFragmentFragmentDoc}`;

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
export function useGetAllProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
        return Apollo.useQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, baseOptions);
      }
export function useGetAllProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, baseOptions);
        }
export type GetAllProductsQueryHookResult = ReturnType<typeof useGetAllProductsQuery>;
export type GetAllProductsLazyQueryHookResult = ReturnType<typeof useGetAllProductsLazyQuery>;
export type GetAllProductsQueryResult = Apollo.QueryResult<GetAllProductsQuery, GetAllProductsQueryVariables>;
export const GetRubricAttributesDocument = gql`
    query GetRubricAttributes($id: ID!) {
  getRubric(id: $id) {
    id
    level
    attributesGroups {
      id
      isOwner
      showInCatalogueFilter
      node {
        id
        nameString
        attributes {
          id
          nameString
          variant
          metric {
            id
            nameString
          }
          options {
            id
            nameString
          }
        }
      }
    }
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRubricAttributesQuery(baseOptions?: Apollo.QueryHookOptions<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>) {
        return Apollo.useQuery<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>(GetRubricAttributesDocument, baseOptions);
      }
export function useGetRubricAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>) {
          return Apollo.useLazyQuery<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>(GetRubricAttributesDocument, baseOptions);
        }
export type GetRubricAttributesQueryHookResult = ReturnType<typeof useGetRubricAttributesQuery>;
export type GetRubricAttributesLazyQueryHookResult = ReturnType<typeof useGetRubricAttributesLazyQuery>;
export type GetRubricAttributesQueryResult = Apollo.QueryResult<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>;