import { DEFAULT_CITY, DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

const basePath = `${ROUTE_CMS}/companies/${fixtureIds.companyA}/promo`;

describe('Promo', () => {
  beforeEach(() => {
    cy.testAuth(basePath);
  });

  it('Should CRUD promo', () => {
    const newPromoName = 'newPromoName';
    const updatedPromoName = 'updatedPromoName';

    cy.getByCy('promo-list').should('exist');

    // should create promo
    cy.getByCy(`create-promo`).click();
    cy.getByCy('create-promo-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).type(newPromoName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).type(newPromoName);
    cy.getByCy(`index`).type('1');
    cy.selectOptionByTestId('citySlug', DEFAULT_CITY);
    cy.getByCy(`submit-promo`).click();
    cy.wait(1500);
    cy.getByCy(`${newPromoName}-row`).should('exist');

    // should update created promo
    cy.getByCy(`${newPromoName}-link`).click();
    cy.wait(1500);
    cy.getByCy(`promo-details`).should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).clear().type(updatedPromoName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).clear().type(updatedPromoName);
    cy.getByCy(`submit-promo`).click();
    cy.visit(basePath);
    cy.wait(1500);
    cy.getByCy(`${updatedPromoName}-row`).should('exist');

    // should delete created promo
    cy.getByCy(`${updatedPromoName}-delete`).click();
    cy.getByCy(`delete-promo-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedPromoName}-row`).should('not.exist');
  });
});
