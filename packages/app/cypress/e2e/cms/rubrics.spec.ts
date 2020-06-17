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

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockNewRubric = 'cy-test-new-rubric';

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
        CreateRubric: {
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
    // cy.getByCy(`tree-${mockNewRubric}`).should('exist');
  });

  /*it(`Shouldn't create a new rubric if exists on first level`, () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockRubricLevelOneName[0].value);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelOneName[0].value);
    cy.selectOptionByTestId(`rubric-type`, mockRubricType[0].value);
    cy.getByCy(`rubric-submit`).click();

    cy.getByCy(`error-notification`).should('exist');
  });*/

  /*it('Should create a new rubric on second level', () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockNewRubric);
    cy.getByCy(`catalogue-name`).type(mockNewRubric);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName[0].value);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.getByCy(`tree-${mockNewRubric}`).contains(mockNewRubric);
  });*/

  /*it(`Shouldn't create a new rubric if exists on second level`, () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockRubricLevelTwoName[0].value);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelTwoName[0].value);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName[0].value);
    cy.getByCy(`rubric-submit`).click();

    cy.getByCy(`error-notification`).should('exist');
  });*/

  /*it('Should create a new rubric on third level', () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockNewRubric);
    cy.getByCy(`catalogue-name`).type(mockNewRubric);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName[0].value);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName[0].value);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.getByCy(`tree-${mockNewRubric}`).contains(mockNewRubric);
  });*/

  /*it(`Shouldn't create a new rubric if exists on third level`, () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockRubricLevelThreeName[0].value);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelThreeName[0].value);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName[0].value);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName[0].value);
    cy.getByCy(`rubric-submit`).click();

    cy.getByCy(`error-notification`).should('exist');
  });*/

  /*it('Should have rubric details tab', () => {
    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').should('exist');
    cy.getByCy('catalogue-name').should('exist');
    cy.getByCy('rubric-type').should('exist');
  });*/

  /*it('Should have rubric type on first level only', () => {
    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.getByCy('rubric-type').should('not.exist');

    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.getByCy('rubric-type').should('not.exist');
  });*/

  /*it('Should update rubric', () => {
    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').clear().type(mockNewRubric);
    cy.getByCy('catalogue-name').clear().type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-type`, MOCK_RUBRIC_TYPE_STAGE.name[0].value);
    cy.getByCy('rubric-submit').click();
    cy.getByCy('rubrics-tree').contains(mockNewRubric);
  });*/
});
