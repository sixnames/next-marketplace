/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import { DEFAULT_LANG, SECONDARY_LANG, ATTRIBUTE_VIEW_VARIANT_TAG } from '@yagu/shared';
import { getTestLangField } from '../../../utils/getLangField';
import * as faker from 'faker';

describe('Products', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD products', () => {
    const mockProductForDeleteName = getTestLangField(mockData.productB.name);
    const mockProductCName = getTestLangField(mockData.productC.name);
    const mockRubricLevelThreeName = getTestLangField(mockData.rubricLevelThreeAA.name);
    const mockRubricLevelThreeBName = getTestLangField(mockData.rubricLevelThreeAB.name);
    const mockTablesRubricLevelThreeName = getTestLangField(mockData.rubricLevelThreeBA.name);

    const mockProductNewName = faker.commerce.productName();
    const mockProductNewCardName = mockProductNewName;
    const mockProductNewCarDescription = faker.commerce.productDescription();

    const mockProductCreateName = faker.commerce.productName();
    const mockProductCreateCardName = mockProductCreateName;
    const mockProductCreateCarDescription = faker.commerce.productDescription();
    const mockAttributeColorName = getTestLangField(mockData.attributeWineColor.name);

    const mockAttributeMultipleSelects = mockData.optionsColor;
    const mockAttributeMultipleSelectValueA = getTestLangField(
      mockAttributeMultipleSelects[0].name,
    );
    const mockAttributeMultipleSelectValueB = getTestLangField(
      mockAttributeMultipleSelects[1].name,
    );

    const mockAttributesGroupWineFeaturesName = getTestLangField(
      mockData.attributesGroupWineFeatures.name,
    );

    const mockAttributeSelectName = getTestLangField(mockData.attributeWineVariant.name);
    const mockAttributeSelectValue = mockData.optionsWineVariant[0].slug;

    const mockAttributeStringName = getTestLangField(mockData.attributeString.name);
    const mockAttributeNumberName = getTestLangField(mockData.attributeNumber.name);

    // Should delete product from city or DB
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductForDeleteName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(`${mockProductForDeleteName}-row`).should('not.exist');
    cy.shouldSuccess();

    // Should open product details
    cy.getByCy(`${mockProductCName}-update`).click();
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
    cy.getByCy(`originalName`).clear().type(mockProductNewName);
    cy.getByCy(`description-${DEFAULT_LANG}`).clear().type(mockProductNewCarDescription);
    cy.getByCy(`description-${SECONDARY_LANG}`).clear().type(mockProductNewCarDescription);
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should update product attributes
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}-checkbox`).check();
    cy.getByCy(`tree-link-${mockTablesRubricLevelThreeName}-checkbox`).check();
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
    cy.getByCy(`originalName`).clear().type(mockProductCreateName);
    cy.getByCy(`description-${DEFAULT_LANG}`).type(mockProductCreateCarDescription);
    cy.getByCy(`description-${SECONDARY_LANG}`).type(mockProductCreateCarDescription);
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}-checkbox`).check();
    cy.getByCy(`tree-link-${mockRubricLevelThreeBName}-checkbox`).check();

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
    cy.getByCy(`${mockProductCreateName}-row`).should('exist');
  });
});
