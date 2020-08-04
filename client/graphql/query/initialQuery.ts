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

  ${rubricFragment}
`;
