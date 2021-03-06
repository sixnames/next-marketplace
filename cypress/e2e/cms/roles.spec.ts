import { DEFAULT_LOCALE } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('User roles', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.roles.url);
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
    cy.visit(links.cms.roles.url);
    cy.getByCy(`${newRoleName}-row`).should('exist');
  });

  it('Should update role permissions', () => {
    const createdGroupName = 'createdGroupName';

    // Should display role nav
    cy.getByCy(`Контент менеджер B-update`).click();
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
    cy.signOut();
    cy.wait(1500);

    // Auth as content manager
    cy.testAuth('/', 'contentManagerB@gmail.com');
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
    cy.signOut();
    cy.wait(1500);
    cy.testAuth(links.cms.roles.url);
    cy.getByCy(`Контент менеджер B-update`).click();
    cy.wait(1500);
    cy.getByCy('role-rules').click();
    cy.wait(1500);
    cy.getByCy('role-rules-list').should('exist');
    cy.getByCy('Создание группы атрибутов-checkbox').check();
    cy.wait(1500);
    cy.getByCy('Создание группы атрибутов-checkbox').should('be.checked');
    cy.signOut();
    cy.wait(1500);

    // Auth as content manager
    cy.testAuth(links.cms.url, 'contentManagerB@gmail.com');
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
