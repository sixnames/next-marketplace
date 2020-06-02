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
  /** Use JavaScript Date object for date/time fields. */
  DateTime: any;
  JSONObject: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum RoleType {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
  Manager = 'MANAGER',
  Super = 'SUPER',
  Logistician = 'LOGISTICIAN',
  Contractor = 'CONTRACTOR',
  Driver = 'DRIVER',
  Helper = 'HELPER',
  Bookkeeper = 'BOOKKEEPER',
  Warehouse = 'WAREHOUSE',
  Stage = 'STAGE'
}



export type AssetUrl = {
   __typename?: 'AssetUrl';
  regular: Scalars['String'];
  retina: Scalars['String'];
};

export type AssetSize = {
   __typename?: 'AssetSize';
  key: Scalars['String'];
  width: Scalars['Int'];
  url: AssetUrl;
};

export type AssetItem = {
   __typename?: 'AssetItem';
  index: Scalars['Int'];
  sizes: Array<AssetSize>;
};

export type Query = {
   __typename?: 'Query';
  _?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  getUser?: Maybe<User>;
  getAllUsers: UsersPaginationPayload;
  getRole?: Maybe<Role>;
  getAllRoles: Array<Role>;
  getAttributeTypes: Array<AttributeType>;
  getConditionTypes: Array<ConditionType>;
  getMetric?: Maybe<Metric>;
  getAllMetrics: Array<Metric>;
  getOption?: Maybe<Option>;
  getOptionsGroup?: Maybe<OptionsGroup>;
  getAllOptionsGroups: Array<OptionsGroup>;
  getAttribute?: Maybe<Attribute>;
  getAttributesGroup?: Maybe<AttributesGroup>;
  getAllAttributesGroups: Array<AttributesGroup>;
  getAccessory?: Maybe<Accessory>;
  getAllAccessories: AccessoriesPaginationResponse;
  getAccessoryRubric?: Maybe<Rubric>;
  getAccessoryRubricsTree: Array<Rubric>;
  getRubricType?: Maybe<RubricType>;
  getAllRubricTypes: Array<RubricType>;
  getRubric?: Maybe<Rubric>;
  getRubricsTree: Array<Rubric>;
  getFeaturesASTOptions: Array<FeaturesAstOption>;
  getProduct?: Maybe<Product>;
  getAllProducts: ProductsPaginationPayload;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllUsersArgs = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<SortDirection>;
  sortBy?: Maybe<SortableUserField>;
  query?: Maybe<Scalars['String']>;
};


