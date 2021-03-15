import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';
import { OptionModel, RubricModel } from 'db/dbModels';

describe('Catalogue filter', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit(`/${DEFAULT_CITY}/`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have catalogue and filters', () => {
    const wineRubric: RubricModel = mockData.rubricA;
    const wineRubricTitle = wineRubric.catalogueTitle;
    const wineRubricDefaultTitle = wineRubricTitle.defaultTitleI18n[DEFAULT_LOCALE];
    const wineRubricKeyword = wineRubricTitle.keywordI18n[DEFAULT_LOCALE];
    const wineRubricPrefix = wineRubricTitle.prefixI18n
      ? wineRubricTitle.prefixI18n[DEFAULT_LOCALE]
      : '';
    const wineRubricTitleGender = wineRubricTitle.gender;

    const wineRubricTestId = `main-rubric-list-item-${wineRubric.slug}`;

    const mockAttributeWineColorSlug = mockData.attributeWineColor.slug;
    const mockAttributeWineVariantSlug = mockData.attributeWineVariant.slug;

    const colorOptionIndex = 1;
    const mockWineColorOption: OptionModel = mockData.optionsColor[colorOptionIndex];
    const mockWineColorOptionSlug = mockWineColorOption.slug;
    const mockWineColorOptionVariant = mockWineColorOption.variants[wineRubricTitleGender];
    const mockWineColorOptionVariantValue = mockWineColorOptionVariant
      ? mockWineColorOptionVariant[DEFAULT_LOCALE]
      : mockWineColorOption.nameI18n[DEFAULT_LOCALE];

    const variantOptionIndex = 2;
    const mockWineVariantOption: OptionModel = mockData.optionsWineVariant[variantOptionIndex];
    const mockWineVariantOptionSlug = mockWineVariantOption.slug;
    const mockWineVariantOptionVariant = mockWineVariantOption.variants[wineRubricTitleGender];
    const mockWineVariantOptionVariantValue = mockWineVariantOptionVariant
      ? mockWineVariantOptionVariant[DEFAULT_LOCALE]
      : mockWineVariantOption.nameI18n[DEFAULT_LOCALE];

    // Should show search result
    cy.getByCy('search-trigger').click();
    cy.getByCy('search-dropdown').should('exist');
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });

    cy.getByCy('search-input').type(wineRubric.nameI18n[DEFAULT_LOCALE]);
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(1);
    });
    cy.getByCy('search-product').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-close').click();
    cy.getByCy('search-dropdown').should('not.exist');

    // Should navigate to the rubric
    cy.getByCy(wineRubricTestId).trigger('mouseover');
    cy.getByCy('burger-dropdown').should('be.visible');
    cy.getByCy(wineRubricTestId).trigger('mouseout');

    cy.getByCy(wineRubricTestId).click();
    cy.getByCy('catalogue-title').should('exist');
    cy.getByCy('catalogue-title').contains(wineRubricDefaultTitle, { matchCase: false });

    // Should update page title
    cy.getByCy(`${mockAttributeWineColorSlug}-${mockWineColorOptionSlug}`).click();
    cy.getByCy('catalogue-title').contains(wineRubricKeyword, { matchCase: false });
    cy.getByCy('catalogue-title').contains(wineRubricPrefix, { matchCase: false });
    cy.getByCy('catalogue-title').contains(mockWineColorOptionVariantValue, {
      matchCase: false,
    });

    cy.getByCy(`${mockAttributeWineVariantSlug}-${mockWineVariantOptionSlug}`).click();
    cy.getByCy('catalogue-title').contains(mockWineVariantOptionVariantValue, { matchCase: false });
  });
});
