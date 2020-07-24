/// <reference types="cypress" />
import { MOCK_RUBRIC_TYPE_ALCOHOL, MOCK_RUBRIC_TYPE_JUICE } from '../../../config';

const mockRubricVariantName = MOCK_RUBRIC_TYPE_ALCOHOL.name[0].value;
const mockRubricVariantNameForDelete = MOCK_RUBRIC_TYPE_JUICE.name[0].value;
const mockNewRubricVariantName = 'new_variant';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/rubric-variants`);
  });

  after(() => {
    cy.clearTestData();
  });

  it(`Should CRUD rubric variant`, () => {
    // Shouldn't create new rubric type on validation error
    cy.getByCy('rubric-variant-create').click();
    cy.getByCy('rubric-variant-modal').should('exist');
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Shouldn't create new rubric on duplicate error
    cy.getByCy('name-ru').type(mockRubricVariantName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy('rubric-variant-modal').should('not.exist');
    cy.getByCy(`error-notification`).should('exist');

    // Should create new rubric type
    cy.getByCy('rubric-variant-create').click();
    cy.getByCy('name-ru').type(mockNewRubricVariantName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`${mockNewRubricVariantName}`).should('exist');

    // Should update rubric type name
    const mockUpdatedRubricTypeName = 'updated_variant';
    cy.getByCy(`${mockNewRubricVariantName}-update`).click();
    cy.getByCy('name-ru').clear().type(mockUpdatedRubricTypeName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`${mockNewRubricVariantName}`).should('not.exist');
    cy.getByCy(`${mockUpdatedRubricTypeName}`).should('exist');

    // Shouldn't delete rubric type connected to the rubric
    cy.getByCy(`${mockRubricVariantName}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy('error-notification').should('exist');
    cy.getByCy(`${mockRubricVariantName}`).should('exist');

    // Should delete rubric type
    cy.getByCy(`${mockRubricVariantNameForDelete}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy('success-notification').should('exist');
    cy.getByCy(`${mockRubricVariantNameForDelete}`).should('not.exist');
  });
});
