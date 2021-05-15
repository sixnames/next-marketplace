import { ADULT_KEY, ADULT_TRUE, DEFAULT_CITY, ROUTE_CMS } from 'config/common';
import { MOCK_ADDRESS_A, MOCK_ADDRESS_B } from 'tests/mocks';

describe('Companies list', () => {
  const companiesPath = `${ROUTE_CMS}/companies`;
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(companiesPath);
  });

  it('Should display companies list in CMS', () => {
    const newCompanyName = 'newCompanyName';
    const newCompanyEmailA = 'newCompanyEmailA@mail.com';
    const newCompanyEmailB = 'newCompanyEmailB@mail.com';
    const newCompanyPhoneA = `79997776655`;
    const newCompanyPhoneB = `79997776656`;

    cy.getByCy('companies-list').should('exist');
    cy.getByCy('create-company').click();
    cy.getByCy('create-company-content').should('exist');

    // company name
    cy.getByCy('name').type(newCompanyName);

    // company emails
    cy.getByCy(`email-0`).type(newCompanyEmailA);
    cy.getByCy(`email-0-add`).click();
    cy.getByCy(`email-1`).type(newCompanyEmailB);
    cy.getByCy(`email-1-remove`).click();
    cy.getByCy(`remove-field-confirm`).click();
    cy.getByCy(`email-1`).should('not.exist');

    // company phones
    cy.getByCy(`phone-0`).type(newCompanyPhoneA);
    cy.getByCy(`phone-0-add`).click();
    cy.getByCy(`phone-1`).type(newCompanyPhoneB);

    // owner
    cy.getByCy(`add-owner`).click();
    cy.getByCy(`users-search-modal`).should('exist');
    cy.getByCy('user-search-input').type('guest@gmail.com');
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`000005-create`).click();
    cy.getByCy('ownerId').should('contain', 'Buyer Guest');

    // staff
    cy.getByCy(`add-staff`).click();
    cy.getByCy('user-search-input').type('user@gmail.com');
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`000006-create`).click();
    cy.getByCy(`users-search-modal`).should('not.exist');
    cy.getByCy(`000006-row`).should('exist');

    // submit
    cy.getByCy(`company-submit`).click();
    cy.shouldSuccess();
    cy.getByCy('companies-list').should('contain', newCompanyName);

    // Should display company route
    cy.getByCy(`company_a-update`).click();
    cy.getByCy('company-details').should('exist');

    const updatedCompanyName = 'updatedCompanyName';
    const updatedCompanyPhoneA = `79997776655`;
    const updatedCompanyPhoneB = `79997776656`;

    // company name
    cy.getByCy('name').should('have.value', 'Company A');
    cy.getByCy('name').clear().type(updatedCompanyName);

    // domain
    cy.getByCy('domain').clear().type('domainB.com');

    // company emails
    cy.getByCy(`email-1-remove`).click();
    cy.getByCy(`remove-field-confirm`).click();
    cy.getByCy(`email-1`).should('not.exist');

    // company phones
    cy.getByCy(`phone-0`).clear().type(updatedCompanyPhoneA);
    cy.getByCy(`phone-1`).clear().type(updatedCompanyPhoneB);

    // owner
    cy.getByCy(`add-owner`).click();
    cy.getByCy(`users-search-modal`).should('exist');
    cy.getByCy('user-search-input').type('userC@gmail.com');
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`000007-create`).click();
    cy.getByCy('ownerId').should('contain', 'C User');

    // staff
    cy.getByCy(`add-staff`).click();
    cy.getByCy('user-search-input').type('userD@gmail.com');
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`000008-create`).click();
    cy.getByCy(`users-search-modal`).should('not.exist');
    cy.getByCy(`000008-row`).should('exist');

    // submit
    cy.getByCy(`company-submit`).click();

    // Should update company logo
    cy.getByCy(`company-assets`).click();
    cy.getByCy(`company-assets-list`).should('exist');
    cy.getByCy(`logo-remove`).click();
    cy.getByCy('logo').attachFile('test-company-logo.png', {
      subjectType: 'drag-n-drop',
    });

    // Should delete company
    cy.visit(companiesPath);
    cy.getByCy(`company_a-delete`).click();
    cy.getByCy(`delete-company-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('companies-list').should('not.contain', '000001');
  });

  it('Should display company shops list', () => {
    const newShopName = 'newShopName';
    const newShopEmailA = 'newShopEmailA@mail.com';
    const newShopPhoneA = `77776665544`;

    cy.getByCy(`company_a-update`).click();
    cy.getByCy(`company-shops`).click();
    cy.getByCy('company-shops-list').should('exist');

    // Should add shop to the company
    cy.getByCy(`create-shop`).click();
    cy.getByCy(`create-shop-modal`).should('exist');

    // add name
    cy.getByCy('name').type(newShopName);

    // add city
    cy.getByCy('citySlug').select(DEFAULT_CITY);

    // add emails
    cy.getByCy(`email-0`).type(newShopEmailA);

    // add phones
    cy.getByCy(`phone-0`).type(newShopPhoneA);

    // address
    cy.getByCy(`address`).type(MOCK_ADDRESS_A.formattedAddress);
    cy.getByCy(`address-result-0`).then(($el: any) => {
      const value = $el.text();
      cy.wrap($el).click();
      cy.getByCy(`address`).should('have.value', value);
    });

    // submit
    cy.getByCy(`shop-submit`).click();
    cy.getByCy('company-shops-list').should('contain', newShopName);

    // Should delete shop from company
    cy.getByCy(`Shop A-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy('company-shops-list').should('not.contain', 'Shop A');
  });

  it('Should display shop details', () => {
    cy.getByCy(`company_a-update`).click();
    cy.getByCy(`company-shops`).click();
    cy.getByCy('company-shops-list').should('exist');
    cy.getByCy(`Shop A-update`).click();
    cy.getByCy('shop-details-page').should('exist');

    const newShopName = 'newShopName';
    const newShopEmailA = 'newShopEmailA@mail.com';
    const newShopPhoneA = `77776665544`;

    // add name
    cy.getByCy('name').clear().type(newShopName);

    // add city
    cy.getByCy('citySlug').select(DEFAULT_CITY);

    // add emails
    cy.getByCy(`email-0`).clear().type(newShopEmailA);

    // add phones
    cy.getByCy(`phone-0`).clear().type(newShopPhoneA);

    // address
    cy.getByCy(`address-clear`).click();
    cy.getByCy(`address`).type(MOCK_ADDRESS_B.formattedAddress);
    cy.getByCy(`address-result-0`).then(($el: any) => {
      const value = $el.text();
      cy.wrap($el).click();
      cy.getByCy(`address`).should('have.value', value);
    });

    // submit
    cy.getByCy(`shop-submit`).click();
    cy.getByCy('shop-details-page').should('exist');

    // add logo
    cy.getByCy(`shop-assets`).click();
    cy.getByCy('shop-assets-list').should('exist');
    cy.getByCy(`logo-remove`).click();
    cy.getByCy('logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });

    // add assets
    cy.getByCy('assets').attachFile('test-shop-asset-0.png', { subjectType: 'drag-n-drop' });
    cy.getByCy(`submit-shop-assets`).click();
  });

  it.only('Should display shop products', () => {
    cy.getByCy(`company_a-update`).click();
    cy.getByCy(`company-shops`).click();
    cy.getByCy('company-shops-list').should('exist');
    cy.getByCy(`Shop A-update`).click();
    cy.getByCy('shop-details-page').should('exist');
    cy.getByCy(`shop-products`).click();
    cy.getByCy('shop-rubrics-list').should('exist');
  });
});