export type QueryGetRoleArgs = {
  id: Scalars['ID'];
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


export type QueryGetAttributesGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllAttributesGroupsArgs = {
  exclude?: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type QueryGetAccessoryArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllAccessoriesArgs = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<SortDirection>;
  sortBy?: Maybe<SortableAccessoryField>;
  query?: Maybe<Scalars['String']>;
  rubric?: Maybe<Scalars['ID']>;
  notInRubric?: Maybe<Scalars['ID']>;
  noRubrics?: Maybe<Scalars['Boolean']>;
};


export type QueryGetAccessoryRubricArgs = {
  id: Scalars['ID'];
};


export type QueryGetAccessoryRubricsTreeArgs = {
  excluded?: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type QueryGetRubricTypeArgs = {
  id: Scalars['ID'];
};


export type QueryGetRubricArgs = {
  id: Scalars['ID'];
};


export type QueryGetRubricsTreeArgs = {
  excluded?: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type QueryGetFeaturesAstOptionsArgs = {
  selected: Array<Scalars['ID']>;
};


export type QueryGetProductArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllProductsArgs = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<SortDirection>;
  sortBy?: Maybe<SortableProductField>;
  query?: Maybe<Scalars['String']>;
  rubric?: Maybe<Scalars['ID']>;
  notInRubric?: Maybe<Scalars['ID']>;
  contractor?: Maybe<Scalars['ID']>;
  notInContractor?: Maybe<Scalars['ID']>;
  noRubrics?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  _?: Maybe<Scalars['String']>;
  createUser: CreateUserPayload;
  updateUser: UpdateUserPayload;
  deleteUser: DeleteUserPayload;
  signUp: SignUpPayload;
  signIn: SignInPayload;
  signOut?: Maybe<SignOutPayload>;
  createRole: CreateRolePayload;
  updateRole: UpdateRolePayload;
  deleteRole: DeleteRolePayload;
  createMetric: CreateMetricPayload;
  updateMetric: UpdateMetricPayload;
  deleteMetric: DeleteMetricPayload;
  createOptionsGroup: CreateOptionsGroupPayload;
  updateOptionsGroup: UpdateOptionsGroupPayload;
  deleteOptionsGroup: DeleteOptionsGroupPayload;
  addOptionToGroup: AddOptionToGroupPayload;
  updateOptionInGroup: UpdateOptionInGroupPayload;
  deleteOptionFromGroup: DeleteOptionFromGroupPayload;
  createAttributesGroup: CreateAttributesGroupPayload;
  updateAttributesGroup: UpdateAttributesGroupPayload;
  deleteAttributesGroup: DeleteAttributesGroupPayload;
  addAttributeToGroup: AddAttributeToGroupPayload;
  updateAttributeInGroup: UpdateAttributeInGroupPayload;
  deleteAttributeFromGroup: DeleteAttributeFromGroupPayload;
  createAccessory: CreateAccessoryPayload;
  updateAccessory: UpdateAccessoryPayload;
  deleteAccessory: DeleteAccessoryPayload;
  createAccessoryRubric: CreateAccessoryRubricPayload;
  updateAccessoryRubric: UpdateAccessoryRubricPayload;
  deleteAccessoryRubric: DeleteAccessoryRubricPayload;
  createRubricType: CreateRubricTypePayload;
  updateRubricType: UpdateRubricTypePayload;
  deleteRubricType: DeleteRubricTypePayload;
  createRubric: CreateRubricPayload;
  updateRubric: UpdateRubricPayload;
  deleteRubric: DeleteRubricPayload;
  addAttributesGroupToRubric: AddAttributesGroupToRubricPayload;
  deleteAttributesGroupFromRubric: DeleteAttributesGroupFromRubricPayload;
  addProductToRubric: AddProductToRubricPayload;
  deleteProductFromRubric: DeleteProductFromRubricPayload;
  createProduct: CreateProductPayload;
  updateProduct: UpdateProductPayload;
  updateProductAssets: UpdateProductAssetsPayload;
  deleteProduct: DeleteProductPayload;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationDeleteRoleArgs = {
  input: DeleteRoleInput;
};


export type MutationCreateMetricArgs = {
  input: CreateMetricInput;
};


export type MutationUpdateMetricArgs = {
  input: UpdateMetricInput;
};


export type MutationDeleteMetricArgs = {
  input: DeleteMetricInput;
};


export type MutationCreateOptionsGroupArgs = {
  input: CreateOptionsGroupInput;
};


export type MutationUpdateOptionsGroupArgs = {
  input: UpdateOptionsGroupInput;
};


export type MutationDeleteOptionsGroupArgs = {
  input: DeleteOptionsGroupInput;
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
  input: DeleteAttributesGroupInput;
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


export type MutationCreateAccessoryArgs = {
  input: CreateAccessoryInput;
};


export type MutationUpdateAccessoryArgs = {
  input: UpdateAccessoryInput;
};


export type MutationDeleteAccessoryArgs = {
  input: DeleteAccessoryInput;
};


export type MutationCreateAccessoryRubricArgs = {
  input: CreateAccessoryRubricInput;
};


export type MutationUpdateAccessoryRubricArgs = {
  input: UpdateAccessoryRubricInput;
};


export type MutationDeleteAccessoryRubricArgs = {
  input: DeleteAccessoryRubricInput;
};


export type MutationCreateRubricTypeArgs = {
  input: CreateRubricTypeInput;
};


export type MutationUpdateRubricTypeArgs = {
  input: UpdateRubricTypeInput;
};


export type MutationDeleteRubricTypeArgs = {
  input: DeleteRubricTypeInput;
};


export type MutationCreateRubricArgs = {
  input: CreateRubricInput;
};


export type MutationUpdateRubricArgs = {
  input: UpdateRubricInput;
};


export type MutationDeleteRubricArgs = {
  input: DeleteRubricInput;
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


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateProductAssetsArgs = {
  input: UpdateProductAssetsInput;
};


export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};

export type Subscription = {
   __typename?: 'Subscription';
  _?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type CreateUserPayload = {
   __typename?: 'CreateUserPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phone: Scalars['String'];
  role: Scalars['String'];
};

export type UpdateUserPayload = {
   __typename?: 'UpdateUserPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type DeleteUserInput = {
  id: Scalars['ID'];
};

export type DeleteUserPayload = {
   __typename?: 'DeleteUserPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type SignUpInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  secondName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type SignUpPayload = {
   __typename?: 'SignUpPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignInPayload = {
   __typename?: 'SignInPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type SignOutPayload = {
   __typename?: 'SignOutPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
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
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  fullName: Scalars['String'];
  shortName: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  isCustomer: Scalars['Boolean'];
  isSuper: Scalars['Boolean'];
  isContractor: Scalars['Boolean'];
  isDriver: Scalars['Boolean'];
  isHelper: Scalars['Boolean'];
  isBookkeeper: Scalars['Boolean'];
  isWarehouse: Scalars['Boolean'];
  isLogistician: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isStage: Scalars['Boolean'];
};

export enum SortableUserField {
  Id = 'id',
  Email = 'email',
  Name = 'name',
  LastName = 'lastName',
  SecondName = 'secondName',
  Phone = 'phone',
  Role = 'role',
  CreatedAt = 'createdAt'
}

export type UsersPaginationPayload = {
   __typename?: 'UsersPaginationPayload';
  docs: Array<User>;
  totalDocs: Scalars['Int'];
  limit: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  totalPages: Scalars['Int'];
  pagingCounter?: Maybe<Scalars['Int']>;
  nextPage?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPrevPage?: Maybe<Scalars['Boolean']>;
};

export type CreateRoleInput = {
  name: Scalars['String'];
  type: Scalars['String'];
};

export type CreateRolePayload = {
   __typename?: 'CreateRolePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  role?: Maybe<Role>;
};

export type UpdateRoleInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateRolePayload = {
   __typename?: 'UpdateRolePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  role?: Maybe<Role>;
};

export type DeleteRoleInput = {
  id: Scalars['ID'];
};

export type DeleteRolePayload = {
   __typename?: 'DeleteRolePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Role = {
   __typename?: 'Role';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum AttributeTypeEnum {
  Select = 'select',
  MultipleSelect = 'multipleSelect',
  String = 'string',
  Number = 'number'
}

export enum ConditionTypeEnum {
  Perfect = 'perfect',
  Good = 'good',
  Normal = 'normal',
  Bad = 'bad',
  Awful = 'awful'
}

export type AttributeType = {
   __typename?: 'AttributeType';
  id: AttributeTypeEnum;
  name: Scalars['String'];
};

export type ConditionType = {
   __typename?: 'ConditionType';
  id: ConditionTypeEnum;
  name: Scalars['String'];
};

export type CreateMetricInput = {
  name: Scalars['String'];
};

export type CreateMetricPayload = {
   __typename?: 'CreateMetricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  metric?: Maybe<Metric>;
};

export type UpdateMetricInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateMetricPayload = {
   __typename?: 'UpdateMetricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  metric?: Maybe<Metric>;
};

export type DeleteMetricInput = {
  id: Scalars['ID'];
};

export type DeleteMetricPayload = {
   __typename?: 'DeleteMetricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Metric = {
   __typename?: 'Metric';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Option = {
   __typename?: 'Option';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CreateOptionsGroupInput = {
  name: Scalars['String'];
};

export type CreateOptionsGroupPayload = {
   __typename?: 'CreateOptionsGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<OptionsGroup>;
};

export type UpdateOptionsGroupInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateOptionsGroupPayload = {
   __typename?: 'UpdateOptionsGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<OptionsGroup>;
};

export type DeleteOptionsGroupInput = {
  id: Scalars['ID'];
};

export type DeleteOptionsGroupPayload = {
   __typename?: 'DeleteOptionsGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type AddOptionToGroupInput = {
  groupId: Scalars['ID'];
  name: Scalars['String'];
  color?: Maybe<Scalars['String']>;
};

export type AddOptionToGroupPayload = {
   __typename?: 'AddOptionToGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<OptionsGroup>;
};

export type UpdateOptionInGroupInput = {
  optionId: Scalars['ID'];
  groupId: Scalars['ID'];
  name: Scalars['String'];
  color?: Maybe<Scalars['String']>;
};

export type UpdateOptionInGroupPayload = {
   __typename?: 'UpdateOptionInGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<OptionsGroup>;
};

export type DeleteOptionFromGroupInput = {
  groupId: Scalars['ID'];
  optionId: Scalars['ID'];
};

export type DeleteOptionFromGroupPayload = {
   __typename?: 'DeleteOptionFromGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<OptionsGroup>;
};

export type OptionsGroup = {
   __typename?: 'OptionsGroup';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  options: Array<Option>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Attribute = {
   __typename?: 'Attribute';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  type: AttributeTypeEnum;
  metric?: Maybe<Metric>;
  slug: Scalars['String'];
  options?: Maybe<OptionsGroup>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CreateAttributesGroupInput = {
  name: Scalars['String'];
};

export type CreateAttributesGroupPayload = {
   __typename?: 'CreateAttributesGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type UpdateAttributesGroupInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type UpdateAttributesGroupPayload = {
   __typename?: 'UpdateAttributesGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type DeleteAttributesGroupInput = {
  id: Scalars['ID'];
};

export type DeleteAttributesGroupPayload = {
   __typename?: 'DeleteAttributesGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type AddAttributeToGroupInput = {
  groupId: Scalars['ID'];
  name: Scalars['String'];
  type: AttributeTypeEnum;
  metric?: Maybe<Scalars['ID']>;
  options?: Maybe<Scalars['ID']>;
};

export type AddAttributeToGroupPayload = {
   __typename?: 'AddAttributeToGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type UpdateAttributeInGroupInput = {
  attributeId: Scalars['ID'];
  groupId: Scalars['ID'];
  name: Scalars['String'];
  type: AttributeTypeEnum;
  metric?: Maybe<Scalars['ID']>;
  options?: Maybe<Scalars['ID']>;
};

export type UpdateAttributeInGroupPayload = {
   __typename?: 'UpdateAttributeInGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type DeleteAttributeFromGroupInput = {
  groupId: Scalars['ID'];
  attributeId: Scalars['ID'];
};

export type DeleteAttributeFromGroupPayload = {
   __typename?: 'DeleteAttributeFromGroupPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  group?: Maybe<AttributesGroup>;
};

export type AttributesGroup = {
   __typename?: 'AttributesGroup';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  attributes: Array<Attribute>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum SortableAccessoryField {
  Id = 'id',
  Art = 'art',
  Name = 'name',
  Price = 'price',
  CreatedAt = 'createdAt'
}

export type AccessoriesPaginationResponse = {
   __typename?: 'AccessoriesPaginationResponse';
  docs: Array<Accessory>;
  totalDocs: Scalars['Int'];
  limit: Scalars['Int'];
  page: Scalars['Int'];
  totalPages: Scalars['Int'];
  pagingCounter?: Maybe<Scalars['Int']>;
  nextPage?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPrevPage?: Maybe<Scalars['Boolean']>;
};

export type CreateAccessoryInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  images: Array<Scalars['Upload']>;
  available: Scalars['Int'];
  price: Scalars['Int'];
  rubrics: Array<Scalars['ID']>;
};

export type CreateAccessoryPayload = {
   __typename?: 'CreateAccessoryPayload';
  succes: Scalars['Boolean'];
  message: Scalars['String'];
  accessory?: Maybe<Accessory>;
};

export type UpdateAccessoryInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  images: Array<Scalars['Upload']>;
  available: Scalars['Int'];
  price: Scalars['Int'];
  rubrics: Array<Scalars['ID']>;
};

export type UpdateAccessoryPayload = {
   __typename?: 'UpdateAccessoryPayload';
  succes: Scalars['Boolean'];
  message: Scalars['String'];
  accessory?: Maybe<Accessory>;
};

export type DeleteAccessoryInput = {
  id: Scalars['ID'];
};

export type DeleteAccessoryPayload = {
   __typename?: 'DeleteAccessoryPayload';
  succes: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Accessory = {
   __typename?: 'Accessory';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Int'];
  description: Scalars['String'];
  images: Array<Scalars['String']>;
  available: Scalars['Int'];
  products: Array<Maybe<Product>>;
  rubrics: Array<Scalars['ID']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CreateAccessoryRubricInput = {
  name: Scalars['String'];
  catalogueName: Scalars['String'];
  parent?: Maybe<Scalars['ID']>;
};

export type CreateAccessoryRubricPayload = {
   __typename?: 'CreateAccessoryRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type UpdateAccessoryRubricInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  catalogueName?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['ID']>;
};

export type UpdateAccessoryRubricPayload = {
   __typename?: 'UpdateAccessoryRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type DeleteAccessoryRubricInput = {
  id: Scalars['ID'];
};

export type DeleteAccessoryRubricPayload = {
   __typename?: 'DeleteAccessoryRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type AccessoryRubric = {
   __typename?: 'AccessoryRubric';
  id: Scalars['ID'];
  parent?: Maybe<AccessoryRubric>;
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  children?: Maybe<Array<Maybe<AccessoryRubric>>>;
  totalProductsCount: Scalars['Int'];
  activeProductsCount: Scalars['Int'];
  level: Scalars['Int'];
};

export type CreateRubricTypeInput = {
  name: Scalars['String'];
};

export type CreateRubricTypePayload = {
   __typename?: 'CreateRubricTypePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  type?: Maybe<RubricType>;
};

export type UpdateRubricTypeInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateRubricTypePayload = {
   __typename?: 'UpdateRubricTypePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  type?: Maybe<RubricType>;
};

export type DeleteRubricTypeInput = {
  id: Scalars['ID'];
};

export type DeleteRubricTypePayload = {
   __typename?: 'DeleteRubricTypePayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type RubricType = {
   __typename?: 'RubricType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateRubricInput = {
  name: Scalars['String'];
  catalogueName: Scalars['String'];
  parent?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['ID']>;
};

export type CreateRubricPayload = {
   __typename?: 'CreateRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type UpdateRubricInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  catalogueName: Scalars['String'];
  parent?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['ID']>;
};

export type UpdateRubricPayload = {
   __typename?: 'UpdateRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type DeleteRubricInput = {
  id: Scalars['ID'];
};

export type DeleteRubricPayload = {
   __typename?: 'DeleteRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type AddAttributesGroupToRubricInput = {
  rubricId: Scalars['ID'];
  attributesGroupId: Scalars['ID'];
};

export type AddAttributesGroupToRubricPayload = {
   __typename?: 'AddAttributesGroupToRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type DeleteAttributesGroupFromRubricInput = {
  rubricId: Scalars['ID'];
  attributesGroupId: Scalars['ID'];
};

export type DeleteAttributesGroupFromRubricPayload = {
   __typename?: 'DeleteAttributesGroupFromRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type AddProductToRubricInput = {
  rubricId: Scalars['ID'];
  productId: Scalars['ID'];
};

export type AddProductToRubricPayload = {
   __typename?: 'AddProductToRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type DeleteProductFromRubricInput = {
  rubricId: Scalars['ID'];
  productId: Scalars['ID'];
};

export type DeleteProductFromRubricPayload = {
   __typename?: 'DeleteProductFromRubricPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  rubric?: Maybe<Rubric>;
};

export type FeaturesAstOption = {
   __typename?: 'FeaturesASTOption';
  id: Scalars['ID'];
  name: Scalars['String'];
  attributesGroups: Array<RubricAttributesGroup>;
};

export type RubricAttributesGroup = {
   __typename?: 'RubricAttributesGroup';
  showInCatalogueFilter: Scalars['Boolean'];
  node: AttributesGroup;
};

export type Rubric = {
   __typename?: 'Rubric';
  id: Scalars['ID'];
  parent?: Maybe<Rubric>;
  name: Scalars['String'];
  catalogueName: Scalars['String'];
  slug: Scalars['String'];
  active: Scalars['Boolean'];
  type?: Maybe<RubricType>;
  attributesGroups: Array<RubricAttributesGroup>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  children?: Maybe<Array<Maybe<Rubric>>>;
  totalProductsCount: Scalars['Int'];
  activeProductsCount: Scalars['Int'];
  products: Array<Product>;
  level: Scalars['Int'];
};


export type RubricChildrenArgs = {
  excluded?: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type RubricTotalProductsCountArgs = {
  contractor?: Maybe<Scalars['ID']>;
  notInContractor?: Maybe<Scalars['ID']>;
};


export type RubricActiveProductsCountArgs = {
  contractor?: Maybe<Scalars['ID']>;
  notInContractor?: Maybe<Scalars['ID']>;
};


export type RubricProductsArgs = {
  contractor?: Maybe<Scalars['ID']>;
  notInContractor?: Maybe<Scalars['ID']>;
  notInRubric?: Maybe<Scalars['ID']>;
};

export type CreateProductInput = {
  name: Scalars['String'];
  cardName: Scalars['String'];
  price: Scalars['Int'];
  description: Scalars['String'];
  images: Array<Scalars['Upload']>;
  rubrics: Array<Scalars['ID']>;
  attributesSource: Scalars['ID'];
  attributesGroups: Array<ProductAttributesGroupInput>;
};

export type ProductAttributesGroupInput = {
  source: Scalars['ID'];
  showInCard: Scalars['Boolean'];
  attributes: Array<ProductAttributeInput>;
};

export type ProductAttributeInput = {
  source: Scalars['ID'];
  showInCard: Scalars['Boolean'];
  value: Scalars['JSONObject'];
};

export type CreateProductPayload = {
   __typename?: 'CreateProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  product?: Maybe<Product>;
  attributesGroups: Array<ProductAttributesGroup>;
};

export type UpdateProductInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  cardName: Scalars['String'];
  price: Scalars['Int'];
  description: Scalars['String'];
  images: Array<Scalars['Upload']>;
  rubrics: Array<Scalars['ID']>;
  attributesSource: Scalars['ID'];
  attributesGroups: Array<ProductAttributesGroupInput>;
};

export type UpdateProductPayload = {
   __typename?: 'UpdateProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  product?: Maybe<Product>;
};

export type UpdateProductAssetsInput = {
  id: Scalars['ID'];
  images: Array<Scalars['Upload']>;
};

export type UpdateProductAssetsPayload = {
   __typename?: 'UpdateProductAssetsPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  product?: Maybe<Product>;
};

export type DeleteProductInput = {
  id: Scalars['ID'];
};

export type DeleteProductPayload = {
   __typename?: 'DeleteProductPayload';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export enum SortableProductField {
  Id = 'id',
  Art = 'art',
  Name = 'name',
  Price = 'price',
  CreatedAt = 'createdAt'
}

export type ProductsPaginationPayload = {
   __typename?: 'ProductsPaginationPayload';
  docs: Array<Product>;
  totalDocs: Scalars['Int'];
  limit: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  totalPages: Scalars['Int'];
  pagingCounter?: Maybe<Scalars['Int']>;
  nextPage?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPrevPage?: Maybe<Scalars['Boolean']>;
};

export type ProductAttribute = {
   __typename?: 'ProductAttribute';
  source: Attribute;
  showInCard: Scalars['Boolean'];
  value?: Maybe<Scalars['JSONObject']>;
};

export type ProductAttributesGroup = {
   __typename?: 'ProductAttributesGroup';
  source: AttributesGroup;
  showInCard: Scalars['Boolean'];
  attributes: Array<ProductAttribute>;
};

export type Product = {
   __typename?: 'Product';
  id: Scalars['ID'];
  itemId: Scalars['Int'];
  name: Scalars['String'];
  cardName: Scalars['String'];
  slug: Scalars['String'];
  price: Scalars['Int'];
  description: Scalars['String'];
  assets: Array<AssetItem>;
  mainImage?: Maybe<AssetItem>;
  rubrics: Array<Scalars['ID']>;
  attributesSource: Scalars['ID'];
  attributesGroups: Array<ProductAttributesGroup>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type AddAttributeToGroupMutationVariables = {
  input: AddAttributeToGroupInput;
};


export type AddAttributeToGroupMutation = (
  { __typename?: 'Mutation' }
  & { addAttributeToGroup: (
    { __typename?: 'AddAttributeToGroupPayload' }
    & Pick<AddAttributeToGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'name'>
      & { attributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'name' | 'type'>
        & { options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'name'>
        )>, metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'name'>
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
    { __typename?: 'AddAttributesGroupToRubricPayload' }
    & Pick<AddAttributesGroupToRubricPayload, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id'>
      & { attributesGroups: Array<(
        { __typename?: 'RubricAttributesGroup' }
        & Pick<RubricAttributesGroup, 'showInCatalogueFilter'>
        & { node: (
          { __typename?: 'AttributesGroup' }
          & Pick<AttributesGroup, 'id' | 'name'>
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
    { __typename?: 'AddOptionToGroupPayload' }
    & Pick<AddOptionToGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'name'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'name' | 'color'>
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
    { __typename?: 'AddProductToRubricPayload' }
    & Pick<AddProductToRubricPayload, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'activeProductsCount' | 'totalProductsCount'>
      & { products: Array<(
        { __typename?: 'Product' }
        & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
      )> }
    )> }
  ) }
);

export type CreateAttributesGroupMutationVariables = {
  input: CreateAttributesGroupInput;
};


export type CreateAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { createAttributesGroup: (
    { __typename?: 'CreateAttributesGroupPayload' }
    & Pick<CreateAttributesGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'name'>
    )> }
  ) }
);

export type CreateOptionsGroupMutationVariables = {
  input: CreateOptionsGroupInput;
};


export type CreateOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { createOptionsGroup: (
    { __typename?: 'CreateOptionsGroupPayload' }
    & Pick<CreateOptionsGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'name'>
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
    { __typename?: 'CreateProductPayload' }
    & Pick<CreateProductPayload, 'success' | 'message'>
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
    { __typename?: 'CreateRubricPayload' }
    & Pick<CreateRubricPayload, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { type?: Maybe<(
        { __typename?: 'RubricType' }
        & Pick<RubricType, 'id' | 'name'>
      )>, children?: Maybe<Array<Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
        & { type?: Maybe<(
          { __typename?: 'RubricType' }
          & Pick<RubricType, 'id' | 'name'>
        )> }
      )>>>, parent?: Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level'>
        & { children?: Maybe<Array<Maybe<(
          { __typename?: 'Rubric' }
          & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
          & { type?: Maybe<(
            { __typename?: 'RubricType' }
            & Pick<RubricType, 'id' | 'name'>
          )> }
        )>>> }
      )> }
    )> }
  ) }
);

export type CreateRubricTypeMutationVariables = {
  input: CreateRubricTypeInput;
};


export type CreateRubricTypeMutation = (
  { __typename?: 'Mutation' }
  & { createRubricType: (
    { __typename?: 'CreateRubricTypePayload' }
    & Pick<CreateRubricTypePayload, 'success' | 'message'>
    & { type?: Maybe<(
      { __typename?: 'RubricType' }
      & Pick<RubricType, 'id' | 'name'>
    )> }
  ) }
);

export type DeleteAttributeFromGroupMutationVariables = {
  input: DeleteAttributeFromGroupInput;
};


export type DeleteAttributeFromGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributeFromGroup: (
    { __typename?: 'DeleteAttributeFromGroupPayload' }
    & Pick<DeleteAttributeFromGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'name'>
      & { attributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'name' | 'type'>
        & { options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'name'>
        )>, metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'name'>
        )> }
      )> }
    )> }
  ) }
);

export type DeleteAttributesGroupMutationVariables = {
  input: DeleteAttributesGroupInput;
};


export type DeleteAttributesGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroup: (
    { __typename?: 'DeleteAttributesGroupPayload' }
    & Pick<DeleteAttributesGroupPayload, 'success' | 'message'>
  ) }
);

