import { ROUTE_CMS } from 'config/common';

describe('Companies list', () => {
  const companiesPath = `${ROUTE_CMS}/companies`;
  beforeEach(() => {
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
    cy.getByCy(`email-add`).click();
    cy.getByCy(`email-1`).type(newCompanyEmailB);
    cy.getByCy(`email-1-remove`).click();
    cy.getByCy(`remove-field-confirm`).click();
    cy.getByCy(`email-1`).should('not.exist');

    // company phones
    cy.getByCy(`phone-0`).type(newCompanyPhoneA);
    cy.getByCy(`phone-add`).click();
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
    cy.wait(1500);
    cy.getByCy('companies-list').should('contain', newCompanyName);

    // Should display company route
    cy.getByCy(`company_a-update`).click();
    cy.wait(1500);
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
    cy.wait(1500);

    // Should update company logo
    cy.getByCy(`company-assets`).click();
    cy.wait(1500);
    cy.getByCy(`company-assets-list`).should('exist');
    cy.getByCy(`logo-remove`).click();
    cy.getByCy('logo').attachFile('test-company-logo.png', {
      subjectType: 'drag-n-drop',
    });
    cy.wait(1500);

    // Should delete company
    cy.visit(companiesPath);
    cy.getByCy(`company_a-delete`).click();
    cy.getByCy(`delete-company-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.wait(1500);
    cy.getByCy('companies-list').should('not.contain', '000001');
  });

  it.only('Should update company configs', () => {
    cy.getByCy(`company_a-update`).click();
    cy.wait(1500);
    cy.getByCy(`company-global-config`).click();
    cy.wait(1500);
    cy.getByCy('company-config-globals').should('exist');

    cy.getByCy(`siteName-msk-accordion-en`).click();
    cy.getByCy('siteName-msk-en-0').clear().type('updatedCompanyName');
    cy.getByCy('siteName-msk-ru-0').clear().type('updatedCompanyName');
    cy.getByCy('siteName-submit').click();
    cy.wait(1500);

    cy.getByCy('siteFoundationYear-msk-ru-0').clear().type('1999');
    cy.getByCy('siteFoundationYear-submit').click();
    cy.wait(1500);
  });
});
