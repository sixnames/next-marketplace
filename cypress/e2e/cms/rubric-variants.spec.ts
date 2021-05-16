import { ADULT_KEY, ADULT_TRUE, ROUTE_CMS } from 'config/common';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/rubric-variants`);
  });

  it(`Should CRUD rubric variant`, () => {
    cy.visit('/');
    // const mockRubricVariantName = mockData.rubricVariantAlcohol.nameI18n[DEFAULT_LOCALE];
    // const mockRubricVariantNameForDelete = mockData.rubricVariantJuice.nameI18n[DEFAULT_LOCALE];
    // const mockNewRubricVariantName = 'mockNewRubricVariantName';

    // Shouldn't create new rubric variant on validation error
    // cy.getByCy('rubric-variant-create').click();
    // cy.getByCy('rubric-variant-modal').should('exist');
    // cy.getByCy('rubric-variant-submit').click();
    // cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Shouldn't create new rubric on duplicate error
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockRubricVariantName);
    // cy.getByCy('rubric-variant-submit').click();
    // cy.getByCy('rubric-variant-modal').should('not.exist');
    // cy.shouldError();

    // Should create new rubric variant
    // cy.getByCy('rubric-variant-create').click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockNewRubricVariantName);
    // cy.getByCy('rubric-variant-submit').click();
    // cy.getByCy(`${mockNewRubricVariantName}-row`).should('exist');
    // cy.shouldSuccess();

    // Should update rubric variant name
    // const mockUpdatedRubricTypeName = 'updated_variant';
    // cy.getByCy(`${mockNewRubricVariantName}-update`).click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(mockUpdatedRubricTypeName);
    // cy.getByCy('rubric-variant-submit').click();
    // cy.getByCy(`${mockNewRubricVariantName}-row`).should('not.exist');
    // cy.getByCy(`${mockUpdatedRubricTypeName}-row`).should('exist');
    // cy.shouldSuccess();

    // Shouldn't delete rubric variant connected to the rubric
    // cy.getByCy(`${mockRubricVariantName}-delete`).click();
    // cy.getByCy('rubric-variant-delete-modal').should('exist');
    // cy.getByCy('confirm').click();
    // cy.shouldError();
    // cy.getByCy(`${mockRubricVariantName}-row`).should('exist');

    // Should delete rubric variant
    // cy.getByCy(`${mockRubricVariantNameForDelete}-delete`).click();
    // cy.getByCy('rubric-variant-delete-modal').should('exist');
    // cy.getByCy('confirm').click();
    // cy.shouldSuccess();
    // cy.getByCy(`${mockRubricVariantNameForDelete}-row`).should('not.exist');
  });
});
