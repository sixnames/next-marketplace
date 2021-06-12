import { ADULT_KEY, ADULT_TRUE, ORDER_STATUS_DONE, ROUTE_CMS } from 'config/common';
import {
  SyncOrderResponseInterface,
  SyncOrderStatusesResponseInterface,
  SyncProductInterface,
  SyncResponseInterface,
  SyncUpdateOrderProductInterface,
} from 'db/syncInterfaces';

const validRequestParamsA = 'token=000001&apiVersion=0.0.1&systemVersion=8.2';
const validRequestParamsC = 'token=000003&apiVersion=0.0.1&systemVersion=8.2';

const initialBody: SyncProductInterface[] = [
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
const updateBody: SyncProductInterface[] = [
  {
    barcode: '000003',
    available: 5,
    price: 890,
  },
  {
    barcode: '000004',
    available: 5,
    price: 1000,
  },
];

const errorCallback = (res: any) => {
  const body = res.body as SyncResponseInterface;
  expect(body.success).equals(false);
};

describe('Sync', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`/`);
  });

  it('Should sync shop products with site catalogue', () => {
    // should error on no parameters
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify(initialBody),
    }).then(errorCallback);

    // should error on no request body
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify([]),
    }).then(errorCallback);

    // should error on wrong method
    cy.request({
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
    }).then(errorCallback);

    // should success
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
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

    // should update synced products
    cy.request({
      method: 'PATCH',
      url: `/api/shops/update?${validRequestParamsC}`,
      body: JSON.stringify(updateBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });
    cy.reload();
    cy.wait(1500);
    cy.getByCy('000003-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('5');
    });
    cy.getByCy('000003-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('890');
    });
    cy.getByCy('000004-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('5');
    });
    cy.getByCy('000004-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1000');
    });
  });

  it.only('Should sync shop orders with site', () => {
    // Should return order statuses list
    cy.request({
      method: 'GET',
      url: `/api/shops/get-order-statuses?${validRequestParamsC}`,
      body: JSON.stringify(updateBody),
    }).then((res) => {
      const body = res.body as SyncOrderStatusesResponseInterface;
      expect(body.success).equals(true);
      expect(body.orderStatuses?.length).greaterThan(0);
    });

    cy.makeAnOrder({});

    // should return shop new orders
    cy.request({
      method: 'GET',
      url: `/api/shops/get-orders?${validRequestParamsA}`,
    }).then((res) => {
      const { success, orders } = res.body as SyncOrderResponseInterface;
      const order = orders[0];
      const product = order.products[0];

      expect(success).equals(true);
      expect(orders).to.have.length(1);
      expect(orders[0].products).to.have.length(1);

      // should update order product
      const updateProduct: SyncUpdateOrderProductInterface = {
        ...product,
        orderId: order.orderId,
        status: ORDER_STATUS_DONE,
      };

      cy.request({
        method: 'PATCH',
        url: `/api/shops/update-order-product?${validRequestParamsA}`,
        body: JSON.stringify(updateProduct),
      }).then((res) => {
        const { success } = res.body as SyncOrderResponseInterface;
        expect(success).equals(true);
      });
    });
  });
});
