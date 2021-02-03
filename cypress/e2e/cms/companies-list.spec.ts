import { DEFAULT_CITY } from 'config/common';
import { getFullName } from 'lib/nameUtils';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';
import { MOCK_ADDRESS_A } from 'tests/mockData';

describe('Companies list', () => {
  const companiesPath = `/cms/companies`;
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(companiesPath);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should display companies list in CMS', () => {
    const newCompanyName = 'newCompanyName';
    const newCompanyEmailA = 'newCompanyEmailA@mail.com';
    const newCompanyEmailB = 'newCompanyEmailB@mail.com';
    const newCompanyPhoneA = `79997776655`;
    const newCompanyPhoneB = `79997776656`;

    cy.getByCy('companies-list').should('exist');
    cy.getByCy('company-create').click();
    cy.getByCy('create-company-content').should('exist');

    // add logo
    cy.getByCy('logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });

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
    cy.getByCy('user-search-input').type(mockData.sampleUser.email);
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`${mockData.sampleUser.itemId}-create`).click();
    cy.getByCy('ownerId').should('contain', getFullName(mockData.sampleUser));

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
    cy.getByCy('companies-list').should('contain', newCompanyName);

    // Should delete company
    cy.getByCy(`${mockData.companyA.slug}-delete`).click();
    cy.getByCy(`delete-company-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.shouldSuccess();
    cy.getByCy('companies-list').should('not.contain', mockData.companyA.itemId);
  });

  it('Should display company route', () => {
    const { companyA } = mockData;
    const newCompanyName = 'newCompanyName';
    const newCompanyPhoneA = `79997776655`;
    const newCompanyPhoneB = `79997776656`;

    cy.getByCy('companies-list').should('exist');
    cy.getByCy(`${companyA.slug}-update`).click();
    cy.getByCy('company-details').should('exist');

    // company name
    cy.getByCy('name').should('have.value', companyA.name);
    cy.getByCy('name').clear().type(newCompanyName);

    // company emails
    cy.getByCy(`email-1-remove`).click();
    cy.getByCy(`remove-field-confirm`).click();
    cy.getByCy(`email-1`).should('not.exist');

    // company phones
    cy.getByCy(`phone-0`).clear().type(newCompanyPhoneA);
    cy.getByCy(`phone-1`).clear().type(newCompanyPhoneB);

    // owner
    cy.getByCy(`add-owner`).click();
    cy.getByCy(`users-search-modal`).should('exist');
    cy.getByCy('user-search-input').type(mockData.sampleUser.email);
    cy.getByCy('user-search-submit').click();
    cy.getByCy(`${mockData.sampleUser.itemId}-create`).click();
    cy.getByCy('ownerId').should('contain', getFullName(mockData.sampleUser));

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
    const newShopName = 'newShopName';
    const newShopEmailA = 'newShopEmailA@mail.com';
    const newShopPhoneA = `77776665544`;

    cy.getByCy(`${companyA.slug}-update`).click();
    cy.visitMoreNavLink('shops');
    cy.getByCy('company-shops-list').should('exist');
    cy.getByCy(`${mockData.shopA.slug}-row`).should('exist');

    // Should add shop to the company
    cy.getByCy(`create-shop`).click();
    cy.getByCy(`create-shop-modal`).should('exist');

    // add logo
    cy.getByCy('logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });

    // add assets
    cy.getByCy('assets').attachFile('test-shop-asset-0.png', { subjectType: 'drag-n-drop' });

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
    cy.getByCy(`address-result-0`).click();
    cy.getByCy(`address`).should('have.value', MOCK_ADDRESS_A.formattedAddress);

    // submit
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
    cy.getByCy(`create-shop-modal`).should('not.exist');
    cy.getByCy('company-shops-list').should('contain', newShopName);

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