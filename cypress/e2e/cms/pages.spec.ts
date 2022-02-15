import { DEFAULT_CITY, DEFAULT_LOCALE } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Pages', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.pages.url);
  });

  it('Should CRUD pages', () => {
    const newGroupName = 'newGroupName';
    const updatedGroupName = 'updatedGroupName';
    const newPageName = 'newPageName';
    const updatedPageName = 'updatedPageName';

    // Should create pages group
    cy.getByCy('page-groups-list').should('exist');
    cy.getByCy('create-pages-group').click();
    cy.getByCy('pages-group-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).type(newGroupName);
    cy.getByCy(`index`).type('10');
    cy.getByCy(`showInHeader-checkbox`).check();
    cy.getByCy(`showInFooter-checkbox`).check();
    cy.getByCy(`submit-pages-group`).click();
    cy.wait(1500);
    cy.getByCy(`${newGroupName}-row`).should('exist');

    // Should update pages group
    cy.getByCy(`${newGroupName}-update`).click();
    cy.getByCy('pages-group-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).clear().type(updatedGroupName);
    cy.getByCy(`index`).clear().type('11');
    cy.getByCy(`showInFooter-checkbox`).uncheck();
    cy.getByCy(`submit-pages-group`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedGroupName}-row`).should('exist');

    // Should create page in new pages group
    cy.getByCy(`${updatedGroupName}-link`).click();
    cy.wait(1500);
    cy.getByCy(`pages-list`).should('exist');
    cy.getByCy(`create-page`).click();
    cy.getByCy('create-page-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).type(newPageName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).type(newPageName);
    cy.getByCy(`index`).type('1');
    cy.selectOptionByTestId('citySlug', DEFAULT_CITY);
    cy.getByCy(`submit-page`).click();
    cy.wait(1500);
    cy.getByCy(`${newPageName}-row`).should('exist');

    // Should update created page
    cy.getByCy(`${newPageName}-link`).click();
    cy.wait(1500);
    cy.getByCy(`page-details`).should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).clear().type(updatedPageName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).clear().type(updatedPageName);
    cy.getByCy(`index`).clear().type('1');
    cy.getByCy(`submit-page`).click();
    cy.visit(links.cms.pages.url);
    cy.getByCy(`${updatedGroupName}-link`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedPageName}-row`).should('exist');

    // Should delete created page
    cy.getByCy(`${updatedPageName}-delete`).click();
    cy.getByCy(`delete-page-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedPageName}-row`).should('not.exist');

    // Should delete created pages group
    cy.visit(links.cms.pages.url);
    cy.getByCy(`${updatedGroupName}-delete`).click();
    cy.getByCy(`delete-pages-group-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedGroupName}-row`).should('not.exist');
  });
});
