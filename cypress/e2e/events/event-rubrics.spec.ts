import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { DEFAULT_LOCALE, GENDER_HE, GENDER_SHE, SECONDARY_LOCALE } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Event rubrics', () => {
  const links = getProjectLinks({
    companyId: fixtureIds.companyA,
  });
  beforeEach(() => {
    cy.testAuth(links.cms.eventRubrics.url);
  });

  it('Should CRUD rubrics', () => {
    const mainRubricName = 'Лекции';
    const newRubricName = 'newRubricName';
    const updatedRubricName = 'updatedRubricName';

    // Should create new event rubric
    cy.getByCy(`create-event-rubric`).click();
    cy.getByCy(`create-event-rubric-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`defaultTitleI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`prefixI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`keywordI18n-${DEFAULT_LOCALE}`).type(newRubricName);
    cy.getByCy(`gender`).select(GENDER_SHE);
    cy.getByCy(`event-rubric-submit`).click();
    cy.wait(1500);
    cy.getByCy(`${newRubricName}-row`).should('exist');

    // Should delete event rubric
    cy.getByCy(`${newRubricName}-delete`).click();
    cy.getByCy('delete-event-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${newRubricName}-row`).should('not.exist');

    // Should have event rubric details tab and should update rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`details`).click();
    cy.wait(1500);
    cy.getByCy(`event-rubric-details`).should('exist');
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`defaultTitleI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`prefixI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`keywordI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricName);
    cy.getByCy(`gender`).select(GENDER_HE);
    cy.getByCy('event-rubric-submit').click();
    cy.wait(1500);
    cy.visit(links.cms.eventRubrics.url);
    cy.getByCy(`${updatedRubricName}-row`).should('exist');
  });
});
