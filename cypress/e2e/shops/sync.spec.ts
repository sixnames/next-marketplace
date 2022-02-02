import { REQUEST_METHOD_GET, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import {
  SyncBlackListProductInterface,
  SyncBlacklistResponseInterface,
  SyncOrderResponseInterface,
  SyncOrderStatusesResponseInterface,
  SyncProductInterface,
  SyncResponseInterface,
  SyncShopProductsResponseInterface,
  SyncUpdateOrderProductInterface,
} from 'db/syncInterfaces';
import { getProjectLinks } from '../../../lib/getProjectLinks';
import { getCmsCompanyLinks } from '../../../lib/linkUtils';

const validRequestParamsA = 'token=000001';
const validRequestParamsC = 'token=000003';

const errorBarcode = '9999999999999999';
const errorBarcodeB = '9999999999999999B';

const newSyncErrorName = 'newSyncErrorName';
const updateSyncErrorBody: SyncProductInterface[] = [
  {
    barcode: [errorBarcode, errorBarcodeB],
    available: 0,
    price: 100,
    name: newSyncErrorName,
  },
];

const initialBody: SyncProductInterface[] = [
  {
    barcode: [errorBarcode, errorBarcodeB],
    available: 999,
    price: 999,
    name: errorBarcode,
  },
  {
    barcode: ['000140', '0001409999'],
    available: 10,
    price: 1890,
    name: '000140',
  },
  {
    barcode: ['000139'],
    available: 1,
    price: 800,
    name: '000139',
  },
  {
    barcode: ['000138'],
    available: 5,
    price: 650,
    name: '000138',
  },
];

const secondarySyncBody: SyncProductInterface[] = [
  {
    barcode: ['000140', '0001409999', '0001409999000000000000876876878767'],
    available: 1,
    price: 1,
    name: '000140',
  },
  {
    barcode: ['000139'],
    available: 1,
    price: 1,
    name: '000139',
  },
  {
    barcode: ['000138'],
    available: 1,
    price: 1,
    name: '000138',
  },
  {
    barcode: ['000137'],
    available: 1,
    price: 1,
    name: '000137',
  },
];

const updateBody: SyncProductInterface[] = [
  {
    barcode: ['000140', '0001409999'],
    available: 5,
    price: 890,
    name: '000140',
  },
  {
    barcode: ['000139'],
    available: 5,
    price: 1000,
    name: '000139',
  },
];

const updateBlacklistBody: SyncBlackListProductInterface[] = [
  {
    id: 'ba96a6c9e43a1ae56dc1e604',
    products: [
      {
        barcode: ['000002'],
        price: 100,
        available: 9,
        name: 'blacklist product 2',
      },
      {
        barcode: ['0000029999'],
        price: 90,
        available: 1,
        name: 'blacklist product 2',
      },
    ],
  },
];

const blacklistedSyncBody: SyncProductInterface[] = [
  {
    barcode: ['000002', '0000029999'],
    available: 10,
    price: 1890,
    name: 'blacklist product 2',
  },
  {
    barcode: ['000001', '0000019999'],
    available: 10,
    price: 999,
    name: 'blacklist product 1',
  },
];

const withIntersectsBody: SyncProductInterface[] = [
  {
    id: '1',
    barcode: ['000139', '000139999'],
    available: 1,
    price: 100,
    name: '000139',
  },
  {
    id: '2',
    barcode: ['000138', '000138999'],
    available: 1,
    price: 110,
    name: '000138',
  },
  {
    id: '3',
    barcode: ['000139', '000139888'],
    available: 2,
    price: 200,
    name: '000139',
  },
  {
    id: '4',
    barcode: ['000138', '000138888'],
    available: 2,
    price: 220,
    name: '000138',
  },
  {
    id: '5',
    barcode: ['000139', '000139777'],
    available: 3,
    price: 300,
    name: '000139',
  },
  {
    id: '6',
    barcode: ['000138', '000138777'],
    available: 3,
    price: 330,
    name: '000138',
  },
];

const errorCallback = (res: any) => {
  const body = res.body as SyncResponseInterface;
  expect(body.success).equals(false);
};

describe('Sync', () => {
  const links = getProjectLinks();
  const syncErrorsPath = links.cms.syncErrors.url;
  beforeEach(() => {
    cy.testAuth(`/`);
  });

  it('Should sync shop blacklist', () => {
    // should return shop blacklist
    cy.request({
      method: REQUEST_METHOD_GET,
      url: `/api/shops/blacklist?${validRequestParamsA}`,
    }).then((res) => {
      const { success, blacklist } = res.body as SyncBlacklistResponseInterface;
      expect(success).equals(true);
      expect(blacklist).to.have.length(1);
      expect(blacklist[0].products).to.have.length(2);
    });

    // should update shop blacklist
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/blacklist?${validRequestParamsA}`,
      body: JSON.stringify(updateBlacklistBody),
    }).then((res) => {
      const { success } = res.body as SyncResponseInterface;
      expect(success).equals(true);
    });

    // should return updated shop blacklist
    cy.request({
      method: REQUEST_METHOD_GET,
      url: `/api/shops/blacklist?${validRequestParamsA}`,
    }).then((res) => {
      const { success, blacklist } = res.body as SyncBlacklistResponseInterface;
      expect(success).equals(true);
      expect(blacklist).to.have.length(2);
    });

    // should success
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsA}`,
      body: JSON.stringify(blacklistedSyncBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
      expect(body.message).equals('all products are blacklisted');
    });
  });

  it('Should sync shop orders with site', () => {
    const currentDate = new Date('2021-07-10T09:47:09.087Z').toISOString();

    // Should return order statuses list
    cy.request({
      method: REQUEST_METHOD_GET,
      url: `/api/shops/get-order-statuses?${validRequestParamsC}`,
    }).then((res) => {
      const body = res.body as SyncOrderStatusesResponseInterface;
      expect(body.success).equals(true);
      expect(body.orderStatuses?.length).greaterThan(0);
    });

    // should return shop new orders
    cy.request({
      method: REQUEST_METHOD_GET,
      url: `/api/shops/get-orders?${validRequestParamsA}&fromDate=${currentDate}`,
    }).then((res) => {
      const { success, orders } = res.body as SyncOrderResponseInterface;
      const order = orders[0];
      const product = order.products[0];

      expect(success).equals(true);
      expect(orders).to.have.length(1);
      expect(order.products).to.have.length(2);

      // should update order product
      const updateProduct: SyncUpdateOrderProductInterface = {
        ...product,
        amount: 55,
        orderId: order.orderId,
        status: 'done',
      };

      cy.request({
        method: REQUEST_METHOD_PATCH,
        url: `/api/shops/update-order-product?${validRequestParamsA}`,
        body: JSON.stringify([updateProduct]),
      }).then((res) => {
        const { success } = res.body as SyncOrderResponseInterface;
        expect(success).equals(true);
      });
    });
  });

  it('Should create product with sync error', () => {
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });

    cy.visit(syncErrorsPath);
    cy.getByCy('sync-errors-page').should('exist');
    cy.getByCy(`${errorBarcode}-create`).click();
    cy.getByCy('products-search-modal').should('exist');
    cy.getByCy(`create-product`).click();
    cy.getByCy('create-product-with-sync-error-modal').should('exist');
    cy.getByCy('descriptionI18n-ru').type('description');
    cy.selectOptionByTestId('rubricId', 'vino');
    cy.getByCy(`submit-new-product`).click();
    cy.wait(1500);
    cy.getByCy('product-details').should('exist');
    cy.visit(syncErrorsPath);
    cy.getByCy(`${errorBarcode}-create`).should('not.exist');
  });

  it('Should update product with sync error', () => {
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });

    // Should create product with sync error
    cy.visit(syncErrorsPath);
    cy.getByCy('sync-errors-page').should('exist');
    cy.getByCy(`${errorBarcode}-create`).click();
    cy.getByCy('products-search-modal').should('exist');
    cy.getByCy('product-search-input').type('000200');
    cy.getByCy('product-search-submit').click();
    cy.wait(1500);
    cy.getByCy('VINO 000200-create').click();
    cy.wait(1500);
    cy.getByCy(`${errorBarcode}-create`).should('not.exist');
  });

  it('Should sync shop products with site catalogue', () => {
    // should error on no parameters
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync`,
      body: JSON.stringify(initialBody),
      failOnStatusCode: false,
    }).then(errorCallback);

    // should error on no request body
    cy.request({
      method: REQUEST_METHOD_POST,
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
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });

    // should display synced products
    const shopCLinks = getCmsCompanyLinks({
      companyId: fixtureIds.companyB,
      shopId: fixtureIds.shopC,
      rubricSlug: fixtureIds.rubricChampagneSlug,
    });
    cy.visit(shopCLinks.shop.rubrics.product.parentLink);
    cy.wait(1500);
    cy.getByCy('shop-rubric-products-list').should('exist');
    cy.getByCy('shop-product-main-image').should('have.length', 3);

    // should update existing shop products and creat new ones
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(secondarySyncBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });
    cy.reload();
    cy.wait(1500);
    cy.getByCy('3-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });
    cy.getByCy('3-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });
    cy.getByCy('0-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });
    cy.getByCy('0-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1');
    });

    // should update synced products
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(updateBody),
      failOnStatusCode: false,
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });
    cy.reload();
    cy.wait(1500);
    cy.getByCy('3-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('5');
    });
    cy.getByCy('3-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('890');
    });
    cy.getByCy('2-available').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('5');
    });
    cy.getByCy('2-price').then((el: any) => {
      const input = el.find('input');
      expect(input.val()).to.equals('1000');
    });

    // should display sync errors list in the shop
    cy.getByCy('shop-sync-errors').click();
    cy.wait(1500);
    cy.getByCy('shop-sync-errors-page').should('exist');
    cy.getByCy(`${errorBarcode}-row`).should('exist');

    // should return shop products list
    cy.request({
      method: REQUEST_METHOD_GET,
      url: `/api/shops/get-shop-products?${validRequestParamsC}`,
    }).then((res) => {
      const body = res.body as SyncShopProductsResponseInterface;
      expect(body.success).equals(true);
      expect(body.shopProducts.length).equals(secondarySyncBody.length);
    });
  });

  it('Should update sync error values', () => {
    // should success
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(initialBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });
    cy.visit(syncErrorsPath);

    // should update sync error values
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(updateSyncErrorBody),
      failOnStatusCode: false,
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      console.log(body);
      expect(body.success).equals(true);
      cy.reload();
      cy.getByCy(newSyncErrorName).should('exist');
    });
  });

  it('Should reset old shop products availability', () => {
    const links = getCmsCompanyLinks({
      companyId: fixtureIds.companyA,
      shopId: fixtureIds.shopA,
      rubricSlug: fixtureIds.rubricChampagneSlug,
    });
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsA}`,
      body: JSON.stringify(initialBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
      cy.visit(links.shop.rubrics.product.parentLink);
    });
  });

  it('Should find barcode intersect items', () => {
    cy.request({
      method: REQUEST_METHOD_POST,
      url: `/api/shops/sync?${validRequestParamsC}`,
      body: JSON.stringify(withIntersectsBody),
    }).then((res) => {
      const body = res.body as SyncResponseInterface;
      expect(body.success).equals(true);
    });
  });
});
