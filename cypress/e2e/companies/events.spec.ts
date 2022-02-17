import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Event rubric events', () => {
  const links = getProjectLinks({
    companyId: fixtureIds.companyA,
  });
  beforeEach(() => {
    cy.testAuth(links.cms.companies.companyId.events.url);
  });

  it('Should CRUD rubric events', () => {
    const mainRubricName = 'Лекции';
    const newProductName = 'newProductName';
    const newProductDescription = 'newProductDescription';
    const updatedProductName = 'updatedProductName';
    const updatedProductDescription = 'updatedProductDescription';

    // Should add event to rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-events-list').should('exist');
    cy.getByCy(`create-rubric-event`).click();
    cy.getByCy('create-new-event-modal').should('exist');
    cy.getByCy('nameI18n-ru').type(newProductName);
    cy.getByCy('originalName').type(newProductName);
    cy.getByCy('descriptionI18n-ru').type(newProductDescription);
    cy.getByCy(`submit-new-event`).click();
    cy.wait(1500);
    cy.getByCy('event-details').should('exist');

    // Should update rubric event
    cy.getByCy('nameI18n-ru').clear().type(updatedProductName);
    cy.getByCy('originalName').clear().type(updatedProductName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedProductDescription);
    cy.getByCy(`submit-event`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-event-title`).should('exist');

    // Should delete event from rubric
    cy.visit(links.cms.rubrics.url);
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-events-list').should('exist');
    // cy.getByCy('events-search-input').clear().type(updatedProductName);
    // cy.getByCy('events-search-submit').click();
    // cy.wait(1500);
    cy.getByCy(`${updatedProductName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    // cy.getByCy('events-search-input').clear().type(updatedProductName);
    // cy.getByCy('events-search-submit').click();
    cy.getByCy(`${updatedProductName}-delete`).should('not.exist');
  });
});
