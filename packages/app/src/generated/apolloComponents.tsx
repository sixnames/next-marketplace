import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
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
  getMetric?: Maybe<Metric>;
  getAllMetrics?: Maybe<Array<Metric>>;
  getOption?: Maybe<Option>;
  getOptionsGroup?: Maybe<OptionsGroup>;
  getAllOptionsGroups: Array<OptionsGroup>;
  getAttribute?: Maybe<Attribute>;
  getProduct: Product;
  getAllProducts: PaginatedProductsResponse;
  getAttributesGroup?: Maybe<AttributesGroup>;
  getAllAttributesGroups: Array<AttributesGroup>;
  getRubricVariant?: Maybe<RubricVariant>;
  getAllRubricVariants?: Maybe<Array<RubricVariant>>;
  getRubric: Rubric;
  getRubricsTree: Array<Rubric>;
  getAttributeVariants?: Maybe<Array<AttributeVariant>>;
  getFeaturesASTOptions: Array<FeaturesAstOption>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllUsersArgs = {
  input: UserPaginateInput;
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


export type QueryGetAttributeArgs = {
  id: Scalars['ID'];
};


export type QueryGetProductArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllProductsArgs = {
  input?: Maybe<ProductPaginateInput>;
};


export type QueryGetAttributesGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllAttributesGroupsArgs = {
  exclude?: Maybe<Array<Scalars['ID']>>;
};


export type QueryGetRubricVariantArgs = {
  id: Scalars['ID'];
};


export type QueryGetRubricArgs = {
  id: Scalars['ID'];
};


export type QueryGetRubricsTreeArgs = {
  excluded?: Maybe<Array<Scalars['ID']>>;
};


export type QueryGetFeaturesAstOptionsArgs = {
  selected: Array<Scalars['ID']>;
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
  role: Scalars['String'];
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  isAdmin: Scalars['Boolean'];
  isCustomer: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
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

export type Metric = {
   __typename?: 'Metric';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
};

export type LanguageType = {
   __typename?: 'LanguageType';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Option = {
   __typename?: 'Option';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  color?: Maybe<Scalars['String']>;
};

export type OptionsGroup = {
   __typename?: 'OptionsGroup';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  options: Array<Option>;
};

export type Attribute = {
   __typename?: 'Attribute';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  variant: AttributeVariantEnum;
  options?: Maybe<OptionsGroup>;
  metric?: Maybe<Metric>;
};

/** Attribute type enum */
export enum AttributeVariantEnum {
  Select = 'select',
  MultipleSelect = 'multipleSelect',
  String = 'string',
  Number = 'number'
}

export type Product = {
   __typename?: 'Product';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  cardName: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  rubrics: Array<Scalars['ID']>;
  attributesSource?: Maybe<Scalars['ID']>;
  attributesGroups: Array<ProductAttributesGroup>;
  assets: Array<AssetType>;
  price: Scalars['Int'];
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

export type ProductAttribute = {
   __typename?: 'ProductAttribute';
  showInCard: Scalars['Boolean'];
  node: Attribute;
  /** Attribute reference via attribute itemId field */
  key: Scalars['Int'];
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
  attributesSource: Scalars['ID'];
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
};

/** Product pagination sortBy enum */
export enum ProductSortByEnum {
  Price = 'price',
  CreatedAt = 'createdAt'
}

export type RubricVariant = {
   __typename?: 'RubricVariant';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
};

export type Rubric = {
   __typename?: 'Rubric';
  id: Scalars['ID'];
  name: Scalars['String'];
  catalogueName: Scalars['String'];
  slug: Scalars['String'];
  level: Scalars['Int'];
  active: Scalars['Boolean'];
  parent?: Maybe<Rubric>;
  children: Array<Rubric>;
  attributesGroups: Array<RubricAttributesGroup>;
  variant?: Maybe<RubricVariant>;
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

export type RubricAttributesGroup = {
   __typename?: 'RubricAttributesGroup';
  id: Scalars['ID'];
  showInCatalogueFilter: Scalars['Boolean'];
  node: AttributesGroup;
};

export type RubricProductPaginateInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<PaginateSortDirectionEnum>;
  search?: Maybe<Scalars['String']>;
  sortBy?: Maybe<ProductSortByEnum>;
  notInRubric?: Maybe<Scalars['ID']>;
};

export type RubricCity = {
   __typename?: 'RubricCity';
  key: Scalars['String'];
  node: RubricNode;
};

export type RubricNode = {
   __typename?: 'RubricNode';
  name: Array<LanguageType>;
  catalogueName: Array<LanguageType>;
  slug: Scalars['String'];
  level: Scalars['Int'];
  active?: Maybe<Scalars['Boolean']>;
  parent?: Maybe<Rubric>;
  attributesGroups: Array<RubricAttributesGroup>;
  variant?: Maybe<RubricVariant>;
};

export type AttributeVariant = {
   __typename?: 'AttributeVariant';
  id: Scalars['ID'];
  nameString: Scalars['String'];
};

export type FeaturesAstOption = {
   __typename?: 'FeaturesASTOption';
  id: Scalars['ID'];
  nameString: Scalars['String'];
  attributesGroups: Array<RubricAttributesGroup>;
};

export type Mutation = {
   __typename?: 'Mutation';
  createUser: UserPayloadType;
  updateUser: UserPayloadType;
  deleteUser: UserPayloadType;
  signUp: UserPayloadType;
  signIn: UserPayloadType;
  signOut: UserPayloadType;
  createMetric: MetricPayloadType;
  updateMetric: MetricPayloadType;
  deleteMetric: MetricPayloadType;
  createOptionsGroup: OptionsGroupPayloadType;
  updateOptionsGroup: OptionsGroupPayloadType;
  deleteOptionsGroup: OptionsGroupPayloadType;
  addOptionToGroup: OptionsGroupPayloadType;
  updateOptionInGroup: OptionsGroupPayloadType;
  deleteOptionFromGroup: OptionsGroupPayloadType;
  createProduct: ProductPayloadType;
  updateProduct: ProductPayloadType;
  deleteProduct: ProductPayloadType;
  createAttributesGroup: AttributesGroupPayloadType;
  updateAttributesGroup: AttributesGroupPayloadType;
  deleteAttributesGroup: AttributesGroupPayloadType;
  addAttributeToGroup: AttributesGroupPayloadType;
  updateAttributeInGroup: AttributesGroupPayloadType;
  deleteAttributeFromGroup: AttributesGroupPayloadType;
  createRubricVariant: RubricVariantPayloadType;
  updateRubricVariant: RubricVariantPayloadType;
  deleteRubricVariant: RubricVariantPayloadType;
  createRubric: RubricPayloadType;
  updateRubric: RubricPayloadType;
  deleteRubric: RubricPayloadType;
  addAttributesGroupToRubric: RubricPayloadType;
  deleteAttributesGroupFromRubric: RubricPayloadType;
  addProductToRubric: RubricPayloadType;
  deleteProductFromRubric: RubricPayloadType;
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


export type MutationCreateRubricVariantArgs = {
  input: CreateRubricVariantInput;
};


export type MutationUpdateRubricVariantArgs = {
  input: UpdateRubricVariantInput;
};


export type MutationDeleteRubricVariantArgs = {
  id: Scalars['ID'];
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


export type MutationDeleteAttributesGroupFromRubricArgs = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type MutationAddProductToRubricArgs = {
  input: AddProductToRubricInput;
};


export type MutationDeleteProductFromRubricArgs = {
  input: DeleteProductFromRubricInput;
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
  role?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  role: Scalars['String'];
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

export type MetricPayloadType = {
   __typename?: 'MetricPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  metric?: Maybe<Metric>;
};

export type CreateMetricInput = {
  name: Array<LangInput>;
};

export type LangInput = {
  key: Scalars['String'];
  value: Scalars['String'];
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
};

export type UpdateOptionInGroupInput = {
  groupId: Scalars['ID'];
  optionId: Scalars['ID'];
  name: Array<LangInput>;
  color?: Maybe<Scalars['String']>;
};

export type DeleteOptionFromGroupInput = {
  groupId: Scalars['ID'];
  optionId: Scalars['ID'];
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
  attributesSource: Scalars['ID'];
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
  /** Attribute reference via attribute itemId field */
  key: Scalars['Int'];
  value: Array<Scalars['String']>;
};


export type UpdateProductInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
  cardName: Array<LangInput>;
  description: Array<LangInput>;
  rubrics: Array<Scalars['ID']>;
  attributesSource: Scalars['ID'];
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
};

export type UpdateAttributeInGroupInput = {
  groupId: Scalars['ID'];
  attributeId: Scalars['ID'];
  name: Array<LangInput>;
  variant: AttributeVariantEnum;
  options?: Maybe<Scalars['ID']>;
  metric?: Maybe<Scalars['ID']>;
};

export type DeleteAttributeFromGroupInput = {
  groupId: Scalars['ID'];
  attributeId: Scalars['ID'];
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

export type RubricPayloadType = {
   __typename?: 'RubricPayloadType';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type CreateRubricInput = {
  name: Array<LangInput>;
  catalogueName: Array<LangInput>;
  parent?: Maybe<Scalars['ID']>;
  variant?: Maybe<Scalars['ID']>;
};

export type UpdateRubricInput = {
  id: Scalars['ID'];
  name: Array<LangInput>;
  catalogueName: Array<LangInput>;
  parent?: Maybe<Scalars['ID']>;
  variant?: Maybe<Scalars['ID']>;
};

export type AddAttributesGroupToRubricInput = {
  rubricId: Scalars['ID'];
  attributesGroupId: Scalars['ID'];
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

export type AddAttributeToGroupMutationVariables = {
  input: AddAttributeToGroupInput;
};


export type AddAttributeToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addAttributeToGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'nameString'>
      & { attributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'nameString' | 'variant'>
        & { options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'nameString'>
        )>, metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'nameString'>
        )> }
      )> }
    )> }
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
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id'>
      & { attributesGroups: Array<(
        { __typename?: 'RubricAttributesGroup' }
        & Pick<RubricAttributesGroup, 'id' | 'showInCatalogueFilter'>
        & { node: (
          { __typename?: 'AttributesGroup' }
          & Pick<AttributesGroup, 'id' | 'nameString'>
        ) }
      )> }
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'nameString'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'nameString' | 'color'>
      )> }
    )> }
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
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'activeProductsCount' | 'totalProductsCount'>
      & { products: (
        { __typename?: 'PaginatedProductsResponse' }
        & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages'>
        & { docs: Array<(
          { __typename?: 'Product' }
          & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
        )> }
      ) }
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'nameString'>
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'nameString'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id'>
      )> }
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
    & { product?: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
    )> }
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
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { variant?: Maybe<(
        { __typename?: 'RubricVariant' }
        & Pick<RubricVariant, 'id' | 'nameString'>
      )>, children: Array<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
        & { variant?: Maybe<(
          { __typename?: 'RubricVariant' }
          & Pick<RubricVariant, 'id' | 'nameString'>
        )>, children: Array<(
          { __typename?: 'Rubric' }
          & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
          & { variant?: Maybe<(
            { __typename?: 'RubricVariant' }
            & Pick<RubricVariant, 'id' | 'nameString'>
          )> }
        )> }
      )>, parent?: Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id'>
      )> }
    )> }
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
    & { variant?: Maybe<(
      { __typename?: 'RubricVariant' }
      & Pick<RubricVariant, 'id' | 'nameString'>
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'nameString'>
      & { attributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'nameString' | 'variant'>
        & { options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'nameString'>
        )>, metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'nameString'>
        )> }
      )> }
    )> }
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

