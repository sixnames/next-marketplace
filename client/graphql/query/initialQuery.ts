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
  }
`;

const rubricFragment = gql`
  fragment SiteRubricFragment on Rubric {
    id
    name
    slug
    catalogueName
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
