/// <reference types="cypress" />
import schema from '../../../generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_TWO,
  MOCK_RUBRIC_TYPE_EQUIPMENT,
  MOCK_RUBRIC_TYPE_STAGE,
} from '../../../../api/src/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockRubricType = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockNewRubric = 'cy-test-new-rubric-name';
const mockNewRubricA = 'cy-test-new-rubric-a';
const mockNewRubricB = 'cy-test-new-rubric-b';
const mockNewRubricC = 'cy-test-new-rubric-c';

// Rubric variants
const mockRubricVariantName = MOCK_RUBRIC_TYPE_STAGE.name[0].value;

describe('Rubrics', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
      },
    });

    cy.createTestData();
    cy.visit(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD rubrics tree', () => {
    // Should show validation errors on new rubric creation
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`catalogueName[0].value-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    // Shouldn't create a new rubric if exists on first level
    cy.getByCy(`rubric-name`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`rubric-submit`).click();
    cy.closeNotification();

    // Should create a new rubric
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).clear().type(mockNewRubricA);
    cy.getByCy(`catalogue-name`).clear().type(mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricA}`).should('exist');
    cy.closeNotification();

    // Shouldn't create a new rubric if exists on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`rubric-submit`).click();
    cy.closeNotification();

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-name`).type(mockNewRubricB);
    cy.getByCy(`catalogue-name`).type(mockNewRubricB);
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricB}`).should('exist');
    cy.closeNotification();

    // Shouldn't create a new rubric if exists on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelThreeName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`rubric-name`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');
    cy.closeNotification();

    // Should create a new rubric on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`catalogue-name`).type(mockNewRubricC);
    cy.selectOptionByTestId(`subParent`, mockNewRubricB);
    cy.getByCy(`rubric-name`).type(mockNewRubricC);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricC}`).should('exist');

    // Should have rubric details tab and have rubric variant select on first level only
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').should('exist');
    cy.getByCy('catalogue-name').should('exist');
    cy.getByCy('rubric-variant').should('exist');
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.getByCy('rubric-variant').should('not.exist');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.getByCy('rubric-variant').should('not.exist');

    // Should update rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').clear().type(mockNewRubric);
    cy.getByCy('catalogue-name').clear().type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy('rubric-submit').click();
    cy.getByCy(`tree-link-${mockNewRubric}`).should('exist');

    // Should delete rubric
    cy.getByCy(`rubric-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`success-notification`).should('exist');
  });
});
