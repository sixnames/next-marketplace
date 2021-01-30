import { DEFAULT_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Product connections', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/cms/products`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD product connection', () => {
    const productName = mockData.productC.nameI18n[DEFAULT_LOCALE];
    const addProductName = mockData.productA.nameI18n[DEFAULT_LOCALE];
    const connectionAttribute = mockData.attributeWineVariant;
    const connectionAttributeId = `${connectionAttribute._id}`;
    const connectionAttributeName = connectionAttribute.nameI18n[DEFAULT_LOCALE];
    const rubricName = mockData.rubricLevelTwoADefaultName;

    // Should create new connection
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${productName}-update`).click();
    cy.visitMoreNavLink('connections');

    cy.getByCy(`create-connection`).click();
    cy.getByCy(`create-connection-modal`).should('exist');
    cy.getByCy('attributeId').select(`${connectionAttributeId}`);
    cy.getByCy(`create-connection-submit`).click();
    cy.getByCy(`create-connection-modal`).should('not.exist');
    cy.shouldSuccess();

    cy.getByCy(`${connectionAttributeName}-connection`).should('exist');
    cy.getByCy(`${connectionAttributeName}-connection-list`).should('exist');
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${productName}-row"]`,
    ).should('exist');

    // Shouldn't create new connection on duplicate error
    cy.getByCy(`create-connection`).click();
    cy.getByCy(`create-connection-empty-modal`).should('exist');
    cy.getByCy(`close-modal`).click();

    // Should add product to the new connection
    const addProductToConnectionModal = `add-product-to-connection-modal`;
    cy.getByCy(`${connectionAttributeName}-connection-create`).click();
    cy.getByCy(addProductToConnectionModal).should('exist');

    cy.getBySelector(
      `[data-cy=${addProductToConnectionModal}] [data-cy=tree-${rubricName}]`,
    ).click();
    cy.getByCy(`${addProductName}-create`).click();
    cy.getByCy(addProductToConnectionModal).should('not.exist');
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${addProductName}-row"]`,
    ).should('exist');

    // Should delete product from connection
    cy.getByCy(`${addProductName}-delete`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('not.exist');
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${addProductName}-row"]`,
    ).should('not.exist');

    // Should delete connection if product is last
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${productName}-delete"]`,
    ).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('not.exist');
    cy.getByCy(`${connectionAttributeName}-connection-list`).should('not.exist');
  });
});
