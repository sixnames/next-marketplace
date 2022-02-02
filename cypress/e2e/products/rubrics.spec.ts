import { DEFAULT_LOCALE, GENDER_HE, GENDER_SHE, SECONDARY_LOCALE } from 'config/common';
import { getProjectLinks } from '../../../lib/getProjectLinks';
import { fixtureIds } from '../../fixtures/fixtureIds';

describe('Rubrics', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.rubrics.url);
  });

  it('Should CRUD rubrics', () => {
    const mainRubricName = 'Вино';
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
    cy.getByCy(`variantId`).select(fixtureIds.rubricVariantAlcohol);
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
    cy.getByCy(`variantId`).select(fixtureIds.rubricVariantAlcohol);
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
    cy.getByCy(`rubric-details`).should('exist');
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);
    cy.getByCy('rubric-submit').click();
    cy.wait(1500);
    cy.visit(links.cms.rubrics.url);
    cy.getByCy(`${updatedRubricName}-row`).should('exist');
  });
});