export type DeleteAttributesGroupFromRubricMutationVariables = {
  input: DeleteAttributesGroupFromRubricInput;
};


export type DeleteAttributesGroupFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttributesGroupFromRubric: (
    { __typename?: 'DeleteAttributesGroupFromRubricPayload' }
    & Pick<DeleteAttributesGroupFromRubricPayload, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id'>
      & { attributesGroups: Array<(
        { __typename?: 'RubricAttributesGroup' }
        & Pick<RubricAttributesGroup, 'showInCatalogueFilter'>
        & { node: (
          { __typename?: 'AttributesGroup' }
          & Pick<AttributesGroup, 'id' | 'name'>
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
    { __typename?: 'DeleteOptionFromGroupPayload' }
    & Pick<DeleteOptionFromGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'name'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'name' | 'color'>
      )> }
    )> }
  ) }
);

export type DeleteOptionsGroupMutationVariables = {
  input: DeleteOptionsGroupInput;
};


export type DeleteOptionsGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteOptionsGroup: (
    { __typename?: 'DeleteOptionsGroupPayload' }
    & Pick<DeleteOptionsGroupPayload, 'success' | 'message'>
  ) }
);

export type DeleteProductMutationVariables = {
  input: DeleteProductInput;
};


export type DeleteProductMutation = (
  { __typename?: 'Mutation' }
  & { deleteProduct: (
    { __typename?: 'DeleteProductPayload' }
    & Pick<DeleteProductPayload, 'success' | 'message'>
  ) }
);

