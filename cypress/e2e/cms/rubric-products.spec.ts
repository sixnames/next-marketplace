import { DEFAULT_LOCALE, QUERY_DATA_LAYOUT_NO_RUBRIC, ROUTE_CMS } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

const modal = 'add-product-to-rubric-modal';

describe('Rubric products', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should delete product from rubric', () => {
    const mockRubricLevelTwoBName = mockData.rubricLevelTwoBDefaultName;
    const mockProductForDeleteName = mockData.productC.nameI18n[DEFAULT_LOCALE];

    // Should delete product from rubric
    cy.getByCy(`tree-link-${mockRubricLevelTwoBName}`).click();
    cy.getByCy('rubric-products').should('exist');
    cy.getByCy(`${mockProductForDeleteName}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('rubric-products').should('not.contain', mockProductForDeleteName);
    cy.getByCy(`${mockRubricLevelTwoBName}-total`).should('contain', '0');

    // Should display not in rubric products and should delete product from DB
    cy.getByCy(QUERY_DATA_LAYOUT_NO_RUBRIC).click();
    cy.getByCy(`${mockProductForDeleteName}-row`).should('exist');
  });

  it('Should add product to rubric', () => {
    const mockRubricLevelTwoName = mockData.rubricLevelTwoADefaultName;
    const mockRubricLevelTwoBName = mockData.rubricLevelTwoBDefaultName;

    const mockProductName = mockData.productA.nameI18n[DEFAULT_LOCALE];
    const mockProductForDeleteName = mockData.productC.nameI18n[DEFAULT_LOCALE];

    // Should add product from tree to the rubric
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.getByCy('product-create').click();
    cy.getBySelector(`[data-cy=${modal}] [data-cy=tree-${mockRubricLevelTwoBName}]`).click();
    cy.getByCy(`${mockProductForDeleteName}-create`).click();
    cy.getByCy(`${mockProductForDeleteName}-row`).should('exist');

    // Should add product from not in rubric list to the rubric
    cy.getByCy(`${mockProductName}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy('product-create').click();
    cy.get(`[data-cy=${modal}] [data-cy=${QUERY_DATA_LAYOUT_NO_RUBRIC}]`).click();
    cy.getByCy(`${mockProductName}-create`).click();
    cy.getByCy(`${mockProductName}-row`).should('exist');

    // Should add product from search result to the rubric
    cy.getByCy(`${mockProductName}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy('product-create').click();
    cy.getByCy('product-search-input').type(mockProductName);
    cy.getByCy('product-search-reset').click();
    cy.getByCy('product-search-input').should('not.have.value', mockProductName);
    cy.getByCy('product-search-input').type(mockProductName);
    cy.getByCy('product-search-submit').click();
    cy.getByCy(`${mockProductName}-create`).click();
    cy.getByCy(`${mockProductName}-row`).should('exist');

    // Should display Create product modal
    cy.getByCy('product-create').click();
    cy.getByCy('add-product-to-rubric-modal').should('exist');
    cy.getByCy('create-new-product').click();
    cy.getByCy('create-new-product-modal').should('exist');
  });
});
