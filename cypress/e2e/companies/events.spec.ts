import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { DEFAULT_CITY } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { MOCK_ADDRESS_A } from 'tests/mocks';

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
    cy.clock(1624449303350);

    // Should add event to rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`events`).click();
    cy.wait(1500);
    cy.getByCy('rubric-events-list').should('exist');
    cy.getByCy(`create-rubric-event`).click();
    cy.getByCy('create-new-event').should('exist');

    // address
    cy.getByCy(`address`).type(MOCK_ADDRESS_A.formattedAddress);
    cy.getByCy(`address-result-0`).then(($el: any) => {
      const value = $el.text();
      cy.wrap($el).click();
      cy.getByCy(`address`).should('have.value', value);
    });

    // simple fields
    cy.getByCy('nameI18n-ru').type(newEventName);
    cy.getByCy('seatsCount').type('50');
    cy.getByCy('price').type('500');
    cy.getByCy('descriptionI18n-ru').type(newEventDescription);

    // city
    cy.getByCy('citySlug').select(DEFAULT_CITY);

    // date
    cy.get('#startAt').click();
    cy.get('.react-datepicker__day--024').click();
    cy.get('.react-datepicker__time-list-item:nth-child(4)').click();

    cy.getByCy(`submit-new-event`).click();
    cy.wait(1500);
    cy.getByCy('event-details').should('exist');

    // Should update rubric event
    cy.getByCy('nameI18n-ru').clear().type(updatedEventName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedEventDescription);
    cy.getByCy(`submit-event`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedEventName}-event-title`).should('exist');

    // Should delete event from rubric
    cy.visit(links.cms.companies.companyId.events.url);
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`events`).click();
    cy.wait(1500);
    cy.getByCy('rubric-events-list').should('exist');
    cy.getByCy(`${updatedEventName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedEventName}-delete`).should('not.exist');
  });
});