export type DeleteProductFromRubricMutationVariables = {
  input: DeleteProductFromRubricInput;
};


export type DeleteProductFromRubricMutation = (
  { __typename?: 'Mutation' }
  & { deleteProductFromRubric: (
    { __typename?: 'DeleteProductFromRubricPayload' }
    & Pick<DeleteProductFromRubricPayload, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id'>
      & { products: Array<(
        { __typename?: 'Product' }
        & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
      )> }
    )> }
  ) }
);

export type DeleteRubricTypeMutationVariables = {
  input: DeleteRubricTypeInput;
};


export type DeleteRubricTypeMutation = (
  { __typename?: 'Mutation' }
  & { deleteRubricType: (
    { __typename?: 'DeleteRubricTypePayload' }
    & Pick<DeleteRubricTypePayload, 'success' | 'message'>
  ) }
);

export type SignInMutationVariables = {
  input: SignInInput;
};


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signIn: (
    { __typename?: 'SignInPayload' }
    & Pick<SignInPayload, 'success' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone' | 'role' | 'isAdmin' | 'isBookkeeper' | 'isContractor' | 'isDriver' | 'isHelper' | 'isLogistician' | 'isManager' | 'isStage' | 'isWarehouse' | 'isSuper'>
    )> }
  ) }
);

