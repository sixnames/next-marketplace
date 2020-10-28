import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  MOCK_PRODUCT_C,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
} from '@yagu/mocks';

describe('Product connections', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  /*after(() => {
    cy.clearTestData();
  });*/

  it('Should CRUD product connection', () => {
    const mockProductC = MOCK_PRODUCT_C.name[0].value;
    const mockGroupName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockAttributeName = MOCK_ATTRIBUTE_WINE_VARIANT.name[0].value;

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

    cy.getByCy(`${mockAttributeName}-connection-create`).click();
    cy.getByCy(`add-product-to-connection-modal`).should('exist');
  });
});
