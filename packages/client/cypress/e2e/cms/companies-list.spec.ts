/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '@yagu/config';
import { MOCK_NEW_COMPANY } from '@yagu/mocks';

describe('Companies list', () => {
  let mockData: any;

  beforeEach(() => {
    cy.createTestData((mocks) => {
      mockData = mocks;
    });
    cy.testAuth(`/app/cms/companies${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should have companies list in CMS', () => {
    console.log(mockData.companyA);
    cy.getByCy('companies-list').should('exist');
    cy.getByCy('company-create').click();
    cy.getByCy('create-new-company-modal').should('exist');

    // add logo
    cy.getByCy('company-logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('company-logo-text').should('contain', 'Добавлено максимальное количество файлов.');

    // fill inputs
    cy.getByCy('nameString').type(MOCK_NEW_COMPANY.nameString);
  });
});
