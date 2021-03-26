import { gql } from '@apollo/client';
import { siteConfigFragment } from './configsQueries';
import { cartFragment } from '../mutation/cartMutations';

export const appNavItemFragment = gql`
  fragment AppNavItem on NavItem {
    _id
    name
    icon
    path
  }
`;

export const appNavParentItemFragment = gql`
  fragment AppNavParentItem on NavItem {
    ...AppNavItem
    appNavigationChildren {
      ...AppNavItem
    }
  }
  ${appNavItemFragment}
`;

export const sessionRoleFragment = gql`
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
  ${appNavParentItemFragment}
`;

export const sessionUserFragment = gql`
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
  ${sessionRoleFragment}
`;

export const setRubricNavItemAttributeOptionFragment = gql`
  fragment RubricNavItemAttributeOption on RubricOption {
    _id
    slug
    name
  }
`;

export const setRubricNavItemAttributeFragment = gql`
  fragment RubricNavItemAttribute on RubricAttribute {
    _id
    name
    options {
      ...RubricNavItemAttributeOption
    }
  }
  ${setRubricNavItemAttributeOptionFragment}
`;

export const catalogueNavRubricFragment = gql`
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
  ${setRubricNavItemAttributeFragment}
`;

export const initialQueryCityFragment = gql`
  fragment InitialQueryCity on City {
    _id
    slug
    name
  }
`;

export const SESSION_USER_QUERY = gql`
  query SessionUser {
    me {
      ...SessionUser
    }
  }
  ${sessionUserFragment}
`;

export const SESSION_CART_QUERY = gql`
  query SessionCart {
    getSessionCart {
      ...Cart
    }
  }
  ${cartFragment}
`;

export const initialQueryLanguageFragment = gql`
  fragment InitialQueryLanguage on Language {
    _id
    slug
    name
    nativeName
  }
`;

export const initialDataFragment = gql`
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
  ${initialQueryCityFragment}
  ${siteConfigFragment}
  ${initialQueryLanguageFragment}
`;

// Catalogue
export const INITIAL_SITE_QUERY = gql`
  query InitialSite {
    ...InitialData
    getCatalogueNavRubrics {
      ...CatalogueNavRubric
    }
  }
  ${initialDataFragment}
  ${catalogueNavRubricFragment}
`;

// App
export const INITIAL_APP_QUERY = gql`
  query InitialApp {
    ...InitialData
  }
  ${initialDataFragment}
`;
