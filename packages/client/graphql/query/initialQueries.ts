import { gql } from '@apollo/client';
import { siteConfigFragment } from './configsQueries';
import { cartFragment } from '../mutation/cartMutations';

export const sessionUserFragment = gql`
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

export const sessionRoleFragment = gql`
  fragment SessionRoleFragment on Role {
    id
    nameString
    isStuff
  }
`;

export const setRubricNavItemAttributeOptionFragment = gql`
  fragment RubricNavItemAttributeOption on RubricNavItemAttributeOption {
    id
    slug
    nameString
    isDisabled
  }
`;

export const setRubricNavItemAttributeFragment = gql`
  fragment RubricNavItemAttribute on RubricNavItemAttribute {
    id
    isDisabled
    nameString
    options {
      ...RubricNavItemAttributeOption
    }
    visibleOptions {
      ...RubricNavItemAttributeOption
    }
    hiddenOptions {
      ...RubricNavItemAttributeOption
    }
  }
  ${setRubricNavItemAttributeOptionFragment}
`;

export const rubricFragment = gql`
  fragment SiteRubricFragment on Rubric {
    id
    nameString
    slug
    level
    variant {
      id
      nameString
    }
    navItems {
      id
      isDisabled
      attributes {
        ...RubricNavItemAttribute
      }
    }
  }
  ${setRubricNavItemAttributeFragment}
`;

export const INITIAL_QUERY = gql`
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
    getSessionCurrency
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
  ${sessionRoleFragment}
  ${sessionUserFragment}
  ${siteConfigFragment}
`;

export const INITIAL_SITE_QUERY = gql`
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
    getSessionCart {
      ...Cart
    }
  }
  ${cartFragment}
  ${sessionRoleFragment}
  ${sessionUserFragment}
  ${rubricFragment}
  ${siteConfigFragment}
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      success
      message
      user {
        ...SessionUserFragment
      }
    }
  }
  ${sessionUserFragment}
`;

export const SIGNOUT_MUTATION = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;
