import { DEFAULT_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';
import { MOCK_ADDRESS_A } from 'tests/mockData';

describe('Shops list', () => {
  let mockData: CreateTestDataPayloadInterface;
  const shopsPath = `/cms/shops`;

  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(shopsPath);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should display shops list in CMS', () => {
    const { shopA } = mockData;
    cy.getByCy('shops-list').should('exist');
    cy.getByCy(`${shopA.name}-row`).should('exist');
    cy.getByCy(`${shopA.name}-update`).click();
    cy.getByCy('shop-details').should('exist');

    // Should update shop
    const shopNewEmail = 'shopNewEmail@mail.com';
    const shopNewPhone = `78886665544`;
    // emails
    cy.getByCy(`email-0`).clear().type(shopNewEmail);

    // phones
    cy.getByCy(`phone-0`).clear().type(shopNewPhone);

    // address
    cy.getByCy(`address-clear`).click();
    cy.getByCy(`address`).type(MOCK_ADDRESS_A.formattedAddress);
    cy.getByCy(`address-result-0`).click();

    // submit
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
  });

  it('Should display shop products list in CMS', () => {
    const { shopA } = mockData;

    cy.getByCy('shops-list').should('exist');
    cy.getByCy(`${shopA.name}-row`).should('exist');
    cy.getByCy(`${shopA.name}-update`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('shop-products').should('exist');

    // Should delete shop product
    cy.getByCy(`${mockData.shopAProductD._id}-delete`).click();
    cy.getByCy(`delete-shop-product-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`${mockData.shopAProductD._id}-row`).should('not.exist');

    // Should update shop product
    const newAvailableAmount = `100`;
    const newPriceAmount = `9999`;
    const { shopAProductA } = mockData;
    cy.getByCy(`${shopAProductA._id}-update`).click();
    cy.getByCy(`update-shop-product-modal`).should('exist');
    cy.getByCy(`available`).clear().type(newAvailableAmount);
    cy.getByCy(`price`).clear().type(newPriceAmount);
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
    cy.getByCy(`${shopAProductA._id}-price`).should('contain', newPriceAmount);
    cy.getByCy(`${shopAProductA._id}-available`).should('contain', newAvailableAmount);

    // Should add shop product
    const modal = 'product-search-modal';
    const newProductAvailableAmount = `77777`;
    const newProductPriceAmount = `88888`;
    const mockRubricLevelTwoNameB = mockData.rubricBDefaultName;
    const newProductName = mockData.productC.nameI18n[DEFAULT_LOCALE];
    cy.getByCy(`add-shop-product`).click();
    cy.getByCy(modal).should('exist');
    cy.getBySelector(`[data-cy="${modal}"] [data-cy="tree-${mockRubricLevelTwoNameB}"]`).click();
    cy.getByCy(`${newProductName}-create`).click();
    cy.getByCy(`update-shop-product-modal`).should('exist');
    cy.getByCy(`available`).clear().type(newProductAvailableAmount);
    cy.getByCy(`price`).clear().type(newProductPriceAmount);
    cy.getByCy(`shop-submit`).click();
    cy.shouldSuccess();
    cy.getByCy('shop-products').should('contain', newProductAvailableAmount);
    cy.getByCy('shop-products').should('contain', newProductPriceAmount);
    cy.getByCy('shop-products').should('contain', newProductName);
  });
});
