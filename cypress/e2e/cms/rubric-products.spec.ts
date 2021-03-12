import { DEFAULT_CITY, DEFAULT_LOCALE, ROUTE_CMS, SECONDARY_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Rubric products', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/${DEFAULT_CITY}${ROUTE_CMS}/rubrics`);
  });

  after(() => {
    // cy.clearTestData();
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

  it('Should CRUD products', () => {
    const rubricBName = mockData.rubricBDefaultName;
    const mockProductCName = mockData.productC.nameI18n[DEFAULT_LOCALE];

    const mockProductNewName = 'mockProductNewName';
    const mockProductNewDescription = 'mockProductNewDescription';
    const mockAttributeStringName = mockData.attributeString.nameI18n[DEFAULT_LOCALE];
    const mockAttributeNumberName = mockData.attributeNumber.nameI18n[DEFAULT_LOCALE];

    cy.getByCy(`${rubricBName}-update`).click();
    cy.visitMoreNavLink('products');

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

    cy.visit(`/${DEFAULT_CITY}${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${rubricBName}-update`).click();
    cy.visitMoreNavLink('products');
    cy.getByCy(`${mockProductNewName}-row`).should('exist');
  });

  it('Should CRUD product connections', () => {
    const rubricAName = mockData.rubricADefaultName;
    const productName = mockData.productA.nameI18n[DEFAULT_LOCALE];
    const addProductName = mockData.productD.nameI18n[DEFAULT_LOCALE];
    const connectionAttribute = mockData.attributeWineVariant;
    const connectionAttributeId = `${connectionAttribute._id}`;
    const connectionAttributeName = connectionAttribute.nameI18n[DEFAULT_LOCALE];

    cy.getByCy(`${rubricAName}-update`).click();
    cy.visitMoreNavLink('products');

    // Should open product details
    cy.getByCy(`${productName}-update`).click();
    cy.getByCy(`product-details`).should('exist');

    // Should add product connection
    cy.visitMoreNavLink('connections');
    cy.getByCy(`create-connection`).click();
    cy.getByCy(`create-connection-modal`).should('exist');
    cy.getByCy('attributeId').select(`${connectionAttributeId}`);
    cy.getByCy(`create-connection-submit`).click();
    cy.getByCy(`create-connection-modal`).should('not.exist');
    cy.shouldSuccess();

    cy.getByCy(`${connectionAttributeName}-connection`).should('exist');
    cy.getByCy(`${connectionAttributeName}-connection-list`).should('exist');
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${productName}-row"]`,
    ).should('exist');

    // Shouldn't create new connection on duplicate error
    cy.getByCy(`create-connection`).click();
    cy.getByCy(`create-connection-empty-modal`).should('exist');
    cy.getByCy(`close-modal`).click();

    // Should add product to the new connection
    const addProductToConnectionModal = `add-product-to-connection-modal`;
    cy.getByCy(`${connectionAttributeName}-connection-create`).click();
    cy.getByCy(addProductToConnectionModal).should('exist');

    cy.getByCy(`${addProductName}-create`).click();
    cy.getByCy(addProductToConnectionModal).should('not.exist');
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${addProductName}-row"]`,
    ).should('exist');

    // Should delete product from connection
    cy.getByCy(`${addProductName}-delete`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('not.exist');
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${addProductName}-row"]`,
    ).should('not.exist');

    // Should delete connection if product is last
    cy.get(
      `[data-cy="${connectionAttributeName}-connection-list"] [data-cy="${productName}-delete"]`,
    ).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`delete-product-from-connection-modal`).should('not.exist');
    cy.getByCy(`${connectionAttributeName}-connection-list`).should('not.exist');
  });
});
