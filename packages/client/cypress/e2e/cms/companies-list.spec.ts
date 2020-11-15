/// <reference types="cypress" />
describe('Companies list', () => {
  let mockData: any;

  beforeEach(() => {
    cy.createTestData((mocks) => {
      mockData = mocks;
    });
    cy.testAuth(`/app/cms/companies-list`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have companies list in CMS', () => {
    console.log(mockData.companyA);
    cy.getByCy('companies-list').should('exist');
  });
});
