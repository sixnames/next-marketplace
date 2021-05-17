import {
  ADULT_KEY,
  ADULT_TRUE,
  DEFAULT_LOCALE,
  GENDER_HE,
  GENDER_SHE,
  ROUTE_CMS,
  SECONDARY_LOCALE,
} from 'config/common';

describe('Rubrics', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD rubrics', () => {
    const mainRubricName = 'Вино';
    const rubricVariantName = 'Алкоголь';
    const newRubricName = 'newRubricName';
    const updatedRubricName = 'updatedRubricName';

    // Shouldn't create a new rubric if exists
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mainRubricName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mainRubricName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mainRubricName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mainRubricName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mainRubricName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mainRubricName);
    cy.selectOptionByTestId(`variantId`, rubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError();

    // Should create new rubrics
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.selectOptionByTestId(`variantId`, rubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.wait(1500);
    cy.getByCy(`${newRubricName}-row`).should('exist');

    // Should delete rubric
    cy.getByCy(`${newRubricName}-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${newRubricName}-row`).should('not.exist');

    // Should have rubric details tab and should update rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy(`details`).click();
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.selectOptionByTestId(`variantId`, rubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy('rubric-submit').click();
    cy.wait(1500);
    cy.visit(`${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${updatedRubricName}-row`).should('exist');
  });
});
