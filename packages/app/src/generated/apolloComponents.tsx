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
  getAttributesGroup?: Maybe<AttributesGroup>;
  getAllAttributesGroups: Array<AttributesGroup>;
  getRubricVariant?: Maybe<RubricVariant>;
  getAllRubricVariants?: Maybe<Array<RubricVariant>>;
  getRubric: Rubric;
  getRubricsTree: Array<Rubric>;
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
  query?: Maybe<Scalars['String']>;
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
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  variant: AttributeVariantEnum;
  options?: Maybe<OptionsGroup>;
  metric?: Maybe<Metric>;
  slug: Scalars['String'];
};

/** Attribute type enum */
export enum AttributeVariantEnum {
  Select = 'select',
  MultipleSelect = 'multipleSelect',
  String = 'string',
  Number = 'number'
}

export type AttributesGroup = {
   __typename?: 'AttributesGroup';
  id: Scalars['ID'];
  name: Array<LanguageType>;
  nameString: Scalars['String'];
  attributes: Array<Attribute>;
};

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
  cities: Array<RubricCity>;
};


export type RubricChildrenArgs = {
  excluded?: Maybe<Array<Scalars['ID']>>;
};

export type RubricAttributesGroup = {
   __typename?: 'RubricAttributesGroup';
  showInCatalogueFilter: Scalars['Boolean'];
  node: AttributesGroup;
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
  active: Scalars['Boolean'];
  parent?: Maybe<Rubric>;
  attributesGroups: Array<RubricAttributesGroup>;
  variant?: Maybe<RubricVariant>;
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
  phone?: Maybe<Scalars['String']>;
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

export type InitialQueryVariables = {};


export type InitialQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'secondName' | 'lastName' | 'fullName' | 'shortName' | 'phone' | 'role' | 'isAdmin' | 'isManager' | 'isCustomer'>
  )> }
);


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