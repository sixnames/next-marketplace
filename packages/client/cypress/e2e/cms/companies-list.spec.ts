/// <reference types="cypress" />
import {
  DEFAULT_CITY,
  MOCK_ADDRESS_A,
  MOCK_NEW_COMPANY,
  MOCK_NEW_SHOP,
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
} from '@yagu/shared';
import { getFullName } from '../../../utils/nameUtils';

describe('Companies list', () => {
  let mockData: any;
  const companiesPath = `/app/cms/companies${QUERY_DATA_LAYOUT_FILTER_ENABLED}`;
  beforeEach(() => {
    cy.createTestData((mocks) => {
      mockData = mocks;
    });
    cy.testAuth(companiesPath);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should display companies list in CMS', () => {
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
    cy.getByCy(`${mockData.sampleUserB.itemId}-row`).should('exist');

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

  it('Should display company route', () => {
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
    cy.getByCy(`${mockData.sampleUserB.itemId}-row`).should('exist');

    // submit
    cy.getByCy(`company-submit`).click();
    cy.shouldSuccess();
  });

  it('Should display company shops list', () => {
    const { companyA } = mockData;
    cy.getByCy(`${companyA.slug}-update`).click();
    cy.visitMoreNavLink('shops');
    cy.getByCy('company-shops-list').should('exist');
    cy.getByCy(`${mockData.shopA.slug}-row`).should('exist');

    // Should add shop to the company
    cy.getByCy(`create-shop`).click();
    cy.getByCy(`create-shop-modal`).should('exist');

    // add logo
    cy.getByCy('shop-logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });

    // add assets
    cy.getByCy('shop-assets').attachFile('test-shop-asset-0.png', { subjectType: 'drag-n-drop' });

    // add name
    cy.getByCy('nameString').type(MOCK_NEW_SHOP.nameString);

    // add city
    cy.getByCy('city').select(DEFAULT_CITY);

    // add emails
    cy.getByCy(`email-0`).type(MOCK_NEW_SHOP.contacts.emails[0]);

    // add phones
    cy.getByCy(`phone-0`).type(MOCK_NEW_SHOP.contacts.phones[0]);

    // address
    cy.getByCy(`address`).type(MOCK_ADDRESS_A.formattedAddress);
    cy.getByCy(`address-result-0`).click();
    cy.getByCy(`address`).should('have.value', MOCK_ADDRESS_A.formattedAddress);

    // submit
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
    cy.getByCy(`create-shop-modal`).should('not.exist');
    cy.getByCy('company-shops-list').should('contain', MOCK_NEW_SHOP.nameString);

    // Should have shop details link
    cy.getByCy(`${mockData.shopA.itemId}-update`).click();
    cy.getByCy('shop-details').should('exist');

    // Should delete shop
    cy.visit(companiesPath);
    cy.getByCy(`${companyA.slug}-update`).click();
    cy.visitMoreNavLink('shops');
    cy.getByCy(`${mockData.shopA.itemId}-delete`).click();
    cy.getByCy(`delete-shop-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.shouldSuccess();
    cy.getByCy(`${mockData.shopA.itemId}-row`).should('not.exist');
  });
});
