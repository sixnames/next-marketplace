import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Nav items', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/nav`);
  });

  it('Should CRUD nav items', () => {
    const newNavItemName = 'newNavItemName';
    const updatedNavItemName = 'updatedNavItemName';
    const navGroup = 'cms';

    // Should create nav item
    cy.getByCy(`${navGroup}-create-nav-item`).click();
    cy.getByCy('create-nav-item-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type('f');
    cy.getByCy('nav-item-submit').click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(newNavItemName);
    cy.getByCy(`slug`).type('slug');
    cy.getByCy(`path`).type('/path');
    cy.getByCy(`index`).type('100');
    cy.getByCy(`icon`).click();
    cy.getByCy(`arrow-left`).click();
    cy.getByCy(`nav-item-submit`).click();
    cy.wait(1500);

    // New nav item should exist in the app nav list
    cy.getByCy('app-nav-item-slug').should('exist');

    // Should update nav item
    cy.getByCy(`${navGroup}-${newNavItemName}-update`).click();
    cy.getByCy('update-nav-item-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedNavItemName);
    cy.getByCy(`nav-item-submit`).click();
    cy.wait(1500);

    // Should delete nav item
    cy.getByCy(`${navGroup}-${updatedNavItemName}-delete`).click();
    cy.getByCy('delete-nav-item-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);

    // New nav item should not exist in the app nav list
    cy.getByCy('app-nav-item-slug').should('not.exist');
  });
});
