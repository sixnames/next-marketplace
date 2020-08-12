import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
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
  me?: Maybe<User>;
  getUser?: Maybe<User>;
  getAllUsers: PaginatedUsersResponse;
  getAllCities: Array<City>;
  getCity: City;
  getCityBySlug: City;
  getAllCountries: Array<Country>;
  getCountry: Country;
  getLanguage?: Maybe<Language>;
  getAllLanguages?: Maybe<Array<Language>>;
  getClientLanguage: Scalars['String'];
  getAllCurrencies: Array<Currency>;
  getCurrency: Currency;
  getProduct: Product;
  getProductBySlug: Product;
  getAllProducts: PaginatedProductsResponse;
  getProductsCounters: ProductsCounters;
  getFeaturesAst: Array<AttributesGroup>;
  getAttribute?: Maybe<Attribute>;
  getAttributesGroup?: Maybe<AttributesGroup>;
  getAllAttributesGroups: Array<AttributesGroup>;
  getCatalogueData?: Maybe<CatalogueData>;
  getMessage: Message;
  getMessagesByKeys: Array<Message>;
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


export type QueryGetProductArgs = {
  id: Scalars['ID'];
};


export type QueryGetProductBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetAllProductsArgs = {
  input?: Maybe<ProductPaginateInput>;
};


export type QueryGetProductsCountersArgs = {
  input: ProductsCountersInput;
};


export type QueryGetFeaturesAstArgs = {
  selectedRubrics: Array<Scalars['ID']>;
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

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  itemId: Scalars['String'];
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

export type LanguageType = {
   __typename?: 'LanguageType';
  key: Scalars['String'];
  value: Scalars['String'];
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

/** Pagination sortDir enum */
export enum PaginateSortDirectionEnum {
  Asc = 'asc',
  Desc = 'desc'
}

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

export type Product = {
   __typename?: 'Product';
  id: Scalars['ID'];
  itemId: Scalars['String'];
  nameString: Scalars['String'];
  name: Array<LanguageType>;
  cardNameString: Scalars['String'];
  cardName: Array<LanguageType>;
  slug: Scalars['String'];
  descriptionString: Scalars['String'];
  description: Array<LanguageType>;
  rubrics: Array<Scalars['ID']>;
  attributesGroups: Array<ProductAttributesGroup>;
  assets: Array<AssetType>;
  mainImage: Scalars['String'];
  price: Scalars['Int'];
  active: Scalars['Boolean'];
  cities: Array<ProductCity>;
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
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
  variant: AttributeVariantEnum;
  options?: Maybe<OptionsGroup>;
  /** list of options with products counter for catalogue filter */
  filterOptions: Array<AttributeFilterOption>;
  positioningInTitle?: Maybe<Array<AttributePositioningInTitle>>;
  metric?: Maybe<Metric>;
};


export type AttributeFilterOptionsArgs = {
  filter: Array<Scalars['String']>;
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
  nameString: Scalars['String'];
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

export type AttributeFilterOption = {
   __typename?: 'AttributeFilterOption';
  option: Option;
  counter: Scalars['Int'];
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

export type ProductCity = {
   __typename?: 'ProductCity';
  key: Scalars['String'];
  node: ProductNode;
};

export type ProductNode = {
   __typename?: 'ProductNode';
  name: Array<LanguageType>;
  cardName: Array<LanguageType>;
  slug: Scalars['String'];
  description: Array<LanguageType>;
  rubrics: Array<Scalars['ID']>;
  attributesGroups: Array<ProductAttributesGroup>;
  assets: Array<AssetType>;
  price: Scalars['Int'];
  active: Scalars['Boolean'];
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

/** Product pagination sortBy enum */
export enum ProductSortByEnum {
  Price = 'price',
  CreatedAt = 'createdAt'
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

export type CatalogueData = {
   __typename?: 'CatalogueData';
  rubric: Rubric;
  products: PaginatedProductsResponse;
  catalogueTitle: Scalars['String'];
};

export type Rubric = {
   __typename?: 'Rubric';
  id: Scalars['ID'];
  nameString: Scalars['String'];
  name: Array<LanguageType>;
  catalogueTitle: RubricCatalogueTitle;
  catalogueTitleString: RubricCatalogueTitleField;
  slug: Scalars['String'];
  level: Scalars['Int'];
  active: Scalars['Boolean'];
  parent?: Maybe<Rubric>;
  children: Array<Rubric>;
  attributesGroups: Array<RubricAttributesGroup>;
  filterAttributes: Array<Attribute>;
  variant: RubricVariant;
  products: PaginatedProductsResponse;
  totalProductsCount: Scalars['Int'];
  activeProductsCount: Scalars['Int'];
  cities: Array<RubricCity>;
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

export type RubricCatalogueTitleField = {
   __typename?: 'RubricCatalogueTitleField';
  defaultTitle: Scalars['String'];
  prefix?: Maybe<Scalars['String']>;
  keyword: Scalars['String'];
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

export type RubricCity = {
   __typename?: 'RubricCity';
  key: Scalars['String'];
  node: RubricNode;
};

export type RubricNode = {
   __typename?: 'RubricNode';
  name: Array<LanguageType>;
  catalogueTitle: RubricCatalogueTitle;
  slug: Scalars['String'];
  level: Scalars['Int'];
  active?: Maybe<Scalars['Boolean']>;
  parent?: Maybe<Rubric>;
  attributesGroups: Array<RubricAttributesGroup>;
  variant: RubricVariant;
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
  slug: Scalars['String'];
  nameString: Scalars['String'];
  description: Scalars['String'];
  order: Scalars['Float'];
  multi: Scalars['Boolean'];
  variant: ConfigVariantEnum;
  acceptedFormats: Array<Scalars['String']>;
  value: Array<Scalars['String']>;
};

/** Config variant enum */
export enum ConfigVariantEnum {
  String = 'string',
  Number = 'number',
  Email = 'email',
  Tel = 'tel',
  Asset = 'asset'
}

export type Mutation = {
   __typename?: 'Mutation';
  createUser: UserPayloadType;
  updateUser: UserPayloadType;
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
  createProduct: ProductPayloadType;
  updateProduct: ProductPayloadType;
  deleteProduct: ProductPayloadType;
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


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
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


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationDeleteProductArgs = {
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

export type LangInput = {
  key: Scalars['String'];
  value: Scalars['String'];
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
  value: Array<Scalars['String']>;
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
  ) }
);

export type InitialQueryVariables = {};


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
    & Pick<Config, 'id' | 'slug' | 'value' | 'nameString' | 'description' | 'variant' | 'multi' | 'acceptedFormats'>
  )> }
);

export type InitialSiteQueryQueryVariables = {};


export type InitialSiteQueryQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getClientLanguage'>
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
    & Pick<Config, 'id' | 'slug' | 'value' | 'nameString' | 'description' | 'variant' | 'multi' | 'acceptedFormats'>
  )>, getRubricsTree: Array<(
    { __typename?: 'Rubric' }
    & { children: Array<(
      { __typename?: 'Rubric' }
      & { children: Array<(
        { __typename?: 'Rubric' }
        & SiteRubricFragmentFragment
      )> }
      & SiteRubricFragmentFragment
    )> }
    & SiteRubricFragmentFragment
  )> }
);

export type SignInMutationVariables = {
  input: SignInInput;
};


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

export type SignOutMutationVariables = {};


export type SignOutMutation = (
  { __typename?: 'Mutation' }
  & { signOut: (
    { __typename?: 'UserPayloadType' }
    & Pick<UserPayloadType, 'success' | 'message'>
  ) }
);

export type CreateAttributesGroupMutationVariables = {
  input: CreateAttributesGroupInput;
};


export type CreateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { createAttributesGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAttributesGroupMutationVariables = {
  input: UpdateAttributesGroupInput;
};


export type UpdateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributesGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type AddAttributeToGroupMutationVariables = {
  input: AddAttributeToGroupInput;
};


export type AddAttributeToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addAttributeToGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAttributeInGroupMutationVariables = {
  input: UpdateAttributeInGroupInput;
};


export type UpdateAttributeInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributeInGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteAttributeFromGroupMutationVariables = {
  input: DeleteAttributeFromGroupInput;
};


export type DeleteAttributeFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributeFromGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
  ) }
);