export type SignOutMutationVariables = {};


export type SignOutMutation = (
  { __typename?: 'Mutation' }
  & { signOut?: Maybe<(
    { __typename?: 'SignOutPayload' }
    & Pick<SignOutPayload, 'success' | 'message'>
  )> }
);

export type UpdateAttributeInGroupMutationVariables = {
  input: UpdateAttributeInGroupInput;
};


export type UpdateAttributeInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateAttributeInGroup: (
    { __typename?: 'UpdateAttributeInGroupPayload' }
    & Pick<UpdateAttributeInGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'name'>
      & { attributes: Array<(
        { __typename?: 'Attribute' }
        & Pick<Attribute, 'id' | 'name' | 'type'>
        & { options?: Maybe<(
          { __typename?: 'OptionsGroup' }
          & Pick<OptionsGroup, 'id' | 'name'>
        )>, metric?: Maybe<(
          { __typename?: 'Metric' }
          & Pick<Metric, 'id' | 'name'>
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
    { __typename?: 'UpdateAttributesGroupPayload' }
    & Pick<UpdateAttributesGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'AttributesGroup' }
      & Pick<AttributesGroup, 'id' | 'name'>
    )> }
  ) }
);

export type UpdateOptionInGroupMutationVariables = {
  input: UpdateOptionInGroupInput;
};


export type UpdateOptionInGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateOptionInGroup: (
    { __typename?: 'UpdateOptionInGroupPayload' }
    & Pick<UpdateOptionInGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'name'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'name' | 'color'>
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
    { __typename?: 'UpdateOptionsGroupPayload' }
    & Pick<UpdateOptionsGroupPayload, 'success' | 'message'>
    & { group?: Maybe<(
      { __typename?: 'OptionsGroup' }
      & Pick<OptionsGroup, 'id' | 'name'>
    )> }
  ) }
);

export type UpdateProductMutationVariables = {
  input: UpdateProductInput;
};


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { updateProduct: (
    { __typename?: 'UpdateProductPayload' }
    & Pick<UpdateProductPayload, 'success' | 'message'>
    & { product?: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'itemId' | 'name' | 'cardName' | 'slug' | 'price' | 'description' | 'rubrics' | 'attributesSource'>
      & { attributesGroups: Array<(
        { __typename?: 'ProductAttributesGroup' }
        & Pick<ProductAttributesGroup, 'showInCard'>
        & { source: (
          { __typename?: 'AttributesGroup' }
          & Pick<AttributesGroup, 'id' | 'name'>
        ), attributes: Array<(
          { __typename?: 'ProductAttribute' }
          & Pick<ProductAttribute, 'showInCard' | 'value'>
          & { source: (
            { __typename?: 'Attribute' }
            & Pick<Attribute, 'id' | 'name' | 'slug' | 'type'>
            & { metric?: Maybe<(
              { __typename?: 'Metric' }
              & Pick<Metric, 'id' | 'name'>
            )>, options?: Maybe<(
              { __typename?: 'OptionsGroup' }
              & Pick<OptionsGroup, 'id' | 'name'>
              & { options: Array<(
                { __typename?: 'Option' }
                & Pick<Option, 'id' | 'name' | 'color'>
              )> }
            )> }
          ) }
        )> }
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
    { __typename?: 'UpdateRubricPayload' }
    & Pick<UpdateRubricPayload, 'success' | 'message'>
    & { rubric?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'catalogueName' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { type?: Maybe<(
        { __typename?: 'RubricType' }
        & Pick<RubricType, 'id' | 'name'>
      )> }
    )> }
  ) }
);

export type UpdateRubricTypeMutationVariables = {
  input: UpdateRubricTypeInput;
};


export type UpdateRubricTypeMutation = (
  { __typename?: 'Mutation' }
  & { updateRubricType: (
    { __typename?: 'UpdateRubricTypePayload' }
    & Pick<UpdateRubricTypePayload, 'success' | 'message'>
    & { type?: Maybe<(
      { __typename?: 'RubricType' }
      & Pick<RubricType, 'id' | 'name'>
    )> }
  ) }
);

export type GetAllProductsQueryVariables = {
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sortDir?: Maybe<SortDirection>;
  sortBy?: Maybe<SortableProductField>;
  query?: Maybe<Scalars['String']>;
  rubric?: Maybe<Scalars['ID']>;
  notInRubric?: Maybe<Scalars['ID']>;
  contractor?: Maybe<Scalars['ID']>;
  notInContractor?: Maybe<Scalars['ID']>;
  noRubrics?: Maybe<Scalars['Boolean']>;
};


export type GetAllProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'ProductsPaginationPayload' }
    & Pick<ProductsPaginationPayload, 'totalDocs' | 'page' | 'totalPages'>
    & { docs: Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
    )> }
  ) }
);

