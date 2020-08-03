const newSiteName = 'new site name';
const newSitePhone = '+89990007766';

describe('Site configs', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/config`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should save site non asset configs', () => {
    cy.getByCy(`site-configs`).should('exist');
    cy.getByCy('inputs[0].value[0]').clear().type(newSiteName);

    // Should create additional field of config and remove it
    cy.getByCy('inputs[2].value[0]-add').click();
    cy.getByCy('inputs[2].value[1]').type(newSitePhone);
    cy.getByCy('site-configs-submit').click();
    cy.getByCy('inputs[0].value[0]').should('have.value', newSiteName);
    cy.getByCy('inputs[2].value[1]').should('have.value', newSitePhone);
    cy.getByCy('inputs[2].value[1]-remove').click();
    cy.getByCy(`remove-field-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('inputs[2].value[1]').should('not.exist');
  });
});
