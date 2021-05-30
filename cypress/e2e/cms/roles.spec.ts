import { ADULT_KEY, ADULT_TRUE, DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('User roles', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/roles`);
  });

  it('Should create role and show it rules', () => {
    const newRoleName = 'newRoleName';
    const newRoleDescription = 'newRoleName vary long description';

    // Shouldn't create role on validation error
    cy.getByCy('create-role').click();
    cy.getByCy('create-role-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type('f');
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type('b');
    cy.getByCy('role-submit').click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Should create role
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(newRoleName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(newRoleDescription);
    cy.getByCy('isStaff-checkbox').check();
    cy.getByCy('role-submit').click();
    cy.getByCy('role-modal').should('not.exist');
    cy.wait(1500);
    cy.getByCy(`${newRoleName}-row`).should('exist');

    // Should delete role
    cy.getByCy(`${newRoleName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${newRoleName}-row`).should('not.exist');

    // Should display role details
    cy.getByCy(`Гость-update`).click();
    cy.wait(1500);
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(newRoleName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(newRoleDescription);
    cy.getByCy('isStaff-checkbox').check();
    cy.getByCy('role-submit').click();

    // Should display updated role in list
    cy.visit(`${ROUTE_CMS}/roles`);
    cy.getByCy(`${newRoleName}-row`).should('exist');

    // Should display role rules
    cy.getByCy(`admin-update`).click();
    cy.wait(1500);
    cy.getByCy('role-rules').click();
    cy.getByCy('role-rules-list').should('exist');
    cy.getByCy('Создание группы атрибутов-checkbox').check();
    cy.wait(1500);
    cy.getByCy('Создание группы атрибутов-checkbox').should('be.checked');
    // TODO test rules

    // Should display role nav
    cy.wait(1500);
    cy.getByCy('role-nav').click();
    cy.getByCy('role-nav-list').should('exist');
    cy.getByCy('cms-Заказы-checkbox').check();
    cy.wait(1500);
    cy.getByCy('cms-Заказы-checkbox').should('be.checked');
    // TODO test nav
  });
});
