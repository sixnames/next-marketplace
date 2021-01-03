/// <reference types="cypress" />
import { getTestLangField } from '../../../utils/getLangField';

describe('Catalogue filter', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit('/');
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have catalogue and filters', () => {
    const wineRubric = mockData.rubricLevelOneA;
    const wineRubricName = getTestLangField(wineRubric.name);
    const wineRubricTitle = mockData.rubricLevelOneA.catalogueTitle;
    const wineRubricDefaultTitle = getTestLangField(wineRubricTitle.defaultTitle);
    const wineRubricKeyword = getTestLangField(wineRubricTitle.keyword);
    const wineRubricPrefix = getTestLangField(wineRubricTitle.prefix);
    const wineRubricTitleGender = wineRubricTitle.gender;

    const mockAttributeWineColorSlug = mockData.attributeWineColor.slug;
    const mockAttributeWineVariantSlug = mockData.attributeWineVariant.slug;

    const colorOptionIndex = 1;
    const mockWineColorOption = mockData.optionsColor[colorOptionIndex];
    const mockWineColorOptionSlug = mockWineColorOption.slug;
    const mockWineColorOptionVariant = mockWineColorOption.variants.find(
      ({ key }: any) => key === wineRubricTitleGender,
    );
    const mockWineColorOptionFinalVariant = mockWineColorOptionVariant
      ? mockWineColorOptionVariant.value
      : mockWineColorOption.name;
    const mockWineColorOptionVariantValue = getTestLangField(mockWineColorOptionFinalVariant);

    const variantOptionIndex = 2;
    const mockWineVariantOption = mockData.optionsWineVariant[variantOptionIndex];
    const mockWineVariantOptionSlug = mockWineVariantOption.slug;
    const mockWineVariantOptionVariant = mockWineVariantOption.variants.find(
      ({ key }: any) => key === wineRubricTitleGender,
    );
    const mockWineVariantOptionFinalVariant = mockWineVariantOptionVariant
      ? mockWineVariantOptionVariant.value
      : mockWineVariantOption.name;
    const mockWineVariantOptionVariantValue = getTestLangField(mockWineVariantOptionFinalVariant);

    cy.getByCy(`main-rubric-list-item-${wineRubricName}`).trigger('mouseover');
    cy.getByCy('burger-dropdown').should('be.visible');
    cy.getByCy(`main-rubric-list-item-${wineRubricName}`).trigger('mouseout');

    cy.getByCy(`main-rubric-${wineRubricName}`).click();
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
