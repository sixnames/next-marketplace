/// <reference types="cypress" />
import schema from '../../../src/generated/introspectionSchema.json';
import { ME_AS_ADMIN, MOCK_RUBRIC_TYPE_EQUIPMENT, MOCK_RUBRIC_TYPE_STAGE } from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockRubricVariantName = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockRubricVariantNameForDelete = MOCK_RUBRIC_TYPE_STAGE.name[0].value;
const mockNewRubricVariantName = 'cy-test-new-type';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
      },
    });

    cy.createTestData();
    cy.visit(`/rubric-types?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have rubric types list', () => {
    cy.getByCy('rubric-types-list').should('exist');
  });

  it(`Shouldn't create new rubric type on validation error`, () => {
    cy.getByCy('rubric-type-create').click();
    cy.getByCy('rubric-type-modal').should('exist');

    cy.getByCy('update-name-submit').click();
    cy.getByCy(`name-error`).should('exist');
  });

  it(`Shouldn't create new rubric on duplicate error`, () => {
    cy.getByCy('rubric-type-create').click();

    cy.getByCy('update-name-input').type(mockRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-type-modal').should('not.exist');
    cy.getByCy(`${mockNewRubricVariantName}`).should('not.exist');
  });

  it(`Should create new rubric type`, () => {
    cy.getByCy('rubric-type-create').click();
    cy.getByCy('rubric-type-modal').should('exist');

    cy.getByCy('update-name-input').type(mockNewRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-type-modal').should('not.exist');
    cy.getByCy(`${mockNewRubricVariantName}`).should('exist');
  });

  it(`Should update rubric type name`, () => {
    cy.getByCy(`${mockRubricVariantName}-update`).click();
    cy.getByCy('rubric-type-modal').should('exist');

    cy.getByCy('update-name-input').clear().type(mockNewRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy(`${mockRubricVariantName}`).should('not.exist');
    cy.getByCy(`${mockNewRubricVariantName}`).should('exist');
  });

  it(`Shouldn't delete rubric type connected to the rubric`, () => {
    cy.getByCy(`${mockRubricVariantName}-delete`).click();
    cy.getByCy('rubric-type-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`error-notification`).should('exist');
    cy.getByCy(`${mockRubricVariantName}`).should('exist');
  });

  it(`Should delete rubric type`, () => {
    cy.getByCy(`${mockRubricVariantNameForDelete}-delete`).click();
    cy.getByCy('rubric-type-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`${mockRubricVariantNameForDelete}`).should('not.exist');
  });
});
