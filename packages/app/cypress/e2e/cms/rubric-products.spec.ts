import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_SELECT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_OPTIONS,
  MOCK_PRODUCT,
  MOCK_PRODUCT_B_PRODUCT,
  MOCK_PRODUCT_FOR_DELETE,
  MOCK_PRODUCT_NEW_PRODUCT,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_THREE_B,
  MOCK_RUBRIC_LEVEL_TWO,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED, QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../../src/config';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockRubricLevelThreeNameB = MOCK_RUBRIC_LEVEL_THREE_B.name[0].value;

const mockProduct = MOCK_PRODUCT.name[0].value;
const mockProductB = MOCK_PRODUCT_B_PRODUCT.name[0].value;
const mockProductForDelete = MOCK_PRODUCT_FOR_DELETE.name[0].value;

const mockProductNewName = MOCK_PRODUCT_NEW_PRODUCT.name[0].value;
const mockProductNewCardName = MOCK_PRODUCT_NEW_PRODUCT.cardName[0].value;
const mockProductNewCardPrice = MOCK_PRODUCT_NEW_PRODUCT.price;
const mockProductNewCarDescription = MOCK_PRODUCT_NEW_PRODUCT.description[0].value;

const mockAttributeSelectName = MOCK_ATTRIBUTE_SELECT.name[0].value;
const mockAttributeSelectValue = MOCK_OPTIONS[0].name[0].value;
const mockAttributeMultipleSelectValueA = MOCK_OPTIONS[0].name[0].value;
const mockAttributeMultipleSelectValueB = MOCK_OPTIONS[1].name[0].value;
const mockAttributeStringName = MOCK_ATTRIBUTE_STRING.name[0].value;
const mockAttributeNumberName = MOCK_ATTRIBUTE_NUMBER.name[0].value;

const modal = 'add-product-to-rubric-modal';

describe.skip('Rubric products', () => {
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
    cy.visit(`/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should CRUD products in rubric', () => {
    // Should have products on third level rubric only
    cy.getByCy('more-nav-trigger').should('not.exist');

    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.openMoreNav();
    cy.getByCy('more-nav-list').should('not.contain', 'Товары');
    cy.closeMoreNav();

    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.openMoreNav();
    cy.getByCy('more-nav-list').should('not.contain', 'Товары');
    cy.closeMoreNav();

    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('rubric-products').should('exist');

    // Should delete product from rubric
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('rubric-products').should('not.contain', mockProductForDelete);
    cy.getByCy(`${mockRubricLevelThreeName}-total`).should('contain', '1');
    cy.closeNotification();

    // Should display not in rubric products and should delete product from DB
    cy.getByCy(QUERY_DATA_LAYOUT_NO_RUBRIC).click();
    cy.getByCy(mockProductForDelete).should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.closeNotification();
    cy.getByCy('delete-product-modal').should('not.exist');
    cy.getByCy(mockProductForDelete).should('not.exist');

    // Should add product from tree to the rubric
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('product-create').click();
    cy.get(`[data-cy=${modal}] [data-cy=tree-${mockRubricLevelThreeNameB}]`).click();
    cy.getByCy(`${mockProductB}-create`).click();
    cy.getByCy(mockProductB).should('exist');
    cy.getByCy(`${mockRubricLevelThreeName}-total`).should('contain', '2');
    cy.closeNotification();
    cy.getByCy(`${mockProduct}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.closeNotification();

    // Should add product from not in rubric list to the rubric
    cy.getByCy('product-create').click();
    cy.get(`[data-cy=${modal}] [data-cy=${QUERY_DATA_LAYOUT_NO_RUBRIC}]`).click();
    cy.getByCy(`${mockProduct}-create`).click();
    cy.getByCy(mockProduct).should('exist');
    cy.closeNotification();
    cy.getByCy(`${mockProduct}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.closeNotification();

    // Should add product from search result to the rubric
    cy.getByCy('product-create').click();
    cy.getByCy('product-search-input').type(mockProduct);
    cy.getByCy('product-search-reset').click();
    cy.getByCy('product-search-input').should('not.have.value', mockProduct);
    cy.getByCy('product-search-input').type(mockProduct);
    cy.getByCy('product-search-submit').click();
    cy.getByCy(`${mockProduct}-create`).click();
    cy.getByCy(mockProduct).should('exist');
    cy.closeNotification();

    // Shouldn't create product on validation error
    cy.getByCy('product-create').click();
    cy.getByCy('add-product-to-rubric-modal').should('exist');
    cy.getByCy('create-new-product').click();
    cy.getByCy('create-new-product-modal').should('exist');
    cy.getByCy('submit-new-product').click();
    cy.getByCy('name[0].value-error').should('exist');
    cy.getByCy('cardName[0].value-error').should('exist');
    cy.getByCy('price-error').should('exist');
    cy.getByCy('description[0].value-error').should('exist');
  });
});

// Used separate describe for file upload mutation
// cypress-graphql-mock throw error on file upload
describe('Rubric products creation', () => {
  beforeEach(() => {
    cy.createTestData();
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should create product and add it to the rubric', () => {
    // sign in as admin
    cy.auth({
      email: ME_AS_ADMIN.email,
      password: ME_AS_ADMIN.password,
      redirect: `/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
    });

    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('product-create').click();
    cy.getByCy('create-new-product').click();

    cy.getByCy('product-images').attachFile('test-image-1.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-0').should('exist');
    cy.getByCy('product-images').attachFile('test-image-2.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-1').should('exist');
    cy.getByCy('product-images').attachFile('test-image-3.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-2').should('exist');

    // remove last added image
    cy.getByCy('file-preview-remove-2').click();
    cy.getByCy('remove-image-decline').click();
    cy.getByCy('file-preview-remove-2').click();
    cy.getByCy('remove-image-confirm').click();
    cy.getByCy('file-preview-2').should('not.exist');

    // fill inputs
    cy.getByCy('product-name').type(mockProductNewName);
    cy.getByCy('product-card-name').type(mockProductNewCardName);
    cy.getByCy('product-price').clear().type(`${mockProductNewCardPrice}`);
    cy.getByCy('product-description').type(mockProductNewCarDescription);

    // fill attributes
    cy.selectOptionByTestId(
      `attributesSource`,
      `${mockRubricLevelOneName}_>_${mockRubricLevelTwoName}`,
    );
    cy.getByCy(`${mockAttributeMultipleSelectValueA}-checkbox`).check();
    cy.getByCy(`${mockAttributeMultipleSelectValueB}-checkbox`).check();

    cy.selectOptionByTestId(mockAttributeSelectName, mockAttributeSelectValue);
    cy.getByCy(`${mockAttributeSelectName}-showInCard-checkbox`).check();

    cy.getByCy(mockAttributeStringName).type('string');
    cy.getByCy(`${mockAttributeStringName}-showInCard-checkbox`).check();

    cy.getByCy(mockAttributeNumberName).type('999');
    cy.getByCy(`${mockAttributeNumberName}-showInCard-checkbox`).check();

    cy.getByCy('submit-new-product').click();
    cy.getByCy(mockProductNewName).should('exist');
    cy.getByCy(`${mockRubricLevelThreeName}-total`).should('contain', '3');
  });
});