export type DeleteAttributesGroupFromRubricMutationVariables = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type DeleteAttributesGroupFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroupFromRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id'>
      & { attributesGroups: Array<(
        { __typename?: 'RubricAttributesGroup' }
        & Pick<RubricAttributesGroup, 'id' | 'showInCatalogueFilter'>
        & { node: (
          { __typename?: 'AttributesGroup' }
          & Pick<AttributesGroup, 'id' | 'nameString'>
        ) }
      )> }
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'nameString'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'nameString' | 'color'>
      )> }
    )> }
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

export type DeleteProductFromRubricMutationVariables = {
  input: DeleteProductFromRubricInput;
};


export type DeleteProductFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromRubric: (
    { __typename?: 'RubricPayloadType' }
    & Pick<RubricPayloadType, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id'>
      & { products: (
        { __typename?: 'PaginatedProductsResponse' }
        & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages'>
        & { docs: Array<(
          { __typename?: 'Product' }
          & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
        )> }
      ) }
    )> }
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
      & Pick<User, 'id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone' | 'role' | 'isAdmin' | 'isManager' | 'isCustomer'>
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

export type UpdateAttributeInGroupMutationVariables = {
  input: UpdateAttributeInGroupInput;
};


export type UpdateAttributeInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributeInGroup: (
    { __typename?: 'AttributesGroupPayloadType' }
    & Pick<AttributesGroupPayloadType, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'nameString'>
      & { attributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'nameString' | 'variant'>
        & { options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'nameString'>
        )>, metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'nameString'>
        )> }
      )> }
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'nameString'>
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'nameString'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'nameString' | 'color'>
      )> }
    )> }
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
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'nameString'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'nameString' | 'color'>
      )> }
    )> }
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
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'catalogueName' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { variant?: Maybe<(
        { __typename?: 'RubricVariant' }
        & Pick<RubricVariant, 'id' | 'nameString'>
      )> }
    )> }
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
    & { variant?: Maybe<(
      { __typename?: 'RubricVariant' }
      & Pick<RubricVariant, 'id' | 'nameString'>
    )> }
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

