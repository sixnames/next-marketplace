/// <reference types="cypress" />
import schema from '../../../src/generated/introspectionSchema.json';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';
import {
  ME_AS_ADMIN,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_TWO,
  MOCK_RUBRIC_TYPE_EQUIPMENT,
  MOCK_RUBRIC_TYPE_STAGE,
} from '@rg/config';
import { CreateRubricInput } from '../../../src/generated/apolloComponents';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockNewRubric = 'cy-test-new-rubric';
const mockNewSecondLevelRubric = 'cy-test-new-second-level-rubric';
const mockNewThirdLevelRubric = 'cy-test-new-third-level-rubric';

const mockRubricVariantName = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockRubricVariantNameForDelete = MOCK_RUBRIC_TYPE_STAGE.name[0].value;

describe('Rubrics', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
        GetAllRubricVariants: {
          getAllRubricVariants: [
            {
              id: '11',
              nameString: mockRubricVariantName,
            },
            {
              id: '22',
              nameString: mockRubricVariantNameForDelete,
            },
          ],
        },
        GetRubric: ({ id }: { id: string }) => {
          let level = 1;
          let name = mockRubricLevelOneName;
          let catalogueName = mockRubricLevelOneName;

          if (id === '2') {
            level = 2;
          } else if (id === '3') {
            level = 3;
          }

          if (id === '2') {
            name = mockRubricLevelTwoName;
            catalogueName = mockRubricLevelTwoName;
          } else if (id === '3') {
            name = mockRubricLevelThreeName;
            catalogueName = mockRubricLevelThreeName;
          }

          return {
            getRubric: {
              id,
              name,
              catalogueName,
              level,
              variant:
                level === 1
                  ? {
                      id: '11',
                      nameString: mockRubricVariantName,
                    }
                  : null,
              totalProductsCount: 1,
              activeProductsCount: 1,
              children: [],
            },
          };
        },
        GetRubricsTree: {
          getRubricsTree: [
            {
              id: '1',
              name: mockRubricLevelOneName,
              level: 1,
              variant: {
                id: '11',
                nameString: mockRubricVariantName,
              },
              totalProductsCount: 1,
              activeProductsCount: 1,
              children: [
                {
                  id: '2',
                  name: mockRubricLevelTwoName,
                  level: 2,
                  variant: null,
                  totalProductsCount: 1,
                  activeProductsCount: 1,
                  children: [
                    {
                      id: '3',
                      name: mockRubricLevelThreeName,
                      level: 3,
                      variant: null,
                      totalProductsCount: 1,
                      activeProductsCount: 1,
                    },
                  ],
                },
              ],
            },
          ],
        },
        UpdateRubric: {
          updateRubric: {
            success: true,
            message: 'true',
            rubric: {
              id: '1',
              name: mockNewRubric,
              catalogueName: mockNewRubric,
              level: 1,
              variant: {
                id: '22',
                nameString: mockRubricVariantNameForDelete,
              },
              totalProductsCount: 1,
              activeProductsCount: 1,
            },
          },
        },
        CreateRubric: ({ input }: { input: CreateRubricInput }) => {
          if (input.parent === '1') {
            return {
              createRubric: {
                success: true,
                message: 'true',
                rubric: {
                  id: '5',
                  name: mockNewSecondLevelRubric,
                  level: 2,
                  variant: null,
                  totalProductsCount: 0,
                  activeProductsCount: 0,
                  children: [],
                  parent: {
                    id: '1',
                  },
                },
              },
            };
          }

          if (input.parent === '5') {
            return {
              createRubric: {
                success: true,
                message: 'true',
                rubric: {
                  id: '6',
                  name: mockNewThirdLevelRubric,
                  level: 3,
                  variant: null,
                  totalProductsCount: 0,
                  activeProductsCount: 0,
                  children: [],
                  parent: {
                    id: '5',
                  },
                },
              },
            };
          }

          return {
            createRubric: {
              success: true,
              message: 'true',
              rubric: {
                id: '4',
                name: mockNewRubric,
                level: 1,
                variant: {
                  id: '11',
                  nameString: mockRubricVariantName,
                },
                totalProductsCount: 0,
                activeProductsCount: 0,
                children: [],
              },
            },
          };
        },
        DeleteRubric: {
          deleteRubric: {
            success: true,
            message: 'true',
          },
        },
      },
    });

    cy.visit(`/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  it('Should CRUD rubrics tree', () => {
    // Should have rubrics list
    cy.getByCy(`rubrics-tree`).should('exist');

    // Should show validation errors on new rubric creation
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`catalogueName[0].value-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    // Should create a new rubric on first level
    cy.getByCy(`rubric-name`).type(mockNewRubric);
    cy.getByCy(`catalogue-name`).type(mockNewRubric);
    cy.getByCy(`rubric-variant`).select('11');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.getByCy(`tree-${mockNewRubric}`).should('exist');

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).type(mockNewSecondLevelRubric);
    cy.getByCy(`catalogue-name`).type(mockNewSecondLevelRubric);
    cy.getByCy(`parent`).select('1');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-${mockNewSecondLevelRubric}`).should('exist');

    // Should create a new rubric on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).type(mockNewThirdLevelRubric);
    cy.getByCy(`catalogue-name`).type(mockNewThirdLevelRubric);
    cy.getByCy(`parent`).select('1');
    cy.getByCy(`subParent`).select('5');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-${mockNewThirdLevelRubric}`).should('exist');
  });

  it('Should delete rubric', () => {
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.getByCy(`rubric-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`success-notification`).should('exist');
  });

  it('Should have rubric details tab', () => {
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').should('exist');
    cy.getByCy('catalogue-name').should('exist');
    cy.getByCy('rubric-variant').should('exist');

    // Shouldn't have rubric variant on first level only
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.getByCy('rubric-variant').should('not.exist');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.getByCy('rubric-variant').should('not.exist');

    // Should update rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').clear().type(mockNewRubric);
    cy.getByCy('catalogue-name').clear().type(mockNewRubric);
    cy.getByCy('rubric-variant').select('22');
    cy.getByCy('rubric-submit').click();
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).should('not.exist');
    cy.getByCy(`tree-link-${mockNewRubric}`).should('exist');
  });
});
