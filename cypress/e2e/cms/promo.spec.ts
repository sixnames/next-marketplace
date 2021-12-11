import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

const basePath = `${ROUTE_CMS}/companies/${fixtureIds.companyA}/promo`;

describe('Promo', () => {
  beforeEach(() => {
    cy.testAuth(basePath);
  });

  it('Should CRUD promo', () => {
    cy.clock(1624449303350);
    const newPromoName = 'newPromoName';
    const newPromoDiscount = '33';
    const newPromoCashBack = '44';
    const updatedPromoName = 'updatedPromoName';
    const updatedPromoDiscount = '55';
    const updatedPromoCashBack = '66';

    cy.getByCy('promo-list').should('exist');

    // should create promo
    cy.getByCy(`create-promo`).click();
    cy.getByCy('create-promo-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).type(newPromoName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).type(newPromoName);
    cy.getByCy(`discountPercent`).clear().type(newPromoDiscount);
    cy.getByCy(`cashbackPercent`).clear().type(newPromoCashBack);

    cy.get('#startAt').click();
    cy.get('.react-datepicker__day--024').click();

    cy.get('#endAt').click();
    cy.get('.react-datepicker__day--025').click();

    cy.getByCy(`submit-promo`).click();
    cy.wait(1500);
    cy.getByCy(`${newPromoName}-row`).should('exist');

    // should update created promo
    cy.getByCy(`${newPromoName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`promo-details-page`).should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).clear().type(updatedPromoName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).clear().type(updatedPromoName);
    cy.getByCy(`discountPercent`).clear().type(updatedPromoDiscount);
    cy.getByCy(`cashbackPercent`).clear().type(updatedPromoCashBack);
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

    // should CRUD promo products
    cy.getByCy(`Promo A-update`).click();
    cy.wait(1500);
    cy.getByCy(`promo-details-page`).should('exist');
    cy.getByCy(`promo-products`).click();
    cy.wait(1500);
    cy.getByCy(`company-rubrics-list`).should('exist');
    cy.getByCy(`Виски-update`).click();
    cy.wait(1500);
    cy.getByCy(`promo-products-list`).should('exist');

    // add all rubric products
    cy.getByCy('add-all-rubric-products').click();
    cy.wait(1500);
    cy.getByCy(`shop-product-10-checkbox`).should('be.checked');

    // delete all rubric products
    cy.getByCy('delete-all-rubric-products').click();
    cy.wait(1500);
    cy.getByCy(`shop-product-10-checkbox`).should('not.be.checked');
  });
});
