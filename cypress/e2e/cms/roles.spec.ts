import { DEFAULT_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('User roles', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/cms/roles`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should create role and show it rules', () => {
    const adminRoleName = mockData.adminRole.nameI18n[DEFAULT_LOCALE];
    const newRoleName = 'newRoleName';
    const newRoleDescription = 'newRoleName vary long description';

    // Shouldn't create role on validation error
    cy.getByCy('roles-create').click();
    cy.getByCy('create-role-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type('f');
    cy.getByCy('description').type('b');
    cy.getByCy('role-submit').click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Should create role
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(newRoleName);
    cy.getByCy('description').clear().type(newRoleDescription);
    cy.getByCy('isStuff-checkbox').check();
    cy.getByCy('role-submit').click();
    cy.getByCy('role-modal').should('not.exist');
    cy.shouldSuccess();
    cy.getByCy(`${newRoleName}-row`).should('exist');

    // Should delete role
    cy.getByCy(`${newRoleName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`${newRoleName}-row`).should('not.exist');

    // Should display role details
    cy.getByCy(`${adminRoleName}-update`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(newRoleName);
    cy.getByCy('description').clear().type(newRoleDescription);
    cy.getByCy('isStuff-checkbox').check();
    cy.getByCy('role-submit').click();
    cy.shouldSuccess();
    cy.visit(`/cms/roles`);
    cy.getByCy(`${newRoleName}-row`).should('exist');
  });
});