export type GetAllRubricVariantsQueryVariables = {};


export type GetAllRubricVariantsQuery = (
  { __typename?: 'Query' }
  & { getAllRubricVariants?: Maybe<Array<(
    { __typename?: 'RubricVariant' }
    & Pick<RubricVariant, 'id' | 'nameString'>
  )>> }
);

export type GetAttributesGroupQueryVariables = {
  id: Scalars['ID'];
};


export type GetAttributesGroupQuery = (
  { __typename?: 'Query' }
  & { getAttributesGroup?: Maybe<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'nameString'>
    & { attributes: Array<(
      { __typename?: 'Attribute' }
      & Pick<Attribute, 'id' | 'nameString' | 'variant'>
      & { options?: Maybe<(
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

export type GetFeaturesAstOptionsQueryVariables = {
  selected: Array<Scalars['ID']>;
};


export type GetFeaturesAstOptionsQuery = (
  { __typename?: 'Query' }
  & { getFeaturesASTOptions: Array<(
    { __typename?: 'FeaturesASTOption' }
    & Pick<FeaturesAstOption, 'id' | 'nameString'>
    & { attributesGroups: Array<(
      { __typename?: 'RubricAttributesGroup' }
      & { node: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'nameString'>
        & { attributes: Array<(
          { __typename?: 'Attribute' }
          & Pick<Attribute, 'id' | 'itemId' | 'nameString' | 'variant'>
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
        )> }
      ) }
    )> }
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
  )>> }
);

export type GetNonRubricProductsQueryVariables = {
  input: ProductPaginateInput;
};


export type GetNonRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'PaginatedProductsResponse' }
    & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages'>
    & { docs: Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
    )> }
  ) }
);

