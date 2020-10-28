import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  MOCK_PRODUCT_C,
  MOCK_ATTRIBUTE_WINE_COLOR,
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

  it('Should create new product connection', () => {
    const mockProductC = MOCK_PRODUCT_C.name[0].value;
    const mockGroupName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockAttributeName = MOCK_ATTRIBUTE_WINE_COLOR.name[0].value;

    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductC}-update`).click();
    cy.visitMoreNavLink('connections');

    cy.getByCy(`create-connection`).click();
    cy.getByCy(`create-connection-modal`).should('exist');
    cy.selectOptionByTestId('attributesGroupId', mockGroupName);
    cy.selectOptionByTestId('attributeId', mockAttributeName);
    cy.getByCy(`create-connection-submit`).click();
  });
});
