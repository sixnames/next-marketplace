/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '@yagu/config';
import { MOCK_NEW_COMPANY } from '@yagu/mocks';
import { getFullName } from '@yagu/shared';

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
    cy.getByCy('companies-list').should('exist');
    cy.getByCy('company-create').click();
    cy.getByCy('create-company-content').should('exist');

    // add logo
    cy.getByCy('company-logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('company-logo-text').should('contain', 'Добавлено максимальное количество файлов.');

    // company name
    cy.getByCy('nameString').type(MOCK_NEW_COMPANY.nameString);

    // company emails
    cy.getByCy(`email-0`).type(MOCK_NEW_COMPANY.contacts.emails[0]);
    cy.getByCy(`email-0-add`).click();
    cy.getByCy(`email-1`).type(MOCK_NEW_COMPANY.contacts.emails[1]);
    cy.getByCy(`email-1-remove`).click();
    cy.getByCy(`remove-field-confirm`).click();
    cy.getByCy(`email-1`).should('not.exist');

    // company phones
    cy.getByCy(`phone-0`).type(MOCK_NEW_COMPANY.contacts.phones[0]);
    cy.getByCy(`phone-0-add`).click();
    cy.getByCy(`phone-1`).type(MOCK_NEW_COMPANY.contacts.phones[1]);

    // owner
    cy.getByCy(`add-owner`).click();
    cy.getByCy(`users-search-modal`).should('exist');
    cy.getByCy('user-search-input').type(mockData.sampleUser.email);
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`${mockData.sampleUser.itemId}-create`).click();
    cy.getByCy('owner').should('contain', getFullName(mockData.sampleUser));

    // staff
    cy.getByCy(`add-staff`).click();
    cy.getByCy('user-search-input').type(mockData.sampleUserB.email);
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`${mockData.sampleUserB.itemId}-create`).click();
    cy.getByCy(`users-search-modal`).should('not.exist');
    cy.getByCy(`${mockData.sampleUserB.itemId}`).should('exist');

    // submit
    cy.getByCy(`company-submit`).click();
    cy.shouldSuccess();
    cy.getByCy('companies-list').should('contain', MOCK_NEW_COMPANY.nameString);

    // Should delete company
    cy.getByCy(`${mockData.companyA.slug}-delete`).click();
    cy.getByCy(`delete-company-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.shouldSuccess();
    cy.getByCy('companies-list').should('not.contain', mockData.companyA.itemId);
  });

  it.only('Should have company route', () => {
    const { companyA } = mockData;

    cy.getByCy('companies-list').should('exist');
    cy.getByCy(`${companyA.slug}-update`).click();
    cy.getByCy('company-details').should('exist');

    // company name
    cy.getByCy('nameString').should('have.value', companyA.nameString);
    cy.getByCy('nameString').clear().type(MOCK_NEW_COMPANY.nameString);

    // company emails
    cy.getByCy(`email-1-remove`).click();
    cy.getByCy(`remove-field-confirm`).click();
    cy.getByCy(`email-1`).should('not.exist');

    // company phones
    cy.getByCy(`phone-0`).clear().type(MOCK_NEW_COMPANY.contacts.phones[0]);
    cy.getByCy(`phone-1`).clear().type(MOCK_NEW_COMPANY.contacts.phones[1]);

    // owner
    cy.getByCy(`add-owner`).click();
    cy.getByCy(`users-search-modal`).should('exist');
    cy.getByCy('user-search-input').type(mockData.sampleUser.email);
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`${mockData.sampleUser.itemId}-create`).click();
    cy.getByCy('owner').should('contain', getFullName(mockData.sampleUser));

    // staff
    cy.getByCy(`add-staff`).click();
    cy.getByCy('user-search-input').type(mockData.sampleUserB.email);
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`${mockData.sampleUserB.itemId}-create`).click();
    cy.getByCy(`users-search-modal`).should('not.exist');
    cy.getByCy(`${mockData.sampleUserB.itemId}`).should('exist');

    // submit
    cy.getByCy(`company-submit`).click();
    cy.shouldSuccess();
  });
});
