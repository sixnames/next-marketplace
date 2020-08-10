import gql from 'graphql-tag';

export const GET_ALL_ROLES_QUERY = gql`
  query GetAllRoles {
    getAllRoles {
      id
      nameString
    }
  }
`;

export const GET_ROLE_QUERY = gql`
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