export type AddAttributesGroupToRubricMutationVariables = {
  input: AddAttributesGroupToRubricInput;
};


export type AddAttributesGroupToRubricMutation = (
  { __typename?: 'Mutation' }
  & { addAttributesGroupToRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAttributesGroupInRubricMutationVariables = {
  input: UpdateAttributesGroupInRubricInput;
};


export type UpdateAttributesGroupInRubricMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributesGroupInRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupFromRubricMutationVariables = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type DeleteAttributesGroupFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroupFromRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateConfigsMutationVariables = {
  input: Array<UpdateConfigInput>;
};


export type UpdateConfigsMutation = (
  { __typename?: 'Mutation' }
  & { updateConfigs: (
    { __typename?: 'ConfigPayloadType' }
    & Pick<ConfigPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateAssetConfigMutationVariables = {
  input: UpdateAssetConfigInput;
};


export type UpdateAssetConfigMutation = (
  { __typename?: 'Mutation' }
  & { updateAssetConfig: (
    { __typename?: 'ConfigPayloadType' }
    & Pick<ConfigPayloadType, 'success' | 'message'>
  ) }
);

export type CreateLanguageMutationVariables = {
  input: CreateLanguageInput;
};


export type CreateLanguageMutation = (
  { __typename?: 'Mutation' }
  & { createLanguage: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type UpdateLanguageMutationVariables = {
  input: UpdateLanguageInput;
};


export type UpdateLanguageMutation = (
  { __typename?: 'Mutation' }
  & { updateLanguage: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type DeleteLanguageMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteLanguageMutation = (
  { __typename?: 'Mutation' }
  & { deleteLanguage: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type SetLanguageAsDefaultMutationVariables = {
  id: Scalars['ID'];
};


export type SetLanguageAsDefaultMutation = (
  { __typename?: 'Mutation' }
  & { setLanguageAsDefault: (
    { __typename?: 'LanguagePayloadType' }
    & Pick<LanguagePayloadType, 'success' | 'message'>
  ) }
);

export type CreateOptionsGroupMutationVariables = {
  input: CreateOptionsGroupInput;
};


export type CreateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { createOptionsGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateOptionsGroupMutationVariables = {
  input: UpdateOptionsGroupInput;
};


export type UpdateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionsGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteOptionsGroupMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionsGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type AddOptionToGroupMutationVariables = {
  input: AddOptionToGroupInput;
};


export type AddOptionToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addOptionToGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateOptionInGroupMutationVariables = {
  input: UpdateOptionInGroupInput;
};


export type UpdateOptionInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionInGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteOptionFromGroupMutationVariables = {
  input: DeleteOptionFromGroupInput;
};


export type DeleteOptionFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionFromGroup: (
    { __typename?: 'OptionsGroupPayloadType' }
    & Pick<OptionsGroupPayloadType, 'success' | 'message'>
  ) }
);

export type CreateRoleMutationVariables = {
  input: CreateRoleInput;
};


export type CreateRoleMutation = (
  { __typename?: 'Mutation' }
  & { createRole: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type UpdateRoleMutationVariables = {
  input: UpdateRoleInput;
};


export type UpdateRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateRole: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type DeleteRoleMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteRoleMutation = (
  { __typename?: 'Mutation' }
  & { deleteRole: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleOperationPermissionMutationVariables = {
  input: SetRoleOperationPermissionInput;
};


export type SetRoleOperationPermissionMutation = (
  { __typename?: 'Mutation' }
  & { setRoleOperationPermission: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleOperationCustomFilterMutationVariables = {
  input: SetRoleOperationCustomFilterInput;
};


export type SetRoleOperationCustomFilterMutation = (
  { __typename?: 'Mutation' }
  & { setRoleOperationCustomFilter: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleRuleRestrictedFieldMutationVariables = {
  input: SetRoleRuleRestrictedFieldInput;
};


export type SetRoleRuleRestrictedFieldMutation = (
  { __typename?: 'Mutation' }
  & { setRoleRuleRestrictedField: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type SetRoleAllowedNavItemMutationVariables = {
  input: SetRoleAllowedNavItemInput;
};


export type SetRoleAllowedNavItemMutation = (
  { __typename?: 'Mutation' }
  & { setRoleAllowedNavItem: (
    { __typename?: 'RolePayloadType' }
    & Pick<RolePayloadType, 'success' | 'message'>
  ) }
);

export type CreateRubricVariantMutationVariables = {
  input: CreateRubricVariantInput;
};


export type CreateRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { createRubricVariant: (
    { __typename?: 'RubricVariantPayloadType' }
    & Pick<RubricVariantPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateRubricVariantMutationVariables = {
  input: UpdateRubricVariantInput;
};


export type UpdateRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { updateRubricVariant: (
    { __typename?: 'RubricVariantPayloadType' }
    & Pick<RubricVariantPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteRubricVariantMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteRubricVariantMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubricVariant: (
    { __typename?: 'RubricVariantPayloadType' }
    & Pick<RubricVariantPayloadType, 'success' | 'message'>
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

export type GetProductQueryVariables = {
  id: Scalars['ID'];
};


export type GetProductQuery = (
  { __typename?: 'Query' }
  & { getProduct: (
    { __typename?: 'Product' }
    & ProductFragmentFragment
  ) }
);

export type UpdateProductMutationVariables = {
  input: UpdateProductInput;
};


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

export type CreateProductMutationVariables = {
  input: CreateProductInput;
};


export type CreateProductMutation = (
  { __typename?: 'Mutation' }
  & { createProduct: (
    { __typename?: 'ProductPayloadType' }
    & Pick<ProductPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteProductMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteProductMutation = (
  { __typename?: 'Mutation' }
  & { deleteProduct: (
    { __typename?: 'ProductPayloadType' }
    & Pick<ProductPayloadType, 'success' | 'message'>
  ) }
);

export type GetAllAttributesGroupsQueryVariables = {};


export type GetAllAttributesGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
  )> }
);

export type GetAttributesGroupQueryVariables = {
  id: Scalars['ID'];
};


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

export type GetAttributesGroupsForRubricQueryVariables = {
  exclude?: Maybe<Array<Scalars['ID']>>;
};


export type GetAttributesGroupsForRubricQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
  )> }
);

export type GetCatalogueCardQueryQueryVariables = {
  slug: Scalars['String'];
};


export type GetCatalogueCardQueryQuery = (
  { __typename?: 'Query' }
  & { getProductBySlug: (
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

export type GetCatalogueRubricQueryVariables = {
  catalogueFilter: Array<Scalars['String']>;
};


export type GetCatalogueRubricQuery = (
  { __typename?: 'Query' }
  & { getCatalogueData?: Maybe<(
    { __typename?: 'CatalogueData' }
    & Pick<CatalogueData, 'catalogueTitle'>
    & { rubric: (
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'nameString' | 'level' | 'slug'>
      & { variant: (
        { __typename?: 'RubricVariant' }
        & Pick<RubricVariant, 'id' | 'nameString'>
      ), filterAttributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'nameString' | 'variant' | 'slug'>
        & { filterOptions: Array<(
          { __typename?: 'AttributeFilterOption' }
          & Pick<AttributeFilterOption, 'counter'>
          & { option: (
            { __typename?: 'Option' }
            & Pick<Option, 'id' | 'slug' | 'nameString' | 'color'>
          ) }
        )> }
      )> }
    ), products: (
      { __typename?: 'PaginatedProductsResponse' }
      & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages'>
      & { docs: Array<(
        { __typename?: 'Product' }
        & Pick<Product, 'id' | 'itemId' | 'nameString' | 'price' | 'slug' | 'mainImage'>
      )> }
    ) }
  )> }
);

export type GetAllConfigsQueryVariables = {};


export type GetAllConfigsQuery = (
  { __typename?: 'Query' }
  & { getAllConfigs: Array<(
    { __typename?: 'Config' }
    & Pick<Config, 'id' | 'slug' | 'value' | 'nameString' | 'description' | 'variant'>
  )> }
);

export type GetAllLanguagesQueryVariables = {};


export type GetAllLanguagesQuery = (
  { __typename?: 'Query' }
  & { getAllLanguages?: Maybe<Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'id' | 'name' | 'key' | 'isDefault' | 'nativeName'>
  )>> }
);

export type GetMessagesByKeysQueryVariables = {
  keys: Array<Scalars['String']>;
};


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

export type GetAllOptionsGroupsQueryVariables = {};


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

export type GetOptionsGroupQueryVariables = {
  id: Scalars['ID'];
};


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

export type GetAllRolesQueryVariables = {};


export type GetAllRolesQuery = (
  { __typename?: 'Query' }
  & { getAllRoles: Array<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'nameString'>
  )> }
);

export type GetRoleQueryVariables = {
  id: Scalars['ID'];
};


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

export type GetAllRubricVariantsQueryVariables = {};


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

export type GetGenderOptionsQueryVariables = {};


export type GetGenderOptionsQuery = (
  { __typename?: 'Query' }
  & { getGenderOptions: Array<(
    { __typename?: 'GenderOption' }
    & Pick<GenderOption, 'id' | 'nameString'>
  )> }
);

export type GetIsoLanguagesListQueryVariables = {};


export type GetIsoLanguagesListQuery = (
  { __typename?: 'Query' }
  & { getISOLanguagesList: Array<(
    { __typename?: 'ISOLanguage' }
    & Pick<IsoLanguage, 'id' | 'nameString' | 'nativeName'>
  )> }
);

export type GetNewAttributeOptionsQueryVariables = {};


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

export type GetFeaturesAstQueryVariables = {
  selectedRubrics: Array<Scalars['ID']>;
};


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

export type GetRubricsTreeQueryVariables = {
  excluded?: Maybe<Array<Scalars['ID']>>;
  counters: ProductsCountersInput;
};


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

export type GetRubricQueryVariables = {
  id: Scalars['ID'];
};


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

export type CreateRubricMutationVariables = {
  input: CreateRubricInput;
};


export type CreateRubricMutation = (
  { __typename?: 'Mutation' }
  & { createRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type UpdateRubricMutationVariables = {
  input: UpdateRubricInput;
};


export type UpdateRubricMutation = (
  { __typename?: 'Mutation' }
  & { updateRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteRubricMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type GetRubricProductsQueryVariables = {
  id: Scalars['ID'];
  notInRubric?: Maybe<Scalars['ID']>;
};


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

export type GetNonRubricProductsQueryVariables = {
  input: ProductPaginateInput;
};


export type GetNonRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'PaginatedProductsResponse' }
    & RubricProductFragmentFragment
  ) }
);

export type AddProductTuRubricMutationVariables = {
  input: AddProductToRubricInput;
};


export type AddProductTuRubricMutation = (
  { __typename?: 'Mutation' }
  & { addProductToRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type DeleteProductFromRubricMutationVariables = {
  input: DeleteProductFromRubricInput;
};


export type DeleteProductFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
  ) }
);

export type GetAllProductsQueryVariables = {
  input: ProductPaginateInput;
};


export type GetAllProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'PaginatedProductsResponse' }
    & RubricProductFragmentFragment
  ) }
);

export type GetRubricAttributesQueryVariables = {
  id: Scalars['ID'];
};


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
    id
    slug
    value
    nameString
    description
    variant
    multi
    acceptedFormats
  }
}
    ${SessionUserFragmentFragmentDoc}
${SessionRoleFragmentFragmentDoc}`;

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
export function useInitialQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<InitialQuery, InitialQueryVariables>) {
        return ApolloReactHooks.useQuery<InitialQuery, InitialQueryVariables>(InitialDocument, baseOptions);
      }
export function useInitialLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<InitialQuery, InitialQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<InitialQuery, InitialQueryVariables>(InitialDocument, baseOptions);
        }
export type InitialQueryHookResult = ReturnType<typeof useInitialQuery>;
export type InitialLazyQueryHookResult = ReturnType<typeof useInitialLazyQuery>;
export type InitialQueryResult = ApolloReactCommon.QueryResult<InitialQuery, InitialQueryVariables>;
export const InitialSiteQueryDocument = gql`
    query InitialSiteQuery {
  me {
    ...SessionUserFragment
  }
  getSessionRole {
    ...SessionRoleFragment
  }
  getClientLanguage
  getAllLanguages {
    id
    key
    name
    nativeName
    isDefault
  }
  getAllConfigs {
    id
    slug
    value
    nameString
    description
    variant
    multi
    acceptedFormats
  }
  getRubricsTree {
    ...SiteRubricFragment
    children {
      ...SiteRubricFragment
      children {
        ...SiteRubricFragment
      }
    }
  }
}
    ${SessionUserFragmentFragmentDoc}
${SessionRoleFragmentFragmentDoc}
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
export function useInitialSiteQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>(InitialSiteQueryDocument, baseOptions);
      }
export function useInitialSiteQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>(InitialSiteQueryDocument, baseOptions);
        }
export type InitialSiteQueryQueryHookResult = ReturnType<typeof useInitialSiteQueryQuery>;
export type InitialSiteQueryLazyQueryHookResult = ReturnType<typeof useInitialSiteQueryLazyQuery>;
export type InitialSiteQueryQueryResult = ApolloReactCommon.QueryResult<InitialSiteQueryQuery, InitialSiteQueryQueryVariables>;
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
export type SignInMutationFn = ApolloReactCommon.MutationFunction<SignInMutation, SignInMutationVariables>;

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
export function useSignInMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        return ApolloReactHooks.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, baseOptions);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = ApolloReactCommon.MutationResult<SignInMutation>;
export type SignInMutationOptions = ApolloReactCommon.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = gql`
    mutation SignOut {
  signOut {
    success
    message
  }
}
    `;
export type SignOutMutationFn = ApolloReactCommon.MutationFunction<SignOutMutation, SignOutMutationVariables>;

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
export function useSignOutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        return ApolloReactHooks.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, baseOptions);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = ApolloReactCommon.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = ApolloReactCommon.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const CreateAttributesGroupDocument = gql`
    mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
  createAttributesGroup(input: $input) {
    success
    message
  }
}
    `;
export type CreateAttributesGroupMutationFn = ApolloReactCommon.MutationFunction<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>;

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
export function useCreateAttributesGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>(CreateAttributesGroupDocument, baseOptions);
      }
export type CreateAttributesGroupMutationHookResult = ReturnType<typeof useCreateAttributesGroupMutation>;
export type CreateAttributesGroupMutationResult = ApolloReactCommon.MutationResult<CreateAttributesGroupMutation>;
export type CreateAttributesGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateAttributesGroupMutation, CreateAttributesGroupMutationVariables>;
export const UpdateAttributesGroupDocument = gql`
    mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
  updateAttributesGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributesGroupMutationFn = ApolloReactCommon.MutationFunction<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>;

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
export function useUpdateAttributesGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>(UpdateAttributesGroupDocument, baseOptions);
      }
export type UpdateAttributesGroupMutationHookResult = ReturnType<typeof useUpdateAttributesGroupMutation>;
export type UpdateAttributesGroupMutationResult = ApolloReactCommon.MutationResult<UpdateAttributesGroupMutation>;
export type UpdateAttributesGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAttributesGroupMutation, UpdateAttributesGroupMutationVariables>;
export const DeleteAttributesGroupDocument = gql`
    mutation DeleteAttributesGroup($id: ID!) {
  deleteAttributesGroup(id: $id) {
    success
    message
  }
}
    `;
export type DeleteAttributesGroupMutationFn = ApolloReactCommon.MutationFunction<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>;

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
export function useDeleteAttributesGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>(DeleteAttributesGroupDocument, baseOptions);
      }
export type DeleteAttributesGroupMutationHookResult = ReturnType<typeof useDeleteAttributesGroupMutation>;
export type DeleteAttributesGroupMutationResult = ApolloReactCommon.MutationResult<DeleteAttributesGroupMutation>;
export type DeleteAttributesGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAttributesGroupMutation, DeleteAttributesGroupMutationVariables>;
export const AddAttributeToGroupDocument = gql`
    mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
  addAttributeToGroup(input: $input) {
    success
    message
  }
}
    `;
export type AddAttributeToGroupMutationFn = ApolloReactCommon.MutationFunction<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>;

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
export function useAddAttributeToGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>(AddAttributeToGroupDocument, baseOptions);
      }
export type AddAttributeToGroupMutationHookResult = ReturnType<typeof useAddAttributeToGroupMutation>;
export type AddAttributeToGroupMutationResult = ApolloReactCommon.MutationResult<AddAttributeToGroupMutation>;
export type AddAttributeToGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<AddAttributeToGroupMutation, AddAttributeToGroupMutationVariables>;
export const UpdateAttributeInGroupDocument = gql`
    mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
  updateAttributeInGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributeInGroupMutationFn = ApolloReactCommon.MutationFunction<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>;

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
export function useUpdateAttributeInGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>(UpdateAttributeInGroupDocument, baseOptions);
      }
export type UpdateAttributeInGroupMutationHookResult = ReturnType<typeof useUpdateAttributeInGroupMutation>;
export type UpdateAttributeInGroupMutationResult = ApolloReactCommon.MutationResult<UpdateAttributeInGroupMutation>;
export type UpdateAttributeInGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAttributeInGroupMutation, UpdateAttributeInGroupMutationVariables>;
export const DeleteAttributeFromGroupDocument = gql`
    mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
  deleteAttributeFromGroup(input: $input) {
    success
    message
  }
}
    `;
export type DeleteAttributeFromGroupMutationFn = ApolloReactCommon.MutationFunction<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>;

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
export function useDeleteAttributeFromGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>(DeleteAttributeFromGroupDocument, baseOptions);
      }
export type DeleteAttributeFromGroupMutationHookResult = ReturnType<typeof useDeleteAttributeFromGroupMutation>;
export type DeleteAttributeFromGroupMutationResult = ApolloReactCommon.MutationResult<DeleteAttributeFromGroupMutation>;
export type DeleteAttributeFromGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAttributeFromGroupMutation, DeleteAttributeFromGroupMutationVariables>;
export const AddAttributesGroupToRubricDocument = gql`
    mutation AddAttributesGroupToRubric($input: AddAttributesGroupToRubricInput!) {
  addAttributesGroupToRubric(input: $input) {
    success
    message
  }
}
    `;
export type AddAttributesGroupToRubricMutationFn = ApolloReactCommon.MutationFunction<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>;

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
export function useAddAttributesGroupToRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>(AddAttributesGroupToRubricDocument, baseOptions);
      }
export type AddAttributesGroupToRubricMutationHookResult = ReturnType<typeof useAddAttributesGroupToRubricMutation>;
export type AddAttributesGroupToRubricMutationResult = ApolloReactCommon.MutationResult<AddAttributesGroupToRubricMutation>;
export type AddAttributesGroupToRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<AddAttributesGroupToRubricMutation, AddAttributesGroupToRubricMutationVariables>;
export const UpdateAttributesGroupInRubricDocument = gql`
    mutation UpdateAttributesGroupInRubric($input: UpdateAttributesGroupInRubricInput!) {
  updateAttributesGroupInRubric(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAttributesGroupInRubricMutationFn = ApolloReactCommon.MutationFunction<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>;

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
export function useUpdateAttributesGroupInRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>(UpdateAttributesGroupInRubricDocument, baseOptions);
      }
export type UpdateAttributesGroupInRubricMutationHookResult = ReturnType<typeof useUpdateAttributesGroupInRubricMutation>;
export type UpdateAttributesGroupInRubricMutationResult = ApolloReactCommon.MutationResult<UpdateAttributesGroupInRubricMutation>;
export type UpdateAttributesGroupInRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAttributesGroupInRubricMutation, UpdateAttributesGroupInRubricMutationVariables>;
export const DeleteAttributesGroupFromRubricDocument = gql`
    mutation DeleteAttributesGroupFromRubric($input: DeleteAttributesGroupFromRubricInput!) {
  deleteAttributesGroupFromRubric(input: $input) {
    success
    message
  }
}
    `;
export type DeleteAttributesGroupFromRubricMutationFn = ApolloReactCommon.MutationFunction<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>;

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
export function useDeleteAttributesGroupFromRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>(DeleteAttributesGroupFromRubricDocument, baseOptions);
      }
export type DeleteAttributesGroupFromRubricMutationHookResult = ReturnType<typeof useDeleteAttributesGroupFromRubricMutation>;
export type DeleteAttributesGroupFromRubricMutationResult = ApolloReactCommon.MutationResult<DeleteAttributesGroupFromRubricMutation>;
export type DeleteAttributesGroupFromRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAttributesGroupFromRubricMutation, DeleteAttributesGroupFromRubricMutationVariables>;
export const UpdateConfigsDocument = gql`
    mutation UpdateConfigs($input: [UpdateConfigInput!]!) {
  updateConfigs(input: $input) {
    success
    message
  }
}
    `;
export type UpdateConfigsMutationFn = ApolloReactCommon.MutationFunction<UpdateConfigsMutation, UpdateConfigsMutationVariables>;

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
export function useUpdateConfigsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateConfigsMutation, UpdateConfigsMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateConfigsMutation, UpdateConfigsMutationVariables>(UpdateConfigsDocument, baseOptions);
      }
export type UpdateConfigsMutationHookResult = ReturnType<typeof useUpdateConfigsMutation>;
export type UpdateConfigsMutationResult = ApolloReactCommon.MutationResult<UpdateConfigsMutation>;
export type UpdateConfigsMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateConfigsMutation, UpdateConfigsMutationVariables>;
export const UpdateAssetConfigDocument = gql`
    mutation UpdateAssetConfig($input: UpdateAssetConfigInput!) {
  updateAssetConfig(input: $input) {
    success
    message
  }
}
    `;
export type UpdateAssetConfigMutationFn = ApolloReactCommon.MutationFunction<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>;

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
export function useUpdateAssetConfigMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>(UpdateAssetConfigDocument, baseOptions);
      }
export type UpdateAssetConfigMutationHookResult = ReturnType<typeof useUpdateAssetConfigMutation>;
export type UpdateAssetConfigMutationResult = ApolloReactCommon.MutationResult<UpdateAssetConfigMutation>;
export type UpdateAssetConfigMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAssetConfigMutation, UpdateAssetConfigMutationVariables>;
export const CreateLanguageDocument = gql`
    mutation CreateLanguage($input: CreateLanguageInput!) {
  createLanguage(input: $input) {
    success
    message
  }
}
    `;
export type CreateLanguageMutationFn = ApolloReactCommon.MutationFunction<CreateLanguageMutation, CreateLanguageMutationVariables>;

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
export function useCreateLanguageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateLanguageMutation, CreateLanguageMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateLanguageMutation, CreateLanguageMutationVariables>(CreateLanguageDocument, baseOptions);
      }
export type CreateLanguageMutationHookResult = ReturnType<typeof useCreateLanguageMutation>;
export type CreateLanguageMutationResult = ApolloReactCommon.MutationResult<CreateLanguageMutation>;
export type CreateLanguageMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateLanguageMutation, CreateLanguageMutationVariables>;
export const UpdateLanguageDocument = gql`
    mutation UpdateLanguage($input: UpdateLanguageInput!) {
  updateLanguage(input: $input) {
    success
    message
  }
}
    `;
export type UpdateLanguageMutationFn = ApolloReactCommon.MutationFunction<UpdateLanguageMutation, UpdateLanguageMutationVariables>;

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
export function useUpdateLanguageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateLanguageMutation, UpdateLanguageMutationVariables>(UpdateLanguageDocument, baseOptions);
      }
export type UpdateLanguageMutationHookResult = ReturnType<typeof useUpdateLanguageMutation>;
export type UpdateLanguageMutationResult = ApolloReactCommon.MutationResult<UpdateLanguageMutation>;
export type UpdateLanguageMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>;
export const DeleteLanguageDocument = gql`
    mutation DeleteLanguage($id: ID!) {
  deleteLanguage(id: $id) {
    success
    message
  }
}
    `;
export type DeleteLanguageMutationFn = ApolloReactCommon.MutationFunction<DeleteLanguageMutation, DeleteLanguageMutationVariables>;

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
export function useDeleteLanguageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteLanguageMutation, DeleteLanguageMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteLanguageMutation, DeleteLanguageMutationVariables>(DeleteLanguageDocument, baseOptions);
      }
export type DeleteLanguageMutationHookResult = ReturnType<typeof useDeleteLanguageMutation>;
export type DeleteLanguageMutationResult = ApolloReactCommon.MutationResult<DeleteLanguageMutation>;
export type DeleteLanguageMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteLanguageMutation, DeleteLanguageMutationVariables>;
export const SetLanguageAsDefaultDocument = gql`
    mutation SetLanguageAsDefault($id: ID!) {
  setLanguageAsDefault(id: $id) {
    success
    message
  }
}
    `;
export type SetLanguageAsDefaultMutationFn = ApolloReactCommon.MutationFunction<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>;

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
export function useSetLanguageAsDefaultMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>) {
        return ApolloReactHooks.useMutation<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>(SetLanguageAsDefaultDocument, baseOptions);
      }
export type SetLanguageAsDefaultMutationHookResult = ReturnType<typeof useSetLanguageAsDefaultMutation>;
export type SetLanguageAsDefaultMutationResult = ApolloReactCommon.MutationResult<SetLanguageAsDefaultMutation>;
export type SetLanguageAsDefaultMutationOptions = ApolloReactCommon.BaseMutationOptions<SetLanguageAsDefaultMutation, SetLanguageAsDefaultMutationVariables>;
export const CreateOptionsGroupDocument = gql`
    mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
  createOptionsGroup(input: $input) {
    success
    message
  }
}
    `;
export type CreateOptionsGroupMutationFn = ApolloReactCommon.MutationFunction<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>;

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
export function useCreateOptionsGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>(CreateOptionsGroupDocument, baseOptions);
      }
export type CreateOptionsGroupMutationHookResult = ReturnType<typeof useCreateOptionsGroupMutation>;
export type CreateOptionsGroupMutationResult = ApolloReactCommon.MutationResult<CreateOptionsGroupMutation>;
export type CreateOptionsGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateOptionsGroupMutation, CreateOptionsGroupMutationVariables>;
export const UpdateOptionsGroupDocument = gql`
    mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
  updateOptionsGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateOptionsGroupMutationFn = ApolloReactCommon.MutationFunction<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>;

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
export function useUpdateOptionsGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>(UpdateOptionsGroupDocument, baseOptions);
      }
export type UpdateOptionsGroupMutationHookResult = ReturnType<typeof useUpdateOptionsGroupMutation>;
export type UpdateOptionsGroupMutationResult = ApolloReactCommon.MutationResult<UpdateOptionsGroupMutation>;
export type UpdateOptionsGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateOptionsGroupMutation, UpdateOptionsGroupMutationVariables>;
export const DeleteOptionsGroupDocument = gql`
    mutation DeleteOptionsGroup($id: ID!) {
  deleteOptionsGroup(id: $id) {
    success
    message
  }
}
    `;
export type DeleteOptionsGroupMutationFn = ApolloReactCommon.MutationFunction<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>;

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
export function useDeleteOptionsGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>(DeleteOptionsGroupDocument, baseOptions);
      }
export type DeleteOptionsGroupMutationHookResult = ReturnType<typeof useDeleteOptionsGroupMutation>;
export type DeleteOptionsGroupMutationResult = ApolloReactCommon.MutationResult<DeleteOptionsGroupMutation>;
export type DeleteOptionsGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteOptionsGroupMutation, DeleteOptionsGroupMutationVariables>;
export const AddOptionToGroupDocument = gql`
    mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
  addOptionToGroup(input: $input) {
    success
    message
  }
}
    `;
export type AddOptionToGroupMutationFn = ApolloReactCommon.MutationFunction<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>;

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
export function useAddOptionToGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>(AddOptionToGroupDocument, baseOptions);
      }
export type AddOptionToGroupMutationHookResult = ReturnType<typeof useAddOptionToGroupMutation>;
export type AddOptionToGroupMutationResult = ApolloReactCommon.MutationResult<AddOptionToGroupMutation>;
export type AddOptionToGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<AddOptionToGroupMutation, AddOptionToGroupMutationVariables>;
export const UpdateOptionInGroupDocument = gql`
    mutation UpdateOptionInGroup($input: UpdateOptionInGroupInput!) {
  updateOptionInGroup(input: $input) {
    success
    message
  }
}
    `;
export type UpdateOptionInGroupMutationFn = ApolloReactCommon.MutationFunction<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>;

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
export function useUpdateOptionInGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>(UpdateOptionInGroupDocument, baseOptions);
      }
export type UpdateOptionInGroupMutationHookResult = ReturnType<typeof useUpdateOptionInGroupMutation>;
export type UpdateOptionInGroupMutationResult = ApolloReactCommon.MutationResult<UpdateOptionInGroupMutation>;
export type UpdateOptionInGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateOptionInGroupMutation, UpdateOptionInGroupMutationVariables>;
export const DeleteOptionFromGroupDocument = gql`
    mutation DeleteOptionFromGroup($input: DeleteOptionFromGroupInput!) {
  deleteOptionFromGroup(input: $input) {
    success
    message
  }
}
    `;
export type DeleteOptionFromGroupMutationFn = ApolloReactCommon.MutationFunction<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>;

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
export function useDeleteOptionFromGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>(DeleteOptionFromGroupDocument, baseOptions);
      }