export type GetAllRubricTypesQueryVariables = {};


export type GetAllRubricTypesQuery = (
  { __typename?: 'Query' }
  & { getAllRubricTypes: Array<(
    { __typename?: 'RubricType' }
    & Pick<RubricType, 'id' | 'name'>
  )> }
);

export type GetAttributesGroupQueryVariables = {
  id: Scalars['ID'];
};


export type GetAttributesGroupQuery = (
  { __typename?: 'Query' }
  & { getAttributesGroup?: Maybe<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'name'>
    & { attributes: Array<(
      { __typename?: 'Attribute' }
      & Pick<Attribute, 'id' | 'name' | 'type'>
      & { options?: Maybe<(
        { __typename?: 'OptionsGroup' }
        & Pick<OptionsGroup, 'id' | 'name'>
      )>, metric?: Maybe<(
        { __typename?: 'Metric' }
        & Pick<Metric, 'id' | 'name'>
      )> }
    )> }
  )> }
);

export type GetAttributesGroupsQueryVariables = {};


export type GetAttributesGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'name'>
  )> }
);

export type GetAttributesGroupsForRubricQueryVariables = {
  exclude?: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type GetAttributesGroupsForRubricQuery = (
  { __typename?: 'Query' }
  & { getAllAttributesGroups: Array<(
    { __typename?: 'AttributesGroup' }
    & Pick<AttributesGroup, 'id' | 'name'>
  )> }
);

export type GetFeaturesAstOptionsQueryVariables = {
  selected: Array<Scalars['ID']>;
};


export type GetFeaturesAstOptionsQuery = (
  { __typename?: 'Query' }
  & { getFeaturesASTOptions: Array<(
    { __typename?: 'FeaturesASTOption' }
    & Pick<FeaturesAstOption, 'id' | 'name'>
    & { attributesGroups: Array<(
      { __typename?: 'RubricAttributesGroup' }
      & { node: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'name'>
        & { attributes: Array<(
          { __typename?: 'Attribute' }
          & Pick<Attribute, 'id' | 'name' | 'type' | 'slug'>
          & { metric?: Maybe<(
            { __typename?: 'Metric' }
            & Pick<Metric, 'id' | 'name'>
          )>, options?: Maybe<(
            { __typename?: 'OptionsGroup' }
            & Pick<OptionsGroup, 'id' | 'name'>
            & { options: Array<(
              { __typename?: 'Option' }
              & Pick<Option, 'id' | 'name' | 'color'>
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
    & Pick<OptionsGroup, 'id' | 'name'>
  )>, getAllMetrics: Array<(
    { __typename?: 'Metric' }
    & Pick<Metric, 'id' | 'name'>
  )>, getAttributeTypes: Array<(
    { __typename?: 'AttributeType' }
    & Pick<AttributeType, 'id' | 'name'>
  )> }
);

export type GetNonRubricProductsQueryVariables = {
  noRubrics?: Maybe<Scalars['Boolean']>;
  page: Scalars['Int'];
  limit?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  notInRubric?: Maybe<Scalars['ID']>;
};


export type GetNonRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getAllProducts: (
    { __typename?: 'ProductsPaginationPayload' }
    & Pick<ProductsPaginationPayload, 'totalDocs' | 'page' | 'totalPages'>
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
    & Pick<OptionsGroup, 'id' | 'name'>
    & { options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, 'id' | 'name' | 'color'>
    )> }
  )> }
);

export type GetOptionsGroupsQueryVariables = {};


export type GetOptionsGroupsQuery = (
  { __typename?: 'Query' }
  & { getAllOptionsGroups: Array<(
    { __typename?: 'OptionsGroup' }
    & Pick<OptionsGroup, 'id' | 'name'>
    & { options: Array<(
      { __typename?: 'Option' }
      & Pick<Option, 'id'>
    )> }
  )> }
);

export type GetProductQueryVariables = {
  id: Scalars['ID'];
};


export type GetProductQuery = (
  { __typename?: 'Query' }
  & { getProduct?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'itemId' | 'name' | 'cardName' | 'slug' | 'price' | 'description' | 'rubrics' | 'attributesSource'>
    & { attributesGroups: Array<(
      { __typename?: 'ProductAttributesGroup' }
      & Pick<ProductAttributesGroup, 'showInCard'>
      & { source: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'name'>
      ), attributes: Array<(
        { __typename?: 'ProductAttribute' }
        & Pick<ProductAttribute, 'showInCard' | 'value'>
        & { source: (
          { __typename?: 'Attribute' }
          & Pick<Attribute, 'id' | 'name' | 'slug' | 'type'>
          & { metric?: Maybe<(
            { __typename?: 'Metric' }
            & Pick<Metric, 'id' | 'name'>
          )>, options?: Maybe<(
            { __typename?: 'OptionsGroup' }
            & Pick<OptionsGroup, 'id' | 'name'>
            & { options: Array<(
              { __typename?: 'Option' }
              & Pick<Option, 'id' | 'name' | 'color'>
            )> }
          )> }
        ) }
      )> }
    )> }
  )> }
);

export type GetRubricQueryVariables = {
  id: Scalars['ID'];
};


export type GetRubricQuery = (
  { __typename?: 'Query' }
  & { getRubric?: Maybe<(
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id' | 'name' | 'catalogueName' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
    & { type?: Maybe<(
      { __typename?: 'RubricType' }
      & Pick<RubricType, 'id' | 'name'>
    )>, parent?: Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name'>
      & { parent?: Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name'>
      )> }
    )>, children?: Maybe<Array<Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { type?: Maybe<(
        { __typename?: 'RubricType' }
        & Pick<RubricType, 'id' | 'name'>
      )>, children?: Maybe<Array<Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
        & { type?: Maybe<(
          { __typename?: 'RubricType' }
          & Pick<RubricType, 'id' | 'name'>
        )> }
      )>>> }
    )>>> }
  )> }
);

export type GetRubricAttributesQueryVariables = {
  id: Scalars['ID'];
};


export type GetRubricAttributesQuery = (
  { __typename?: 'Query' }
  & { getRubric?: Maybe<(
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id'>
    & { attributesGroups: Array<(
      { __typename?: 'RubricAttributesGroup' }
      & Pick<RubricAttributesGroup, 'showInCatalogueFilter'>
      & { node: (
        { __typename?: 'AttributesGroup' }
        & Pick<AttributesGroup, 'id' | 'name'>
      ) }
    )> }
  )> }
);

export type GetRubricProductsQueryVariables = {
  id: Scalars['ID'];
  notInRubric?: Maybe<Scalars['ID']>;
};


export type GetRubricProductsQuery = (
  { __typename?: 'Query' }
  & { getRubric?: Maybe<(
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id'>
    & { products: Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'itemId' | 'name' | 'price' | 'slug'>
    )> }
  )> }
);

