import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getCmsCompanyLinks } from '../../../lib/linkUtils';

describe('Promo products', () => {
  const links = getCmsCompanyLinks({
    companyId: fixtureIds.companyA,
  });
  beforeEach(() => {
    cy.testAuth(links.promo.parentLink);
  });

  it('Should CRUD promo products', () => {
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
