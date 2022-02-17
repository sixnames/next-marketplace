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
    const newEventName = 'newEventName';
    const newEventDescription = 'newEventDescription';
    const updatedEventName = 'updatedEventName';
    const updatedEventDescription = 'updatedEventDescription';

    // Should add event to rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`events`).click();
    cy.wait(1500);
    cy.getByCy('rubric-events-list').should('exist');
    cy.getByCy(`create-rubric-event`).click();
    cy.getByCy('create-new-event-modal').should('exist');
    cy.getByCy('nameI18n-ru').type(newEventName);
    cy.getByCy('descriptionI18n-ru').type(newEventDescription);
    cy.getByCy(`submit-new-event`).click();
    cy.wait(1500);
    cy.getByCy('event-details').should('exist');

    // Should update rubric event
    cy.getByCy('nameI18n-ru').clear().type(updatedEventName);
    cy.getByCy('originalName').clear().type(updatedEventName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedEventDescription);
    cy.getByCy(`submit-event`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedEventName}-event-title`).should('exist');

    // Should delete event from rubric
    cy.visit(links.cms.rubrics.url);
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-events-list').should('exist');
    // cy.getByCy('events-search-input').clear().type(updatedEventName);
    // cy.getByCy('events-search-submit').click();
    // cy.wait(1500);
    cy.getByCy(`${updatedEventName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    // cy.getByCy('events-search-input').clear().type(updatedEventName);
    // cy.getByCy('events-search-submit').click();
    cy.getByCy(`${updatedEventName}-delete`).should('not.exist');
  });
});