export type GetOptionsGroupQueryVariables = {
  id: Scalars['ID'];
};


export type GetOptionsGroupQuery = (
  { __typename?: 'Query' }
  & { getOptionsGroup?: Maybe<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, 'id' | 'nameString'>
    & { options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, 'id' | 'nameString' | 'color'>
    )> }
  )> }
);

export type GetRubricQueryVariables = {
  id: Scalars['ID'];
};


export type GetRubricQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id' | 'name' | 'catalogueName' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
    & { variant?: Maybe<(
      { __typename?: 'RubricVariant' }
      & Pick<RubricVariant, 'id' | 'nameString'>
    )>, parent?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name'>
      & { parent?: Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name'>
      )> }
    )>, children: Array<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { variant?: Maybe<(
        { __typename?: 'RubricVariant' }
        & Pick<RubricVariant, 'id' | 'nameString'>
      )>, children: Array<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
        & { variant?: Maybe<(
          { __typename?: 'RubricVariant' }
          & Pick<RubricVariant, 'id' | 'nameString'>
        )> }
      )> }
    )> }
  ) }
);

export type GetRubricAttributesQueryVariables = {
  id: Scalars['ID'];
};


export type GetRubricAttributesQuery = (
  { __typename?: 'Query' }
  & { getRubric: (
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id'>
    & { attributesGroups: Array<(
      { __typename?: 'RubricAttributesGroup' }
      & Pick<RubricAttributesGroup, 'id' | 'showInCatalogueFilter'>
      & { node: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'nameString'>
      ) }
    )> }
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
      & Pick<PaginatedProductsResponse, 'totalDocs' | 'page' | 'totalPages'>
      & { docs: Array<(
        { __typename?: 'Product' }
        & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
      )> }
    ) }
  ) }
);

