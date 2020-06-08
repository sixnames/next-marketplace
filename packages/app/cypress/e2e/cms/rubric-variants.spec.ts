/// <reference types="cypress" />
import schema from '../../../src/generated/introspectionSchema.json';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';
import { ME_AS_ADMIN, MOCK_RUBRIC_TYPE_EQUIPMENT, MOCK_RUBRIC_TYPE_STAGE } from '@rg/config';

const mockRubricVariantName = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockRubricVariantNameForDelete = MOCK_RUBRIC_TYPE_STAGE.name[0].value;
const mockNewRubricVariantName = 'cy-test-new-variant';

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
              nameString: mockRubricVariantName,
            },
            {
              id: '2',
              nameString: mockRubricVariantNameForDelete,
            },
          ],
        },
        CreateRubricVariant: {
          createRubricVariant: {
            success: true,
            message: 'success',
            variant: {
              id: 'id',
              nameString: mockNewRubricVariantName,
            },
          },
        },
        UpdateRubricVariant: {
          updateRubricVariant: {
            success: true,
            message: 'success',
            variant: {
              id: '1',
              nameString: mockNewRubricVariantName,
            },
          },
        },
        DeleteRubricVariant: {
          deleteRubricVariant: {
            success: true,
            message: 'success',
          },
        },
      },
    });

    cy.visit(`/rubric-variants?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  it(`Should have validation on new rubric variant creation and create new variant`, () => {
    cy.getByCy('rubric-variants-list').should('exist');

    cy.getByCy('rubric-variant-create').click();
    cy.getByCy('rubric-variant-modal').should('exist');

    cy.getByCy('update-name-submit').click();
    cy.getByCy(`name[0].value-error`).should('exist');

    cy.getByCy('update-name-input').clear().type(mockNewRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy('rubric-variant-modal').should('not.exist');
    cy.getByCy(`${mockNewRubricVariantName}`).should('exist');
  });

  it(`Should update and delete rubric variant`, () => {
    cy.getByCy(`${mockRubricVariantName}-update`).click();
    cy.getByCy('rubric-variant-modal').should('exist');

    cy.getByCy('update-name-input').clear().type(mockNewRubricVariantName);
    cy.getByCy('update-name-submit').click();
    cy.getByCy(`${mockRubricVariantName}`).should('not.exist');
    cy.getByCy(`${mockNewRubricVariantName}`).should('exist');

    // Delete
    cy.getByCy(`${mockRubricVariantNameForDelete}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`${mockRubricVariantNameForDelete}`).should('not.exist');
  });
});
