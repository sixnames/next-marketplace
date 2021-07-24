import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('User roles', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/roles`);
  });

  it('Should CRUD role', () => {
    const newRoleName = 'newRoleName';
    const newRoleDescription = 'newRoleName very long description';

    // Should create role
    cy.getByCy('create-role').click();
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
  });

  it('Should update role permissions', () => {
    const createdGroupName = 'createdGroupName';

    // Should display role nav
    cy.getByCy(`Контент менеджер-update`).click();
    cy.wait(1500);
    cy.getByCy('role-nav').click();
    cy.wait(1500);
    cy.getByCy('role-nav-list').should('exist');
    cy.getByCy('cms-Группы атрибутов-checkbox').check();
    cy.wait(1500);
    cy.getByCy('cms-Группы атрибутов-checkbox').should('be.checked');
    cy.getByCy('cms-CMS-checkbox').check();
    cy.wait(1500);
    cy.getByCy('cms-CMS-checkbox').should('be.checked');
    cy.getByCy('sign-out').click();
    cy.wait(1500);

    // Auth as content manager
    cy.getByCy(`header-sign-in-link`).click();
    cy.wait(1500);
    cy.getByCy(`sign-in-email`).clear().type('contentManager@gmail.com');
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();
    cy.wait(1500);
    cy.getByCy(`header-user-dropdown-trigger`).click();
    cy.getByCy(`header-user-dropdown-cms-link`).click();
    cy.wait(1500);

    // Content manager should have allowed attributes route
    cy.getByCy(`app-nav-item-cms-attributes`).click();
    cy.wait(1500);
    cy.getByCy(`attribute-groups-list`).should('exist');

    // Shouldn't create attributes group without permission
    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`attributes-group-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.shouldError();

    // Add permission for content manager to create attributes group
    cy.getByCy('sign-out').click();
    cy.wait(1500);
    cy.getByCy(`header-sign-in-link`).click();
    cy.wait(1500);
    cy.getByCy(`sign-in-email`).clear().type('admin@gmail.com');
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();
    cy.wait(1500);
    cy.visit(`${ROUTE_CMS}/roles`);
    cy.getByCy(`Контент менеджер-update`).click();
    cy.wait(1500);
    cy.getByCy('role-rules').click();
    cy.wait(1500);
    cy.getByCy('role-rules-list').should('exist');
    cy.getByCy('Создание группы атрибутов-checkbox').check();
    cy.wait(1500);
    cy.getByCy('Создание группы атрибутов-checkbox').should('be.checked');
    cy.getByCy('sign-out').click();
    cy.wait(1500);

    // Auth as content manager
    cy.getByCy(`header-sign-in-link`).click();
    cy.wait(1500);
    cy.getByCy(`sign-in-email`).clear().type('contentManager@gmail.com');
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();
    cy.wait(1500);
    cy.visit(ROUTE_CMS);
    cy.wait(1500);
    cy.getByCy(`app-nav-item-cms-attributes`).click();
    cy.wait(1500);
    cy.getByCy(`attribute-groups-list`).should('exist');

    // Should create attributes group with permission
    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`attributes-group-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.wait(1500);
    cy.getByCy(`attributes-group-${createdGroupName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`attributes-group-title`).contains(createdGroupName).should('exist');
  });
});
