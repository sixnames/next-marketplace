/// <reference types="cypress" />

import {
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_WINE_TYPE,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_WINE_TYPE,
  MOCK_RUBRIC_LEVEL_ONE,
} from '../../../config';

const mockRubricLevelOne = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockAttributeWineColor = MOCK_ATTRIBUTE_WINE_COLOR.slug;
const mockAttributeWineType = MOCK_ATTRIBUTE_WINE_TYPE.slug;
const mockAttributeWineColorValueWhite = MOCK_OPTIONS_WINE_COLOR[0].slug;
const mockAttributeWineColorValueRed = MOCK_OPTIONS_WINE_COLOR[1].slug;
const mockAttributeWineTypeValuePortvein = MOCK_OPTIONS_WINE_TYPE[0].slug;
const mockAttributeWineTypeValueHeres = MOCK_OPTIONS_WINE_TYPE[1].slug;

describe('Catalogue filter', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.visit('/');
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have catalogue and filters', () => {
    cy.getByCy('show-all-rubrics').click();
    cy.getByCy('all-rubrics-nav').should('be.visible');
    cy.getByCy(`main-rubric-${mockRubricLevelOne}`).click();
    cy.getByCy('catalogue-title').contains('Купить вино');

    // Should update page title
    cy.getByCy(`${mockAttributeWineColor}-${mockAttributeWineColorValueWhite}`).click();
    cy.getByCy('catalogue-title').contains('Купить белое вино');
    cy.getByCy(`${mockAttributeWineColor}-${mockAttributeWineColorValueRed}`).click();
    cy.getByCy('catalogue-title').contains('Купить белое или красное вино');

    cy.getByCy(`${mockAttributeWineType}-${mockAttributeWineTypeValuePortvein}`).click();
    cy.getByCy('catalogue-title').contains('Купить белый или красный портвейн');
    cy.getByCy(`${mockAttributeWineType}-${mockAttributeWineTypeValueHeres}`).click();
    cy.getByCy('catalogue-title').contains('Купить белый или красный портвейн или херес');
  });
});