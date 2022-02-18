import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Event rubric attributes', () => {
  const links = getProjectLinks({
    companyId: fixtureIds.companyA,
  });
  beforeEach(() => {
    cy.testAuth(links.cms.companies.companyId.events.url);
  });

  it('Should CRUD event rubric attributes list', () => {
    const mainRubricName = 'Лекции';

    cy.getByCy(`${mainRubricName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`attributes`).click();
    cy.wait(1500);
    cy.getByCy(`event-rubric-attributes`).should('exist');

    // Should add attributes group to the list
    cy.getByCy('add-attributes-group').click();
    cy.selectOptionByTestId('attributes-groups', 'Характеристики вина');
    cy.getByCy(`attributes-group-submit`).click();
    cy.wait(1500);
    cy.getByCy(`Характеристики вина-delete`).should('exist');

    // Should delete attributes group from rubric
    cy.getByCy(`Характеристики вина-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`Характеристики вина-delete`).should('not.exist');

    // Should toggle attribute flags
    // filterVisibleAttributeIds
    cy.getByCy('Виноград-filterVisibleAttributeIds-checkbox').click();
    cy.wait(1500);
    cy.getByCy('Виноград-filterVisibleAttributeIds-checkbox').should('not.be.checked');
    // cmsCardAttributeIds
    cy.getByCy('Виноград-cmsCardAttributeIds-checkbox').click();
    cy.wait(1500);
    cy.getByCy('Виноград-cmsCardAttributeIds-checkbox').should('not.be.checked');
  });
});
