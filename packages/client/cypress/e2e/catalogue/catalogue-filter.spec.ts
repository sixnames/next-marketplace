/// <reference types="cypress" />
import {
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_WINE_VARIANT,
  MOCK_RUBRIC_LEVEL_ONE,
} from '@yagu/shared';

describe('Catalogue filter', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.visit('/');
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have catalogue and filters', () => {
    const mockRubricLevelOne = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
    const mockAttributeWineColor = MOCK_ATTRIBUTE_WINE_COLOR.slug;
    const mockAttributeWineType = MOCK_ATTRIBUTE_WINE_VARIANT.slug;
    const mockAttributeWineColorValueRed = MOCK_OPTIONS_WINE_COLOR[1].slug;
    const mockAttributeWineTypeValueVermut = MOCK_OPTIONS_WINE_VARIANT[2].slug;
    const mockAttributeWineTypeValueHeres = MOCK_OPTIONS_WINE_VARIANT[1].slug;

    cy.getByCy(`main-rubric-list-item-${mockRubricLevelOne}`).trigger('mouseover');
    cy.getByCy('burger-dropdown').should('be.visible');
    cy.getByCy(`main-rubric-list-item-${mockRubricLevelOne}`).trigger('mouseout');

    cy.getByCy(`main-rubric-${mockRubricLevelOne}`).click();
    cy.getByCy('catalogue-title').should('exist');
    cy.getByCy('catalogue-title').contains('Купить вино');

    // Should update page title
    cy.getByCy(`${mockAttributeWineColor}-${mockAttributeWineColorValueRed}`).click();
    cy.getByCy('catalogue-title').should('contain', 'красное');

    cy.getByCy(`${mockAttributeWineType}-${mockAttributeWineTypeValueVermut}`).click();
    cy.getByCy('catalogue-title').should('contain', 'вермут');
    cy.getByCy(`${mockAttributeWineType}-${mockAttributeWineTypeValueHeres}`).click();
    cy.getByCy('catalogue-title').should('contain', 'херес');
  });
});
