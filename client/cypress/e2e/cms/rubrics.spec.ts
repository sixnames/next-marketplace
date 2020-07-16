/// <reference types="cypress" />
import {
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
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

  it('Should validate rubric creation', () => {
    // Should show validation errors on new rubric creation
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`catalogueTitle.defaultTitle[0].value-error`).should('exist');
    cy.getByCy(`catalogueTitle.keyword[0].value-error`).should('exist');
    cy.getByCy(`catalogueTitle.gender-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    // Shouldn't create a new rubric if exists on first level
    cy.getByCy(`rubric-name`).type(mockRubricLevelOneName);
    cy.getByCy(`rubric-default-title`).type(mockRubricLevelOneName);
    cy.getByCy(`rubric-title-prefix`).type(mockRubricLevelOneName);
    cy.getByCy(`rubric-title-keyword`).type(mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`rubric-title-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');

    // Shouldn't create a new rubric if exists on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).type(mockRubricLevelTwoName);
    cy.getByCy(`rubric-default-title`).type(mockRubricLevelTwoName);
    cy.getByCy(`rubric-title-prefix`).type(mockRubricLevelTwoName);
    cy.getByCy(`rubric-title-keyword`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`rubric-title-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');

    // Shouldn't create a new rubric if exists on third level
    cy.getByCy(`create-rubric`).click();
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`rubric-default-title`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-title-prefix`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-title-keyword`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-title-gender`).select(GENDER_IT);
    cy.getByCy(`rubric-name`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');
  });

  it('Should create new rubrics', () => {
    // Should create a new rubric on first level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`rubric-name`).type(mockNewRubricA);
    cy.getByCy(`rubric-default-title`).type(mockNewRubricA);
    cy.getByCy(`rubric-title-prefix`).type(mockNewRubricA);
    cy.getByCy(`rubric-title-keyword`).type(mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`rubric-title-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricA}`).should('exist');

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-name`).type(mockNewRubricB);
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`rubric-default-title`).type(mockNewRubricB);
    cy.getByCy(`rubric-title-prefix`).type(mockNewRubricB);
    cy.getByCy(`rubric-title-keyword`).type(mockNewRubricB);
    cy.getByCy(`rubric-title-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricB}`).should('exist');

    // Should create a new rubric on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`rubric-name`).type(mockNewRubricC);
    cy.selectOptionByTestId(`subParent`, mockNewRubricB);
    cy.getByCy(`rubric-default-title`).type(mockNewRubricC);
    cy.getByCy(`rubric-title-prefix`).type(mockNewRubricC);
    cy.getByCy(`rubric-title-keyword`).type(mockNewRubricC);
    cy.getByCy(`rubric-title-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricC}`).should('exist');
  });

  it('Should have rubric details tab', () => {
    // Should have rubric details tab and have rubric variant select on first level only
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('details');
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
    cy.getByCy(`rubric-default-title`).clear().type(mockNewRubric);
    cy.getByCy(`rubric-title-prefix`).clear().type(mockNewRubric);
    cy.getByCy(`rubric-title-keyword`).clear().type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`rubric-title-gender`).select(GENDER_HE);
    cy.getByCy('rubric-submit').click();
    cy.getByCy(`tree-link-${mockNewRubric}`).should('exist');
    cy.getByCy(`success-notification`).should('exist');

    // Should delete rubric
    cy.getByCy(`rubric-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`tree-link-${mockNewRubric}`).should('not.exist');
  });
});
