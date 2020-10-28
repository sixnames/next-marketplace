import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import { MOCK_PRODUCT_C } from '@yagu/mocks';

describe('Product connections', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should create new product connection', () => {
    const mockProductC = MOCK_PRODUCT_C.name[0].value;
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductC}-update`).click();
    cy.visitMoreNavLink('connections');
  });
});
