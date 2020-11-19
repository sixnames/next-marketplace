/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '@yagu/config';
import { MOCK_ADDRESS_A, MOCK_NEW_SHOP } from '@yagu/mocks';

describe('Shops list', () => {
  let mockData: any;
  const shopsPath = `/app/cms/shops${QUERY_DATA_LAYOUT_FILTER_ENABLED}`;

  beforeEach(() => {
    cy.createTestData((mocks) => {
      mockData = mocks;
    });
    cy.testAuth(shopsPath);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should display shops list in CMS', () => {
    const { shopA } = mockData;
    cy.getByCy('shops-list').should('exist');
    cy.getByCy(`${shopA.slug}-row`).should('exist');
    cy.getByCy(`${shopA.itemId}-update`).click();
    cy.getByCy('shop-details').should('exist');

    // Should update shop
    // emails
    cy.getByCy(`email-0`).clear().type(MOCK_NEW_SHOP.contacts.emails[0]);

    // phones
    cy.getByCy(`phone-0`).clear().type(MOCK_NEW_SHOP.contacts.phones[0]);

    // address
    cy.getByCy(`address-clear`).click();
    cy.getByCy(`address`).type(MOCK_ADDRESS_A.formattedAddress);
    cy.getByCy(`address-result-0`).click();

    // submit
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
  });

  it.only('Should display shop products list in CMS', () => {
    const { shopA } = mockData;
    cy.getByCy('shops-list').should('exist');
    cy.getByCy(`${shopA.slug}-row`).should('exist');
    cy.getByCy(`${shopA.itemId}-update`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('shop-products').should('exist');

    // Should delete shop product
    cy.getByCy(`${mockData.shopAProductD.itemId}-delete`).click();
    cy.getByCy(`delete-shop-product-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`${mockData.shopAProductD.itemId}-row`).should('not.exist');

    // Should update shop product
    const newAvailableAmount = `100`;
    const newPriceAmount = `9999`;
    const { shopAProductA } = mockData;
    cy.getByCy(`${shopAProductA.itemId}-update`).click();
    cy.getByCy(`update-shop-product-modal`).should('exist');
    cy.getByCy(`available`).clear().type(newAvailableAmount);
    cy.getByCy(`price`).clear().type(newPriceAmount);
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
    cy.getByCy(`${shopAProductA.itemId}-price`).should('contain', newPriceAmount);
    cy.getByCy(`${shopAProductA.itemId}-available`).should('contain', newAvailableAmount);
  });
});
