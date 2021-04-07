import {
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  GENDER_HE,
  GENDER_SHE,
  ROUTE_CMS,
  SECONDARY_LOCALE,
} from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Rubrics', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD rubrics', () => {
    const mockRubricAName = mockData.rubricADefaultName;
    const mockRubricVariantName = mockData.rubricVariantAlcohol.nameI18n[DEFAULT_LOCALE];
    const mockNewRubricA = 'mockNewRubricA';
    const mockNewRubricB = 'mockNewRubricB';

    // Should show validation errors on new rubric creation
    cy.getByCy(`rubrics-create`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`descriptionI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`shortDescriptionI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`catalogueTitle.defaultTitleI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`catalogueTitle.keywordI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`catalogueTitle.gender-error`).should('exist');
    cy.getByCy(`variantId-error`).should('exist');

    // Shouldn't create a new rubric if exists
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockRubricAName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mockRubricAName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mockRubricAName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mockRubricAName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mockRubricAName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mockRubricAName);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError();

    // Should create new rubrics
    cy.getByCy(`rubrics-create`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.shouldSuccess();
    cy.getByCy(`${mockNewRubricA}-row`).should('exist');

    // Should delete rubric
    cy.getByCy(`${mockNewRubricA}-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`${mockNewRubricA}-row`).should('not.exist');

    // Should have rubric details tab and should update rubric
    cy.getByCy(`${mockRubricAName}-update`).click();
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();

    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubricB);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(mockNewRubricB);

    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubricB);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubricB);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);

    cy.getByCy('rubric-submit').click();
    cy.shouldSuccess();
    cy.visit(`${DEFAULT_CITY}${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${mockNewRubricB}-row`).should('exist');
  });
});
