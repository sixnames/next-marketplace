import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_SELECT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_OPTIONS,
  MOCK_PRODUCT_B_PRODUCT,
  MOCK_PRODUCT_FOR_DELETE,
  MOCK_PRODUCT_NEW_PRODUCT,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_THREE_B,
  MOCK_RUBRIC_LEVEL_TWO,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED, QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../../src/config';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name;
const mockRubricLevelThreeNameB = MOCK_RUBRIC_LEVEL_THREE_B.name;
const mockProductForDelete = MOCK_PRODUCT_FOR_DELETE.name;

describe('Rubric products', () => {
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
    cy.visit(`/rubrics?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have products on third level rubric only', () => {
    cy.getByCy('more-nav-trigger').should('not.exist');

    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.openMoreNav();
    cy.getByCy('more-nav-list').should('not.contain', 'Товары');
    cy.closeMoreNav();

    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.openMoreNav();
    cy.getByCy('more-nav-list').should('not.contain', 'Товары');
    cy.closeMoreNav();

    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('rubric-products').should('exist');
  });

  it('Should delete product from rubric', () => {
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('rubric-products').should('not.contain', mockProductForDelete);
    cy.getByCy(`${mockRubricLevelThreeName}-total`).should('contain', '1');
  });

  it(`Shouldn't create product on validation error`, () => {
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('product-create').click();
    cy.getByCy('add-product-to-rubric-modal').should('exist');
    cy.getByCy('create-new-product').click();
    cy.getByCy('create-new-product-modal').should('exist');
    cy.getByCy('submit-new-product').click();
    cy.getByCy('name-error').should('exist');
    // cy.getByCy('images-error').should('exist');
    cy.getByCy('cardName-error').should('exist');
    cy.getByCy('price-error').should('exist');
    cy.getByCy('description-error').should('exist');
  });

  it('Should display not in rubric products and should delete product from DB', () => {
    // delete product from rubric
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('close-notification').click();

    // display deleted product in non rubric list
    cy.getByCy(QUERY_DATA_LAYOUT_NO_RUBRIC).click();
    cy.getByCy(mockProductForDelete).should('exist');

    // delete product from db
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('delete-product-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('delete-product-modal').should('not.exist');
    cy.getByCy(mockProductForDelete).should('not.exist');
  });

  it('Should add product from tree to the rubric', () => {
    const modal = 'add-product-to-rubric-modal';

    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('product-create').click();
    cy.get(`[data-cy=${modal}] [data-cy=tree-${mockRubricLevelThreeNameB}]`).click();
    cy.getByCy(`${MOCK_PRODUCT_B_PRODUCT.name}-create`).click();
    cy.getByCy(modal).should('not.exist');
    cy.getByCy(MOCK_PRODUCT_B_PRODUCT.name).should('exist');
    cy.getByCy(`${mockRubricLevelThreeName}-total`).should('contain', '3');
  });

  it('Should add product from not in rubric list to the rubric', () => {
    const modal = 'add-product-to-rubric-modal';

    // open rubric products
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');

    // delete product from rubric
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy(`confirm`).click();

    // add product from not in rubric list
    cy.getByCy('product-create').click();
    cy.get(`[data-cy=${modal}] [data-cy=${QUERY_DATA_LAYOUT_NO_RUBRIC}]`).click();
    cy.getByCy(`${mockProductForDelete}-create`).click();
    cy.getByCy(modal).should('not.exist');
    cy.getByCy(mockProductForDelete).should('exist');
  });

  it('Should add product from search result to the rubric', () => {
    const modal = 'add-product-to-rubric-modal';

    // open rubric products
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');

    // delete product from rubric
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy(`confirm`).click();

    // add product from search result
    cy.getByCy('product-create').click();
    cy.getByCy('product-search-input').type(mockProductForDelete);

    cy.getByCy('product-search-reset').click();
    cy.getByCy('product-search-input').should('not.have.value', mockProductForDelete);

    cy.getByCy('product-search-input').type(mockProductForDelete);
    cy.getByCy('product-search-submit').click();

    // cy.get
    cy.getByCy(`${mockProductForDelete}-create`).click();
    cy.getByCy(modal).should('not.exist');
    cy.getByCy(mockProductForDelete).should('exist');
  });

  it('Should create product and add it to the rubric', () => {
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('product-create').click();
    cy.getByCy('create-new-product').click();

    // fill inputs
    cy.getByCy('product-name').type(MOCK_PRODUCT_NEW_PRODUCT.name);
    cy.getByCy('product-card-name').type(MOCK_PRODUCT_NEW_PRODUCT.cardName);
    cy.getByCy('product-price').type(`${MOCK_PRODUCT_NEW_PRODUCT.price}`);
    cy.getByCy('product-description').type(MOCK_PRODUCT_NEW_PRODUCT.description);
    cy.selectOptionByTestId(
      `attributesSource`,
      `${mockRubricLevelOneName}_>_${mockRubricLevelTwoName}`,
    );

    // fill attributes
    cy.getByCy(`${MOCK_OPTIONS[0].name}-checkbox`).check();
    cy.getByCy(`${MOCK_OPTIONS[1].name}-checkbox`).check();

    cy.selectOptionByTestId(MOCK_ATTRIBUTE_SELECT.name[0].value, MOCK_OPTIONS[0].name[0].value);
    cy.getByCy(`${MOCK_ATTRIBUTE_SELECT.name}-showInCard-checkbox`).check();

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
/*describe('Rubric products creation', () => {
  beforeEach(() => {
    cy.createTestData();
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should create product and add it to the rubric', () => {
    // sign in as admin
    cy.auth({
      email: ME_AS_ADMIN.email,
      password: ME_AS_ADMIN.password,
      redirect: `/rubrics?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
    });

    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('product-create').click();
    cy.getByCy('create-new-product').click();
    cy.getByCy('product-images').attachFile('test-image-3.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-0').should('exist');
    cy.getByCy('product-images').attachFile('test-image-2.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-1').should('exist');
    cy.getByCy('product-images').attachFile('test-image-1.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-2').should('exist');

    // remove last added image
    cy.getByCy('file-preview-remove-2').click();
    cy.getByCy('remove-image-decline').click();
    cy.getByCy('file-preview-remove-2').click();
    cy.getByCy('remove-image-confirm').click();
    cy.getByCy('file-preview-2').should('not.exist');

    // fill inputs
    cy.getByCy('product-name').type(MOCK_PRODUCT_NEW_PRODUCT.name);
    cy.getByCy('product-card-name').type(MOCK_PRODUCT_NEW_PRODUCT.cardName);
    cy.getByCy('product-price').type(`${MOCK_PRODUCT_NEW_PRODUCT.price}`);
    cy.getByCy('product-description').type(MOCK_PRODUCT_NEW_PRODUCT.description);
    cy.getByCy('submit-new-product').click();

    cy.getByCy(MOCK_PRODUCT_NEW_PRODUCT.name).should('exist');
    cy.getByCy(`${mockRubricLevelThreeName}-total`).should('contain', '3');
  });
});*/
