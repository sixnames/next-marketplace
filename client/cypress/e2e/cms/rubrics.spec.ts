/// <reference types="cypress" />
import {
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_TWO_A,
  MOCK_RUBRIC_TYPE_ALCOHOL,
  MOCK_RUBRIC_TYPE_JUICE,
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
} from '../../../config';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO_A.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE_A_A.name[0].value;
const mockRubricType = MOCK_RUBRIC_TYPE_ALCOHOL.name[0].value;
const mockNewRubric = 'new_rubric_name';
const mockNewRubricA = 'new_rubric_a';
const mockNewRubricB = 'new_rubric_b';
const mockNewRubricC = 'new_rubric_c';

// Rubric variants
const mockRubricVariantName = MOCK_RUBRIC_TYPE_JUICE.name[0].value;

describe('Rubrics', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
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

    // Should create a new rubric
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).clear().type(mockNewRubricA);
    cy.getByCy(`catalogue-name`).clear().type(mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricA}`).should('exist');

    // Shouldn't create a new rubric if exists on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`rubric-submit`).click();

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-name`).type(mockNewRubricB);
    cy.getByCy(`catalogue-name`).type(mockNewRubricB);
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricB}`).should('exist');

    // Shouldn't create a new rubric if exists on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelThreeName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`rubric-name`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');

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
    cy.visitMoreNavLink('details');
    cy.getByCy('rubric-name').should('exist');
    cy.getByCy('catalogue-name').should('exist');
    cy.getByCy('rubric-variant').should('exist');
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('details');
    cy.getByCy('rubric-variant').should('not.exist');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('details');
    cy.getByCy('rubric-variant').should('not.exist');

    // Should update rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('details');
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
