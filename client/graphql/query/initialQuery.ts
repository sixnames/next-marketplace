import gql from 'graphql-tag';

export const INITIAL_QUERY = gql`
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
    getClientLanguage
    getAllLanguages {
      id
      name
      nativeName
      key
      isDefault
    }
  }
`;

const rubricFragment = gql`
  fragment SiteRubricFragment on Rubric {
    id
    name
    slug
    level
    variant {
      id
      nameString
    }
  }
`;

export const INITIAL_SITE_QUERY = gql`
  query InitialSiteQuery {
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
    getClientLanguage
    getAllLanguages {
      id
      key
      name
      nativeName
      isDefault
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

  ${rubricFragment}
`;
