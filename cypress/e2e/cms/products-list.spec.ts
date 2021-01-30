import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Products', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/cms/products`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD products', () => {
    const mockProductCName = mockData.productC.nameI18n[DEFAULT_LOCALE];
    const mockRubricLevelTwoName = mockData.rubricLevelTwoADefaultName;
    const mockRubricLevelTwoBName = mockData.rubricLevelTwoBDefaultName;

    const mockProductNewName = 'mockProductNewName';
    const mockProductNewDescription = 'mockProductNewDescription';

    const mockProductCreateName = 'mockProductCreateName';
    const mockProductCreateCarDescription = 'mockProductCreateCarDescription';

    const mockAttributeColorName = mockData.attributeWineColor.nameI18n[DEFAULT_LOCALE];
    const mockAttributeMultipleSelects = mockData.optionsColor;
    const mockAttributeMultipleSelectValueA =
      mockAttributeMultipleSelects[0].nameI18n[DEFAULT_LOCALE];
    const mockAttributeMultipleSelectValueB =
      mockAttributeMultipleSelects[1].nameI18n[DEFAULT_LOCALE];

    const mockAttributeSelectName = mockData.attributeWineVariant.nameI18n[DEFAULT_LOCALE];
    const mockAttributeSelectValue = mockData.optionsWineVariant[0].slug;

    const mockAttributeStringName = mockData.attributeString.nameI18n[DEFAULT_LOCALE];
    const mockAttributeNumberName = mockData.attributeNumber.nameI18n[DEFAULT_LOCALE];

    // Should open product details
    cy.getByCy(`${mockProductCName}-update`).click();
    cy.getByCy(`product-details`).should('exist');

    // Should update product assets
    cy.visitMoreNavLink('assets');
    cy.getByCy('product-assets').should('exist');
    cy.getByCy('product-images').attachFile('test-image-1.png', { subjectType: 'drag-n-drop' });
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();
    cy.getByCy('asset-preview-remove-1').click();
    cy.getByCy('confirm').click();
    cy.shouldSuccess();

    // Should update product activity
    cy.visitMoreNavLink('details');
    cy.getByCy('active-checkbox').check();
    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should update product main fields
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(mockProductNewName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(mockProductNewName);

    cy.getByCy(`descriptionI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(mockProductNewDescription);
    cy.getByCy(`descriptionI18n-${SECONDARY_LOCALE}`).clear().type(mockProductNewDescription);

    cy.getByCy(`brandSlug`).select(mockData.brandB.slug);
    cy.getByCy(`brandCollectionSlug`).select(mockData.brandCollectionB.slug);
    cy.getByCy(`manufacturerSlug`).select(mockData.manufacturerC.slug);

    cy.getByCy(`originalName`).clear().type(mockProductNewName);

    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should update product attributes
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}-checkbox`).check();
    cy.getByCy(`tree-link-${mockRubricLevelTwoBName}-checkbox`).check();

    // string attribute
    cy.getByCy(`${mockAttributeStringName}-${DEFAULT_LOCALE}`).clear().type('string');
    cy.getByCy(`${mockAttributeStringName}-showInCard-checkbox`).check();
    cy.getByCy(`${mockAttributeStringName}-showAsBreadcrumb-checkbox`).check();

    // number attribute
    cy.getByCy(`${mockAttributeNumberName}`).clear().type('999');
    cy.getByCy(`${mockAttributeNumberName}-showInCard-checkbox`).check();
    cy.getByCy(`${mockAttributeNumberName}-showAsBreadcrumb-checkbox`).check();

    cy.getByCy('submit-product').click();
    cy.shouldSuccess();

    // Should create new product
    cy.visit(`/cms/products`);
    cy.getByCy(`product-create`).click();

    // attach images
    cy.getByCy('product-images').attachFile('test-image-3.png', { subjectType: 'drag-n-drop' });

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

    // fill attributes
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}-checkbox`).check();

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