export type GetRubricsTreeQueryVariables = {
  excluded?: Maybe<Array<Scalars['ID']>>;
};


export type GetRubricsTreeQuery = (
  { __typename?: 'Query' }
  & { getRubricsTree: Array<(
    { __typename?: 'Rubric' }
    & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
    & { type?: Maybe<(
      { __typename?: 'RubricType' }
      & Pick<RubricType, 'id' | 'name'>
    )>, children?: Maybe<Array<Maybe<(
      { __typename?: 'Rubric' }
      & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
      & { type?: Maybe<(
        { __typename?: 'RubricType' }
        & Pick<RubricType, 'id' | 'name'>
      )>, children?: Maybe<Array<Maybe<(
        { __typename?: 'Rubric' }
        & Pick<Rubric, 'id' | 'name' | 'level' | 'totalProductsCount' | 'activeProductsCount'>
        & { type?: Maybe<(
          { __typename?: 'RubricType' }
          & Pick<RubricType, 'id' | 'name'>
        )> }
      )>>> }
    )>>> }
  )> }
);

export type InitialQueryVariables = {};


export type InitialQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone' | 'role' | 'isAdmin' | 'isBookkeeper' | 'isContractor' | 'isDriver' | 'isHelper' | 'isLogistician' | 'isManager' | 'isStage' | 'isWarehouse' | 'isSuper'>
  )> }
);


export const AddAttributeToGroupDocument = gql`
    mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
  addAttributeToGroup(input: $input) {
    success
    message
    group {
      id
      name
      attributes {
        id
        name
        type
        options {
          id
          name
        }
        metric {
          id
          name
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
        showInCatalogueFilter
        node {
          id
          name
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
      name
      options {
        id
        name
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
      name
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
      name
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
      type {
        id
        name
      }
      totalProductsCount
      activeProductsCount
      children {
        id
        name
        level
        type {
          id
          name
        }
        totalProductsCount
        activeProductsCount
      }
      parent {
        id
        name
        level
        children {
          id
          name
          level
          type {
            id
            name
          }
          totalProductsCount
          activeProductsCount
        }
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
export const CreateRubricTypeDocument = gql`
    mutation CreateRubricType($input: CreateRubricTypeInput!) {
  createRubricType(input: $input) {
    success
    message
    type {
      id
      name
    }
  }
}
    `;
export type CreateRubricTypeMutationFn = ApolloReactCommon.MutationFunction<CreateRubricTypeMutation, CreateRubricTypeMutationVariables>;

/**
 * __useCreateRubricTypeMutation__
 *
 * To run a mutation, you first call `useCreateRubricTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRubricTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRubricTypeMutation, { data, loading, error }] = useCreateRubricTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRubricTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRubricTypeMutation, CreateRubricTypeMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRubricTypeMutation, CreateRubricTypeMutationVariables>(CreateRubricTypeDocument, baseOptions);
      }
export type CreateRubricTypeMutationHookResult = ReturnType<typeof useCreateRubricTypeMutation>;
export type CreateRubricTypeMutationResult = ApolloReactCommon.MutationResult<CreateRubricTypeMutation>;
export type CreateRubricTypeMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRubricTypeMutation, CreateRubricTypeMutationVariables>;
export const DeleteAttributeFromGroupDocument = gql`
    mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
  deleteAttributeFromGroup(input: $input) {
    success
    message
    group {
      id
      name
      attributes {
        id
        name
        type
        options {
          id
          name
        }
        metric {
          id
          name
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
    mutation DeleteAttributesGroup($input: DeleteAttributesGroupInput!) {
  deleteAttributesGroup(input: $input) {
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
 *      input: // value for 'input'
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
        showInCatalogueFilter
        node {
          id
          name
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
      name
      options {
        id
        name
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
    mutation DeleteOptionsGroup($input: DeleteOptionsGroupInput!) {
  deleteOptionsGroup(input: $input) {
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
 *      input: // value for 'input'
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
    mutation DeleteProduct($input: DeleteProductInput!) {
  deleteProduct(input: $input) {
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
 *      input: // value for 'input'
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
export const DeleteRubricTypeDocument = gql`
    mutation DeleteRubricType($input: DeleteRubricTypeInput!) {
  deleteRubricType(input: $input) {
    success
    message
  }
}
    `;
export type DeleteRubricTypeMutationFn = ApolloReactCommon.MutationFunction<DeleteRubricTypeMutation, DeleteRubricTypeMutationVariables>;

/**
 * __useDeleteRubricTypeMutation__
 *
 * To run a mutation, you first call `useDeleteRubricTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRubricTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRubricTypeMutation, { data, loading, error }] = useDeleteRubricTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteRubricTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRubricTypeMutation, DeleteRubricTypeMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRubricTypeMutation, DeleteRubricTypeMutationVariables>(DeleteRubricTypeDocument, baseOptions);
      }
export type DeleteRubricTypeMutationHookResult = ReturnType<typeof useDeleteRubricTypeMutation>;
export type DeleteRubricTypeMutationResult = ApolloReactCommon.MutationResult<DeleteRubricTypeMutation>;
export type DeleteRubricTypeMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRubricTypeMutation, DeleteRubricTypeMutationVariables>;
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
      isBookkeeper
      isContractor
      isDriver
      isHelper
      isLogistician
      isManager
      isStage
      isWarehouse
      isSuper
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
      name
      attributes {
        id
        name
        type
        options {
          id
          name
        }
        metric {
          id
          name
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
      name
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
      name
      options {
        id
        name
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
      name
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
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    success
    message
    product {
      id
      itemId
      name
      cardName
      slug
      price
      description
      rubrics
      attributesSource
      attributesGroups {
        showInCard
        source {
          id
          name
        }
        attributes {
          showInCard
          source {
            id
            name
            slug
            type
            metric {
              id
              name
            }
            options {
              id
              name
              options {
                id
                name
                color
              }
            }
          }
          value
        }
      }
    }
  }
}
    `;
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
      type {
        id
        name
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
export const UpdateRubricTypeDocument = gql`
    mutation UpdateRubricType($input: UpdateRubricTypeInput!) {
  updateRubricType(input: $input) {
    success
    message
    type {
      id
      name
    }
  }
}
    `;
export type UpdateRubricTypeMutationFn = ApolloReactCommon.MutationFunction<UpdateRubricTypeMutation, UpdateRubricTypeMutationVariables>;

/**
 * __useUpdateRubricTypeMutation__
 *
 * To run a mutation, you first call `useUpdateRubricTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRubricTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRubricTypeMutation, { data, loading, error }] = useUpdateRubricTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRubricTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRubricTypeMutation, UpdateRubricTypeMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRubricTypeMutation, UpdateRubricTypeMutationVariables>(UpdateRubricTypeDocument, baseOptions);
      }
