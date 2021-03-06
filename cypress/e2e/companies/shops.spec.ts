import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { DEFAULT_CITY } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { MOCK_ADDRESS_A, MOCK_ADDRESS_B } from 'tests/mocks';

describe('Company shops', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.companies.url);
  });

  it('Should display company shops list', () => {
    const newShopName = 'newShopName';
    const newShopEmailA = 'newShopEmailA@mail.com';
    const newShopPhoneA = `77776665544`;

    cy.getByCy(`company_a-update`).click();
    cy.wait(1500);
    cy.getByCy(`company-shops`).click();
    cy.wait(1500);
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
    cy.wait(1500);
    cy.getByCy('company-shops-list').should('contain', newShopName);

    // Should delete shop from company
    cy.getByCy(`Shop A-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.wait(1500);
    cy.getByCy('company-shops-list').should('not.contain', 'Shop A');
  });

  it('Should display shop details', () => {
    cy.getByCy(`company_a-update`).click();
    cy.getByCy(`company-shops`).click();
    cy.wait(1500);
    cy.getByCy('company-shops-list').should('exist');
    cy.getByCy(`Shop A-update`).click();
    cy.wait(1500);
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
    cy.wait(1500);
    cy.getByCy('shop-details-page').should('exist');

    // add logo
    cy.getByCy(`shop-assets`).click();
    cy.wait(1500);
    cy.getByCy('shop-assets-list').should('exist');
    cy.getByCy(`logo-remove`).click();
    cy.getByCy('logo').attachFile('test-company-logo.png', { subjectType: 'drag-n-drop' });
    cy.wait(1500);

    // add assets
    cy.getByCy('assets').attachFile('test-shop-asset-0.png', { subjectType: 'drag-n-drop' });
  });

  it('Should CRUD shop products', () => {
    // Should generate shop token
    const shopBLinks = getProjectLinks({
      companyId: fixtureIds.companyB,
      shopId: fixtureIds.shopB,
    });
    cy.visit(shopBLinks.cms.companies.companyId.shops.shop.shopId.url);
    cy.wait(1500);
    cy.getByCy('shop-details-page').should('exist');
    cy.getByCy('generate-api-token').click();
    cy.wait(1500);
    cy.getByCy('generated-token').should('exist');

    // Should display shop products list
    const shopALinks = getProjectLinks({
      companyId: fixtureIds.companyA,
      shopId: fixtureIds.shopA,
    });
    cy.visit(shopALinks.cms.companies.companyId.shops.shop.shopId.rubrics.url);
    cy.getByCy('shop-rubrics-list').should('exist');
    cy.getByCy(`????????-update`).click();
    cy.wait(1500);
    cy.getByCy('shop-rubric-products-list').should('exist');

    // Should delete shop product
    cy.getByCy('shop-product-0-delete').click();
    cy.getByCy('delete-shop-product-modal').should('exist');
    cy.getByCy('confirm').click();

    // Should update shop product
    cy.wait(1500);
    cy.getByCy('shop-product-available-1').clear().type('10');
    cy.getByCy('shop-product-price-1').clear().type('10');
    cy.getByCy('save-shop-products').first().click();
    cy.wait(1500);

    // Should create shop product
    cy.getByCy('add-shop-product').first().click();
    cy.wait(1500);
    cy.getByCy('not-in-shop-products-list').should('exist');
    cy.getByCy('product-0-checkbox').check();
    cy.getByCy('product-1-checkbox').check();
    cy.getByCy('next-step').first().click();
    cy.wait(1500);
    cy.getByCy('not-in-shop-products-list-step-2').should('exist');
    cy.getByCy('shop-product-available-0').clear().type('10');
    cy.getByCy('shop-product-price-0').clear().type('10');
    cy.getByCy('shop-product-available-1').clear().type('5');
    cy.getByCy('shop-product-price-1').clear().type('5');
    cy.getByCy('save-shop-products').first().click();
    cy.wait(1500);
    cy.getByCy('shop-rubric-products-list').should('exist');
  });

  /*it.only('Should update shop address', () => {
    cy.visit(`${ROUTE_CMS}/companies/${fixtureIds.companyA}/shops/shop/${fixtureIds.shopA}`);

    const testAddressA = '?????????????? ????????????????, ????????????, ???????????????????? ??????., ????????????, 142782';
    // const testAddressB = '?????????????????? ????????????????????, ?????????????? ????????????????, ????8??20, ????????????, ????????????, 108811';

    cy.getByCy(`address-clear`).click();
    cy.getByCy(`address`).type(testAddressA);
    cy.getByCy(`address-result-0`).then(($el: any) => {
      const value = $el.text();
      cy.wrap($el).click();
      cy.getByCy(`address`).should('have.value', value);
    });

    // submit
    cy.getByCy(`shop-submit`).click();
  });*/
});
