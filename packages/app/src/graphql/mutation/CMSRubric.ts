import gql from 'graphql-tag';

const rubricFragment = gql`
  fragment CMSRubricFragment on Rubric {
    id
    name
    level
    variant {
      id
      nameString
    }
    totalProductsCount
    activeProductsCount
  }
`;

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
      rubric {
        ...CMSRubricFragment
        children {
          ...CMSRubricFragment
          children {
            ...CMSRubricFragment
          }
        }
        parent {
          id
        }
      }
    }
    ${rubricFragment}
  }
`;

export const UPDATE_RUBRIC = gql`
  mutation UpdateRubric($input: UpdateRubricInput!) {
    updateRubric(input: $input) {
      success
      message
      rubric {
        ...CMSRubricFragment
      }
    }
  }
`;

export const DELETE_RUBRIC = gql`
  mutation DeleteRubric($id: ID!) {
    deleteRubric(id: $id) {
      success
      message
    }
  }
`;
