/// <reference types="cypress" />
import { MOCK_RUBRIC_VARIANT_ALCOHOL, MOCK_RUBRIC_VARIANT_JUICE } from '@yagu/mocks';
import { DEFAULT_LANG } from '@yagu/config';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/rubric-variants`);
  });

  after(() => {
    cy.clearTestData();
  });

  it(`Should CRUD rubric variant`, () => {
    const mockRubricVariantName = MOCK_RUBRIC_VARIANT_ALCOHOL.name[0].value;
    const mockRubricVariantNameForDelete = MOCK_RUBRIC_VARIANT_JUICE.name[0].value;
    const mockNewRubricVariantName = 'new_variant';

    // Shouldn't create new rubric variant on validation error
    cy.getByCy('rubric-variant-create').click();
    cy.getByCy('rubric-variant-modal').should('exist');
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Shouldn't create new rubric on duplicate error
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockRubricVariantName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy('rubric-variant-modal').should('not.exist');
    cy.shouldError();

    // Should create new rubric variant
    cy.getByCy('rubric-variant-create').click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockNewRubricVariantName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`${mockNewRubricVariantName}-row`).should('exist');
    cy.shouldSuccess();

    // Should update rubric variant name
    const mockUpdatedRubricTypeName = 'updated_variant';
    cy.getByCy(`${mockNewRubricVariantName}-update`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(mockUpdatedRubricTypeName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`${mockNewRubricVariantName}-row`).should('not.exist');
    cy.getByCy(`${mockUpdatedRubricTypeName}-row`).should('exist');
    cy.shouldSuccess();

    // Shouldn't delete rubric variant connected to the rubric
    cy.getByCy(`${mockRubricVariantName}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldError();
    cy.getByCy(`${mockRubricVariantName}-row`).should('exist');

    // Should delete rubric variant
    cy.getByCy(`${mockRubricVariantNameForDelete}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`${mockRubricVariantNameForDelete}-row`).should('not.exist');
  });
});
