import { gql } from '@apollo/client';

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

const sessionRoleFragment = gql`
  fragment SessionRoleFragment on Role {
    id
    nameString
    isStuff
  }
`;

const rubricFragment = gql`
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
  ${sessionRoleFragment}
  ${sessionUserFragment}
`;

export const INITIAL_SITE_QUERY = gql`
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
  ${sessionRoleFragment}
  ${sessionUserFragment}
  ${rubricFragment}
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
