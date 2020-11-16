import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  MOCK_PRODUCT_C,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_PRODUCT_A,
} from '@yagu/mocks';

describe('Product connections', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD product connection', () => {
    const mockProductC = MOCK_PRODUCT_C.name[0].value;
    const mockGroupName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockAttributeName = MOCK_ATTRIBUTE_WINE_VARIANT.name[0].value;
    const mockRubricLevelThreeNameB = MOCK_RUBRIC_LEVEL_THREE_A_A.name[0].value;
    const mockProductForAdd = MOCK_PRODUCT_A.name[0].value;

    // Should create new connection
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductC}-update`).click();
    cy.visitMoreNavLink('connections');

    cy.getByCy(`create-connection`).click();
    cy.getByCy(`create-connection-modal`).should('exist');
    cy.selectOptionByTestId('attributesGroupId', mockGroupName);
    cy.selectOptionByTestId('attributeId', mockAttributeName);
    cy.getByCy(`create-connection-submit`).click();

    cy.getByCy(`create-connection-modal`).should('not.exist');
    cy.getByCy(`${mockAttributeName}-connection`).should('exist');
    cy.getByCy(`${mockAttributeName}-connection-list`).should('exist');
    cy.get(
      `[data-cy="${mockAttributeName}-connection-list"] [data-cy="${mockProductC}-row"]`,
    ).should('exist');

    // Shouldn't create new connection on duplicate error
    cy.getByCy(`create-connection`).click();
    cy.selectOptionByTestId('attributesGroupId', mockGroupName);
    cy.selectOptionByTestId('attributeId', mockAttributeName);
    cy.getByCy(`create-connection-submit`).click();
    cy.getByCy(`${mockAttributeName}-connection`).should('have.length', 1);

    // Should add product to the new connection
    const addProductToConnectionModal = `add-product-to-connection-modal`;
    cy.getByCy(`${mockAttributeName}-connection-create`).click();
    cy.getByCy(addProductToConnectionModal).should('exist');

    cy.getBySelector(
      `[data-cy=${addProductToConnectionModal}] [data-cy=tree-${mockRubricLevelThreeNameB}]`,
    ).click();
    cy.getByCy(`${mockProductForAdd}-create`).click();
    cy.getByCy(addProductToConnectionModal).should('not.exist');
    cy.get(
      `[data-cy="${mockAttributeName}-connection-list"] [data-cy="${mockProductForAdd}-row"]`,
    ).should('exist');

    // Should delete product from connection
    cy.getByCy(`${mockProductForAdd}-delete`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('not.exist');
    cy.get(
      `[data-cy="${mockAttributeName}-connection-list"] [data-cy="${mockProductForAdd}-row"]`,
    ).should('not.exist');
  });
});