export type UpdateRubricTypeMutationHookResult = ReturnType<typeof useUpdateRubricTypeMutation>;
export type UpdateRubricTypeMutationResult = ApolloReactCommon.MutationResult<UpdateRubricTypeMutation>;
export type UpdateRubricTypeMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRubricTypeMutation, UpdateRubricTypeMutationVariables>;
export const GetAllProductsDocument = gql`
    query GetAllProducts($page: Int, $limit: Int, $sortDir: SortDirection, $sortBy: SortableProductField, $query: String, $rubric: ID, $notInRubric: ID, $contractor: ID, $notInContractor: ID, $noRubrics: Boolean) {
  getAllProducts(limit: $limit, page: $page, sortDir: $sortDir, sortBy: $sortBy, query: $query, rubric: $rubric, notInRubric: $notInRubric, contractor: $contractor, notInContractor: $notInContractor, noRubrics: $noRubrics) {
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
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      sortDir: // value for 'sortDir'
 *      sortBy: // value for 'sortBy'
 *      query: // value for 'query'
 *      rubric: // value for 'rubric'
 *      notInRubric: // value for 'notInRubric'
 *      contractor: // value for 'contractor'
 *      notInContractor: // value for 'notInContractor'
 *      noRubrics: // value for 'noRubrics'
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
export const GetAllRubricTypesDocument = gql`
    query GetAllRubricTypes {
  getAllRubricTypes {
    id
    name
  }
}
    `;

/**
 * __useGetAllRubricTypesQuery__
 *
 * To run a query within a React component, call `useGetAllRubricTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRubricTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRubricTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRubricTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllRubricTypesQuery, GetAllRubricTypesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllRubricTypesQuery, GetAllRubricTypesQueryVariables>(GetAllRubricTypesDocument, baseOptions);
      }
export function useGetAllRubricTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllRubricTypesQuery, GetAllRubricTypesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllRubricTypesQuery, GetAllRubricTypesQueryVariables>(GetAllRubricTypesDocument, baseOptions);
        }
export type GetAllRubricTypesQueryHookResult = ReturnType<typeof useGetAllRubricTypesQuery>;
export type GetAllRubricTypesLazyQueryHookResult = ReturnType<typeof useGetAllRubricTypesLazyQuery>;
export type GetAllRubricTypesQueryResult = ApolloReactCommon.QueryResult<GetAllRubricTypesQuery, GetAllRubricTypesQueryVariables>;
export const GetAttributesGroupDocument = gql`
    query GetAttributesGroup($id: ID!) {
  getAttributesGroup(id: $id) {
    id
    name
    attributes {
      id
      name
      type
      options {
        id
        name
      }
      metric {
        id
        name
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
export const GetAttributesGroupsDocument = gql`
    query GetAttributesGroups {
  getAllAttributesGroups {
    id
    name
  }
}
    `;

/**
 * __useGetAttributesGroupsQuery__
 *
 * To run a query within a React component, call `useGetAttributesGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributesGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributesGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAttributesGroupsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAttributesGroupsQuery, GetAttributesGroupsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAttributesGroupsQuery, GetAttributesGroupsQueryVariables>(GetAttributesGroupsDocument, baseOptions);
      }
export function useGetAttributesGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAttributesGroupsQuery, GetAttributesGroupsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAttributesGroupsQuery, GetAttributesGroupsQueryVariables>(GetAttributesGroupsDocument, baseOptions);
        }
export type GetAttributesGroupsQueryHookResult = ReturnType<typeof useGetAttributesGroupsQuery>;
export type GetAttributesGroupsLazyQueryHookResult = ReturnType<typeof useGetAttributesGroupsLazyQuery>;
export type GetAttributesGroupsQueryResult = ApolloReactCommon.QueryResult<GetAttributesGroupsQuery, GetAttributesGroupsQueryVariables>;
export const GetAttributesGroupsForRubricDocument = gql`
    query GetAttributesGroupsForRubric($exclude: [ID]) {
  getAllAttributesGroups(exclude: $exclude) {
    id
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
    name
    attributesGroups {
      node {
        id
        name
        attributes {
          id
          name
          type
          slug
          metric {
            id
            name
          }
          options {
            id
            name
            options {
              id
              name
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
    name
  }
  getAllMetrics {
    id
    name
  }
  getAttributeTypes {
    id
    name
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
    query GetNonRubricProducts($noRubrics: Boolean, $page: Int!, $limit: Int, $query: String, $notInRubric: ID) {
  getAllProducts(noRubrics: $noRubrics, page: $page, limit: $limit, query: $query, notInRubric: $notInRubric) {
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
 *      noRubrics: // value for 'noRubrics'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      query: // value for 'query'
 *      notInRubric: // value for 'notInRubric'
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
    name
    options {
      id
      name
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
export const GetOptionsGroupsDocument = gql`
    query GetOptionsGroups {
  getAllOptionsGroups {
    id
    name
    options {
      id
    }
  }
}
    `;

/**
 * __useGetOptionsGroupsQuery__
 *
 * To run a query within a React component, call `useGetOptionsGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOptionsGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOptionsGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOptionsGroupsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOptionsGroupsQuery, GetOptionsGroupsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetOptionsGroupsQuery, GetOptionsGroupsQueryVariables>(GetOptionsGroupsDocument, baseOptions);
      }
export function useGetOptionsGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOptionsGroupsQuery, GetOptionsGroupsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetOptionsGroupsQuery, GetOptionsGroupsQueryVariables>(GetOptionsGroupsDocument, baseOptions);
        }
export type GetOptionsGroupsQueryHookResult = ReturnType<typeof useGetOptionsGroupsQuery>;
export type GetOptionsGroupsLazyQueryHookResult = ReturnType<typeof useGetOptionsGroupsLazyQuery>;
export type GetOptionsGroupsQueryResult = ApolloReactCommon.QueryResult<GetOptionsGroupsQuery, GetOptionsGroupsQueryVariables>;
export const GetProductDocument = gql`
    query GetProduct($id: ID!) {
  getProduct(id: $id) {
    id
    itemId
    name
    cardName
    slug
    price
    description
    rubrics
    attributesSource
    attributesGroups {
      showInCard
      source {
        id
        name
      }
      attributes {
        showInCard
        source {
          id
          name
          slug
          type
          metric {
            id
            name
          }
          options {
            id
            name
            options {
              id
              name
              color
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
export const GetRubricDocument = gql`
    query GetRubric($id: ID!) {
  getRubric(id: $id) {
    id
    name
    catalogueName
    level
    type {
      id
      name
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
      type {
        id
        name
      }
      totalProductsCount
      activeProductsCount
      children {
        id
        name
        level
        type {
          id
          name
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
      showInCatalogueFilter
      node {
        id
        name
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
    products(notInRubric: $notInRubric) {
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
    type {
      id
      name
    }
    totalProductsCount
    activeProductsCount
    children(excluded: $excluded) {
      id
      name
      level
      type {
        id
        name
      }
      totalProductsCount
      activeProductsCount
      children(excluded: $excluded) {
        id
        name
        level
        type {
          id
          name
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
    isBookkeeper
    isContractor
    isDriver
    isHelper
    isLogistician
    isManager
    isStage
    isWarehouse
    isSuper
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