/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED, QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../../config';
import {
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_PRODUCT_C,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_PRODUCT_A,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_PRODUCT_NEW,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_OPTIONS_WINE_VARIANT,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_ATTRIBUTE_WINE_COLOR,
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '@yagu/shared';

const modal = 'add-product-to-rubric-modal';

describe('Rubric products', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should delete product from rubric and db', () => {
    const mockRubricLevelThreeNameB = MOCK_RUBRIC_LEVEL_THREE_A_B.name[0].value;
    const mockProductForDelete = MOCK_PRODUCT_C.name[0].value;

    // Should delete product from rubric
    cy.getByCy(`tree-link-${mockRubricLevelThreeNameB}`).click();
    cy.getByCy('rubric-products').should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('rubric-products').should('not.contain', mockProductForDelete);
    cy.getByCy(`${mockRubricLevelThreeNameB}-total`).should('contain', '0');

    // Should display not in rubric products and should delete product from DB
    cy.getByCy(QUERY_DATA_LAYOUT_NO_RUBRIC).click();
    cy.getByCy(`${mockProductForDelete}-row`).should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy(`confirm`).click();

    cy.getByCy('delete-product-modal').should('not.exist');
    cy.getByCy(`${mockProductForDelete}-row`).should('not.exist');
  });

  it('Should add product to rubric', () => {
    const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE_A_A.name[0].value;
    const mockRubricLevelThreeNameB = MOCK_RUBRIC_LEVEL_THREE_A_B.name[0].value;

    const mockProduct = MOCK_PRODUCT_A.name[0].value;
    const mockProductForDelete = MOCK_PRODUCT_C.name[0].value;

    // Should add product from tree to the rubric
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.getByCy('product-create').click();
    cy.getBySelector(`[data-cy=${modal}] [data-cy=tree-${mockRubricLevelThreeNameB}]`).click();
    cy.getByCy(`${mockProductForDelete}-create`).click();
    cy.getByCy(`${mockProductForDelete}-row`).should('exist');

    // Should add product from not in rubric list to the rubric
    cy.getByCy(`${mockProduct}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy('product-create').click();
    cy.get(`[data-cy=${modal}] [data-cy=${QUERY_DATA_LAYOUT_NO_RUBRIC}]`).click();
    cy.getByCy(`${mockProduct}-create`).click();
    cy.getByCy(`${mockProduct}-row`).should('exist');

    // Should add product from search result to the rubric
    cy.getByCy(`${mockProduct}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy('product-create').click();
    cy.getByCy('product-search-input').type(mockProduct);
    cy.getByCy('product-search-reset').click();
    cy.getByCy('product-search-input').should('not.have.value', mockProduct);
    cy.getByCy('product-search-input').type(mockProduct);
    cy.getByCy('product-search-submit').click();
    cy.getByCy(`${mockProduct}-create`).click();
    cy.getByCy(`${mockProduct}-row`).should('exist');
  });

  it('Should create products in rubric', () => {
    const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
    const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE_A_A.name[0].value;

    const mockProductNewName = MOCK_PRODUCT_NEW.name[0].value;
    const mockProductNewCardName = MOCK_PRODUCT_NEW.cardName[0].value;
    const mockProductNewCardPrice = MOCK_PRODUCT_NEW.price;
    const mockProductNewCarDescription = MOCK_PRODUCT_NEW.description[0].value;

    const mockAttributesGroupWineFeaturesName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockAttributeColorName = MOCK_ATTRIBUTE_WINE_COLOR.name[0].value;

    const mockAttributeMultipleSelectValueA = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
    const mockAttributeMultipleSelectValueB = MOCK_OPTIONS_WINE_COLOR[1].name[0].value;
    const mockAttributeSelectName = MOCK_ATTRIBUTE_WINE_VARIANT.name[0].value;
    const mockAttributeSelectValue = MOCK_OPTIONS_WINE_VARIANT[0].name[0].value;
    const mockAttributeStringName = MOCK_ATTRIBUTE_STRING.name[0].value;
    const mockAttributeNumberName = MOCK_ATTRIBUTE_NUMBER.name[0].value;

    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();

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
    cy.getByCy('close-modal').click();

    // Should create product and add it to the rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.getByCy('product-create').click();
    cy.getByCy('create-new-product').click();

    cy.getByCy('product-images').attachFile('test-image-1.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-0').should('exist');
    cy.getByCy('product-images').attachFile('test-image-2.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-1').should('exist');
    cy.getByCy('product-images').attachFile('test-image-3.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-2').should('exist');

    // remove last added image
    cy.getByCy('file-preview-remove-2').click();
    cy.getByCy('remove-image-decline').click();
    cy.getByCy('file-preview-remove-2').click();
    cy.getByCy('remove-image-confirm').click();
    cy.getByCy('file-preview-2').should('not.exist');

    // fill inputs
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`cardName-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`description-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockProductNewName);
    cy.getByCy(`name-${SECONDARY_LANG}`).type(mockProductNewName);
    cy.getByCy(`cardName-${DEFAULT_LANG}`).type(mockProductNewCardName);
    cy.getByCy(`cardName-${SECONDARY_LANG}`).type(mockProductNewCardName);
    cy.getByCy(`originalName`).clear().type(mockProductNewCardName);
    cy.getByCy('product-price').clear().type(`${mockProductNewCardPrice}`);
    cy.getByCy(`description-${DEFAULT_LANG}`).type(mockProductNewCarDescription);
    cy.getByCy(`description-${SECONDARY_LANG}`).type(mockProductNewCarDescription);

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
    cy.getByCy(`${mockProductNewName}-row`).should('exist');
  });
});
