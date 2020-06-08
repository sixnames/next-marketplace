import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_SELECT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_OPTIONS,
  MOCK_PRODUCT_FOR_DELETE,
  MOCK_PRODUCT_NEW_PRODUCT,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_THREE_B,
  MOCK_RUBRIC_LEVEL_TWO,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockProductForDelete = MOCK_PRODUCT_FOR_DELETE.name;
const mockRubricLevelOne = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwo = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThree = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockRubricLevelThreeB = MOCK_RUBRIC_LEVEL_THREE_B.name[0].value;

describe('Products list', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
      },
    });

    cy.createTestData();
    cy.visit(`/products?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Products list page should exist', () => {
    cy.getByCy(`products-list`).should('exist');
  });

  it('Should delete product from data base', () => {
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(mockProductForDelete).should('not.exist');
  });

  it('Should create new product and add it to the list', () => {
    cy.getByCy(`product-create`).click();

    // fill inputs
    cy.getByCy('product-name').type(MOCK_PRODUCT_NEW_PRODUCT.name);
    cy.getByCy('product-card-name').type(MOCK_PRODUCT_NEW_PRODUCT.cardName);
    cy.getByCy('product-price').type(`${MOCK_PRODUCT_NEW_PRODUCT.price}`);
    cy.getByCy('product-description').type(MOCK_PRODUCT_NEW_PRODUCT.description);
    cy.getByCy(`${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`${mockRubricLevelThreeB}-checkbox`).check();
    cy.selectOptionByTestId(`attributesSource`, `${mockRubricLevelOne}_>_${mockRubricLevelTwo}`);

    // fill attributes
    cy.getByCy(`${MOCK_OPTIONS[0].name}-checkbox`).check();
    cy.getByCy(`${MOCK_OPTIONS[1].name}-checkbox`).check();

    cy.selectOptionByTestId(MOCK_ATTRIBUTE_SELECT.name[0].value, MOCK_OPTIONS[0].name[0].value);
    cy.getByCy(`${MOCK_ATTRIBUTE_SELECT.name[0].value}-showInCard-checkbox`).check();

    cy.getByCy(MOCK_ATTRIBUTE_STRING.name[0].value).type('string');
    cy.getByCy(`${MOCK_ATTRIBUTE_STRING.name[0].value}-showInCard-checkbox`).check();

    cy.getByCy(MOCK_ATTRIBUTE_NUMBER.name[0].value).type('999');
    cy.getByCy(`${MOCK_ATTRIBUTE_NUMBER.name[0].value}-showInCard-checkbox`).check();

    cy.getByCy('submit-new-product').click();
    cy.getByCy(MOCK_PRODUCT_NEW_PRODUCT.name).should('exist');
  });
});

// Used separate describe for file upload mutation
// cypress-graphql-mock throw error on file upload
/*describe('New products creation', () => {
  beforeEach(() => {
    cy.createTestData();
  });

  after(() => {
    cy.clearTestData();
  });

  it.only('Should create product and add it to the rubric', () => {
    // sign in as admin
    cy.auth({
      email: ME_AS_ADMIN.email,
      password: ME_AS_ADMIN.password,
      redirect: `/products?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
    });

    cy.getByCy(`product-create`).click();
    cy.getByCy('product-images').attachFile('test-image-1.jpg', { subjectType: 'drag-n-drop' });

    // fill inputs
    cy.getByCy('product-name').type(MOCK_PRODUCT_NEW_PRODUCT.name);
    cy.getByCy('product-card-name').type(MOCK_PRODUCT_NEW_PRODUCT.cardName);
    cy.getByCy('product-price').type(`${MOCK_PRODUCT_NEW_PRODUCT.price}`);
    cy.getByCy('product-description').type(MOCK_PRODUCT_NEW_PRODUCT.description);
    cy.getByCy(`${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy('submit-new-product').click();

    cy.getByCy(MOCK_PRODUCT_NEW_PRODUCT.name).should('exist');
  });
});*/
