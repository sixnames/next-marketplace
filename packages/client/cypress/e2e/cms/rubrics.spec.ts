/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import { DEFAULT_LANG, GENDER_HE, GENDER_IT, GENDER_SHE, SECONDARY_LANG } from '@yagu/shared';
import { getTestLangField } from '../../../utils/getLangField';
import * as faker from 'faker';

describe('Rubrics', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should validate rubric creation', () => {
    const mockRubricLevelOneName = getTestLangField(mockData.rubricLevelOneA.name);
    const mockRubricLevelTwoName = getTestLangField(mockData.rubricLevelTwoA.name);
    const mockRubricLevelThreeName = getTestLangField(mockData.rubricLevelThreeAA.name);
    const mockRubricVariantName = getTestLangField(mockData.rubricVariantAlcohol.name);

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
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).type(mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError('first');

    // Shouldn't create a new rubric if exists on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError('second');

    // Shouldn't create a new rubric if exists on third level
    cy.getByCy(`create-rubric`).click();
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).type(mockRubricLevelThreeName);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).type(mockRubricLevelThreeName);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).type(mockRubricLevelThreeName);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_IT);
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockRubricLevelThreeName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError('third');
  });

  it('Should create new rubrics', () => {
    const mockRubricVariantName = getTestLangField(mockData.rubricVariantAlcohol.name);
    const mockNewRubricA = faker.commerce.department();
    const mockNewRubricB = faker.commerce.department();
    const mockNewRubricC = faker.commerce.department();

    // Should create a new rubric on first level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).type(mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricA}`).should('exist');

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockNewRubricB);
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricB}`).should('exist');

    // Should create a new rubric on third level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.selectOptionByTestId(`parent`, mockNewRubricA);
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockNewRubricC);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.selectOptionByTestId(`subParent`, mockNewRubricB);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).type(mockNewRubricC);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).type(mockNewRubricC);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).type(mockNewRubricC);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricC}`).should('exist');
  });

  it('Should display rubric details tab', () => {
    const mockRubricLevelOneName = getTestLangField(mockData.rubricLevelOneA.name);
    const mockNewRubric = faker.commerce.department();
    const mockRubricVariantName = getTestLangField(mockData.rubricVariantJuice.name);

    // Should have rubric details tab and should update rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('details');
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(mockNewRubric);
    cy.getByCy(`name-${SECONDARY_LANG}`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-defaultTitle-${DEFAULT_LANG}`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-prefix-${DEFAULT_LANG}`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-keyword-${DEFAULT_LANG}`).clear().type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-variant`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy('rubric-submit').click();
    cy.getByCy(`tree-link-${mockNewRubric}`).should('exist');
    cy.shouldSuccess();

    // Should delete rubric
    cy.getByCy(`rubric-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`tree-link-${mockNewRubric}`).should('not.exist');
  });
});
