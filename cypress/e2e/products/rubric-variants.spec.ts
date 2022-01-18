import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Rubric variants', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/rubric-variants`);
  });

  it(`Should CRUD rubric variant`, () => {
    const newRubricVariantName = 'mockNewRubricVariantName';
    const updatedRubricVariantName = 'updatedRubricVariantName';

    // Shouldn't create new rubric variant on validation error
    cy.getByCy('create-rubric-variant').click();
    cy.getByCy('rubric-variant-modal').should('exist');
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Shouldn't create new rubric on duplicate error
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type('Алкоголь');
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy('rubric-variant-modal').should('not.exist');
    cy.shouldError();

    // Should create new rubric variant
    cy.getByCy('create-rubric-variant').click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newRubricVariantName);
    cy.getByCy('rubric-variant-submit').click();
    cy.getByCy(`${newRubricVariantName}-row`).should('exist');
    cy.wait(1500);

    // Should update rubric variant name
    cy.getByCy(`${newRubricVariantName}-update`).click();
    cy.wait(1500);
    cy.getByCy('rubric-variant-details').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedRubricVariantName);
    cy.getByCy('rubric-variant-submit').click();
    cy.wait(1500);
    cy.visit(`${ROUTE_CMS}/rubric-variants`);
    cy.wait(1500);
    cy.getByCy(`${newRubricVariantName}-row`).should('not.exist');
    cy.getByCy(`${updatedRubricVariantName}-row`).should('exist');

    // Shouldn't delete rubric variant connected to the rubric
    cy.getByCy(`Алкоголь-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldError();
    cy.getByCy(`Алкоголь-row`).should('exist');

    // Should delete rubric variant
    cy.getByCy(`${updatedRubricVariantName}-delete`).click();
    cy.getByCy('rubric-variant-delete-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedRubricVariantName}-row`).should('not.exist');
  });
});