export type DeleteOptionFromGroupMutationHookResult = ReturnType<typeof useDeleteOptionFromGroupMutation>;
export type DeleteOptionFromGroupMutationResult = ApolloReactCommon.MutationResult<DeleteOptionFromGroupMutation>;
export type DeleteOptionFromGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteOptionFromGroupMutation, DeleteOptionFromGroupMutationVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    success
    message
  }
}
    `;
export type CreateRoleMutationFn = ApolloReactCommon.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

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
export function useCreateRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, baseOptions);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = ApolloReactCommon.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
  updateRole(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRoleMutationFn = ApolloReactCommon.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

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
export function useUpdateRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, baseOptions);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = ApolloReactCommon.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($id: ID!) {
  deleteRole(id: $id) {
    success
    message
  }
}
    `;
export type DeleteRoleMutationFn = ApolloReactCommon.MutationFunction<DeleteRoleMutation, DeleteRoleMutationVariables>;

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
export function useDeleteRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, baseOptions);
      }
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>;
export type DeleteRoleMutationResult = ApolloReactCommon.MutationResult<DeleteRoleMutation>;
export type DeleteRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const SetRoleOperationPermissionDocument = gql`
    mutation SetRoleOperationPermission($input: SetRoleOperationPermissionInput!) {
  setRoleOperationPermission(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleOperationPermissionMutationFn = ApolloReactCommon.MutationFunction<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>;

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
export function useSetRoleOperationPermissionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>) {
        return ApolloReactHooks.useMutation<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>(SetRoleOperationPermissionDocument, baseOptions);
      }
export type SetRoleOperationPermissionMutationHookResult = ReturnType<typeof useSetRoleOperationPermissionMutation>;
export type SetRoleOperationPermissionMutationResult = ApolloReactCommon.MutationResult<SetRoleOperationPermissionMutation>;
export type SetRoleOperationPermissionMutationOptions = ApolloReactCommon.BaseMutationOptions<SetRoleOperationPermissionMutation, SetRoleOperationPermissionMutationVariables>;
export const SetRoleOperationCustomFilterDocument = gql`
    mutation SetRoleOperationCustomFilter($input: SetRoleOperationCustomFilterInput!) {
  setRoleOperationCustomFilter(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleOperationCustomFilterMutationFn = ApolloReactCommon.MutationFunction<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>;

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
export function useSetRoleOperationCustomFilterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>) {
        return ApolloReactHooks.useMutation<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>(SetRoleOperationCustomFilterDocument, baseOptions);
      }
export type SetRoleOperationCustomFilterMutationHookResult = ReturnType<typeof useSetRoleOperationCustomFilterMutation>;
export type SetRoleOperationCustomFilterMutationResult = ApolloReactCommon.MutationResult<SetRoleOperationCustomFilterMutation>;
export type SetRoleOperationCustomFilterMutationOptions = ApolloReactCommon.BaseMutationOptions<SetRoleOperationCustomFilterMutation, SetRoleOperationCustomFilterMutationVariables>;
export const SetRoleRuleRestrictedFieldDocument = gql`
    mutation SetRoleRuleRestrictedField($input: SetRoleRuleRestrictedFieldInput!) {
  setRoleRuleRestrictedField(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleRuleRestrictedFieldMutationFn = ApolloReactCommon.MutationFunction<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>;

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
export function useSetRoleRuleRestrictedFieldMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>) {
        return ApolloReactHooks.useMutation<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>(SetRoleRuleRestrictedFieldDocument, baseOptions);
      }
export type SetRoleRuleRestrictedFieldMutationHookResult = ReturnType<typeof useSetRoleRuleRestrictedFieldMutation>;
export type SetRoleRuleRestrictedFieldMutationResult = ApolloReactCommon.MutationResult<SetRoleRuleRestrictedFieldMutation>;
export type SetRoleRuleRestrictedFieldMutationOptions = ApolloReactCommon.BaseMutationOptions<SetRoleRuleRestrictedFieldMutation, SetRoleRuleRestrictedFieldMutationVariables>;
export const SetRoleAllowedNavItemDocument = gql`
    mutation SetRoleAllowedNavItem($input: SetRoleAllowedNavItemInput!) {
  setRoleAllowedNavItem(input: $input) {
    success
    message
  }
}
    `;
export type SetRoleAllowedNavItemMutationFn = ApolloReactCommon.MutationFunction<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>;

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
export function useSetRoleAllowedNavItemMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>) {
        return ApolloReactHooks.useMutation<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>(SetRoleAllowedNavItemDocument, baseOptions);
      }
export type SetRoleAllowedNavItemMutationHookResult = ReturnType<typeof useSetRoleAllowedNavItemMutation>;
export type SetRoleAllowedNavItemMutationResult = ApolloReactCommon.MutationResult<SetRoleAllowedNavItemMutation>;
export type SetRoleAllowedNavItemMutationOptions = ApolloReactCommon.BaseMutationOptions<SetRoleAllowedNavItemMutation, SetRoleAllowedNavItemMutationVariables>;
export const CreateRubricVariantDocument = gql`
    mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
  createRubricVariant(input: $input) {
    success
    message
  }
}
    `;
export type CreateRubricVariantMutationFn = ApolloReactCommon.MutationFunction<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>;

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
export function useCreateRubricVariantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>(CreateRubricVariantDocument, baseOptions);
      }
export type CreateRubricVariantMutationHookResult = ReturnType<typeof useCreateRubricVariantMutation>;
export type CreateRubricVariantMutationResult = ApolloReactCommon.MutationResult<CreateRubricVariantMutation>;
export type CreateRubricVariantMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRubricVariantMutation, CreateRubricVariantMutationVariables>;
export const UpdateRubricVariantDocument = gql`
    mutation UpdateRubricVariant($input: UpdateRubricVariantInput!) {
  updateRubricVariant(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRubricVariantMutationFn = ApolloReactCommon.MutationFunction<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>;

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
export function useUpdateRubricVariantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>(UpdateRubricVariantDocument, baseOptions);
      }
export type UpdateRubricVariantMutationHookResult = ReturnType<typeof useUpdateRubricVariantMutation>;
export type UpdateRubricVariantMutationResult = ApolloReactCommon.MutationResult<UpdateRubricVariantMutation>;
export type UpdateRubricVariantMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRubricVariantMutation, UpdateRubricVariantMutationVariables>;
export const DeleteRubricVariantDocument = gql`
    mutation DeleteRubricVariant($id: ID!) {
  deleteRubricVariant(id: $id) {
    success
    message
  }
}
    `;
export type DeleteRubricVariantMutationFn = ApolloReactCommon.MutationFunction<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>;

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
export function useDeleteRubricVariantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>(DeleteRubricVariantDocument, baseOptions);
      }
