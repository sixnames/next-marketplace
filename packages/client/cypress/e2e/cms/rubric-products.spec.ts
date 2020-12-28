/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED, QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../../config';
import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/shared';
import { getTestLangField } from '../../../utils/getLangField';
import faker from 'faker';

const modal = 'add-product-to-rubric-modal';

describe('Rubric products', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should delete product from rubric and db', () => {
    const mockRubricLevelThreeBName = getTestLangField(mockData.rubricLevelThreeAB.name);
    const mockProductForDeleteName = getTestLangField(mockData.productC.name);

    // Should delete product from rubric
    cy.getByCy(`tree-link-${mockRubricLevelThreeBName}`).click();
    cy.getByCy('rubric-products').should('exist');
    cy.getByCy(`${mockProductForDeleteName}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('rubric-products').should('not.contain', mockProductForDeleteName);
    cy.getByCy(`${mockRubricLevelThreeBName}-total`).should('contain', '0');

    // Should display not in rubric products and should delete product from DB
    cy.getByCy(QUERY_DATA_LAYOUT_NO_RUBRIC).click();
    cy.getByCy(`${mockProductForDeleteName}-row`).should('exist');
    cy.getByCy(`${mockProductForDeleteName}-delete`).click();
    cy.getByCy(`confirm`).click();

    cy.getByCy('delete-product-modal').should('not.exist');
    cy.getByCy(`${mockProductForDeleteName}-row`).should('not.exist');
  });

  it('Should add product to rubric', () => {
    const mockRubricLevelThreeName = getTestLangField(mockData.rubricLevelThreeAA.name);
    const mockRubricLevelThreeBName = getTestLangField(mockData.rubricLevelThreeAB.name);

    const mockProductName = getTestLangField(mockData.productA.name);
    const mockProductForDeleteName = getTestLangField(mockData.productC.name);

    // Should add product from tree to the rubric
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.getByCy('product-create').click();
    cy.getBySelector(`[data-cy=${modal}] [data-cy=tree-${mockRubricLevelThreeBName}]`).click();
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
  });

  it('Should create products in rubric', () => {
    const mockRubricLevelOneName = getTestLangField(mockData.rubricLevelOneA.name);
    const mockRubricLevelThreeName = getTestLangField(mockData.rubricLevelThreeAA.name);

    const mockProductNewName = faker.commerce.productName();
    const mockProductNewCardName = mockProductNewName;
    const mockProductNewCarDescription = faker.commerce.productDescription();

    const mockAttributesGroupWineFeaturesName = getTestLangField(
      mockData.attributesGroupWineFeatures.name,
    );

    const mockAttributeColorName = getTestLangField(mockData.attributeWineColor.name);

    const mockAttributeMultipleSelectValueA = getTestLangField(mockData.optionsColor[0].name);
    const mockAttributeMultipleSelectValueB = getTestLangField(mockData.optionsColor[1].name);

    const mockAttributeSelectName = getTestLangField(mockData.attributeWineType.name);
    const mockAttributeSelectValue = getTestLangField(mockData.optionsWineType[0].name);
    const mockAttributeStringName = getTestLangField(mockData.attributeString.name);
    const mockAttributeNumberName = getTestLangField(mockData.attributeNumber.name);

    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();

    // Shouldn't create product on validation error
    cy.getByCy('product-create').click();
    cy.getByCy('add-product-to-rubric-modal').should('exist');
    cy.getByCy('create-new-product').click();
    cy.getByCy('create-new-product-modal').should('exist');
    cy.getByCy('submit-new-product').click();
    cy.getByCy('name[0].value-error').should('exist');
    cy.getByCy('cardName[0].value-error').should('exist');
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
