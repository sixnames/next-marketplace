import { ADULT_KEY, ADULT_TRUE, ROUTE_CMS } from 'config/common';
import { InitialSyncProductInterface, SyncResponseInterface } from 'db/syncInterfaces';

const body: InitialSyncProductInterface[] = [
  {
    barcode: '000003',
    available: 10,
    price: 1890,
  },
  {
    barcode: '000004',
    available: 1,
    price: 800,
  },
  {
    barcode: '000005',
    available: 5,
    price: 650,
  },
];

const errorCallback = (res: Cypress.Response) => {
  const body = res.body as SyncResponseInterface;
  expect(body.success).equals(false);
};

describe('Authorization', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`/`);
  });

  it('Should sync shop products with site db', () => {
    // should error on no parameters
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify(body),
    }).then(errorCallback);

    // should error on no request body
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?token=000003&apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify([]),
    }).then(errorCallback);

    // should error on wrong method
    cy.request({
      url: `/api/shops/sync?token=000003&apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify(body),
    }).then(errorCallback);

    // should success
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?token=000003&apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify(body),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });

    // should display synced products
    cy.visit(`${ROUTE_CMS}/companies`);
    cy.getByCy('companies-list').should('exist');
    cy.getByCy(`company_b-update`).click();
    cy.wait(1500);
    cy.getByCy(`company-shops`).click();
    cy.wait(1500);
    cy.getByCy(`Shop C-update`).click();
    cy.wait(1500);
    cy.getByCy(`shop-products`).click();
    cy.wait(1500);
    cy.getByCy('shop-rubrics-list').should('exist');
    cy.getByCy(`Шампанское-update`).click();
    cy.wait(1500);
    cy.getByCy('shop-rubric-products-list').should('exist');
    cy.getByCy('shop-product-main-image').should('have.length', 3);
  });
});