export type DeleteRubricVariantMutationHookResult = ReturnType<typeof useDeleteRubricVariantMutation>;
export type DeleteRubricVariantMutationResult = ApolloReactCommon.MutationResult<DeleteRubricVariantMutation>;
export type DeleteRubricVariantMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRubricVariantMutation, DeleteRubricVariantMutationVariables>;
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
export function useGetProductQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, baseOptions);
      }
export function useGetProductLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, baseOptions);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductQueryResult = ApolloReactCommon.QueryResult<GetProductQuery, GetProductQueryVariables>;
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
export type UpdateProductMutationFn = ApolloReactCommon.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

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
export function useUpdateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, baseOptions);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = ApolloReactCommon.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    success
    message
  }
}
    `;
export type CreateProductMutationFn = ApolloReactCommon.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

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
export function useCreateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, baseOptions);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = ApolloReactCommon.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    success
    message
  }
}
    `;
export type DeleteProductMutationFn = ApolloReactCommon.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

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
export function useDeleteProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, baseOptions);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = ApolloReactCommon.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
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
export function useGetAllAttributesGroupsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>(GetAllAttributesGroupsDocument, baseOptions);
      }
export function useGetAllAttributesGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>(GetAllAttributesGroupsDocument, baseOptions);
        }
export type GetAllAttributesGroupsQueryHookResult = ReturnType<typeof useGetAllAttributesGroupsQuery>;
export type GetAllAttributesGroupsLazyQueryHookResult = ReturnType<typeof useGetAllAttributesGroupsLazyQuery>;
export type GetAllAttributesGroupsQueryResult = ApolloReactCommon.QueryResult<GetAllAttributesGroupsQuery, GetAllAttributesGroupsQueryVariables>;
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
export function useGetAttributesGroupQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>(GetAttributesGroupDocument, baseOptions);
      }
