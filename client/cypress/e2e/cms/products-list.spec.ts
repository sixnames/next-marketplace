/// <reference types="cypress" />
import {
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_WINE_TYPE,
  MOCK_ATTRIBUTE_STRING,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_PRODUCT_B,
  MOCK_PRODUCT_C,
  MOCK_PRODUCT_CREATE,
  MOCK_PRODUCT_NEW,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_RUBRIC_LEVEL_THREE_B_A,
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
  MOCK_OPTIONS_WINE_TYPE,
} from '../../../config';

const mockProductForDelete = MOCK_PRODUCT_B.name[0].value;
const mockProductC = MOCK_PRODUCT_C.name[0].value;
const mockRubricLevelThree = MOCK_RUBRIC_LEVEL_THREE_A_A.name[0].value;
const mockRubricLevelThreeB = MOCK_RUBRIC_LEVEL_THREE_A_B.name[0].value;
const mockTablesRubricLevelThree = MOCK_RUBRIC_LEVEL_THREE_B_A.name[0].value;

const mockProductNewName = MOCK_PRODUCT_NEW.name[0].value;
const mockProductNewCardName = MOCK_PRODUCT_NEW.cardName[0].value;
const mockProductNewCardPrice = MOCK_PRODUCT_NEW.price;
const mockProductNewCarDescription = MOCK_PRODUCT_NEW.description[0].value;

const mockProductCreateName = MOCK_PRODUCT_CREATE.name[0].value;
const mockProductCreateCardName = MOCK_PRODUCT_CREATE.cardName[0].value;
const mockProductCreateCardPrice = MOCK_PRODUCT_CREATE.price;
const mockProductCreateCarDescription = MOCK_PRODUCT_CREATE.description[0].value;

const mockAttributeMultipleSelectValueA = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
const mockAttributeMultipleSelectValueB = MOCK_OPTIONS_WINE_COLOR[1].name[0].value;
const mockAttributeSelectName = MOCK_ATTRIBUTE_WINE_TYPE.name[0].value;
const mockAttributeSelectValue = MOCK_OPTIONS_WINE_TYPE[0].name[0].value;
const mockAttributeStringName = MOCK_ATTRIBUTE_STRING.name[0].value;
const mockAttributeNumberName = MOCK_ATTRIBUTE_NUMBER.name[0].value;

describe('Products list', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD products', () => {
    // Should delete product from city or DB
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(mockProductForDelete).should('not.exist');

    // Should open product details
    cy.getByCy(`${mockProductC}-update`).click();
    cy.getByCy(`product-details`).should('exist');

    // Should update product main image
    cy.getByCy('file-preview-remove-0').click();
    cy.getByCy('remove-image-confirm').click();
    cy.getByCy('product-images').attachFile('test-image-1.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('submit-product').click();
    cy.getByCy(`success-notification`).should('exist');

    // Should update product main fields
    cy.getByCy('product-name').clear().type(mockProductNewName);
    cy.getByCy('product-card-name').clear().type(mockProductNewCardName);
    cy.getByCy('product-price').clear().clear().type(`${mockProductNewCardPrice}`);
    cy.getByCy('product-description').clear().type(mockProductNewCarDescription);
    cy.getByCy('submit-product').click();
    cy.getByCy(`success-notification`).should('exist');

    // Should update product attributes
    cy.getByCy(`tree-link-${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`tree-link-${mockTablesRubricLevelThree}-checkbox`).check();
    cy.getByCy(`${mockAttributeStringName}-0`).type('string');
    cy.getByCy(`${mockAttributeStringName}-0-showInCard-checkbox`).check();
    cy.getByCy(`${mockAttributeNumberName}-0`).type('999');
    cy.getByCy(`${mockAttributeNumberName}-0-showInCard-checkbox`).check();
    cy.getByCy('submit-product').click();
    cy.getByCy(`success-notification`).should('exist');

    // Should create new product
    cy.visit(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
    cy.getByCy(`product-create`).click();

    // attach images
    cy.getByCy('product-images').attachFile('test-image-3.png', { subjectType: 'drag-n-drop' });

    // fill inputs
    cy.getByCy('product-name').type(mockProductCreateName);
    cy.getByCy('product-card-name').type(mockProductCreateCardName);
    cy.getByCy('product-price').clear().type(`${mockProductCreateCardPrice}`);
    cy.getByCy('product-description').type(mockProductCreateCarDescription);
    cy.getByCy(`tree-link-${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`tree-link-${mockRubricLevelThreeB}-checkbox`).check();

    // fill attributes
    cy.getByCy(`${mockAttributeMultipleSelectValueA}-0-checkbox`).check();
    cy.getByCy(`${mockAttributeMultipleSelectValueB}-0-checkbox`).check();

    cy.selectOptionByTestId(`${mockAttributeSelectName}-0`, mockAttributeSelectValue);
    cy.getByCy(`${mockAttributeSelectName}-0-showInCard-checkbox`).check();

    cy.getByCy(`${mockAttributeStringName}-0`).type('string');
    cy.getByCy(`${mockAttributeStringName}-0-showInCard-checkbox`).check();

    cy.getByCy(`${mockAttributeNumberName}-0`).type('999');
    cy.getByCy(`${mockAttributeNumberName}-0-showInCard-checkbox`).check();

    cy.getByCy('submit-new-product').click();
    cy.getByCy(mockProductCreateName).should('exist');
  });
});
