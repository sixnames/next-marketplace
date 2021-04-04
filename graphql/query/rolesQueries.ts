import { gql } from '@apollo/client';

export const cmsRoleFragment = gql`
  fragment CmsRole on Role {
    _id
    name
    slug
    isStaff
    description
    nameI18n
  }
`;

export const GET_ALL_ROLES_QUERY = gql`
  query GetAllRoles {
    getAllRoles {
      ...CmsRole
    }
  }
  ${cmsRoleFragment}
`;

export const GET_ROLE_QUERY = gql`
  query GetRole($_id: ObjectId!) {
    getRole(_id: $_id) {
      ...CmsRole
    }
  }
  ${cmsRoleFragment}
`;
