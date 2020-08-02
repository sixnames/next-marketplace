describe('Site configs', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/config`);
  });

  afterEach(() => {
    cy.clearTestData();
  });

  it('Should save site non asset configs', () => {
    cy.getByCy(`site-configs`).should('exist');
  });
});
