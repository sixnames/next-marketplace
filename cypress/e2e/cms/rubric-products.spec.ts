import { DEFAULT_CITY, DEFAULT_LOCALE, ROUTE_CMS, SECONDARY_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Rubric products', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/${DEFAULT_CITY}${ROUTE_CMS}/rubrics`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should delete product from rubric', () => {
    const rubricBName = mockData.rubricBDefaultName;
    const mockProductForDeleteName = mockData.productC.nameI18n[DEFAULT_LOCALE];

    // Should delete product from rubric
    cy.getByCy(`${rubricBName}-update`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy('rubric-products').should('exist');
    cy.getByCy(`${mockProductForDeleteName}-delete`).click();
    cy.getByCy('delete-product-from-rubric-modal').should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('rubric-products').should('not.contain', mockProductForDeleteName);
    cy.visit(`/${DEFAULT_CITY}${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${rubricBName}-productsCount`).should('contain', '0');
  });

  it('Should add product to rubric', () => {
    const rubricAName = mockData.rubricADefaultName;
    const mockProductCreateName = 'mockProductCreateName';
    const mockProductCreateCarDescription = 'mockProductCreateCarDescription';
    const mockAttributeColorName = mockData.attributeWineColor.nameI18n[DEFAULT_LOCALE];
    const mockAttributeMultipleSelects = mockData.optionsColor;
    const mockAttributeMultipleSelectValueA =
      mockAttributeMultipleSelects[0].nameI18n[DEFAULT_LOCALE];
    const mockAttributeMultipleSelectValueB =
      mockAttributeMultipleSelects[1].nameI18n[DEFAULT_LOCALE];
    const mockAttributeSelectName = mockData.attributeWineVariant.nameI18n[DEFAULT_LOCALE];
    const mockAttributeSelectValue = `${mockData.attributeWineVariant.slug}-${mockData.optionsWineVariant[0].slug}`;
    const mockAttributeStringName = mockData.attributeString.nameI18n[DEFAULT_LOCALE];
    const mockAttributeNumberName = mockData.attributeNumber.nameI18n[DEFAULT_LOCALE];

    // Should add product from tree to the rubric
    cy.getByCy(`${rubricAName}-update`).click();
    cy.visitMoreNavLink('products');

    // Should display Create product modal
    cy.getByCy('product-create').click();
    cy.getByCy('create-new-product-modal').should('exist');

    // Fill assets
    cy.getByCy('product-images').attachFile('test-image-1.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('product-images').attachFile('test-image-2.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('file-preview-remove-0').click();
    cy.getByCy('remove-image-confirm').click();

    // fill inputs
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(mockProductCreateName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(mockProductCreateName);

    cy.getByCy(`descriptionI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(mockProductCreateCarDescription);
    cy.getByCy(`descriptionI18n-${SECONDARY_LOCALE}`).clear().type(mockProductCreateCarDescription);

    cy.getByCy(`brandSlug`).select(mockData.brandB.slug);
    cy.getByCy(`brandCollectionSlug`).select(mockData.brandCollectionB.slug);
    cy.getByCy(`manufacturerSlug`).select(mockData.manufacturerC.slug);

    cy.getByCy(`originalName`).clear().type(mockProductCreateName);

    // string attribute
    cy.getByCy(`${mockAttributeStringName}-${DEFAULT_LOCALE}`).clear().type('string');
    cy.getByCy(`${mockAttributeStringName}-showInCard-checkbox`).check();
    cy.getByCy(`${mockAttributeStringName}-showAsBreadcrumb-checkbox`).check();

    // number attribute
    cy.getByCy(`${mockAttributeNumberName}`).clear().type('999');
    cy.getByCy(`${mockAttributeNumberName}-showInCard-checkbox`).check();
    cy.getByCy(`${mockAttributeNumberName}-showAsBreadcrumb-checkbox`).check();

    // select attribute
    cy.getByCy(`${mockAttributeSelectName}`).select(mockAttributeSelectValue);
    cy.getByCy(`${mockAttributeSelectName}-showInCard-checkbox`).check();
    cy.getByCy(`${mockAttributeSelectName}-showAsBreadcrumb-checkbox`).check();

    // multiple select attribute
    cy.getByCy(`${mockAttributeColorName}-${mockAttributeMultipleSelectValueA}-checkbox`).check();
    cy.getByCy(`${mockAttributeColorName}-${mockAttributeMultipleSelectValueB}-checkbox`).check();

    cy.getByCy('submit-new-product').click();
    cy.getByCy(`${mockProductCreateName}-row`).should('exist');
  });
});
