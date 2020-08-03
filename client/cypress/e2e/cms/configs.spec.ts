const newSiteName = 'new site name';

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
    cy.getByCy('site-configs-submit').click();
    cy.getByCy('inputs[0].value[0]').should('have.value', newSiteName);
  });
});
