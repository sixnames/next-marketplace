/// <reference types="cypress" />
import {
  MOCK_RUBRIC_TYPE_EQUIPMENT,
  MOCK_RUBRIC_TYPE_STAGE,
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
} from '../../../config';

const mockRubricVariantName = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockRubricVariantNameForDelete = MOCK_RUBRIC_TYPE_STAGE.name[0].value;
const mockNewRubricVariantName = 'cy-test-new-variant';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.auth({ redirect: `/app/cms/rubric-variants${QUERY_DATA_LAYOUT_FILTER_ENABLED}` });
  });

  after(() => {
    cy.clearTestData();
  });

  it(`Should CRUD rubric type`, () => {
    // Shouldn't create new rubric type on validation error
    cy.getByCy('rubric-variant-create').click();
    cy.getByCy('rubric-variant-modal').should('exist');
    cy.getByCy('update-name-submit').click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Shouldn't create new rubric on duplicate error
    cy.getByCy('update-name-input').type(mockRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-variant-modal').should('not.exist');
    cy.getByCy(`error-notification`).should('exist');

    // Should create new rubric type
    cy.getByCy('rubric-variant-create').click();
    cy.getByCy('update-name-input').type(mockNewRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-variant-modal').should('not.exist');
    cy.getByCy(`${mockNewRubricVariantName}`).should('exist');

    // Should update rubric type name
    const mockUpdatedRubricTypeName = 'cy-test-updated-type';
    cy.getByCy(`${mockNewRubricVariantName}-update`).click();
    cy.getByCy('rubric-variant-modal').should('exist');
    cy.getByCy('update-name-input').clear().type(mockUpdatedRubricTypeName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy(`${mockNewRubricVariantName}`).should('not.exist');
    cy.getByCy(`${mockUpdatedRubricTypeName}`).should('exist');

    // Shouldn't delete rubric type connected to the rubric
    cy.getByCy(`${mockRubricVariantName}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`${mockRubricVariantName}`).should('exist');

    // Should delete rubric type
    cy.getByCy(`${mockRubricVariantNameForDelete}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`${mockRubricVariantNameForDelete}`).should('not.exist');
  });
});