export type GetRubricsTreeQueryVariables = {
  excluded?: Maybe<Array<Scalars['ID']>>;
};


export type GetRubricsTreeQuery = (
  { __typename?: 'Query' }
  & { getRubricsTree: Array<(
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
    & { variant?: Maybe<(
      { __typename?: 'RubricVariant' }
      & Pick<RubricVariant, 'id' | 'nameString'>
    )>, children: Array<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { variant?: Maybe<(
        { __typename?: 'RubricVariant' }
        & Pick<RubricVariant, 'id' | 'nameString'>
      )>, children: Array<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
        & { variant?: Maybe<(
          { __typename?: 'RubricVariant' }
          & Pick<RubricVariant, 'id' | 'nameString'>
        )> }
      )> }
    )> }
  )> }
);

export type InitialQueryVariables = {};


export type InitialQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone' | 'role' | 'isAdmin' | 'isManager' | 'isCustomer'>
  )> }
);


export const AddAttributeToGroupDocument = gql`
    mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
  addAttributeToGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      attributes {
        id
        nameString
        variant
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
export const AddAttributesGroupToRubricDocument = gql`
    mutation AddAttributesGroupToRubric($input: AddAttributesGroupToRubricInput!) {
  addAttributesGroupToRubric(input: $input) {
    success
    message
    rubric {
      id
      attributesGroups {
        id
        showInCatalogueFilter
        node {
          id
          nameString
        }
      }
    }
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
export const AddOptionToGroupDocument = gql`
    mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
  addOptionToGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      options {
        id
        nameString
        color
      }
    }
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
export const AddProductTuRubricDocument = gql`
    mutation AddProductTuRubric($input: AddProductToRubricInput!) {
  addProductToRubric(input: $input) {
    success
    message
    rubric {
      id
      activeProductsCount
      totalProductsCount
      products {
        totalDocs
        page
        totalPages
        docs {
          id
          itemId
          name
          price
          slug
        }
      }
    }
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
export const CreateAttributesGroupDocument = gql`
    mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
  createAttributesGroup(input: $input) {
    success
    message
    group {
      id
      nameString
    }
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
export const CreateOptionsGroupDocument = gql`
    mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
  createOptionsGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      options {
        id
      }
    }
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
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    success
    message
    product {
      id
      itemId
      name
      price
      slug
    }
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
export const CreateRubricDocument = gql`
    mutation CreateRubric($input: CreateRubricInput!) {
  createRubric(input: $input) {
    success
    message
    rubric {
      id
      name
      level
      variant {
        id
        nameString
      }
      totalProductsCount
      activeProductsCount
      children {
        id
        name
        level
        variant {
          id
          nameString
        }
        totalProductsCount
        activeProductsCount
        children {
          id
          name
          level
          variant {
            id
            nameString
          }
          totalProductsCount
          activeProductsCount
        }
      }
      parent {
        id
      }
    }
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
export const CreateRubricVariantDocument = gql`
    mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
  createRubricVariant(input: $input) {
    success
    message
    variant {
      id
      nameString
    }
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
export const DeleteAttributeFromGroupDocument = gql`
    mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
  deleteAttributeFromGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      attributes {
        id
        nameString
        variant
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
export const DeleteAttributesGroupFromRubricDocument = gql`
    mutation DeleteAttributesGroupFromRubric($input: DeleteAttributesGroupFromRubricInput!) {
  deleteAttributesGroupFromRubric(input: $input) {
    success
    message
    rubric {
      id
      attributesGroups {
        id
        showInCatalogueFilter
        node {
          id
          nameString
        }
      }
    }
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
export const DeleteOptionFromGroupDocument = gql`
    mutation DeleteOptionFromGroup($input: DeleteOptionFromGroupInput!) {
  deleteOptionFromGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      options {
        id
        nameString
        color
      }
    }
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
export const DeleteProductFromRubricDocument = gql`
    mutation DeleteProductFromRubric($input: DeleteProductFromRubricInput!) {
  deleteProductFromRubric(input: $input) {
    success
    message
    rubric {
      id
      products {
        totalDocs
        page
        totalPages
        docs {
          id
          itemId
          name
          price
          slug
        }
      }
    }
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
export const SignInDocument = gql`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    success
    message
    user {
      id
      email
      name
      secondName
      lastName
      fullName
      shortName
      phone
      role
      isAdmin
      isManager
      isCustomer
    }
  }
}
    `;
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
export const UpdateAttributeInGroupDocument = gql`
    mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
  updateAttributeInGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      attributes {
        id
        nameString
        variant
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
export const UpdateAttributesGroupDocument = gql`
    mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
  updateAttributesGroup(input: $input) {
    success
    message
    group {
      id
      nameString
    }
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
export const UpdateOptionInGroupDocument = gql`
    mutation UpdateOptionInGroup($input: UpdateOptionInGroupInput!) {
  updateOptionInGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      options {
        id
        nameString
        color
      }
    }
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
export const UpdateOptionsGroupDocument = gql`
    mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
  updateOptionsGroup(input: $input) {
    success
    message
    group {
      id
      nameString
      options {
        id
        nameString
        color
      }
    }
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
export const UpdateRubricDocument = gql`
    mutation UpdateRubric($input: UpdateRubricInput!) {
  updateRubric(input: $input) {
    success
    message
    rubric {
      id
      name
      catalogueName
      level
      variant {
        id
        nameString
      }
      totalProductsCount
      activeProductsCount
    }
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
export const UpdateRubricVariantDocument = gql`
    mutation UpdateRubricVariant($input: UpdateRubricVariantInput!) {
  updateRubricVariant(input: $input) {
    success
    message
    variant {
      id
      nameString
    }
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
export const GetAllRubricVariantsDocument = gql`
    query GetAllRubricVariants {
  getAllRubricVariants {
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
export const GetAttributesGroupDocument = gql`
    query GetAttributesGroup($id: ID!) {
  getAttributesGroup(id: $id) {
    id
    nameString
    attributes {
      id
      nameString
      variant
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
export const GetFeaturesAstOptionsDocument = gql`
    query GetFeaturesASTOptions($selected: [ID!]!) {
  getFeaturesASTOptions(selected: $selected) {
    id
    nameString
    attributesGroups {
      node {
        id
        nameString
        attributes {
          id
          itemId
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
      }
    }
  }
}
    `;

/**
 * __useGetFeaturesAstOptionsQuery__
 *
 * To run a query within a React component, call `useGetFeaturesAstOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturesAstOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturesAstOptionsQuery({
 *   variables: {
 *      selected: // value for 'selected'
 *   },
 * });
 */
export function useGetFeaturesAstOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFeaturesAstOptionsQuery, GetFeaturesAstOptionsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFeaturesAstOptionsQuery, GetFeaturesAstOptionsQueryVariables>(GetFeaturesAstOptionsDocument, baseOptions);
      }
export function useGetFeaturesAstOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFeaturesAstOptionsQuery, GetFeaturesAstOptionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFeaturesAstOptionsQuery, GetFeaturesAstOptionsQueryVariables>(GetFeaturesAstOptionsDocument, baseOptions);
        }
export type GetFeaturesAstOptionsQueryHookResult = ReturnType<typeof useGetFeaturesAstOptionsQuery>;
export type GetFeaturesAstOptionsLazyQueryHookResult = ReturnType<typeof useGetFeaturesAstOptionsLazyQuery>;
export type GetFeaturesAstOptionsQueryResult = ApolloReactCommon.QueryResult<GetFeaturesAstOptionsQuery, GetFeaturesAstOptionsQueryVariables>;
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
export const GetNonRubricProductsDocument = gql`
    query GetNonRubricProducts($input: ProductPaginateInput!) {
  getAllProducts(input: $input) {
    totalDocs
    page
    totalPages
    docs {
      id
      itemId
      name
      price
      slug
    }
  }
}
    `;

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
export const GetOptionsGroupDocument = gql`
    query GetOptionsGroup($id: ID!) {
  getOptionsGroup(id: $id) {
    id
    nameString
    options {
      id
      nameString
      color
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
export const GetRubricDocument = gql`
    query GetRubric($id: ID!) {
  getRubric(id: $id) {
    id
    name
    catalogueName
    level
    variant {
      id
      nameString
    }
    totalProductsCount
    activeProductsCount
    parent {
      id
      name
      parent {
        id
        name
      }
    }
    children {
      id
      name
      level
      variant {
        id
        nameString
      }
      totalProductsCount
      activeProductsCount
      children {
        id
        name
        level
        variant {
          id
          nameString
        }
        totalProductsCount
        activeProductsCount
      }
    }
  }
}
    `;

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
export const GetRubricAttributesDocument = gql`
    query GetRubricAttributes($id: ID!) {
  getRubric(id: $id) {
    id
    attributesGroups {
      id
      showInCatalogueFilter
      node {
        id
        nameString
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
export const GetRubricProductsDocument = gql`
    query GetRubricProducts($id: ID!, $notInRubric: ID) {
  getRubric(id: $id) {
    id
    products(input: {notInRubric: $notInRubric}) {
      totalDocs
      page
      totalPages
      docs {
        id
        itemId
        name
        price
        slug
      }
    }
  }
}
    `;

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
export const GetRubricsTreeDocument = gql`
    query GetRubricsTree($excluded: [ID!]) {
  getRubricsTree(excluded: $excluded) {
    id
    name
    level
    variant {
      id
      nameString
    }
    totalProductsCount
    activeProductsCount
    children(excluded: $excluded) {
      id
      name
      level
      variant {
        id
        nameString
      }
      totalProductsCount
      activeProductsCount
      children(excluded: $excluded) {
        id
        name
        level
        variant {
          id
          nameString
        }
        totalProductsCount
        activeProductsCount
      }
    }
  }
}
    `;

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
export const InitialDocument = gql`
    query Initial {
  me {
    id
    email
    name
    secondName
    lastName
    fullName
    shortName
    phone
    role
    isAdmin
    isManager
    isCustomer
  }
}
    `;

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