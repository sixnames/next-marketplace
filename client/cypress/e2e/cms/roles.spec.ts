import { DEFAULT_LANG, QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';

const newRoleName = 'newRoleName';
const newRoleDescription = 'newRoleName vary long description';

describe('User roles', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/roles${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should CRUD user roles', () => {
    // Shouldn't create role on validation error
    cy.getByCy('create-role').click();
    cy.getByCy('role-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LANG}`).type('f');
    cy.getByCy('description').type('b');
    cy.getByCy('role-submit').click();
    cy.getByCy('name[0].value-error').should('exist');
    cy.getByCy('description-error').should('exist');

    // Should create role
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(newRoleName);
    cy.getByCy('description').clear().type(newRoleDescription);
    cy.getByCy('isStuff-checkbox').check();
    cy.getByCy('role-submit').click();
    cy.getByCy('role-modal').should('not.exist');
    cy.getByCy(`role-${newRoleName}`).should('exist');

    // Should show role rules
    cy.getByCy(`role-${newRoleName}`).click();
    cy.getByCy(`role-title`).should('contain', newRoleName);
    cy.getByCy(`'role-rules'`).should('exist');
    // cy.getByCy(`Attribute-`);
  });
});