export function useGetAttributesGroupLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>(GetAttributesGroupDocument, baseOptions);
        }
export type GetAttributesGroupQueryHookResult = ReturnType<typeof useGetAttributesGroupQuery>;
export type GetAttributesGroupLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupLazyQuery>;
export type GetAttributesGroupQueryResult = ApolloReactCommon.QueryResult<GetAttributesGroupQuery, GetAttributesGroupQueryVariables>;
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
export function useGetAttributesGroupsForRubricQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>(GetAttributesGroupsForRubricDocument, baseOptions);
      }
export function useGetAttributesGroupsForRubricLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>(GetAttributesGroupsForRubricDocument, baseOptions);
        }
export type GetAttributesGroupsForRubricQueryHookResult = ReturnType<typeof useGetAttributesGroupsForRubricQuery>;
export type GetAttributesGroupsForRubricLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupsForRubricLazyQuery>;
export type GetAttributesGroupsForRubricQueryResult = ApolloReactCommon.QueryResult<GetAttributesGroupsForRubricQuery, GetAttributesGroupsForRubricQueryVariables>;
export const GetCatalogueCardQueryDocument = gql`
    query GetCatalogueCardQuery($slug: String!) {
  getProductBySlug(slug: $slug) {
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
export function useGetCatalogueCardQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>(GetCatalogueCardQueryDocument, baseOptions);
      }
export function useGetCatalogueCardQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>(GetCatalogueCardQueryDocument, baseOptions);
        }
export type GetCatalogueCardQueryQueryHookResult = ReturnType<typeof useGetCatalogueCardQueryQuery>;
export type GetCatalogueCardQueryLazyQueryHookResult = ReturnType<typeof useGetCatalogueCardQueryLazyQuery>;
export type GetCatalogueCardQueryQueryResult = ApolloReactCommon.QueryResult<GetCatalogueCardQueryQuery, GetCatalogueCardQueryQueryVariables>;
export const GetCatalogueRubricDocument = gql`
    query GetCatalogueRubric($catalogueFilter: [String!]!) {
  getCatalogueData(catalogueFilter: $catalogueFilter) {
    catalogueTitle
    rubric {
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
        nameString
        variant
        slug
        filterOptions(filter: $catalogueFilter) {
          option {
            id
            slug
            nameString
            color
          }
          counter
        }
      }
    }
    products {
      totalDocs
      page
      totalPages
      docs {
        id
        itemId
        nameString
        price
        slug
        mainImage
      }
    }
  }
}
    `;

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
export function useGetCatalogueRubricQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>(GetCatalogueRubricDocument, baseOptions);
      }
export function useGetCatalogueRubricLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>(GetCatalogueRubricDocument, baseOptions);
        }
export type GetCatalogueRubricQueryHookResult = ReturnType<typeof useGetCatalogueRubricQuery>;
export type GetCatalogueRubricLazyQueryHookResult = ReturnType<typeof useGetCatalogueRubricLazyQuery>;
export type GetCatalogueRubricQueryResult = ApolloReactCommon.QueryResult<GetCatalogueRubricQuery, GetCatalogueRubricQueryVariables>;
export const GetAllConfigsDocument = gql`
    query GetAllConfigs {
  getAllConfigs {
    id
    slug
    value
    nameString
    description
    variant
  }
}
    `;

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
export function useGetAllConfigsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllConfigsQuery, GetAllConfigsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllConfigsQuery, GetAllConfigsQueryVariables>(GetAllConfigsDocument, baseOptions);
      }
export function useGetAllConfigsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllConfigsQuery, GetAllConfigsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllConfigsQuery, GetAllConfigsQueryVariables>(GetAllConfigsDocument, baseOptions);
        }
export type GetAllConfigsQueryHookResult = ReturnType<typeof useGetAllConfigsQuery>;
export type GetAllConfigsLazyQueryHookResult = ReturnType<typeof useGetAllConfigsLazyQuery>;
export type GetAllConfigsQueryResult = ApolloReactCommon.QueryResult<GetAllConfigsQuery, GetAllConfigsQueryVariables>;
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
export function useGetAllLanguagesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>(GetAllLanguagesDocument, baseOptions);
      }
export function useGetAllLanguagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>(GetAllLanguagesDocument, baseOptions);
        }
export type GetAllLanguagesQueryHookResult = ReturnType<typeof useGetAllLanguagesQuery>;
export type GetAllLanguagesLazyQueryHookResult = ReturnType<typeof useGetAllLanguagesLazyQuery>;
export type GetAllLanguagesQueryResult = ApolloReactCommon.QueryResult<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>;
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
export function useGetMessagesByKeysQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>) {
        return ApolloReactHooks.useQuery<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>(GetMessagesByKeysDocument, baseOptions);
      }
export function useGetMessagesByKeysLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>(GetMessagesByKeysDocument, baseOptions);
        }
export type GetMessagesByKeysQueryHookResult = ReturnType<typeof useGetMessagesByKeysQuery>;
export type GetMessagesByKeysLazyQueryHookResult = ReturnType<typeof useGetMessagesByKeysLazyQuery>;
export type GetMessagesByKeysQueryResult = ApolloReactCommon.QueryResult<GetMessagesByKeysQuery, GetMessagesByKeysQueryVariables>;
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
export function useGetAllOptionsGroupsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>(GetAllOptionsGroupsDocument, baseOptions);
      }
export function useGetAllOptionsGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>(GetAllOptionsGroupsDocument, baseOptions);
        }
export type GetAllOptionsGroupsQueryHookResult = ReturnType<typeof useGetAllOptionsGroupsQuery>;
export type GetAllOptionsGroupsLazyQueryHookResult = ReturnType<typeof useGetAllOptionsGroupsLazyQuery>;
export type GetAllOptionsGroupsQueryResult = ApolloReactCommon.QueryResult<GetAllOptionsGroupsQuery, GetAllOptionsGroupsQueryVariables>;
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
export function useGetOptionsGroupQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>) {
        return ApolloReactHooks.useQuery<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>(GetOptionsGroupDocument, baseOptions);
      }
export function useGetOptionsGroupLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>(GetOptionsGroupDocument, baseOptions);
        }
export type GetOptionsGroupQueryHookResult = ReturnType<typeof useGetOptionsGroupQuery>;
export type GetOptionsGroupLazyQueryHookResult = ReturnType<typeof useGetOptionsGroupLazyQuery>;
export type GetOptionsGroupQueryResult = ApolloReactCommon.QueryResult<GetOptionsGroupQuery, GetOptionsGroupQueryVariables>;
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
export function useGetAllRolesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, baseOptions);
      }
export function useGetAllRolesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, baseOptions);
        }
export type GetAllRolesQueryHookResult = ReturnType<typeof useGetAllRolesQuery>;
export type GetAllRolesLazyQueryHookResult = ReturnType<typeof useGetAllRolesLazyQuery>;
export type GetAllRolesQueryResult = ApolloReactCommon.QueryResult<GetAllRolesQuery, GetAllRolesQueryVariables>;
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
export function useGetRoleQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, baseOptions);
      }
export function useGetRoleLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, baseOptions);
        }
export type GetRoleQueryHookResult = ReturnType<typeof useGetRoleQuery>;
export type GetRoleLazyQueryHookResult = ReturnType<typeof useGetRoleLazyQuery>;
export type GetRoleQueryResult = ApolloReactCommon.QueryResult<GetRoleQuery, GetRoleQueryVariables>;
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
export function useGetAllRubricVariantsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>(GetAllRubricVariantsDocument, baseOptions);
      }
export function useGetAllRubricVariantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>(GetAllRubricVariantsDocument, baseOptions);
        }
export type GetAllRubricVariantsQueryHookResult = ReturnType<typeof useGetAllRubricVariantsQuery>;
export type GetAllRubricVariantsLazyQueryHookResult = ReturnType<typeof useGetAllRubricVariantsLazyQuery>;
export type GetAllRubricVariantsQueryResult = ApolloReactCommon.QueryResult<GetAllRubricVariantsQuery, GetAllRubricVariantsQueryVariables>;
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
export function useGetGenderOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>(GetGenderOptionsDocument, baseOptions);
      }
export function useGetGenderOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>(GetGenderOptionsDocument, baseOptions);
        }
export type GetGenderOptionsQueryHookResult = ReturnType<typeof useGetGenderOptionsQuery>;
export type GetGenderOptionsLazyQueryHookResult = ReturnType<typeof useGetGenderOptionsLazyQuery>;
export type GetGenderOptionsQueryResult = ApolloReactCommon.QueryResult<GetGenderOptionsQuery, GetGenderOptionsQueryVariables>;
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
export function useGetIsoLanguagesListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>) {
        return ApolloReactHooks.useQuery<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>(GetIsoLanguagesListDocument, baseOptions);
      }
export function useGetIsoLanguagesListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>(GetIsoLanguagesListDocument, baseOptions);
        }
export type GetIsoLanguagesListQueryHookResult = ReturnType<typeof useGetIsoLanguagesListQuery>;
export type GetIsoLanguagesListLazyQueryHookResult = ReturnType<typeof useGetIsoLanguagesListLazyQuery>;
export type GetIsoLanguagesListQueryResult = ApolloReactCommon.QueryResult<GetIsoLanguagesListQuery, GetIsoLanguagesListQueryVariables>;
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
export function useGetNewAttributeOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>(GetNewAttributeOptionsDocument, baseOptions);
      }
export function useGetNewAttributeOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>(GetNewAttributeOptionsDocument, baseOptions);
        }
export type GetNewAttributeOptionsQueryHookResult = ReturnType<typeof useGetNewAttributeOptionsQuery>;
export type GetNewAttributeOptionsLazyQueryHookResult = ReturnType<typeof useGetNewAttributeOptionsLazyQuery>;
export type GetNewAttributeOptionsQueryResult = ApolloReactCommon.QueryResult<GetNewAttributeOptionsQuery, GetNewAttributeOptionsQueryVariables>;
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
export function useGetFeaturesAstQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>(GetFeaturesAstDocument, baseOptions);
      }
export function useGetFeaturesAstLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>(GetFeaturesAstDocument, baseOptions);
        }
export type GetFeaturesAstQueryHookResult = ReturnType<typeof useGetFeaturesAstQuery>;
export type GetFeaturesAstLazyQueryHookResult = ReturnType<typeof useGetFeaturesAstLazyQuery>;
export type GetFeaturesAstQueryResult = ApolloReactCommon.QueryResult<GetFeaturesAstQuery, GetFeaturesAstQueryVariables>;
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
export function useGetRubricsTreeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>(GetRubricsTreeDocument, baseOptions);
      }
export function useGetRubricsTreeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>(GetRubricsTreeDocument, baseOptions);
        }
export type GetRubricsTreeQueryHookResult = ReturnType<typeof useGetRubricsTreeQuery>;
export type GetRubricsTreeLazyQueryHookResult = ReturnType<typeof useGetRubricsTreeLazyQuery>;
export type GetRubricsTreeQueryResult = ApolloReactCommon.QueryResult<GetRubricsTreeQuery, GetRubricsTreeQueryVariables>;
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
export function useGetRubricQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRubricQuery, GetRubricQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRubricQuery, GetRubricQueryVariables>(GetRubricDocument, baseOptions);
      }
export function useGetRubricLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRubricQuery, GetRubricQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRubricQuery, GetRubricQueryVariables>(GetRubricDocument, baseOptions);
        }
export type GetRubricQueryHookResult = ReturnType<typeof useGetRubricQuery>;
export type GetRubricLazyQueryHookResult = ReturnType<typeof useGetRubricLazyQuery>;
export type GetRubricQueryResult = ApolloReactCommon.QueryResult<GetRubricQuery, GetRubricQueryVariables>;
export const CreateRubricDocument = gql`
    mutation CreateRubric($input: CreateRubricInput!) {
  createRubric(input: $input) {
    success
    message
  }
}
    `;
export type CreateRubricMutationFn = ApolloReactCommon.MutationFunction<CreateRubricMutation, CreateRubricMutationVariables>;

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
export function useCreateRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRubricMutation, CreateRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRubricMutation, CreateRubricMutationVariables>(CreateRubricDocument, baseOptions);
      }
export type CreateRubricMutationHookResult = ReturnType<typeof useCreateRubricMutation>;
export type CreateRubricMutationResult = ApolloReactCommon.MutationResult<CreateRubricMutation>;
export type CreateRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRubricMutation, CreateRubricMutationVariables>;
export const UpdateRubricDocument = gql`
    mutation UpdateRubric($input: UpdateRubricInput!) {
  updateRubric(input: $input) {
    success
    message
  }
}
    `;
export type UpdateRubricMutationFn = ApolloReactCommon.MutationFunction<UpdateRubricMutation, UpdateRubricMutationVariables>;

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
export function useUpdateRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRubricMutation, UpdateRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRubricMutation, UpdateRubricMutationVariables>(UpdateRubricDocument, baseOptions);
      }
export type UpdateRubricMutationHookResult = ReturnType<typeof useUpdateRubricMutation>;
export type UpdateRubricMutationResult = ApolloReactCommon.MutationResult<UpdateRubricMutation>;
export type UpdateRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRubricMutation, UpdateRubricMutationVariables>;
export const DeleteRubricDocument = gql`
    mutation DeleteRubric($id: ID!) {
  deleteRubric(id: $id) {
    success
    message
  }
}
    `;
export type DeleteRubricMutationFn = ApolloReactCommon.MutationFunction<DeleteRubricMutation, DeleteRubricMutationVariables>;

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
export function useDeleteRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRubricMutation, DeleteRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRubricMutation, DeleteRubricMutationVariables>(DeleteRubricDocument, baseOptions);
      }
export type DeleteRubricMutationHookResult = ReturnType<typeof useDeleteRubricMutation>;
export type DeleteRubricMutationResult = ApolloReactCommon.MutationResult<DeleteRubricMutation>;
export type DeleteRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRubricMutation, DeleteRubricMutationVariables>;
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
export function useGetRubricProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRubricProductsQuery, GetRubricProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRubricProductsQuery, GetRubricProductsQueryVariables>(GetRubricProductsDocument, baseOptions);
      }
export function useGetRubricProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRubricProductsQuery, GetRubricProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRubricProductsQuery, GetRubricProductsQueryVariables>(GetRubricProductsDocument, baseOptions);
        }
export type GetRubricProductsQueryHookResult = ReturnType<typeof useGetRubricProductsQuery>;
export type GetRubricProductsLazyQueryHookResult = ReturnType<typeof useGetRubricProductsLazyQuery>;
export type GetRubricProductsQueryResult = ApolloReactCommon.QueryResult<GetRubricProductsQuery, GetRubricProductsQueryVariables>;
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
export function useGetNonRubricProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>(GetNonRubricProductsDocument, baseOptions);
      }
export function useGetNonRubricProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>(GetNonRubricProductsDocument, baseOptions);
        }
export type GetNonRubricProductsQueryHookResult = ReturnType<typeof useGetNonRubricProductsQuery>;
export type GetNonRubricProductsLazyQueryHookResult = ReturnType<typeof useGetNonRubricProductsLazyQuery>;
export type GetNonRubricProductsQueryResult = ApolloReactCommon.QueryResult<GetNonRubricProductsQuery, GetNonRubricProductsQueryVariables>;
export const AddProductTuRubricDocument = gql`
    mutation AddProductTuRubric($input: AddProductToRubricInput!) {
  addProductToRubric(input: $input) {
    success
    message
  }
}
    `;
export type AddProductTuRubricMutationFn = ApolloReactCommon.MutationFunction<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>;

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
export function useAddProductTuRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>(AddProductTuRubricDocument, baseOptions);
      }
export type AddProductTuRubricMutationHookResult = ReturnType<typeof useAddProductTuRubricMutation>;
export type AddProductTuRubricMutationResult = ApolloReactCommon.MutationResult<AddProductTuRubricMutation>;
export type AddProductTuRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<AddProductTuRubricMutation, AddProductTuRubricMutationVariables>;
export const DeleteProductFromRubricDocument = gql`
    mutation DeleteProductFromRubric($input: DeleteProductFromRubricInput!) {
  deleteProductFromRubric(input: $input) {
    success
    message
  }
}
    `;
export type DeleteProductFromRubricMutationFn = ApolloReactCommon.MutationFunction<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>;

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
export function useDeleteProductFromRubricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>(DeleteProductFromRubricDocument, baseOptions);
      }
export type DeleteProductFromRubricMutationHookResult = ReturnType<typeof useDeleteProductFromRubricMutation>;
export type DeleteProductFromRubricMutationResult = ApolloReactCommon.MutationResult<DeleteProductFromRubricMutation>;
export type DeleteProductFromRubricMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteProductFromRubricMutation, DeleteProductFromRubricMutationVariables>;
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
export function useGetAllProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, baseOptions);
      }
export function useGetAllProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, baseOptions);
        }
export type GetAllProductsQueryHookResult = ReturnType<typeof useGetAllProductsQuery>;
export type GetAllProductsLazyQueryHookResult = ReturnType<typeof useGetAllProductsLazyQuery>;
export type GetAllProductsQueryResult = ApolloReactCommon.QueryResult<GetAllProductsQuery, GetAllProductsQueryVariables>;
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
export function useGetRubricAttributesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>(GetRubricAttributesDocument, baseOptions);
      }
export function useGetRubricAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>(GetRubricAttributesDocument, baseOptions);
        }
export type GetRubricAttributesQueryHookResult = ReturnType<typeof useGetRubricAttributesQuery>;
export type GetRubricAttributesLazyQueryHookResult = ReturnType<typeof useGetRubricAttributesLazyQuery>;
export type GetRubricAttributesQueryResult = ApolloReactCommon.QueryResult<GetRubricAttributesQuery, GetRubricAttributesQueryVariables>;