import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import { getTestLangField } from '../../../utils/getLangField';

describe('Product connections', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD product connection', () => {
    const mockProduct = mockData.productC;
    const mockProductCName = getTestLangField(mockProduct.name);

    const mockGroup = mockData.attributesGroupWineFeatures;
    const mockGroupName = getTestLangField(mockGroup.name);

    const mockAttribute = mockData.attributeWineVariant;
    const mockAttributeName = getTestLangField(mockAttribute.name);

    const mockRubricLevelThree = mockData.rubricLevelThreeAA;
    const mockRubricLevelThreeNameB = getTestLangField(mockRubricLevelThree.name);

    const mockProductForAdd = mockData.productA;
    const mockProductForAddName = getTestLangField(mockProductForAdd.name);

    // Should create new connection
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductCName}-update`).click();
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
      `[data-cy="${mockAttributeName}-connection-list"] [data-cy="${mockProductCName}-row"]`,
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
    cy.getByCy(`${mockProductForAddName}-create`).click();
    cy.getByCy(addProductToConnectionModal).should('not.exist');
    cy.get(
      `[data-cy="${mockAttributeName}-connection-list"] [data-cy="${mockProductForAddName}-row"]`,
    ).should('exist');

    // Should delete product from connection
    cy.getByCy(`${mockProductForAddName}-delete`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('not.exist');
    cy.get(
      `[data-cy="${mockAttributeName}-connection-list"] [data-cy="${mockProductForAddName}-row"]`,
    ).should('not.exist');
  });
});
