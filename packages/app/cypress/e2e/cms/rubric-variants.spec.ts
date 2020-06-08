/// <reference types="cypress" />
import schema from '../../../src/generated/introspectionSchema.json';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';
import { ME_AS_ADMIN, MOCK_RUBRIC_TYPE_EQUIPMENT, MOCK_RUBRIC_TYPE_STAGE } from '@rg/config';

const mockRubricTypeName = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockRubricTypeNameForDelete = MOCK_RUBRIC_TYPE_STAGE.name[0].value;
const mockNewRubricTypeName = 'cy-test-new-type';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
        GetAllRubricVariants: {
          getAllRubricVariants: [
            {
              id: '1',
              nameString: mockRubricTypeName,
              __typename: 'RubricVariant',
            },
            {
              id: '2',
              nameString: mockRubricTypeNameForDelete,
              __typename: 'RubricVariant',
            },
          ],
        },
      },
    });

    // cy.createTestData();
    cy.visit(`/rubric-variants?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should have rubric variants list', () => {
    cy.getByCy('rubric-variants-list').should('exist');
  });

  /*it(`Shouldn't create new rubric type on validation error`, () => {
    cy.getByCy('rubric-type-create').click();
    cy.getByCy('rubric-type-modal').should('exist');

    cy.getByCy('update-name-submit').click();
    cy.getByCy(`name-error`).should('exist');
  });*/

  /*it(`Shouldn't create new rubric on duplicate error`, () => {
    cy.getByCy('rubric-type-create').click();

    cy.getByCy('update-name-input').type(mockRubricTypeName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-type-modal').should('not.exist');
    cy.getByCy(`${mockNewRubricTypeName}`).should('not.exist');
  });*/

  /*it(`Should create new rubric type`, () => {
    cy.getByCy('rubric-type-create').click();
    cy.getByCy('rubric-type-modal').should('exist');

    cy.getByCy('update-name-input').type(mockNewRubricTypeName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-type-modal').should('not.exist');
    cy.getByCy(`${mockNewRubricTypeName}`).should('exist');
  });*/

  /*it(`Should update rubric type name`, () => {
    cy.getByCy(`${mockRubricTypeName}-update`).click();
    cy.getByCy('rubric-type-modal').should('exist');

    cy.getByCy('update-name-input').clear().type(mockNewRubricTypeName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy(`${mockRubricTypeName}`).should('not.exist');
    cy.getByCy(`${mockNewRubricTypeName}`).should('exist');
  });*/

  /*it(`Shouldn't delete rubric type connected to the rubric`, () => {
    cy.getByCy(`${mockRubricTypeName}-delete`).click();
    cy.getByCy('rubric-type-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`error-notification`).should('exist');
    cy.getByCy(`${mockRubricTypeName}`).should('exist');
  });*/

  /*it(`Should delete rubric type`, () => {
    cy.getByCy(`${mockRubricTypeNameForDelete}-delete`).click();
    cy.getByCy('rubric-type-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`${mockRubricTypeNameForDelete}`).should('not.exist');
  });*/
});
