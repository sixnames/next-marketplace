/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  MOCK_PRODUCT_B,
  MOCK_PRODUCT_C,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_RUBRIC_LEVEL_THREE_B_A,
  MOCK_PRODUCT_NEW,
  MOCK_PRODUCT_CREATE,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_OPTIONS_WINE_VARIANT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_ATTRIBUTE_WINE_COLOR,
} from '@yagu/mocks';
import { ATTRIBUTE_VIEW_VARIANT_TAG, DEFAULT_LANG, SECONDARY_LANG } from '@yagu/config';

describe('Products', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD products', () => {
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

    const mockAttributeColorName = MOCK_ATTRIBUTE_WINE_COLOR.name[0].value;
    const mockAttributeMultipleSelectValueA = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
    const mockAttributeMultipleSelectValueB = MOCK_OPTIONS_WINE_COLOR[1].name[0].value;

    const mockAttributesGroupWineFeaturesName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;

    const mockAttributeSelectName = MOCK_ATTRIBUTE_WINE_VARIANT.name[0].value;
    const mockAttributeSelectValue = MOCK_OPTIONS_WINE_VARIANT[0].name[0].value;
    const mockAttributeStringName = MOCK_ATTRIBUTE_STRING.name[0].value;
    const mockAttributeNumberName = MOCK_ATTRIBUTE_NUMBER.name[0].value;

    // Should delete product from city or DB
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(mockProductForDelete).should('not.exist');
    cy.shouldSuccess();

    // Should open product details
    cy.getByCy(`${mockProductC}-update`).click();
    cy.getByCy(`product-details`).should('exist');

    // Should update product activity
    cy.getByCy('active-checkbox').check();
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should update product main image
    cy.getByCy('file-preview-remove-0').click();
    cy.getByCy('remove-image-confirm').click();
    cy.getByCy('product-images').attachFile('test-image-1.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should update product main fields
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`cardName-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`description-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(mockProductNewName);
    cy.getByCy(`name-${SECONDARY_LANG}`).clear().type(mockProductNewName);
    cy.getByCy(`cardName-${DEFAULT_LANG}`).clear().type(mockProductNewCardName);
    cy.getByCy(`cardName-${SECONDARY_LANG}`).clear().type(mockProductNewCardName);
    cy.getByCy('product-price').clear().type(`${mockProductNewCardPrice}`);
    cy.getByCy(`description-${DEFAULT_LANG}`).clear().type(mockProductNewCarDescription);
    cy.getByCy(`description-${SECONDARY_LANG}`).clear().type(mockProductNewCarDescription);
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should update product attributes
    cy.getByCy(`tree-link-${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`tree-link-${mockTablesRubricLevelThree}-checkbox`).check();
    cy.getByCy(`${mockAttributesGroupWineFeaturesName}-${mockAttributeStringName}`).type('string');
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeStringName}-showInCard-checkbox`,
    ).check();
    cy.getByCy(`${mockAttributesGroupWineFeaturesName}-${mockAttributeNumberName}`).type('999');
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeNumberName}-showInCard-checkbox`,
    ).check();
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeNumberName}-viewVariant`,
    ).select(ATTRIBUTE_VIEW_VARIANT_TAG);
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should create new product
    cy.visit(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
    cy.getByCy(`product-create`).click();

    // attach images
    cy.getByCy('product-images').attachFile('test-image-3.png', { subjectType: 'drag-n-drop' });

    // fill inputs
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`cardName-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`description-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockProductCreateName);
    cy.getByCy(`name-${SECONDARY_LANG}`).type(mockProductCreateName);
    cy.getByCy(`cardName-${DEFAULT_LANG}`).type(mockProductCreateCardName);
    cy.getByCy(`cardName-${SECONDARY_LANG}`).type(mockProductCreateCardName);
    cy.getByCy('product-price').clear().type(`${mockProductCreateCardPrice}`);
    cy.getByCy(`description-${DEFAULT_LANG}`).type(mockProductCreateCarDescription);
    cy.getByCy(`description-${SECONDARY_LANG}`).type(mockProductCreateCarDescription);
    cy.getByCy(`tree-link-${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`tree-link-${mockRubricLevelThreeB}-checkbox`).check();

    // fill attributes
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeColorName}-${mockAttributeMultipleSelectValueA}-checkbox`,
    ).check();
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeColorName}-${mockAttributeMultipleSelectValueB}-checkbox`,
    ).check();

    cy.selectOptionByTestId(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeSelectName}`,
      mockAttributeSelectValue,
    );
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeSelectName}-showInCard-checkbox`,
    ).check();

    cy.getByCy(`${mockAttributesGroupWineFeaturesName}-${mockAttributeStringName}`).type('string');
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeStringName}-showInCard-checkbox`,
    ).check();

    cy.getByCy(`${mockAttributesGroupWineFeaturesName}-${mockAttributeNumberName}`).type('999');
    cy.getByCy(
      `${mockAttributesGroupWineFeaturesName}-${mockAttributeNumberName}-showInCard-checkbox`,
    ).check();

    cy.getByCy('submit-new-product').click();
    cy.getByCy(mockProductCreateName).should('exist');
  });
});
