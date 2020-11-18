/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '@yagu/config';

describe('Shops list', () => {
  let mockData: any;

  beforeEach(() => {
    cy.createTestData((mocks) => {
      mockData = mocks;
    });
    cy.testAuth(`/app/cms/shops${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should display shops list in CMS', () => {
    cy.getByCy('shops-list').should('exist');
    cy.getByCy(`${mockData.shopA.slug}-row`).should('exist');
  });
});
