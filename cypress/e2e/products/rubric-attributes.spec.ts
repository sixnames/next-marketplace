import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Rubric attributes', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.rubrics.url);
  });

  it('Should CRUD rubric attributes list', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy(`attributes`).click();
    cy.getByCy(`rubric-attributes`).should('exist');

    // Should delete attributes group from rubric
    cy.getByCy(`Характеристики вина-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`Характеристики вина-delete`).should('not.exist');

    // Should add attributes group to the list
    cy.getByCy('add-attributes-group').click();
    cy.selectOptionByTestId('attributes-groups', 'Характеристики вина');
    cy.getByCy(`attributes-group-submit`).click();
    cy.wait(1500);
    cy.getByCy(`Характеристики вина-delete`).should('exist');
  });
});
