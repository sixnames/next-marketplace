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
    cy.getByCy(`name-ru`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-prefix-ru`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-keyword-ru`).type(mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');

    // Shouldn't create a new rubric if exists on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`name-ru`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-prefix-ru`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-keyword-ru`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');

    // Shouldn't create a new rubric if exists on third level
    cy.getByCy(`create-rubric`).click();
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).type(mockRubricLevelThreeName);
    cy.getByCy(`catalogueTitle-prefix-ru`).type(mockRubricLevelThreeName);
    cy.getByCy(`catalogueTitle-keyword-ru`).type(mockRubricLevelThreeName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_IT);
    cy.getByCy(`name-ru`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`error-notification`).should('exist');
  });

  it('Should create new rubrics', () => {
    // Should create a new rubric on first level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`name-ru`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-prefix-ru`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-keyword-ru`).type(mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricA}`).should('exist');

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`name-ru`).type(mockNewRubricB);
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-prefix-ru`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-keyword-ru`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricB}`).should('exist');

    // Should create a new rubric on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`name-ru`).type(mockNewRubricC);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricType);
    cy.selectOptionByTestId(`subParent`, mockNewRubricB);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).type(mockNewRubricC);
    cy.getByCy(`catalogueTitle-prefix-ru`).type(mockNewRubricC);
    cy.getByCy(`catalogueTitle-keyword-ru`).type(mockNewRubricC);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricC}`).should('exist');
  });

  it.only('Should have rubric details tab', () => {
    // Should have rubric details tab and should update rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('details');
    cy.getByCy('name-accordion-en').click();
    cy.getByCy('name-ru').clear().type(mockNewRubric);
    cy.getByCy('name-en').clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-defaultTitle-ru`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-prefix-ru`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-keyword-ru`).clear().type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
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
