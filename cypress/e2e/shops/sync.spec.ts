import { ADULT_KEY, ADULT_TRUE, ORDER_STATUS_DONE, ROUTE_CMS } from 'config/common';
import {
  SyncOrderResponseInterface,
  SyncOrderStatusesResponseInterface,
  SyncProductInterface,
  SyncResponseInterface,
  SyncShopProductsResponseInterface,
  SyncUpdateOrderProductInterface,
} from 'db/syncInterfaces';

const validRequestParamsA = 'token=000001&apiVersion=0.0.1&systemVersion=8.2';
const validRequestParamsC = 'token=000003&apiVersion=0.0.1&systemVersion=8.2';

const initialBody: SyncProductInterface[] = [
  {
    barcode: '9999999999999999',
    available: 999,
    price: 999,
    name: 'notFoundProduct',
  },
  {
    barcode: '000003',
    available: 10,
    price: 1890,
    name: '000003',
  },
  {
    barcode: '000004',
    available: 1,
    price: 800,
    name: '000004',
  },
  {
    barcode: '000005',
    available: 5,
    price: 650,
    name: '000005',
  },
];

const secondarySyncBody: SyncProductInterface[] = [
  {
    barcode: '000003',
    available: 1,
    price: 1,
    name: '000003',
  },
  {
    barcode: '000004',
    available: 1,
    price: 1,
    name: '000004',
  },
  {
    barcode: '000005',
    available: 1,
    price: 1,
    name: '000005',
  },
  {
    barcode: '000006',
    available: 1,
    price: 1,
    name: '000006',
  },
];

const updateBody: SyncProductInterface[] = [
  {
    barcode: '000003',
    available: 5,
    price: 890,
    name: '000003',
  },
  {
    barcode: '000004',
    available: 5,
    price: 1000,
    name: '000004',
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

  it('Should sync shop orders with site', () => {
    const currentDate = new Date().toISOString();

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
      url: `/api/shops/get-orders?${validRequestParamsA}&fromDate=${currentDate}`,
    }).then((res) => {
      const { success, orders } = res.body as SyncOrderResponseInterface;
      const order = orders[0];
      const product = order.products[0];

      expect(success).equals(true);
      expect(orders).to.have.length(1);
      expect(orders[0].products).to.have.length(2);

      // should update order product
      const updateProduct: SyncUpdateOrderProductInterface = {
        ...product,
        amount: 55,
        orderId: order.orderId,
        status: ORDER_STATUS_DONE,
      };

      cy.request({
        method: 'PATCH',
        url: `/api/shops/update-order-product?${validRequestParamsA}`,
        body: JSON.stringify([updateProduct]),
      }).then((res) => {
        const { success } = res.body as SyncOrderResponseInterface;
        expect(success).equals(true);
      });
    });
  });

  it('Should generate shop token', () => {
    cy.visit(`${ROUTE_CMS}/companies`);
    cy.wait(1500);
    cy.getByCy(`company_b-update`).click();
    cy.getByCy(`company-shops`).click();
    cy.wait(1500);
    cy.getByCy('company-shops-list').should('exist');
    cy.getByCy(`Shop B-update`).click();
    cy.wait(1500);
    cy.getByCy('shop-details-page').should('exist');
    cy.getByCy('generate-api-token').click();
    cy.wait(1500);
    cy.getByCy('generated-token').should('exist');
  });

  it.only('Should sync shop products with site catalogue', () => {
    // should error on no parameters
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify(initialBody),
      failOnStatusCode: false,
    }).then(errorCallback);

    // should error on no request body
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify([]),
      failOnStatusCode: false,
    }).then(errorCallback);

    // should error on wrong method
    cy.request({
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
      failOnStatusCode: false,
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

    // should update existing shop products and creat new ones
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(secondarySyncBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });
    cy.reload();
    cy.wait(1500);
    cy.getByCy('000003-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });
    cy.getByCy('000003-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });
    cy.getByCy('000006-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });
    cy.getByCy('000006-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });

    // Should update synced products
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

    // Should display sync errors list
    cy.getByCy('shop-sync-errors').click();
    cy.wait(1500);
    cy.getByCy('shop-sync-errors-page').should('exist');
    cy.getByCy('notFoundProduct-row').should('exist');

    // Should return shop products list
    cy.request({
      method: 'GET',
      url: `/api/shops/get-shop-products?${validRequestParamsC}`,
    }).then((res) => {
      const body = res.body as SyncShopProductsResponseInterface;
      expect(body.success).equals(true);
      expect(body.shopProducts.length).equals(secondarySyncBody.length);
    });
  });
});
