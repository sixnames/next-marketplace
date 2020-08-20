import { DEFAULT_LANG, QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';

const newRoleName = 'newRoleName';
const newRoleDescription = 'newRoleName vary long description';

describe('User roles', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/roles${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should create role and show it rules', () => {
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

    cy.getByCy(`role-${newRoleName}`).click();
    cy.getByCy(`role-title`).should('contain', newRoleName);

    // Should edit role rules
    cy.getByCy(`role-rules`).should('exist');
    cy.getByCy(`Attribute-create-checkbox`).check();
    cy.getByCy(`Attribute-read-checkbox`).check();
    cy.getByCy(`Attribute-update-checkbox`).check();
    cy.getByCy(`Attribute-delete-checkbox`).check();
    cy.getByCy(`Attribute-restricted-fields`).click();
    cy.getByCy(`role-restricted-fields-modal`).should('exist');
    cy.getByCy(`filterOptions-checkbox`).check();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`close-modal`).click();

    cy.getByCy(`Attribute-read-custom-filter`).click();
    cy.getByCy(`role-custom-filter-modal`).should('exist');
    cy.get(`#json-editor-outer-box`).should('exist');
  });

  it('Should have role details', () => {
    cy.getByCy(`role-Админ`).click();
    cy.visitMoreNavLink('details');
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(newRoleName);
    cy.getByCy('description').clear().type(newRoleDescription);
    cy.getByCy('isStuff-checkbox').check();
    cy.getByCy('role-submit').click();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`role-${newRoleName}`).should('exist');
  });

  it('Should have role navigation config', () => {
    cy.getByCy(`role-Админ`).click();
    cy.visitMoreNavLink('app-navigation');
    cy.getByCy('Главная-checkbox').uncheck();
    cy.getByCy(`success-notification`).should('exist');
    cy.getByCy(`app-nav-item-Главная`).click();
    cy.location('pathname').should('eq', '/');
  });
});
